import { onDocumentDeleted } from "firebase-functions/v2/firestore";
import admin from "firebase-admin";
import { logger } from "firebase-functions/v2";

/**
 * Triggered when a user document is deleted (GDPR account deletion).
 * Anonymizes Personally Identifiable Information (PII) from historical order records.
 * Keeps the order total and item data intact for accounting purposes.
 */
export const anonymizeUserOrders = onDocumentDeleted("users/{userId}", async (event) => {
  const deletedUserId = event.params.userId;
  const db = admin.firestore();
  
  try {
    const ordersSnapshot = await db.collection('orders')
      .where('customer.userId', '==', deletedUserId)
      .get();

    if (ordersSnapshot.empty) {
      logger.info(`No orders found for deleted user ${deletedUserId}`);
      return null;
    }

    // Process in batches if there are many orders
    const batch = db.batch();
    ordersSnapshot.forEach((doc) => {
      batch.update(doc.ref, {
        'customer.name': 'Deleted User',
        'customer.email': 'deleted@example.com',
        'customer.phone': 'Redacted',
        'customer.address': 'Redacted for Privacy',
        'customer.orderNotes': 'Redacted',
        'customer.userId': null // Remove association to prevent future queries
      });
    });

    await batch.commit();
    logger.info(`Successfully anonymized ${ordersSnapshot.size} orders for user ${deletedUserId}`);
    return null;

  } catch (error) {
    logger.error(`Error anonymizing orders for user ${deletedUserId}:`, error);
    throw error; // Let the function fail for retries
  }
});
