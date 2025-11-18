-- Migration: Add OAuth Support
-- This migration adds support for Google OAuth and other auth providers

-- Step 1: Make password field nullable (for OAuth users)
ALTER TABLE "User" ALTER COLUMN "password" DROP NOT NULL;

-- Step 2: Add authProvider field with default value
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "authProvider" TEXT NOT NULL DEFAULT 'email';

-- Step 3: Update existing users to have authProvider = 'email'
UPDATE "User" SET "authProvider" = 'email' WHERE "authProvider" IS NULL OR "authProvider" = '';

-- Step 4: Create index for faster auth provider lookups (optional but recommended)
CREATE INDEX IF NOT EXISTS "User_authProvider_idx" ON "User"("authProvider");

-- Step 5: Create index for email + authProvider combination (prevents duplicate accounts)
CREATE INDEX IF NOT EXISTS "User_email_authProvider_idx" ON "User"("email", "authProvider");

