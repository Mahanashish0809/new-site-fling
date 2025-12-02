# How to Get Firebase Admin Credentials

## 📥 Download Service Account Key

1. **Go to Firebase Console:**
   - Visit: https://console.firebase.google.com/
   - Login with: `tarun.nuka@gmail.com`

2. **Select Your Project:**
   - Click on project: `joltq2025`

3. **Access Project Settings:**
   - Click the ⚙️ gear icon (top left)
   - Select **Project settings**

4. **Go to Service Accounts:**
   - Click on **Service accounts** tab

5. **Generate New Private Key:**
   - Scroll down to **Firebase Admin SDK**
   - Click **Generate new private key**
   - Click **Generate key** in the dialog
   - A JSON file will download (e.g., `joltq2025-firebase-adminsdk-xxxxx.json`)

6. **Save the File:**
   - Move the downloaded JSON file to: `/Users/apple/workspace/new-site-fling/server/`
   - Rename it to: `serviceAccount.json`

## ⚙️ Configure Server Environment

Add this to your `server/.env` file:

```env
FIREBASE_SERVICE_ACCOUNT_PATH=./serviceAccount.json
```

## ⚠️ Security Note

**NEVER commit `serviceAccount.json` to git!**

The file should already be in `.gitignore`, but double-check:

```bash
# Check if it's ignored
git check-ignore server/serviceAccount.json
# Should output: server/serviceAccount.json
```

---

## Alternative: Use Environment Variable (Production)

Instead of a file, you can use an environment variable:

```env
FIREBASE_SERVICE_ACCOUNT='{"type":"service_account","project_id":"joltq2025",...}'
```

But for development, using the file is easier.

