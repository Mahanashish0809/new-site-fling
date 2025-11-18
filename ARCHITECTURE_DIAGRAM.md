# JoltQ Authentication Architecture

## 🏗️ System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                          CLIENT (React)                              │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │                    LoginSignup Component                       │  │
│  │                                                                 │  │
│  │  ┌─────────────────┐           ┌─────────────────┐          │  │
│  │  │  Email/Password │           │ Google Sign-In  │          │  │
│  │  │      Form       │           │     Button      │          │  │
│  │  └────────┬────────┘           └────────┬────────┘          │  │
│  │           │                              │                    │  │
│  │           └──────────┬───────────────────┘                    │  │
│  │                      ▼                                         │  │
│  │              Firebase Auth SDK                                 │  │
│  └───────────────────────┬────────────────────────────────────────┘  │
│                          │                                            │
└──────────────────────────┼────────────────────────────────────────────┘
                           │
                           │ Firebase ID Token
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────────┐
│                       FIREBASE (Google Cloud)                        │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │           Firebase Authentication Service                      │  │
│  │                                                                 │  │
│  │  ┌─────────────────┐           ┌─────────────────┐          │  │
│  │  │ Email/Password  │           │  Google OAuth   │          │  │
│  │  │   Provider      │           │    Provider     │          │  │
│  │  └─────────────────┘           └─────────────────┘          │  │
│  │                                                                 │  │
│  │         Returns: { uid, email, name, provider, ... }           │  │
│  └───────────────────────┬────────────────────────────────────────┘  │
│                          │                                            │
└──────────────────────────┼────────────────────────────────────────────┘
                           │
                           │ POST /api/auth/firebase-login
                           │ { token: "Firebase_ID_Token" }
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────────┐
│                     SERVER (Express + Prisma)                        │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │              /api/auth/firebase-login Endpoint                 │  │
│  │                                                                 │  │
│  │  1. Verify Firebase Token (Firebase Admin SDK)                │  │
│  │  2. Extract: email, name, provider                            │  │
│  │  3. Check if user exists in database                          │  │
│  │  4. Create/Update user:                                       │  │
│  │     - Set authProvider (email/google)                         │  │
│  │     - Set isVerified = true (for OAuth)                       │  │
│  │     - Set password = null (for OAuth)                         │  │
│  │  5. Generate JWT token                                        │  │
│  │  6. Return: { user, token, provider }                         │  │
│  └───────────────────────┬────────────────────────────────────────┘  │
│                          │                                            │
└──────────────────────────┼────────────────────────────────────────────┘
                           │
                           │ SQL Queries
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────────┐
│                  DATABASE (PostgreSQL via Prisma)                    │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  User Table:                                                         │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │ id  │ email │ username │ password │ authProvider │ isVerified│  │
│  ├─────┼───────┼──────────┼──────────┼──────────────┼───────────┤  │
│  │ 1   │ a@... │ Alice    │ $2b$...  │ email        │ true      │  │
│  │ 2   │ b@... │ Bob      │ NULL     │ google       │ true      │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                       │
└───────────────────────────────────────────────────────────────────────┘
```

---

## 🔄 Authentication Flow Comparison

### Email/Password Authentication

```
┌─────────┐    Email/Password    ┌──────────────┐
│  User   │─────────────────────▶│   Firebase   │
└─────────┘                       │     Auth     │
                                  └──────┬───────┘
                                         │
                                         │ Firebase Token
                                         │
                                         ▼
┌─────────────────────────────────────────────────────┐
│              Backend Server                          │
│                                                      │
│  1. Verify Firebase Token                           │
│  2. Create user with:                               │
│     - password: hashed                              │
│     - authProvider: "email"                         │
│     - isVerified: false                             │
│  3. Send OTP email                                  │
│  4. User verifies OTP                               │
│  5. Generate JWT token                              │
└──────────────────┬──────────────────────────────────┘
                   │
                   │ JWT Token
                   │
                   ▼
┌─────────┐    Store Token    ┌──────────────┐
│  User   │◀──────────────────│  localStorage │
└─────────┘                   └───────────────┘
     │
     │ Navigate to /jobPage
     │
     ▼
┌──────────────┐
│   Job Page   │
└──────────────┘
```

### Google OAuth Authentication

```
┌─────────┐  Click "Sign in   ┌──────────────┐
│  User   │  with Google"     │   Firebase   │
└─────────┘──────────────────▶│     Auth     │
                               └──────┬───────┘
                                      │
                                      │ Opens Google
                                      │ Account Picker
                                      ▼
                              ┌────────────────┐
                              │ Google OAuth   │
                              │ (Select Account)│
                              └───────┬────────┘
                                      │
                                      │ Returns to Firebase
                                      │
                                      ▼
                              ┌──────────────┐
                              │   Firebase   │
                              │     Auth     │
                              └──────┬───────┘
                                     │
                                     │ Firebase Token
                                     │
                                     ▼
