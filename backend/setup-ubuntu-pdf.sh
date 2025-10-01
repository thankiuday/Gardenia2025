#!/bin/bash

# Setup script for PDF generation on Ubuntu VPS
# This script installs Chrome/Chromium and dependencies for Puppeteer PDF generation

echo "Setting up PDF generation environment for Ubuntu VPS..."

# Update package list
sudo apt-get update

# Install dependencies
sudo apt-get install -y \
    ca-certificates \
    fonts-liberation \
    libappindicator3-1 \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libc6 \
    libcairo2 \
    libcups2 \
    libdbus-1-3 \
    libexpat1 \
    libfontconfig1 \
    libgbm1 \
    libgcc1 \
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

# Install Google Chrome (Ubuntu 22.04 compatible)
echo "Installing Google Chrome for Ubuntu 22.04..."
wget -q -O - https://dl.google.com/linux/linux_signing_key.pub | sudo gpg --dearmor -o /usr/share/keyrings/googlechrome-linux-keyring.gpg
echo "deb [arch=amd64 signed-by=/usr/share/keyrings/googlechrome-linux-keyring.gpg] http://dl.google.com/linux/chrome/deb/ stable main" | sudo tee /etc/apt/sources.list.d/google-chrome.list
sudo apt-get update
sudo apt-get install -y google-chrome-stable

# Alternative: Install Chromium if Chrome fails
echo "Installing Chromium as backup..."
sudo apt-get install -y chromium-browser

# Set environment variable for Puppeteer
echo "Setting up environment variables..."
echo 'export PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable' >> ~/.bashrc
echo 'export PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true' >> ~/.bashrc

# Verify installation
echo "Verifying Chrome installation..."
if [ -f "/usr/bin/google-chrome-stable" ]; then
    echo "✅ Google Chrome installed successfully"
    /usr/bin/google-chrome-stable --version
elif [ -f "/usr/bin/chromium-browser" ]; then
    echo "✅ Chromium installed successfully"
    /usr/bin/chromium-browser --version
else
    echo "❌ Chrome/Chromium installation failed"
    exit 1
fi

echo "PDF generation setup completed!"
echo "Please restart your Node.js application for changes to take effect."
