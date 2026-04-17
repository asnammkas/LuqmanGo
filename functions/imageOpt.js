import { onObjectFinalized } from "firebase-functions/v2/storage";
import { getStorage } from "firebase-admin/storage";
import { logger } from "firebase-functions/v2";
import sharp from "sharp";
import path from "path";
import os from "os";
import fs from "fs/promises";

/**
 * Triggered when an object is uploaded to Cloud Storage.
 * It detects unoptimized images in the 'products/' folder, resizes them,
 * converts them to WebP, and replaces the original.
 */
export const optimizeImage = onObjectFinalized({ minInstances: 0, memory: "1GiB" }, async (event) => {
  const fileBucket = event.data.bucket;
  const filePath = event.data.name;
  const contentType = event.data.contentType;
  const metadata = event.data.metadata || {};

  // 1. Exit conditions to prevent infinite loops and process only images
  if (!filePath.startsWith('products/')) {
    return logger.log('Not in products directory.');
  }
  if (!contentType.startsWith('image/')) {
    return logger.log('This is not an image.');
  }
  if (metadata.optimized === 'true') {
    return logger.log('Image is already optimized.');
  }

  const bucket = getStorage().bucket(fileBucket);
  const fileName = path.basename(filePath);
  const tempFilePath = path.join(os.tmpdir(), fileName);
  
  const tempOptimizedPath = path.join(os.tmpdir(), `optimized-${fileName}.webp`);

  try {
    logger.info(`Downloading ${filePath} to ${tempFilePath}`);
    await bucket.file(filePath).download({ destination: tempFilePath });

    logger.info(`Optimizing ${tempFilePath}...`);
    await sharp(tempFilePath)
      .resize({ width: 1200, withoutEnlargement: true }) // Max width 1200px
      .webp({ quality: 80 }) 
      .toFile(tempOptimizedPath);

    logger.info(`Uploading optimized image back to ${filePath}`);
    await bucket.upload(tempOptimizedPath, {
      destination: filePath,
      metadata: {
        contentType: 'image/webp',
        metadata: {
          optimized: 'true', 
        },
      },
    });

    logger.info(`Successfully optimized ${filePath}`);

  } catch (error) {
    logger.error(`Failed to optimize image: ${error.message}`);
  } finally {
    try {
      await fs.unlink(tempFilePath);
      await fs.unlink(tempOptimizedPath);
    } catch (e) {
      if (e.code !== 'ENOENT') {
        logger.error(`Error cleaning up temp files: ${e.message}`);
      }
    }
  }
});
