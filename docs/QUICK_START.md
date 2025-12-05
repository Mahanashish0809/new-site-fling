# Google OAuth - Quick Start Guide

## 🚀 Get Started in 3 Steps

### Step 1: Run Setup Script (2 minutes)

```bash
./setup-google-oauth.sh
```

This will:
- ✅ Run database migration
- ✅ Generate Prisma client
- ✅ Install dependencies
- ✅ Create environment files

### Step 2: Enable Google Auth in Firebase (1 minute)

1. Go to https://console.firebase.google.com/
2. Select project: **joltq2025**
3. Click **Authentication** → **Sign-in method**
4. Click **Google** → Toggle **Enable**
5. Click **Save**

### Step 3: Start Servers (30 seconds)

```bash
# Terminal 1 - Backend
cd server && npm start

# Terminal 2 - Frontend  
cd client && npm run dev
```

### Test It! ✨

1. Open http://localhost:8080/login
2. Click **"Sign in with Google"**
3. Select your Google account
4. You're in! 🎉

---

## 📁 Files Changed

| File | What Changed |
|------|--------------|
| `client/src/firebase.js` | Added Google provider |
| `client/src/pages/LoginSignup.tsx` | Added Google button + handler |
| `server/routes/auth.js` | Enhanced OAuth handling |
| `server/prisma/schema.prisma` | Made password optional |

---

## 🔍 What to Check

### In Browser Console
```javascript
// After Google sign-in, you should see:
✅ Google sign-in success: { id, email, username }
Provider: google.com
```

### In Database
```sql
SELECT email, "authProvider", "isVerified" FROM "User";
```

You should see:
- `authProvider` = `google` for Google users
- `isVerified` = `true` (auto-verified!)
- `password` = `NULL`

### In Network Tab
```
POST /api/auth/firebase-login
Response: {
  "success": true,
  "user": { ... },
  "token": "eyJhbGc...",
  "provider": "google.com"
}
```

---

## 🐛 Troubleshooting

### "Failed to verify Firebase token"
```bash
# Check if Firebase Admin is configured
cd server
echo $FIREBASE_SERVICE_ACCOUNT
```

### "Google sign-in popup blocked"
- Allow popups in browser settings
- Or add `localhost:8080` to allowed sites

### Database migration error
```bash
cd server
npx prisma migrate reset
npx prisma migrate dev --name add_oauth_support
```

### CORS error
Make sure backend is running and CORS is configured:
```javascript
// server/index.js should have:
app.use(cors({
  origin: ["http://localhost:8080"],
  credentials: true
}));
```

---

## 📖 Full Documentation

For detailed information, see:

- **GOOGLE_OAUTH_SETUP.md** - Complete setup guide
- **IMPLEMENTATION_SUMMARY.md** - What was implemented
- **ARCHITECTURE_DIAGRAM.md** - System architecture
- **ENV_TEMPLATE.md** - Environment variables

---

## ✅ Success Checklist

- [ ] Setup script ran successfully
- [ ] Google auth enabled in Firebase Console
- [ ] Both servers running without errors
- [ ] Google button appears on login page
- [ ] Can sign in with Google account
- [ ] User created in database with `authProvider='google'`
- [ ] Redirected to job page after login
- [ ] User info displayed in navbar

---

## 🎯 What You Get

### Before
- ✅ Email/password authentication
- ❌ Required OTP verification
- ❌ Manual signup process

### After  
- ✅ Email/password authentication (still works!)
- ✅ **One-click Google sign-in** ← NEW!
- ✅ **Auto-verified** (no OTP needed) ← NEW!
- ✅ **Faster onboarding** ← NEW!

---

## 🔐 Security

All authentication methods are secure:
- ✅ Firebase token verification
- ✅ Server-side JWT generation
- ✅ Auth provider validation
- ✅ Encrypted password storage (for email users)

---

## 💡 Tips

1. **Development**: Use your personal Google account
2. **Production**: Configure authorized domains in Firebase Console
3. **Multiple Accounts**: Each user can only use one auth method
4. **Switching Methods**: Not currently supported (future enhancement)

---

## 🆘 Need Help?

1. Check the troubleshooting section above
2. Review error messages in browser console
3. Check server logs for detailed errors
4. See full documentation in `GOOGLE_OAUTH_SETUP.md`

---

**Ready to test? Run the setup script and start your servers!** 🚀