┌─────────────────────────────────────────────────────┐
│              Backend Server                          │
│                                                      │
│  1. Verify Firebase Token                           │
│  2. Create user with:                               │
│     - password: NULL                                │
│     - authProvider: "google"                        │
│     - isVerified: true  ← Auto-verified!           │
│  3. NO OTP needed                                   │
│  4. Generate JWT token immediately                  │
└──────────────────┬──────────────────────────────────┘
                   │
                   │ JWT Token
                   │
                   ▼
┌─────────┐    Store Token    ┌──────────────┐
│  User   │◀──────────────────│  localStorage │
└─────────┘                   └───────────────┘
     │
     │ Navigate to /jobPage (immediate!)
     │
     ▼
┌──────────────┐
│   Job Page   │
└──────────────┘
```

---

## 🔐 Security Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    Token Verification Flow                       │
└─────────────────────────────────────────────────────────────────┘

Frontend (Client)
    │
    │ 1. User authenticates via Firebase
    │    (Email/Password or Google OAuth)
    │
    ▼
Firebase Authentication
    │
    │ 2. Returns Firebase ID Token
    │    (Short-lived, cryptographically signed)
    │
    ▼
Backend Server
    │
    │ 3. Verify Firebase Token using Firebase Admin SDK
    │    ✓ Token signature valid?
    │    ✓ Token not expired?
    │    ✓ Token issued by our Firebase project?
    │
    ▼
    │ 4. Extract user info from verified token:
    │    - email
    │    - name (for Google users)
    │    - provider (google.com or password)
    │
    ▼
Database Operations
    │
    │ 5. Find or create user in PostgreSQL
    │    - Set authProvider based on sign-in method
    │    - Auto-verify OAuth users
    │
    ▼
JWT Token Generation
    │
    │ 6. Generate our own JWT token
    │    - Payload: { userId, email, username }
    │    - Secret: process.env.JWT_SECRET
    │    - Expiry: 7 days
    │
    ▼
Response to Client
    │
    │ 7. Return: { user, token, provider }
    │
    ▼
Client Storage
    │
    │ 8. Store JWT in localStorage
    │    - Used for subsequent API requests
    │    - Verified by authMiddleware
    │
    ▼
Protected Routes
    │
    │ 9. All API requests include:
    │    Authorization: Bearer <JWT_TOKEN>
    │
    ▼
Auth Middleware
    │
    │ 10. Verify JWT on each request
    │     ✓ Token valid?
    │     ✓ Token not expired?
    │     ✓ User exists in database?
    │
    ▼
API Response
```

---

## 📦 Component Interaction

```
┌─────────────────────────────────────────────────────────────────┐
│                        Frontend Components                       │
└─────────────────────────────────────────────────────────────────┘

App.tsx
  │
  ├─ BrowserRouter
  │   │
  │   ├─ Route: /login
  │   │   └─ LoginSignup Component
  │   │       │
  │   │       ├─ Email/Password Form
  │   │       │   └─ handleSubmit()
  │   │       │       └─ signInWithEmailAndPassword()
  │   │       │
  │   │       └─ Google Sign-In Button
  │   │           └─ handleGoogleSignIn()
  │   │               └─ signInWithPopup(auth, googleProvider)
  │   │
  │   ├─ Route: /jobPage
  │   │   └─ JobPage Component (Protected)
  │   │       └─ Requires: localStorage.getItem("token")
  │   │
  │   └─ Route: /otp
  │       └─ OtpPage Component
  │           └─ (Only for email/password signups)
  │
  └─ Global Providers
      ├─ QueryClientProvider
      ├─ TooltipProvider
      └─ ModalProvider

┌─────────────────────────────────────────────────────────────────┐
│                         Backend Routes                           │
└─────────────────────────────────────────────────────────────────┘

server/index.js
  │
  ├─ POST /api/auth/firebase-login
  │   └─ Handles both Email & Google auth
  │       ├─ Verify Firebase token
  │       ├─ Create/update user
  │       └─ Return JWT token
  │
  ├─ POST /api/auth/signup
  │   └─ Email/password signup only
  │       ├─ Hash password
  │       ├─ Generate OTP
  │       └─ Send verification email
  │
  ├─ POST /api/auth/login
  │   └─ Email/password login only
  │       ├─ Check authProvider
  │       ├─ Verify password
  │       └─ Return JWT token
  │
  ├─ POST /api/auth/verify-otp
  │   └─ Verify OTP code
  │
  └─ GET /api/auth/profile (Protected)
      └─ Requires: Authorization header with JWT
```

