# 🚀 Hostinger VPS Deployment Guide for Gardenia 2025

This guide will help you deploy the Gardenia 2025 application on Hostinger VPS with SSL enabled.

## 📋 Prerequisites

### **1. Hostinger VPS Setup**
- ✅ Purchase Hostinger VPS Basic Plan
- ✅ Configure your domain DNS to point to VPS IP
- ✅ Access to VPS via SSH

### **2. Required Services**
- ✅ MongoDB Atlas account (free tier)
- ✅ AWS S3 account (for file storage)
- ✅ Domain name configured

## 🔧 VPS Setup Steps

### **Step 1: Connect to Your VPS**
```bash
ssh root@your-vps-ip
```

### **Step 2: Update System**
```bash
apt update && apt upgrade -y
```

### **Step 3: Install Required Software**
```bash
# Install Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt-get install -y nodejs

# Install Nginx
apt install -y nginx

# Install PM2
npm install -g pm2

# Install Certbot for SSL
apt install -y certbot python3-certbot-nginx
```

### **Step 4: Upload Project Files**
```bash
# Create project directory
mkdir -p /var/www/gardenia2025

# Upload your project files to /var/www/gardenia2025/
# You can use SCP, SFTP, or Git clone
```

### **Step 5: Configure Environment**
```bash
cd /var/www/gardenia2025/backend
cp env.hostinger.example .env
nano .env  # Update with your actual values
```

### **Step 6: Install Dependencies**
```bash
# Backend dependencies
cd /var/www/gardenia2025/backend
npm install --production

# Frontend dependencies and build
cd /var/www/gardenia2025/frontend
npm install --production
npm run build
```

### **Step 7: Configure Nginx**
```bash
# Copy nginx configuration
cp nginx.conf /etc/nginx/sites-available/gardenia2025

# Update domain name in nginx.conf
nano /etc/nginx/sites-available/gardenia2025

# Enable site
ln -sf /etc/nginx/sites-available/gardenia2025 /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# Test configuration
nginx -t
systemctl restart nginx
```

### **Step 8: Setup SSL Certificate**
```bash
# Get SSL certificate
certbot --nginx -d your-domain.com -d www.your-domain.com

# Setup auto-renewal
crontab -e
# Add this line:
# 0 12 * * * /usr/bin/certbot renew --quiet
```

### **Step 9: Start Application**
```bash
cd /var/www/gardenia2025
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### **Step 10: Configure Firewall**
```bash
ufw allow 22
ufw allow 80
ufw allow 443
ufw --force enable
```

## 🔐 SSL Configuration

### **Automatic SSL with Let's Encrypt**
The setup script will automatically:
- ✅ Install Certbot
- ✅ Obtain SSL certificate
- ✅ Configure auto-renewal
- ✅ Redirect HTTP to HTTPS

### **Manual SSL Setup**
If you prefer manual setup:
```bash
# Install Certbot
apt install -y certbot python3-certbot-nginx

# Get certificate
certbot --nginx -d your-domain.com -d www.your-domain.com

# Test renewal
certbot renew --dry-run
```

## 📊 Monitoring & Maintenance

### **PM2 Commands**
```bash
# View application status
pm2 status

# View logs
pm2 logs gardenia2025-backend

# Restart application
pm2 restart gardenia2025-backend

# Monitor resources
pm2 monit
```

### **Nginx Commands**
```bash
# Test configuration
nginx -t

# Reload configuration
systemctl reload nginx

# View logs
tail -f /var/log/nginx/gardenia2025_access.log
tail -f /var/log/nginx/gardenia2025_error.log
```

### **SSL Renewal**
```bash
# Test renewal
certbot renew --dry-run

# Manual renewal
certbot renew
```

## 🚨 Troubleshooting

### **Common Issues**

#### **1. Application Not Starting**
```bash
# Check PM2 logs
pm2 logs gardenia2025-backend

# Check if port 5000 is in use
netstat -tlnp | grep :5000
```

#### **2. Nginx 502 Bad Gateway**
```bash
# Check if backend is running
pm2 status

# Check backend logs
pm2 logs gardenia2025-backend
```

#### **3. SSL Certificate Issues**
```bash
# Check certificate status
certbot certificates

# Renew certificate
certbot renew --force-renewal
```

#### **4. Database Connection Issues**
```bash
# Check MongoDB connection string in .env
# Ensure MongoDB Atlas IP whitelist includes your VPS IP
```

## 📈 Performance Optimization

### **1. Enable Gzip Compression**
Already configured in nginx.conf

### **2. Setup Log Rotation**
```bash
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7
```

### **3. Monitor Resources**
```bash
pm2 install pm2-server-monit
pm2 monit
```

## 🔄 Deployment Updates

### **Update Application**
```bash
# Pull latest changes
cd /var/www/gardenia2025
git pull origin master

# Install new dependencies
cd backend && npm install --production
cd ../frontend && npm install --production && npm run build

# Restart application
pm2 restart gardenia2025-backend
```

## 📞 Support

### **Hostinger Support**
- 📧 Email: support@hostinger.com
- 💬 Live Chat: Available 24/7
- 📚 Documentation: https://support.hostinger.com/

### **Application Support**
- 📧 Email: your-support-email@domain.com
- 📱 Phone: Your contact number

## ✅ Checklist

- [ ] VPS purchased and configured
- [ ] Domain DNS updated
- [ ] MongoDB Atlas configured
- [ ] AWS S3 configured
- [ ] SSL certificate obtained
- [ ] Application deployed
- [ ] Monitoring setup
- [ ] Backup strategy implemented

## 🎯 Expected Performance

With Hostinger VPS Basic Plan:
- ✅ **Concurrent Users**: 100-200
- ✅ **Response Time**: < 2 seconds
- ✅ **Uptime**: 99.9%
- ✅ **SSL**: A+ Rating
- ✅ **Security**: High

Your Gardenia 2025 application is now ready for production! 🚀
