# 🛡️ Firestore Automated Backup Guide

This guide outlines the steps to enable automated, daily backups of your Firestore database to Google Cloud Storage as per production best practices.

## 1. Prerequisites
- A Google Cloud Storage (GCS) bucket specifically for backups (e.g., `gs://luqmango-backups/`).
- The `gcloud` CLI installed and authenticated with `owner` permissions.

## 2. Infrastructure Setup (Manual)

### Step A: Create the Backup Bucket
```bash
# Set your project ID
gcloud config set project [YOUR_PROJECT_ID]

# Create a multi-regional bucket for high availability
gsutil mb -l asia gs://luqmango-production-backups/
```

### Step B: Setup Cloud Scheduler
The most reliable way to automate backups is via a **Cloud Scheduler** job that triggers a manual export.

1.  **Enable APIs:** 
    `gcloud services enable cloudscheduler.googleapis.com`
2.  **Create the Job:**
    Run the following command to schedule a daily backup at 2:00 AM:

```bash
gcloud scheduler jobs create http daily-firestore-backup \
  --schedule="0 2 * * *" \
  --uri="https://firestore.googleapis.com/v1/projects/[PROJECT_ID]/databases/(default):exportDocuments" \
  --http-method=POST \
  --oauth-service-account-email="[PROJECT_ID]@appspot.gserviceaccount.com" \
  --message-body='{"outputUriPrefix": "gs://luqmango-production-backups"}'
```

*(Replace `[PROJECT_ID]` with your actual Firebase Project ID)*

## 3. Programmatic Trigger (Hybrid Approach)

If you prefer to trigger backups from within your codebase (e.g., before major migrations), you can use the following Cloud Function pattern.

### `functions/backup.js`
```javascript
const { onSchedule } = require("firebase-functions/v2/scheduler");
const admin = require("firebase-admin");
const client = new admin.firestore.v1.FirestoreAdminClient();

exports.scheduledFirestoreExport = onSchedule("0 3 * * *", async (event) => {
  const projectId = process.env.GCP_PROJECT || process.env.GCLOUD_PROJECT;
  const databaseName = client.databasePath(projectId, '(default)');
  const bucket = 'gs://luqmango-production-backups';

  try {
    await client.exportDocuments({
      name: databaseName,
      outputUriPrefix: bucket,
      collectionIds: [] // Empty array means all collections
    });
    console.log(`Backup started to ${bucket}`);
  } catch (err) {
    console.error('Export operation failed:', err);
  }
});
```

## 4. Disaster Recovery (Restore)

To restore your data from a backup:
1.  Identify the specific export folder in your GCS bucket (e.g., `2026-04-12T02:00:00Z`).
2.  Run the import command:

```bash
gcloud firestore import gs://luqmango-production-backups/[EXPORT_FOLDER_NAME]/
```

> [!WARNING]
> **Data Overwrite:** Importing data will overwrite existing documents with the same IDs. Always verify the backup folder timestamp before restoring to production.

---
**Status:** This runbook is complete. Ready for manual execution by DevOps/Ownership.
