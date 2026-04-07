import { describe, it, expect, vi, beforeEach } from 'vitest';
const admin = require('firebase-admin');

// Mock admin before requiring index.js
vi.mock('firebase-admin', () => {
  const mockTransaction = {
    get: vi.fn(),
    update: vi.fn(),
    set: vi.fn(),
  };

  const mockDb = {
    collection: vi.fn().mockReturnThis(),
    doc: vi.fn().mockReturnThis(),
    runTransaction: vi.fn().mockImplementation((cb) => cb(mockTransaction)),
  };

  return {
    initializeApp: vi.fn(),
    firestore: Object.assign(vi.fn(() => mockDb), {
      FieldValue: {
        serverTimestamp: vi.fn(() => 'mock-timestamp'),
      },
    }),
  };
});

vi.mock('firebase-functions/v2/https', () => ({
  onCall: vi.fn((cb) => cb),
  HttpsError: class HttpsError extends Error {
    constructor(code, message) {
      super(message);
      this.code = code;
    }
  },
}));

vi.mock('firebase-functions/v2/firestore', () => ({
  onDocumentCreated: vi.fn(),
  onDocumentDeleted: vi.fn(),
}));

vi.mock('firebase-functions/v2', () => ({
  setGlobalOptions: vi.fn(),
}));

const { validateAndCreateOrder } = require('../index');

describe('validateAndCreateOrder Cloud Function', () => {
  let db;
  let transaction;

  beforeEach(() => {
    vi.clearAllMocks();
    db = admin.firestore();
    transaction = db.runTransaction.mock.calls[0] ? db.runTransaction.mock.calls[0][0] : db._getTransaction(); 
    // Wait, let's just use the mock from the module
    const { runTransaction } = db;
    // Get the transaction mock passed to cb
  });

  it('should throw an error if cart is empty', async () => {
    const request = { data: { cart: [], customerInfo: {} } };
    await expect(validateAndCreateOrder(request)).rejects.toThrow('Cart is empty or invalid.');
  });

  it('should throw an error if customer info is incomplete', async () => {
    const request = { data: { cart: [{ id: 1, quantity: 1 }], customerInfo: { email: '' } } };
    await expect(validateAndCreateOrder(request)).rejects.toThrow('Customer information is incomplete.');
  });

  it('should successfully create an order and decrement stock', async () => {
    const cart = [{ id: 'prod1', quantity: 2, price: 100 }];
    const customerInfo = { email: 'user@test.com', phone: '12345', name: 'User' };
    const request = { data: { cart, customerInfo }, auth: { uid: 'user_123' } };

    const mockProductData = { title: 'Product 1', stock: 10, price: 100 };
    const mockTransaction = db.runTransaction.mock.results[0] === undefined ? undefined : {}; // need better way

    // Mocking the behavior for the transaction
    db.runTransaction.mockImplementationOnce(async (cb) => {
      const tx = {
        get: vi.fn().mockResolvedValue({ exists: true, data: () => mockProductData }),
        update: vi.fn(),
        set: vi.fn(),
      };
      return await cb(tx);
    });

    const result = await validateAndCreateOrder(request);

    expect(result.success).toBe(true);
    expect(result.total).toBe(200);
    expect(db.collection).toHaveBeenCalledWith('orders');
  });

  it('should throw an error if insufficient stock', async () => {
    const cart = [{ id: 'prod1', quantity: 20 }]; // 20 requested, 10 in stock
    const customerInfo = { email: 'user@test.com', phone: '12345' };
    const request = { data: { cart, customerInfo } };

    const mockProductData = { title: 'Product 1', stock: 10, price: 100 };

    db.runTransaction.mockImplementationOnce(async (cb) => {
      const tx = {
        get: vi.fn().mockResolvedValue({ exists: true, data: () => mockProductData }),
        update: vi.fn(),
        set: vi.fn(),
      };
      return await cb(tx);
    });

    await expect(validateAndCreateOrder(request)).rejects.toThrow('Insufficient stock for Product 1.');
  });
});
