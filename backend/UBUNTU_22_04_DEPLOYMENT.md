# Ubuntu 22.04 Production Deployment Guide

This guide ensures PDF generation works properly on Ubuntu 22.04 VPS systems.

## Prerequisites

- Ubuntu 22.04 LTS VPS
- Node.js 18+
- MongoDB
- AWS S3 credentials configured

## Step 1: System Update

```bash
sudo apt update && sudo apt upgrade -y
```

## Step 2: Install Chrome/Chromium

### Option A: Automated Setup (Recommended)
```bash
# Make the setup script executable
chmod +x setup-ubuntu-pdf.sh

# Run the setup script
./setup-ubuntu-pdf.sh
```

### Option B: Manual Installation for Ubuntu 22.04
```bash
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

# Install Google Chrome (Ubuntu 22.04 method)
wget -q -O - https://dl.google.com/linux/linux_signing_key.pub | sudo gpg --dearmor -o /usr/share/keyrings/googlechrome-linux-keyring.gpg
echo "deb [arch=amd64 signed-by=/usr/share/keyrings/googlechrome-linux-keyring.gpg] http://dl.google.com/linux/chrome/deb/ stable main" | sudo tee /etc/apt/sources.list.d/google-chrome.list
sudo apt-get update
sudo apt-get install -y google-chrome-stable

# Alternative: Install Chromium
sudo apt-get install -y chromium-browser
```

## Step 3: Environment Variables

Create a `.env` file in your backend directory:

```env
NODE_ENV=production
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=us-east-1
AWS_S3_BUCKET=gardenia2025-assets
PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable
PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
```

## Step 4: Install Node.js Dependencies

```bash
# Install dependencies
npm install

# Install PM2 globally for process management
sudo npm install -g pm2
```

## Step 5: Test PDF Generation

```bash
# Test PDF generation
node -e "
const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    executablePath: '/usr/bin/google-chrome-stable'
  });
  const page = await browser.newPage();
  await page.setContent('<h1>Test PDF</h1>');
  const pdf = await page.pdf({format: 'A4'});
  console.log('PDF generated successfully, size:', pdf.length, 'bytes');
  await browser.close();
})();
"
```

## Step 6: Production Deployment

### Using PM2 (Recommended)
```bash
# Start the application
pm2 start server.js --name "gardenia-backend"

# Save PM2 configuration
pm2 save
pm2 startup

# Monitor the application
pm2 logs gardenia-backend
pm2 status
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

## Step 7: Nginx Configuration (Optional)

If using Nginx as a reverse proxy:

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

## Troubleshooting

### Chrome/Chromium Issues
```bash
# Check if Chrome is installed
which google-chrome-stable
which chromium-browser

# Test Chrome manually
google-chrome-stable --headless --no-sandbox --dump-dom https://www.google.com

# Check Chrome version
google-chrome-stable --version
```

### Permission Issues
```bash
# Fix permissions for Puppeteer
sudo chown -R $USER:$USER ~/.cache/puppeteer
sudo chmod -R 755 ~/.cache/puppeteer
```

### Memory Issues
```bash
# Check available memory
free -h

# Increase swap if needed
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
```

### Firewall Configuration
```bash
# Allow port 5000
sudo ufw allow 5000
sudo ufw enable
```

## Monitoring

```bash
# Check PM2 status
pm2 status

# View logs
pm2 logs gardenia-backend

# Monitor system resources
htop
iostat -x 1

# Check disk space
df -h
```

## Security Considerations

1. **Run as non-root user**
2. **Use environment variables for secrets**
3. **Enable firewall**
4. **Keep system updated**
5. **Use HTTPS in production**

## Performance Optimization

1. **Set up swap space** for memory-intensive PDF generation
2. **Monitor memory usage** during PDF generation
3. **Use PM2 cluster mode** for multiple instances
4. **Cache generated PDFs** when possible

## Backup Strategy

```bash
# Backup MongoDB
mongodump --uri="your_mongodb_uri" --out=/backup/mongodb/

# Backup application files
tar -czf /backup/app-$(date +%Y%m%d).tar.gz /path/to/your/app
```

## SSL Certificate (Optional)

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d your-domain.com
```

This setup ensures PDF generation works reliably on Ubuntu 22.04 production servers! 🚀
