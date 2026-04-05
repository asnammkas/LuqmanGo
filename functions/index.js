const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { onDocumentCreated, onDocumentDeleted } = require("firebase-functions/v2/firestore");
const { setGlobalOptions } = require("firebase-functions/v2");
const admin = require("firebase-admin");

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
exports.validateAndCreateOrder = onCall(async (request) => {
  const { cart, customerInfo } = request.data;

  if (!cart || !Array.isArray(cart) || cart.length === 0) {
    throw new HttpsError("invalid-argument", "Cart is empty or invalid.");
  }

  if (!customerInfo || !customerInfo.email || !customerInfo.phone) {
    throw new HttpsError("invalid-argument", "Customer information is incomplete.");
  }

  let serverTotal = 0;
  const orderItems = [];

  try {
    const orderId = `ord_${Date.now()}`;
    
    await db.runTransaction(async (transaction) => {
      for (const item of cart) {
        const productRef = db.collection("products").doc(item.id.toString());
        const productSnap = await transaction.get(productRef);

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

        transaction.update(productRef, {
          stock: currentStock - item.quantity
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
 * Cleanup trigger for Products.
 */
exports.onProductDeleted = onDocumentDeleted("products/{productId}", async (event) => {
  const deletedData = event.data?.data();
  if (deletedData) await cleanupStorage(deletedData);
});

/**
 * Cleanup trigger for Categories.
 */
exports.onCategoryDeleted = onDocumentDeleted("categories/{categoryId}", async (event) => {
  const deletedData = event.data?.data();
  if (deletedData) await cleanupStorage(deletedData);
});

/**
 * Trigger for Order creation (Email hook).
 */
exports.onOrderCreated = onDocumentCreated("orders/{orderId}", async (event) => {
  const orderData = event.data?.data();
  if (orderData) {
    console.log(`New Order Created: ${orderData.id}. Send confirmation email to: ${orderData.customer.email}`);
  }
});
