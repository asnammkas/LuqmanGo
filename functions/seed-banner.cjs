/**
 * One-off script to seed banner(s) directly into Firebase.
 * Usage:  node seed-banner.cjs
 */
const admin = require("firebase-admin");
const fs = require("fs");
const path = require("path");

// Initialize with default credentials (uses gcloud auth or service account)
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "luqman-a72f8.firebasestorage.app",
});

const db = admin.firestore();
const bucket = admin.storage().bucket();

async function seedBanner(localImagePath, bannerData) {
  console.log(`Uploading ${localImagePath}...`);

  const fileName = `banners/${Date.now()}_${path.basename(localImagePath)}`;
  await bucket.upload(localImagePath, {
    destination: fileName,
    metadata: {
      contentType: "image/jpeg",
      metadata: { firebaseStorageDownloadTokens: require("crypto").randomUUID() },
    },
  });

  // Get signed URL (public)
  const file = bucket.file(fileName);
  await file.makePublic();
  const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;

  console.log(`Uploaded → ${publicUrl}`);

  const docId = `banner_${Date.now()}`;
  await db.collection("banners").doc(docId).set({
    id: docId,
    title: bannerData.title,
    image: publicUrl,
    link: bannerData.link,
    order: bannerData.order,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  console.log(`✅ Banner "${bannerData.title}" saved as ${docId}`);
}

// ─── BANNERS TO SEED ─────────────────────────────────────────
const banners = [
  {
    imagePath: path.resolve(__dirname, "../banner1.jpg"),
    title: "ELEVATE YOUR EVERYDAY",
    link: "/stores",
    order: 0,
  },
];

(async () => {
  for (const b of banners) {
    await seedBanner(b.imagePath, b);
  }
  console.log("\n🎉 All banners seeded!");
  process.exit(0);
})();
