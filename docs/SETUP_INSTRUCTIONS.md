# 🚀 Setup Instructions for JoltQ

## ✅ Current Status

**Backend:** ✅ Running on http://localhost:8080
**Frontend:** ❌ Needs manual setup (npm installation issues)
**Database:** ✅ Connected to AWS RDS PostgreSQL

---

## 📝 Step 1: Create Server Environment File

You need to manually create the `server/.env` file with your credentials.

**Run this in your terminal:**

```bash
cat > /Users/apple/workspace/new-site-fling/server/.env << 'EOF'
# Database Configuration
DATABASE_URL="postgresql://postgres:postgres@user.c0fo0cumqafz.us-east-1.rds.amazonaws.com:5432/user"

# JWT Secret (IMPORTANT: Change this in production!)
JWT_SECRET=joltq_super_secret_jwt_key_2025_change_in_production

# Email Configuration (for OTP verification)
EMAIL_USER=tarun.nuka@gmail.com
EMAIL_PASS=Srinivasulu@949

# Firebase Admin SDK - ADD THIS AFTER DOWNLOADING SERVICE ACCOUNT
FIREBASE_SERVICE_ACCOUNT_PATH=./serviceAccount.json

# Server Configuration
PORT=8080
NODE_ENV=development
EOF
```

---

## 🔑 Step 2: Get Firebase Admin Credentials

### Follow these steps to enable Google OAuth:

1. **Go to Firebase Console:**
   ```
   https://console.firebase.google.com/
   ```
   Login with: `tarun.nuka@gmail.com` / `Srinivasulu@949`

2. **Select project:** `joltq2025`

3. **Click ⚙️ (Settings)** → **Project settings**

4. **Go to "Service accounts" tab**

5. **Click "Generate new private key"**
   - A JSON file will download

6. **Move the file:**
   ```bash
   # Move downloaded file to server directory
   mv ~/Downloads/joltq2025-*.json /Users/apple/workspace/new-site-fling/server/serviceAccount.json
   ```

7. **Restart the backend server** (see Step 4)

---

## 🎨 Step 3: Setup Frontend

The frontend needs a clean installation. **Open a new terminal** and run:

```bash
cd /Users/apple/workspace/new-site-fling/client

# Clean install
rm -rf node_modules package-lock.json

# Install dependencies
npm install

# If npm fails, try:
npm install --legacy-peer-deps

# Or use a different package manager:
# npm install -g pnpm
# pnpm install
```

---

## ▶️ Step 4: Start Both Servers

### Backend (if not already running):
```bash
cd /Users/apple/workspace/new-site-fling/server
node index.js
```

You should see:
```
✅ Firebase Admin initialized using service account.
✅ Server running on port 8080
```

### Frontend (new terminal):
```bash
cd /Users/apple/workspace/new-site-fling/client
npm run dev
```

You should see:
```
VITE v7.x.x ready in xxx ms
➜  Local:   http://localhost:8080
```

---

## 🧪 Step 5: Test the Application

### Test Backend API:
```bash
curl http://localhost:8080/api/auth/profile
```

Should return: `{"error":"Access denied"}` (this is correct - means API is working)

### Test Frontend:
Open your browser:
```
http://localhost:8080
```

You should see the JoltQ landing page.

### Test Google OAuth:
1. Go to: http://localhost:8080/login
2. Click "Sign in with Google" button
3. Select your Google account
4. You should be logged in! ✨

---

## 🔧 Enable Google Sign-In in Firebase Console

Before Google OAuth works, enable it:

1. **Firebase Console** → **Authentication** → **Sign-in method**
2. Click on **Google**
3. Toggle **Enable**
4. Set support email: `tarun.nuka@gmail.com`
5. Click **Save**

---

## ✅ Verification Checklist

- [ ] Created `server/.env` file with credentials
- [ ] Downloaded Firebase service account JSON
- [ ] Moved service account to `server/serviceAccount.json`
- [ ] Backend running (shows "Firebase Admin initialized")
- [ ] Frontend dependencies installed
- [ ] Frontend running on http://localhost:8080
- [ ] Google sign-in enabled in Firebase Console
- [ ] Tested Google OAuth login

---

## 🐛 Troubleshooting

### "Firebase Admin not initialized"
- Make sure you downloaded the service account JSON file
- Make sure it's at `server/serviceAccount.json`
- Check `server/.env` has `FIREBASE_SERVICE_ACCOUNT_PATH=./serviceAccount.json`

### Frontend won't install
```bash
# Try this:
cd client
rm -rf node_modules package-lock.json
npm cache clean --force
npm install --legacy-peer-deps
```

### "Port 8080 already in use"
```bash
# Kill process on port 8080
lsof -ti:8080 | xargs kill -9

# Or use different port in server/.env:
PORT=3000
```

### Database connection error
- Check if your AWS RDS database is accessible
- Verify DATABASE_URL in server/.env is correct

---

## 📞 Need Help?

Check these files for more information:
- `GOOGLE_OAUTH_SETUP.md` - Detailed OAuth setup
- `PROJECT_ANALYSIS.md` - Project overview
- `QUICK_START.md` - Quick reference guide

---

**Current Backend Status:** ✅ Running on http://localhost:8080 (Process ID: 61821)
**Next Step:** Set up frontend and Firebase credentials following steps above!

