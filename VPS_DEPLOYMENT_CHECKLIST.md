# 🚀 VPS Deployment Checklist - Gardenia 2025

## ✅ **Pre-Deployment Checklist**

### **📋 Prerequisites**
- [ ] **Hostinger VPS Basic Plan** purchased
- [ ] **Domain name** configured and pointing to VPS IP
- [ ] **MongoDB Atlas** account and database created
- [ ] **AWS S3** account and bucket created
- [ ] **SSH access** to VPS working

### **🔧 VPS Setup**
- [ ] **Ubuntu 20.04/22.04** installed
- [ ] **Root access** available
- [ ] **Firewall** configured (ports 22, 80, 443)
- [ ] **Domain DNS** pointing to VPS IP

---

## **🚀 Deployment Steps**

### **Step 1: Initial VPS Setup**
```bash
# Connect to VPS
ssh root@your-vps-ip

# Update system
apt update && apt upgrade -y

# Install Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt-get install -y nodejs

# Install required packages
apt install -y nginx certbot python3-certbot-nginx git ufw
npm install -g pm2
```

### **Step 2: Upload Project Files**
```bash
# Create project directory
mkdir -p /var/www/gardenia2025

# Upload your project files to /var/www/gardenia2025/
# Use SCP, SFTP, or Git clone
```

### **Step 3: Configure Environment**
```bash
# Backend environment
cd /var/www/gardenia2025/backend
cp env.hostinger.example .env
nano .env  # Update with your actual values

# Frontend environment
cd /var/www/gardenia2025/frontend
cp env.vps.example .env
nano .env  # Update with your domain
```

### **Step 4: Install Dependencies**
```bash
# Backend dependencies
cd /var/www/gardenia2025/backend
npm install --production

# Frontend dependencies and build
cd /var/www/gardenia2025/frontend
npm install --production
npm run build
```

### **Step 5: Configure Nginx**
```bash
# Copy nginx configuration
cp nginx.conf /etc/nginx/sites-available/gardenia2025

# Update domain name in nginx.conf
sed -i 's/your-domain.com/your-actual-domain.com/g' /etc/nginx/sites-available/gardenia2025

# Enable site
ln -sf /etc/nginx/sites-available/gardenia2025 /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# Test configuration
nginx -t
systemctl restart nginx
```

### **Step 6: Setup SSL**
```bash
# Get SSL certificate
certbot --nginx -d your-domain.com -d www.your-domain.com

# Setup auto-renewal
crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

### **Step 7: Start Application**
```bash
cd /var/www/gardenia2025
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

---

## **🔐 Environment Variables to Configure**

### **Backend (.env)**
```bash
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/gardenia2025
JWT_SECRET=your_super_secure_jwt_secret_key
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=us-east-1
AWS_S3_BUCKET=gardenia2025-assets
FRONTEND_URL=https://your-domain.com
CORS_ALLOW_ALL=false
```

### **Frontend (.env)**
```bash
VITE_API_URL=https://your-domain.com
NODE_ENV=production
```

---

## **✅ Post-Deployment Verification**

### **🔍 Health Checks**
- [ ] **Website loads**: https://your-domain.com
- [ ] **SSL certificate**: Green lock icon
- [ ] **API health**: https://your-domain.com/api/health
- [ ] **Admin panel**: https://your-domain.com/admin
- [ ] **Registration form**: Working correctly
- [ ] **QR scanner**: Functional

### **📊 Performance Checks**
- [ ] **Page load time**: < 3 seconds
- [ ] **API response**: < 1 second
- [ ] **SSL rating**: A+ (check with SSL Labs)
- [ ] **Mobile responsive**: All devices

### **🔧 Monitoring Setup**
- [ ] **PM2 status**: `pm2 status`
- [ ] **Logs**: `pm2 logs gardenia2025-backend`
- [ ] **Nginx logs**: Check access/error logs
- [ ] **SSL renewal**: Test with `certbot renew --dry-run`

---

## **🚨 Troubleshooting**

### **Common Issues & Solutions**

#### **1. Application Not Starting**
```bash
# Check PM2 logs
pm2 logs gardenia2025-backend

# Check if port 5000 is in use
netstat -tlnp | grep :5000

# Restart application
pm2 restart gardenia2025-backend
```

#### **2. Nginx 502 Bad Gateway**
```bash
# Check if backend is running
pm2 status

# Check backend logs
pm2 logs gardenia2025-backend

# Check nginx configuration
nginx -t
```

#### **3. SSL Certificate Issues**
```bash
# Check certificate status
certbot certificates

# Renew certificate
certbot renew --force-renewal

# Check nginx SSL configuration
nginx -t
```

#### **4. Database Connection Issues**
```bash
# Check MongoDB connection string in .env
# Ensure MongoDB Atlas IP whitelist includes your VPS IP
# Test connection: node -e "require('mongoose').connect(process.env.MONGODB_URI)"
```

#### **5. CORS Issues**
```bash
# Check allowed origins in backend/server.js
# Update FRONTEND_URL in .env
# Restart application: pm2 restart gardenia2025-backend
```

---

## **📈 Performance Optimization**

### **✅ Already Configured**
- [x] **Gzip compression** in Nginx
- [x] **Static asset caching** (1 year)
- [x] **PM2 process management** with auto-restart
- [x] **Log rotation** setup
- [x] **Security headers** configured

### **🔧 Additional Optimizations**
```bash
# Enable Nginx caching
# Already configured in nginx.conf

# Setup log rotation
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7

# Monitor resources
pm2 install pm2-server-monit
pm2 monit
```

---

## **🔄 Update Process**

### **Deploy Updates**
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

---

## **📞 Support Resources**

### **Hostinger Support**
- 📧 Email: support@hostinger.com
- 💬 Live Chat: Available 24/7
- 📚 Documentation: https://support.hostinger.com/

### **Application Support**
- 📧 Email: your-support-email@domain.com
- 📱 Phone: Your contact number

---

## **🎯 Expected Performance**

With Hostinger VPS Basic Plan:
- ✅ **Concurrent Users**: 100-200
- ✅ **Response Time**: < 2 seconds
- ✅ **Uptime**: 99.9%
- ✅ **SSL Rating**: A+
- ✅ **Security**: High

---

## **✅ Final Checklist**

- [ ] All environment variables configured
- [ ] SSL certificate working
- [ ] Application running on PM2
- [ ] Nginx serving static files
- [ ] Database connection working
- [ ] All features tested
- [ ] Monitoring setup
- [ ] Backup strategy implemented

**🎉 Your Gardenia 2025 application is ready for production!**
