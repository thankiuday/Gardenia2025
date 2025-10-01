# VPS Deployment Guide for PDF Generation

This guide ensures PDF generation works properly on Ubuntu VPS systems.

## Prerequisites

- Ubuntu 22.04 LTS VPS (recommended)
- Node.js 18+
- MongoDB
- AWS S3 credentials configured

> **Note**: For Ubuntu 22.04 specific instructions, see `UBUNTU_22_04_DEPLOYMENT.md`

## Step 1: Install Chrome/Chromium

### Option A: Automated Setup (Recommended)
```bash
# Make the setup script executable
chmod +x setup-ubuntu-pdf.sh

# Run the setup script
./setup-ubuntu-pdf.sh
```

### Option B: Manual Installation
```bash
# Update package list
sudo apt-get update

# Install dependencies
sudo apt-get install -y wget gnupg

# Install Google Chrome
wget -q -O - https://dl.google.com/linux/linux_signing_key.pub | sudo apt-key add -
echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" | sudo tee /etc/apt/sources.list.d/google-chrome.list
sudo apt-get update
sudo apt-get install -y google-chrome-stable

# Set environment variable
export PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable
```

## Step 2: Environment Variables

Add these to your `.env` file:
```env
PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable
PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
NODE_ENV=production
```

## Step 3: Install Dependencies

```bash
# Install Node.js dependencies
npm install

# Install system dependencies for Puppeteer
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
```

## Step 4: Test PDF Generation

```bash
# Test PDF generation
node -e "
const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setContent('<h1>Test PDF</h1>');
  const pdf = await page.pdf({format: 'A4'});
  console.log('PDF generated successfully, size:', pdf.length, 'bytes');
  await browser.close();
})();
"
```

## Step 5: Production Deployment

### Using PM2 (Recommended)
```bash
# Install PM2 globally
npm install -g pm2

# Start the application
pm2 start server.js --name "gardenia-backend"

# Save PM2 configuration
pm2 save
pm2 startup
```

### Using Docker
```bash
# Build the Docker image
docker build -f Dockerfile.pdf -t gardenia-backend .

# Run the container
docker run -d \
  --name gardenia-backend \
  -p 5000:5000 \
  -e NODE_ENV=production \
  -e PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser \
  gardenia-backend
```

## Troubleshooting

### Chrome/Chromium Issues
```bash
# Check if Chrome is installed
which google-chrome-stable
which chromium-browser

# Test Chrome manually
google-chrome-stable --headless --no-sandbox --dump-dom https://www.google.com
```

### Memory Issues
```bash
# Increase swap space if needed
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
```

### Permission Issues
```bash
# Fix permissions for Puppeteer
sudo chown -R $USER:$USER ~/.cache/puppeteer
```

## Environment-Specific Configuration

### Development (Windows)
- Uses bundled Chromium
- No additional setup required

### Production (Ubuntu VPS)
- Uses system Chrome/Chromium
- Requires dependency installation
- Uses environment variables for executable path

## Monitoring

Monitor PDF generation with these commands:
```bash
# Check PM2 status
pm2 status

# View logs
pm2 logs gardenia-backend

# Monitor system resources
htop
```

## Security Considerations

1. **Sandbox Mode**: Always use `--no-sandbox` in production
2. **User Permissions**: Run as non-root user
3. **Resource Limits**: Set memory limits for PDF generation
4. **Timeout Settings**: Configure appropriate timeouts

## Performance Optimization

1. **Browser Pool**: Consider using browser pooling for high traffic
2. **Caching**: Cache generated PDFs when possible
3. **Resource Limits**: Monitor memory usage during PDF generation
4. **Queue System**: Use job queues for PDF generation in high-traffic scenarios
