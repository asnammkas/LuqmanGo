import { onCall, HttpsError } from "firebase-functions/v2/https";
import { onDocumentCreated, onDocumentDeleted, onDocumentUpdated } from "firebase-functions/v2/firestore";
import { setGlobalOptions } from "firebase-functions/v2";
import admin from "firebase-admin";
import { randomUUID } from "node:crypto";
import { sendEmail, emailTemplates } from "./utils/email.js";

admin.initializeApp();
const db = admin.firestore();

// Set global options for all v2 functions (ensures region consistency)
setGlobalOptions({ 
  region: "us-central1",
  maxInstances: 10 
});

/**
 * Validates the order, recalculates the total, and decrements stock.
 */
export const validateAndCreateOrder = onCall(async (request) => {
  // ─── P0: Enforce Authentication ───
  if (!request.auth) {
    throw new HttpsError("unauthenticated", "You must be signed in to place an order.");
  }

  const { cart, customerInfo } = request.data;
  const userId = request.auth.uid;

  // ─── P1: Rate Limiting (60s cooldown) ───
  const allowed = await checkRateLimit(userId);
  if (!allowed) {
    throw new HttpsError("resource-exhausted", "Too many orders. Please wait 60 seconds before trying again.");
  }

  if (!cart || !Array.isArray(cart) || cart.length === 0) {
    throw new HttpsError("invalid-argument", "Cart is empty or invalid.");
  }

  if (!customerInfo || !customerInfo.email || !customerInfo.phone || !customerInfo.name || !customerInfo.address) {
    throw new HttpsError("invalid-argument", "Customer information is incomplete.");
  }

  // ─── P1: Server-side Basic Validation ───
  if (customerInfo.name.length < 2 || customerInfo.name.length > 100) {
    throw new HttpsError("invalid-argument", "Invalid name length.");
  }
  if (customerInfo.address.length < 5 || customerInfo.address.length > 500) {
    throw new HttpsError("invalid-argument", "Invalid address length.");
  }
  if (!/^\+?[\d\s-]{8,20}$/.test(customerInfo.phone)) {
    throw new HttpsError("invalid-argument", "Invalid phone number format.");
  }

  let serverTotal = 0;
  const orderItems = [];

  try {
    const orderId = `ord_${randomUUID().replace(/-/g, '').substring(0, 12)}_${Date.now().toString().slice(-4)}`;
    
    await db.runTransaction(async (transaction) => {
      // ─── Phase 1: ALL READS first (Firestore requirement) ───────────
      const productRefs = [];
      const productSnaps = [];

      for (const item of cart) {
        const productRef = db.collection("products").doc(item.id.toString());
        productRefs.push(productRef);
        productSnaps.push(await transaction.get(productRef));
      }

      // ─── Phase 2: VALIDATE all read data ────────────────────────────
      for (let i = 0; i < cart.length; i++) {
        const item = cart[i];
        const productSnap = productSnaps[i];

        if (!productSnap.exists) {
          throw new HttpsError("not-found", `Product ${item.id} not found.`);
        }

        const productData = productSnap.data();
        const currentStock = productData.stock || 0;
        const currentPrice = productData.price || 0;

        if (currentStock < item.quantity) {
          throw new HttpsError("resource-exhausted", `Insufficient stock for ${productData.title}.`);
        }

        serverTotal += currentPrice * item.quantity;

        orderItems.push({
          id: item.id,
          title: productData.title,
          price: currentPrice,
          quantity: item.quantity,
          image: productData.image
        });
      }

      // ─── Phase 3: ALL WRITES after reads are done ───────────────────
      for (let i = 0; i < cart.length; i++) {
        const productData = productSnaps[i].data();
        const currentStock = productData.stock || 0;
        transaction.update(productRefs[i], {
          stock: currentStock - cart[i].quantity
        });
      }

      const orderData = {
        id: orderId,
        date: admin.firestore.FieldValue.serverTimestamp(),
        customer: {
          ...customerInfo,
          userId: request.auth?.uid || null
        },
        items: orderItems,
        total: serverTotal,
        status: "Processing",
        paymentMethod: customerInfo.paymentMethod || "Cash on Delivery"
      };

      const orderRef = db.collection("orders").doc(orderId);
      transaction.set(orderRef, orderData);
    });

    return { success: true, orderId, total: serverTotal };
  } catch (error) {
    console.error("Order Transaction Failed:", error);
    if (error instanceof HttpsError) throw error;
    throw new HttpsError("internal", "An error occurred while processing your order.");
  }
});

