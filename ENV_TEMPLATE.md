# Environment Variables Setup Guide

## Client (.env in client/ directory)

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# Google OAuth Configuration
VITE_GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com

# API Configuration
VITE_API_URL=http://localhost:8080/
```

## Server (.env in server/ directory)

```env
# Database Configuration
DATABASE_URL="postgresql://username:password@host:5432/database"

# JWT Configuration (CHANGE THIS IN PRODUCTION!)
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production

# Email Configuration (for OTP)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password

# Firebase Admin Configuration
FIREBASE_SERVICE_ACCOUNT='{"type":"service_account","project_id":"...","private_key":"..."}'
# OR
FIREBASE_SERVICE_ACCOUNT_PATH=./path/to/serviceAccount.json
# OR
GOOGLE_APPLICATION_CREDENTIALS=./path/to/serviceAccount.json

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Server Configuration
PORT=8080
NODE_ENV=development
```

## How to Get Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Go to Credentials → Create Credentials → OAuth 2.0 Client ID
5. Add authorized redirect URIs:
   - `http://localhost:8080` (development)
   - `https://your-domain.com` (production)
6. Copy Client ID and Client Secret

## Firebase Google Authentication Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to Authentication → Sign-in method
4. Enable Google provider
5. Add your Google Client ID and Secret (optional for advanced config)

