#!/bin/bash

# VPS Update Script for Gardenia 2025
# This script updates the VPS with the latest changes

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_step() {
    echo -e "${BLUE}[STEP]${NC} $1"
}

echo "🚀 Gardenia 2025 VPS Update Script"
echo "=================================="
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ] || [ ! -d "backend" ] || [ ! -d "frontend" ]; then
    print_error "Please run this script from the Gardenia2025 project root directory"
    exit 1
fi

print_step "1. Checking current git status..."
git status

print_step "2. Pulling latest changes from GitHub..."
git pull origin master

if [ $? -eq 0 ]; then
    print_status "✅ Successfully pulled latest changes"
else
    print_error "❌ Failed to pull changes. Please check your git configuration."
    exit 1
fi

print_step "3. Updating backend dependencies..."
cd backend
npm install

if [ $? -eq 0 ]; then
    print_status "✅ Backend dependencies updated"
else
    print_error "❌ Failed to update backend dependencies"
    exit 1
fi

print_step "4. Building frontend..."
cd ../frontend
npm install
npm run build

if [ $? -eq 0 ]; then
    print_status "✅ Frontend built successfully"
else
    print_error "❌ Frontend build failed"
    exit 1
fi

print_step "5. Copying frontend build to backend..."
cp -r dist/* ../backend/public/

if [ $? -eq 0 ]; then
    print_status "✅ Frontend files copied to backend"
else
    print_error "❌ Failed to copy frontend files"
    exit 1
fi

print_step "6. Restarting application with PM2..."
cd ../backend

# Check if PM2 is running
if ! pm2 list | grep -q "gardenia-backend"; then
    print_warning "PM2 process not found. Starting application..."
    pm2 start server.js --name "gardenia-backend"
else
    print_status "Restarting existing PM2 process..."
    pm2 restart gardenia-backend
fi

if [ $? -eq 0 ]; then
    print_status "✅ Application restarted successfully"
else
    print_error "❌ Failed to restart application"
    exit 1
fi

print_step "7. Testing PDF generation..."
if [ -f "test-ubuntu-pdf.js" ]; then
    node test-ubuntu-pdf.js
    if [ $? -eq 0 ]; then
        print_status "✅ PDF generation test passed"
    else
        print_warning "⚠️ PDF generation test failed, but application may still work"
    fi
else
    print_warning "⚠️ PDF test script not found, skipping test"
fi

print_step "8. Checking application status..."
pm2 status

echo ""
print_status "🎉 Update completed successfully!"
echo ""
print_status "Next steps:"
echo "1. Check application status: pm2 status"
echo "2. View logs: pm2 logs gardenia-backend"
echo "3. Test in browser: http://your-vps-ip:5000"
echo "4. Verify Rap Arena event is displayed"
echo "5. Test registration process"
echo ""
print_status "Application should now be running with the latest changes!"
