#!/bin/bash

# Gardenia 2025 VPS Deployment Script
# This script automates the deployment process on Ubuntu VPS

set -e  # Exit on any error

echo "🚀 Starting Gardenia 2025 VPS Deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
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

# Check if running as root
if [[ $EUID -eq 0 ]]; then
   print_error "This script should not be run as root for security reasons"
   exit 1
fi

# Update system
print_status "Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install essential dependencies
print_status "Installing essential dependencies..."
sudo apt install -y \
    gconf-service \
    libasound2 \
    libatk1.0-0 \
    libc6 \
    libcairo2 \
    libcups2 \
    libdbus-1-3 \
    libexpat1 \
    libfontconfig1 \
    libgcc1 \
    libgconf-2-4 \
    libgdk-pixbuf2.0-0 \
    libglib2.0-0 \
    libgtk-3-0 \
    libnspr4 \
    libnss3 \
    libpango-1.0-0 \
    libpangocairo-1.0-0 \
    libstdc++6 \
    libx11-6 \
    libx11-xcb1 \
    libxcb1 \
    libxcomposite1 \
    libxcursor1 \
    libxdamage1 \
    libxext6 \
    libxfixes3 \
    libxi6 \
    libxrandr2 \
    libxrender1 \
    libxss1 \
    libxtst6 \
    lsb-release \
    wget \
    xdg-utils

# Install Google Chrome
print_status "Installing Google Chrome..."
wget -q -O - https://dl.google.com/linux/linux_signing_key.pub | sudo gpg --dearmor -o /usr/share/keyrings/googlechrome-linux-keyring.gpg
echo "deb [arch=amd64 signed-by=/usr/share/keyrings/googlechrome-linux-keyring.gpg] http://dl.google.com/linux/chrome/deb/ stable main" | sudo tee /etc/apt/sources.list.d/google-chrome.list
sudo apt-get update
sudo apt-get install -y google-chrome-stable

# Install Chromium as backup
print_status "Installing Chromium as backup..."
sudo apt-get install -y chromium-browser

# Set environment variables
print_status "Setting up environment variables..."
echo 'export PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable' >> ~/.bashrc
source ~/.bashrc

# Install PM2 globally
print_status "Installing PM2..."
sudo npm install -g pm2

# Check if repository exists
if [ ! -d "Gardenia2025" ]; then
    print_status "Cloning repository..."
    git clone https://github.com/thankiuday/Gardenia2025.git
fi

cd Gardenia2025

# Install backend dependencies
print_status "Installing backend dependencies..."
cd backend
npm install

# Check if .env exists
if [ ! -f ".env" ]; then
    print_warning "Environment file not found. Please create .env file with your configuration."
    print_status "Copying environment template..."
    cp env.production.example .env
    print_warning "Please edit .env file with your actual configuration before continuing."
    read -p "Press Enter to continue after editing .env file..."
fi

# Build frontend
print_status "Building frontend..."
cd ../frontend
npm install
npm run build

# Copy build files
print_status "Copying frontend build files..."
cp -r dist/* ../backend/public/

# Test PDF generation
print_status "Testing PDF generation..."
cd ../backend
if [ -f "test-ubuntu-pdf.js" ]; then
    node test-ubuntu-pdf.js
    if [ $? -eq 0 ]; then
        print_status "✅ PDF generation test successful!"
    else
        print_error "❌ PDF generation test failed!"
        exit 1
    fi
else
    print_warning "PDF test script not found, skipping test..."
fi

# Start application with PM2
print_status "Starting application with PM2..."
pm2 start server.js --name "gardenia-backend"

# Save PM2 configuration
pm2 save

# Setup PM2 startup
print_status "Setting up PM2 startup..."
pm2 startup

print_status "✅ Deployment completed successfully!"
print_status "Application is running on PM2. Check status with: pm2 status"
print_status "View logs with: pm2 logs gardenia-backend"
print_status "Application should be accessible at: http://your-vps-ip:5000"

echo ""
print_status "Next steps:"
echo "1. Configure your domain to point to this VPS"
echo "2. Setup SSL certificate (Let's Encrypt recommended)"
echo "3. Configure Nginx reverse proxy (optional but recommended)"
echo "4. Test the application thoroughly"
echo "5. Monitor logs: pm2 logs gardenia-backend"
