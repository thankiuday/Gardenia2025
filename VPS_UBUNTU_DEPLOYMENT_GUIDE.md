# VPS Ubuntu Deployment Guide - Gardenia 2025

This comprehensive guide will help you deploy the Gardenia 2025 application on an Ubuntu VPS with proper PDF generation support.

## 🚀 Quick Start

### Prerequisites
- Ubuntu 22.04 LTS VPS
- SSH access to your VPS
- Node.js 18+ installed
- MongoDB instance accessible
- AWS S3 credentials configured

## 📋 Step-by-Step Deployment

### 1. Connect to Your VPS
```bash
ssh username@your-vps-ip
```

### 2. Update System and Install Dependencies
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install essential build tools and libraries
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
```

### 3. Install Google Chrome (Required for PDF Generation)
```bash
# Install Google Chrome for Ubuntu 22.04
echo "Installing Google Chrome for Ubuntu 22.04..."
wget -q -O - https://dl.google.com/linux/linux_signing_key.pub | sudo gpg --dearmor -o /usr/share/keyrings/googlechrome-linux-keyring.gpg
echo "deb [arch=amd64 signed-by=/usr/share/keyrings/googlechrome-linux-keyring.gpg] http://dl.google.com/linux/chrome/deb/ stable main" | sudo tee /etc/apt/sources.list.d/google-chrome.list
sudo apt-get update
sudo apt-get install -y google-chrome-stable

# Alternative: Install Chromium if Chrome fails
echo "Installing Chromium as backup..."
sudo apt-get install -y chromium-browser
```

### 4. Set Environment Variables
```bash
# Add to ~/.bashrc
echo 'export PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable' >> ~/.bashrc
# Or if using Chromium:
# echo 'export PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser' >> ~/.bashrc

# Reload environment
source ~/.bashrc
```

### 5. Clone and Setup Application
```bash
# Clone repository
git clone https://github.com/thankiuday/Gardenia2025.git
cd Gardenia2025

# Install Node.js dependencies
cd backend
npm install

# Install PM2 globally
sudo npm install -g pm2
```

### 6. Configure Environment Variables
```bash
# Copy environment template
cp env.production.example .env

# Edit environment file
nano .env
```

**Required Environment Variables:**
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb://localhost:27017/gardenia2025
# Or your MongoDB Atlas connection string

# AWS S3 Configuration
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=us-east-1
AWS_S3_BUCKET_NAME=your_bucket_name

# PDF Generation
PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable
```

### 7. Build Frontend
```bash
# Go to frontend directory
cd ../frontend

# Install dependencies
npm install

# Build for production
npm run build

# Copy build files to backend public directory
cp -r dist/* ../backend/public/
```

### 8. Test PDF Generation
```bash
# Go to backend directory
cd ../backend

# Test PDF generation
node test-ubuntu-pdf.js
```

**Expected Output:**
```
Testing Puppeteer PDF generation on Ubuntu...
Using Chrome executable: /usr/bin/google-chrome-stable
✅ PDF generated successfully to /path/to/test-output.pdf!
```

### 9. Start Application with PM2
```bash
# Start backend with PM2
pm2 start server.js --name "gardenia-backend"

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup
# Follow the instructions provided by the command above
```

### 10. Configure Nginx (Optional but Recommended)
```bash
# Install Nginx
sudo apt install nginx -y

# Create Nginx configuration
sudo nano /etc/nginx/sites-available/gardenia2025
```

**Nginx Configuration:**
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/gardenia2025 /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## 🔧 Troubleshooting

### PDF Generation Issues
```bash
# Check if Chrome is installed
which google-chrome-stable

# Test Chrome manually
google-chrome-stable --version

# Check environment variable
echo $PUPPETEER_EXECUTABLE_PATH

# View PM2 logs
pm2 logs gardenia-backend
```

### Common Issues and Solutions

1. **"Failed to load PDF document"**
   - Ensure Chrome/Chromium is installed
   - Check `PUPPETEER_EXECUTABLE_PATH` environment variable
   - Verify all dependencies are installed

2. **"Permission denied" errors**
   - Check file permissions: `chmod +x setup-ubuntu-pdf.sh`
   - Ensure user has proper permissions

3. **Memory issues**
   - Increase VPS RAM (minimum 2GB recommended)
   - Monitor memory usage: `htop`

4. **Port already in use**
   - Check if port 5000 is free: `netstat -tulpn | grep :5000`
   - Kill existing process: `sudo kill -9 <PID>`

## 📊 Monitoring and Maintenance

### Check Application Status
```bash
# PM2 status
pm2 status

# View logs
pm2 logs gardenia-backend

# Restart application
pm2 restart gardenia-backend
```

### Update Application
```bash
# Pull latest changes
git pull origin master

# Install new dependencies
npm install

# Rebuild frontend
cd ../frontend
npm run build
cp -r dist/* ../backend/public/

# Restart application
cd ../backend
pm2 restart gardenia-backend
```

## 🚀 Production Checklist

- [ ] Chrome/Chromium installed and working
- [ ] Environment variables configured
- [ ] MongoDB connection working
- [ ] AWS S3 credentials configured
- [ ] PDF generation tested successfully
- [ ] PM2 running and configured for auto-start
- [ ] Nginx configured (if using)
- [ ] SSL certificate installed (if using HTTPS)
- [ ] Domain pointing to VPS IP
- [ ] Firewall configured properly

## 📞 Support

If you encounter any issues:

1. Check PM2 logs: `pm2 logs gardenia-backend`
2. Verify environment variables: `env | grep -E "(MONGODB|AWS|PUPPETEER)"`
3. Test PDF generation: `node test-ubuntu-pdf.js`
4. Check system resources: `htop` and `df -h`

## 🔄 Automated Setup Script

For quick setup, you can use the provided script:

```bash
# Make script executable
chmod +x backend/setup-ubuntu-pdf.sh

# Run setup script
./backend/setup-ubuntu-pdf.sh
```

This script will automatically install Chrome, configure environment variables, and test PDF generation.

---

**Note:** This guide assumes you have basic Linux server administration knowledge. Always backup your data before making changes to production systems.