---

## 🎨 UI Component Tree

```
LoginSignup Page
│
├─ Background Spheres (decorative)
│   ├─ Orange/Yellow sphere (top-left)
│   └─ Purple/Indigo sphere (bottom-right)
│
└─ Card Component
    │
    ├─ CardHeader
    │   ├─ Title: "Welcome Back" / "Create Account"
    │   └─ Subtitle: Description text
    │
    └─ CardContent
        │
        └─ Form
            │
            ├─ Username Input (signup only)
            ├─ Email Input
            ├─ Password Input (with show/hide toggle)
            │
            ├─ Submit Button
            │   └─ "Login" / "Sign Up"
            │
            ├─ Divider
            │   └─ "Or continue with"
            │
            ├─ Google Sign-In Button  ← NEW!
            │   ├─ Google Logo (4-color)
            │   └─ "Sign in with Google"
            │
            └─ Toggle Link
                └─ "Sign up" / "Login"
```

---

## 🗄️ Database Schema Evolution

### Before Google OAuth

```sql
CREATE TABLE "User" (
  id            SERIAL PRIMARY KEY,
  email         VARCHAR(255) UNIQUE NOT NULL,
  username      VARCHAR(255) NOT NULL,
  password      VARCHAR(255) NOT NULL,  ← Required
  "createdAt"   TIMESTAMP DEFAULT NOW(),
  "isVerified"  BOOLEAN DEFAULT FALSE,
  "otpCode"     VARCHAR(10),
  "otpExpiresAt" TIMESTAMP
);
```

### After Google OAuth

```sql
CREATE TABLE "User" (
  id            SERIAL PRIMARY KEY,
  email         VARCHAR(255) UNIQUE NOT NULL,
  username      VARCHAR(255) NOT NULL,
  password      VARCHAR(255),           ← Now nullable
  "createdAt"   TIMESTAMP DEFAULT NOW(),
  "isVerified"  BOOLEAN DEFAULT FALSE,
  "otpCode"     VARCHAR(10),
  "otpExpiresAt" TIMESTAMP,
  "authProvider" VARCHAR(50) DEFAULT 'email'  ← NEW!
);

-- Indexes for performance
CREATE INDEX "User_authProvider_idx" 
  ON "User"("authProvider");
  
CREATE INDEX "User_email_authProvider_idx" 
  ON "User"("email", "authProvider");
```

---

## 🔄 Data Flow Diagram

```
┌──────────────────────────────────────────────────────────────────┐
│                    Google OAuth Data Flow                         │
└──────────────────────────────────────────────────────────────────┘

Step 1: User clicks "Sign in with Google"
  └─▶ Frontend calls: signInWithPopup(auth, googleProvider)

Step 2: Google OAuth popup opens
  └─▶ User selects Google account

Step 3: Google returns to Firebase
  └─▶ Firebase verifies with Google
  └─▶ Firebase returns authenticated user object

Step 4: Frontend gets Firebase token
  └─▶ const token = await result.user.getIdToken()

Step 5: Frontend sends to backend
  └─▶ POST /api/auth/firebase-login
  └─▶ Body: { token: "eyJhbGc..." }

Step 6: Backend verifies token
  └─▶ admin.auth().verifyIdToken(token)
  └─▶ Extracts: { email, name, provider: "google.com" }

Step 7: Backend checks database
  └─▶ User exists?
      ├─ NO ─▶ Create new user
      │        ├─ email: from token
      │        ├─ username: from token name
      │        ├─ password: NULL
      │        ├─ authProvider: "google"
      │        └─ isVerified: true
      │
      └─ YES ─▶ Update if needed
               └─ Set isVerified: true if false

Step 8: Backend generates JWT
  └─▶ jwt.sign({ userId, email, username }, SECRET, { expiresIn: '7d' })

Step 9: Backend returns response
  └─▶ { user, token, provider: "google.com" }

Step 10: Frontend stores JWT
  └─▶ localStorage.setItem("token", data.token)

Step 11: Frontend navigates
  └─▶ navigate("/jobPage")

Step 12: JobPage loads
  └─▶ Reads token from localStorage
  └─▶ Decodes to get user info
  └─▶ Displays user in navbar
```

---

*This architecture supports multiple authentication methods while maintaining security and scalability.*

