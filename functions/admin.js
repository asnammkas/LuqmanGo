import { onCall, HttpsError } from "firebase-functions/v2/https";
import admin from "firebase-admin";
import { logger } from "firebase-functions/v2";

/**
 * Validates that the caller has admin privileges by checking the admins collection.
 */
async function verifyAdmin(request) {
  if (!request.auth) {
    throw new HttpsError("unauthenticated", "You must be signed in.");
  }
  
  // Note: App initialization is handled in index.js, so admin.firestore() works here
  const db = admin.firestore();
  const adminDoc = await db.collection("admins").doc(request.auth.uid).get();
  
  if (!adminDoc.exists) {
    throw new HttpsError("permission-denied", "Admin privileges required to perform this action.");
  }
  
  return db;
}

// ─── PRODUCTS ───
export const manageProduct = onCall(async (request) => {
  const db = await verifyAdmin(request);
  const { action, id, productData } = request.data;
  
  try {
    if (action === "create" || action === "update") {
      if (!id || !productData) throw new HttpsError("invalid-argument", "Missing product id or data.");
      
      const payload = { ...productData };
      if (action === "create" && !payload.date) {
        payload.date = admin.firestore.FieldValue.serverTimestamp();
      }
      
      await db.collection("products").doc(id).set(payload, { merge: true });
      logger.info(`Product ${id} ${action}d securely by ${request.auth.uid}`);
      return { success: true, id };
    } else if (action === "delete") {
      if (!id) throw new HttpsError("invalid-argument", "Missing product id for deletion.");
      await db.collection("products").doc(id).delete();
      logger.info(`Product ${id} deleted securely by ${request.auth.uid}`);
      return { success: true };
    }
    throw new HttpsError("invalid-argument", "Unknown action provided.");
  } catch (error) {
    logger.error("manageProduct Server Error:", error);
    if (error instanceof HttpsError) throw error;
    throw new HttpsError("internal", `Server error: ${error.message}`);
  }
});

// ─── CATEGORIES ───
export const manageCategory = onCall(async (request) => {
  const db = await verifyAdmin(request);
  const { action, id, categoryData } = request.data;
  
  try {
    if (action === "create" || action === "update") {
      if (!id || !categoryData) throw new HttpsError("invalid-argument", "Missing category id or data.");
      await db.collection("categories").doc(id).set(categoryData, { merge: true });
      logger.info(`Category ${id} ${action}d securely by ${request.auth.uid}`);
      return { success: true, id };
    } else if (action === "delete") {
      if (!id) throw new HttpsError("invalid-argument", "Missing category id for deletion.");
      await db.collection("categories").doc(id).delete();
      logger.info(`Category ${id} deleted securely by ${request.auth.uid}`);
      return { success: true };
    }
    throw new HttpsError("invalid-argument", "Unknown action provided.");
  } catch (error) {
    logger.error("manageCategory Server Error:", error);
    if (error instanceof HttpsError) throw error;
    throw new HttpsError("internal", "Server encountered an error managing the category.");
  }
});

// ─── BANNERS ───
export const manageBanner = onCall(async (request) => {
  logger.info("manageBanner call received:", { data: request.data, auth: request.auth?.uid });
  const db = await verifyAdmin(request);
  const { action, id, bannerData } = request.data;
  
  try {
    if (action === "create" || action === "update") {
      if (!id || !bannerData) throw new HttpsError("invalid-argument", "Missing banner id or data.");
      
      // Ensure no NaN values in bannerData
      bannerData.order = typeof bannerData.order === 'number' && !isNaN(bannerData.order) ? bannerData.order : 0;

      logger.info(`Attempting to ${action} banner ${id}`, { bannerData });
      await db.collection("banners").doc(id).set(bannerData, { merge: true });
      logger.info(`Banner ${id} ${action}d securely by ${request.auth.uid}`);
      return { success: true, id };
    } else if (action === "delete") {
      if (!id) throw new HttpsError("invalid-argument", "Missing banner id for deletion.");
      await db.collection("banners").doc(id).delete();
      logger.info(`Banner ${id} deleted securely by ${request.auth.uid}`);
      return { success: true };
    }
    throw new HttpsError("invalid-argument", "Unknown action provided.");
  } catch (error) {
    logger.error("manageBanner Server Error:", { error, action, id });
    if (error instanceof HttpsError) throw error;
    throw new HttpsError("internal", `Banner management failed: ${error.message || 'Unknown server error'}`);
  }
});

// ─── ORDERS ───
export const updateOrderStatus = onCall(async (request) => {
  const db = await verifyAdmin(request);
  const { orderId, newStatus } = request.data;
  
  if (!orderId || !newStatus) {
    throw new HttpsError("invalid-argument", "Missing orderId or newStatus.");
  }
  
  const VALID_STATUSES = ['Processing', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'];
  if (!VALID_STATUSES.includes(newStatus)) {
    throw new HttpsError("invalid-argument", "Invalid order status provided.");
  }
  
  try {
    await db.collection("orders").doc(orderId).set({ status: newStatus }, { merge: true });
    logger.info(`Order ${orderId} status updated to ${newStatus} securely by ${request.auth.uid}`);
    return { success: true };
  } catch (error) {
    logger.error("updateOrderStatus Server Error:", error);
    if (error instanceof HttpsError) throw error;
    throw new HttpsError("internal", "Server encountered an error updating order status.");
  }
});
