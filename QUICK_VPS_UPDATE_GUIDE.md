# Quick VPS Update Guide - Gardenia 2025

## 🚀 Quick Update Process

### 1. Connect to VPS
```bash
ssh username@your-vps-ip
```

### 2. Navigate to Project Directory
```bash
cd Gardenia2025
```

### 3. Pull Latest Changes
```bash
git pull origin master
```

### 4. Update Backend Dependencies
```bash
cd backend
npm install
```

### 5. Rebuild Frontend
```bash
cd ../frontend
npm install
npm run build
cp -r dist/* ../backend/public/
```

### 6. Restart Application
```bash
cd ../backend
pm2 restart gardenia-backend
```

### 7. Verify Everything Works
```bash
# Check PM2 status
pm2 status

# Check logs
pm2 logs gardenia-backend

# Test PDF generation
node test-ubuntu-pdf.js
```

## 🔧 If PDF Generation Fails

### Check Chrome Installation
```bash
which google-chrome-stable
google-chrome-stable --version
```

### Reinstall Chrome if Needed
```bash
sudo apt-get update
sudo apt-get install -y google-chrome-stable
```

### Check Environment Variables
```bash
echo $PUPPETEER_EXECUTABLE_PATH
```

### Set Environment Variable
```bash
export PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable
echo 'export PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable' >> ~/.bashrc
```

## 📊 Monitor Application

### Check Status
```bash
pm2 status
pm2 logs gardenia-backend
```

### Restart if Needed
```bash
pm2 restart gardenia-backend
```

### View Real-time Logs
```bash
pm2 logs gardenia-backend --lines 50
```

## 🚨 Troubleshooting

### Application Not Starting
```bash
# Check logs
pm2 logs gardenia-backend

# Check if port is in use
netstat -tulpn | grep :5000

# Kill process if needed
sudo kill -9 <PID>
```

### PDF Generation Issues
```bash
# Test PDF generation
node test-ubuntu-pdf.js

# Check Chrome installation
google-chrome-stable --version

# Install missing dependencies
sudo apt-get install -y libnss3-dev libatk-bridge2.0-dev libdrm2 libxcomposite1 libxdamage1 libxrandr2 libgbm1 libxss1 libasound2
```

### Memory Issues
```bash
# Check memory usage
htop
free -h

# Restart PM2 if needed
pm2 restart all
```

## ✅ Verification Checklist

- [ ] Git pull successful
- [ ] Dependencies installed
- [ ] Frontend built successfully
- [ ] PM2 restarted
- [ ] Application accessible
- [ ] PDF generation working
- [ ] No errors in logs

## 📞 Quick Commands Reference

```bash
# Update application
git pull && cd backend && npm install && cd ../frontend && npm run build && cp -r dist/* ../backend/public/ && cd ../backend && pm2 restart gardenia-backend

# Check status
pm2 status && pm2 logs gardenia-backend

# Test PDF
node test-ubuntu-pdf.js

# View logs
pm2 logs gardenia-backend --lines 100
```

---

**Note:** Always backup your data before updating production systems.
