import { onCall, HttpsError } from "firebase-functions/v2/https";
import admin from "firebase-admin";
import { logger } from "firebase-functions/v2";

export const submitReview = onCall(async (request) => {
  if (!request.auth) {
    throw new HttpsError("unauthenticated", "You must be signed in to leave a review.");
  }

  const { productId, rating, comment, userName } = request.data;

  if (!productId || typeof rating !== "number" || rating < 1 || rating > 5) {
    throw new HttpsError("invalid-argument", "Invalid product ID or rating.");
  }

  if (comment && comment.length > 500) {
    throw new HttpsError("invalid-argument", "Review comment cannot exceed 500 characters.");
  }

  const db = admin.firestore();
  const userId = request.auth.uid;
  const productRef = db.collection("products").doc(productId);
  const reviewRef = productRef.collection("reviews").doc(userId); // 1 review per user

  try {
    await db.runTransaction(async (t) => {
      const productSnap = await t.get(productRef);
      if (!productSnap.exists) {
        throw new HttpsError("not-found", "Product not found.");
      }

      const reviewSnap = await t.get(reviewRef);
      let newCount, newRating;
      const productData = productSnap.data();
      const currentCount = productData.reviewCount || 0;
      const currentRating = productData.rating || 0;

      if (reviewSnap.exists) {
        // Update existing review
        const oldRating = reviewSnap.data().rating;
        newCount = currentCount;
        // recalculate average: remove old rating, add new rating
        newRating = currentCount > 0 
          ? ((currentRating * currentCount) - oldRating + rating) / currentCount 
          : rating;
      } else {
        // New review
        newCount = currentCount + 1;
        newRating = ((currentRating * currentCount) + rating) / newCount;
      }

      t.set(reviewRef, {
        userId,
        userName: userName || "Anonymous",
        rating,
        comment: comment || "",
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      }, { merge: true });

      t.update(productRef, {
        reviewCount: newCount,
        rating: Math.round(newRating * 10) / 10, // Round to 1 decimal place
      });
    });

    logger.info(`User ${userId} left a ${rating}-star review on ${productId}`);
    return { success: true };
  } catch (error) {
    logger.error("submitReview Error:", error);
    if (error instanceof HttpsError) throw error;
    throw new HttpsError("internal", "Server encountered an error while processing the review.");
  }
});
