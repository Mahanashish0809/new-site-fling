#!/bin/bash

# Google OAuth Setup Script for JoltQ
# This script helps set up Google OAuth authentication

set -e  # Exit on error

echo "🚀 JoltQ Google OAuth Setup"
echo "=============================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${YELLOW}ℹ️  $1${NC}"
}

# Check if we're in the project root
if [ ! -d "server" ] || [ ! -d "client" ]; then
    print_error "Please run this script from the project root directory"
    exit 1
fi

print_info "Step 1: Checking prerequisites..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js first."
    exit 1
fi
print_success "Node.js is installed ($(node --version))"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    print_error "npm is not installed. Please install npm first."
    exit 1
fi
print_success "npm is installed ($(npm --version))"

# Check if psql is installed (for database)
if ! command -v psql &> /dev/null; then
    print_info "PostgreSQL client (psql) is not found. You may need it for database operations."
else
    print_success "PostgreSQL client is installed"
fi

echo ""
print_info "Step 2: Setting up database migration..."

cd server

# Check if Prisma is installed
if [ ! -d "node_modules/@prisma/client" ]; then
    print_info "Installing dependencies..."
    npm install
fi

print_info "Running Prisma migration..."
npx prisma migrate dev --name add_oauth_support || {
    print_error "Migration failed. Please check your DATABASE_URL in server/.env"
    exit 1
}
print_success "Database migration completed"

print_info "Generating Prisma client..."
npx prisma generate
print_success "Prisma client generated"

cd ..

echo ""
print_info "Step 3: Checking environment variables..."

# Check client .env
if [ ! -f "client/.env" ]; then
    print_info "Creating client/.env from template..."
    cat > client/.env << 'EOF'
# Firebase Configuration (UPDATE THESE!)
VITE_FIREBASE_API_KEY=AIzaSyBSc__uL1eBA5iH-bdkaf84wIRCseE60VE
VITE_FIREBASE_AUTH_DOMAIN=joltq2025.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=joltq2025
VITE_FIREBASE_STORAGE_BUCKET=joltq2025.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=915503308743
VITE_FIREBASE_APP_ID=1:915503308743:web:32fe4ce32d0ee59fdec3e2

# API Configuration
VITE_API_URL=http://localhost:8080/
EOF
    print_success "Created client/.env file"
else
    print_success "client/.env already exists"
fi

# Check server .env
if [ ! -f "server/.env" ]; then
    print_error "server/.env not found. Please create it with required variables."
    print_info "Required variables: DATABASE_URL, JWT_SECRET, EMAIL_USER, EMAIL_PASS"
    exit 1
else
    print_success "server/.env exists"
fi

echo ""
print_info "Step 4: Installing dependencies..."

# Install client dependencies
print_info "Installing client dependencies..."
cd client
npm install || print_error "Failed to install client dependencies"
cd ..
print_success "Client dependencies installed"

# Install server dependencies
print_info "Installing server dependencies..."
cd server
npm install || print_error "Failed to install server dependencies"
cd ..
print_success "Server dependencies installed"

echo ""
print_success "Setup completed successfully! 🎉"
echo ""
echo "=============================="
echo "📋 Next Steps:"
echo "=============================="
echo ""
echo "1. Enable Google Authentication in Firebase Console:"
echo "   → Go to https://console.firebase.google.com/"
echo "   → Select project 'joltq2025'"
echo "   → Authentication → Sign-in method → Enable Google"
echo ""
echo "2. Start the servers:"
echo "   Terminal 1 (Backend):"
echo "   $ cd server && npm start"
echo ""
echo "   Terminal 2 (Frontend):"
echo "   $ cd client && npm run dev"
echo ""
echo "3. Test Google login:"
echo "   → Navigate to http://localhost:8080/login"
echo "   → Click 'Sign in with Google' button"
echo ""
echo "4. For detailed documentation, see:"
echo "   → GOOGLE_OAUTH_SETUP.md"
echo ""
echo "=============================="

