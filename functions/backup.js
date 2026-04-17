import { onSchedule } from "firebase-functions/v2/scheduler";
import admin from "firebase-admin";
import { logger } from "firebase-functions/v2";

/**
 * Automates daily Firestore backups to Google Cloud Storage.
 * Runs every day at 03:00 AM.
 * 
 * Target GCS Bucket: gs://luqmango-production-backups
 */
export const scheduledFirestoreExport = onSchedule(
  {
    schedule: "0 3 * * *",
    timeZone: "Asia/Colombo",
    memory: "256MiB"
  }, 
  async (event) => {
    // Requires google-auth-library or properly initialized admin sdk
    const client = new admin.firestore.v1.FirestoreAdminClient();
    const projectId = process.env.GCP_PROJECT || process.env.GCLOUD_PROJECT;
    const databaseName = client.databasePath(projectId, '(default)');
    const bucket = 'gs://luqmango-production-backups';

    try {
      await client.exportDocuments({
        name: databaseName,
        outputUriPrefix: bucket,
        collectionIds: [] // Empty array means all collections
      });
      logger.info(`Backup started successfully to ${bucket}`);
    } catch (err) {
      logger.error('Export operation failed:', err);
    }
  }
);