/**
 * Cleanup function helper: Deletes storage blobs.
 */
const cleanupStorage = async (data) => {
  const imageUrl = data.image;
  if (!imageUrl || !imageUrl.includes("firebasestorage.googleapis.com")) return;

  try {
    const decodedUrl = decodeURIComponent(imageUrl);
    const pathPart = decodedUrl.split("/o/")[1].split("?")[0];
    const bucket = admin.storage().bucket();
    const file = bucket.file(pathPart);
    await file.delete();
    console.log(`Successfully deleted storage blob: ${pathPart}`);
  } catch (error) {
    console.error("Storage Cleanup Failed:", error);
  }
};

/**
 * Audit Logging Helper: Records admin actions to Firestore.
 */
const createAuditLog = async (action, collection, entityId, data = null) => {
  try {
    await db.collection("audit_logs").add({
      action,
      collection,
      entityId,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      metadata: data ? JSON.stringify(data).substring(0, 500) : null,
    });
  } catch (error) {
    console.error("Audit Log Failed:", error);
  }
};

/**
 * Rate Limit Helper: Prevent spam by checking the last order timestamp.
 */
const checkRateLimit = async (userId, cooldownSeconds = 60) => {
  const limitRef = db.collection("rate_limits").doc(userId);
  const snap = await limitRef.get();
  
  if (snap.exists) {
    const lastTime = snap.data().lastOrder?.toDate();
    if (lastTime) {
      const diff = (Date.now() - lastTime.getTime()) / 1000;
      if (diff < cooldownSeconds) return false;
    }
  }
  
  await limitRef.set({ lastOrder: admin.firestore.FieldValue.serverTimestamp() }, { merge: true });
  return true;
};

/**
 * Trigger: New Order Notification (Email to vendor & customer).
 */
export const onOrderCreated = onDocumentCreated("orders/{orderId}", async (event) => {
  const order = event.data?.data();
  if (!order) return;

  const { id, total, customer } = order;

  try {
    // Notify Vendor
    const vendorEmail = process.env.VENDOR_EMAIL || "vendor@luqmango.com";
    await sendEmail({
      to: vendorEmail,
      ...emailTemplates.newOrder(id, total, customer)
    });

    // Notify Customer
    await sendEmail({
      to: customer.email,
      subject: "✅ Order Received - LuqmanGo",
      text: `Hi ${customer.name}, we've received your order ${id}. Total: LKR ${total}. We'll notify you when it's shipped!`,
      html: `<h3>Thank you for your order, ${customer.name}!</h3><p>Your order <b>${id}</b> for <b>LKR ${total.toLocaleString()}</b> is being processed.</p>`
    });
  } catch (error) {
    console.error("Order notification flow failed:", error);
  }
});

/**
 * Trigger: Welcome Email for new users.
 */
export const onUserCreated = onDocumentCreated("users/{userId}", async (event) => {
  const user = event.data?.data();
  if (!user || !user.email) return;

  await sendEmail({
    to: user.email,
    ...emailTemplates.welcome(user.name || "there")
  });
});

/**
 * Audit Triggers for Products.
 */
export const onProductCreated = onDocumentCreated("products/{productId}", async (event) => {
  await createAuditLog("CREATE", "products", event.params.productId, event.data?.data());
});

export const onProductUpdated = onDocumentUpdated("products/{productId}", async (event) => {
  const newData = event.data?.after.data();
  await createAuditLog("UPDATE", "products", event.params.productId, newData);
});

export const onProductDeleted = onDocumentDeleted("products/{productId}", async (event) => {
  const deletedData = event.data?.data();
  if (deletedData) await cleanupStorage(deletedData);
  await createAuditLog("DELETE", "products", event.params.productId);
});

/**
 * Audit Triggers for Categories.
 */
export const onCategoryCreated = onDocumentCreated("categories/{categoryId}", async (event) => {
  await createAuditLog("CREATE", "categories", event.params.categoryId, event.data?.data());
});

export const onCategoryUpdated = onDocumentUpdated("categories/{categoryId}", async (event) => {
  const newData = event.data?.after.data();
  await createAuditLog("UPDATE", "categories", event.params.categoryId, newData);
});

export const onCategoryDeleted = onDocumentDeleted("categories/{categoryId}", async (event) => {
  const deletedData = event.data?.data();
  if (deletedData) await cleanupStorage(deletedData);
  await createAuditLog("DELETE", "categories", event.params.categoryId);
});
