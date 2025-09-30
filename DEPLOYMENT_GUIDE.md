# 🚀 Gardenia 2025 - VPS Deployment Guide

## 📋 Prerequisites

- Ubuntu 22.04 VPS
- Domain: `https://gardenia.gardencity.university`
- GitHub repository access
- AWS S3 bucket configured
- MongoDB Atlas or local MongoDB

## 🔧 Step 1: VPS Initial Setup

### 1.1 Update System
```bash
sudo apt update && sudo apt upgrade -y
```

### 1.2 Install Essential Packages
```bash
sudo apt install -y curl wget git nginx certbot python3-certbot-nginx ufw
```

### 1.3 Install Node.js 18.x
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### 1.4 Install PM2 (Process Manager)
```bash
sudo npm install -g pm2
```

## 🔧 Step 2: Clone and Setup Application

### 2.1 Clone Repository
```bash
cd /var/www
sudo git clone https://github.com/thankiuday/Gardenia2025.git
sudo chown -R $USER:$USER /var/www/Gardenia2025
cd /var/www/Gardenia2025
```

### 2.2 Install Dependencies
```bash
# Backend dependencies
cd backend
npm install

# Frontend dependencies
cd ../frontend
npm install
```

### 2.3 Build Frontend
```bash
npm run build
```

## 🔧 Step 3: Environment Configuration

### 3.1 Backend Environment (.env)
Create `/var/www/Gardenia2025/backend/.env`:

```env
# Server Configuration
NODE_ENV=production
PORT=5000

# Database
MONGODB_URI=your_mongodb_atlas_connection_string

# JWT Secret (CHANGE THIS!)
JWT_SECRET=your_super_secure_jwt_secret_key_here

# AWS S3 Configuration
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=us-east-1
AWS_S3_BUCKET=gardenia2025-assets
S3_BASE_URL=https://gardenia2025-assets.s3.us-east-1.amazonaws.com

# CORS Configuration
FRONTEND_URL=https://gardenia.gardencity.university
CORS_ALLOW_ALL=false

# Puppeteer (for PDF generation)
PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable
```

### 3.2 Frontend Environment (.env)
Create `/var/www/Gardenia2025/frontend/.env`:

```env
VITE_API_URL=https://gardenia.gardencity.university/api
```

## 🔧 Step 4: Nginx Configuration

### 4.1 Create Nginx Configuration
Create `/etc/nginx/sites-available/gardenia`:

```nginx
server {
    listen 80;
    server_name gardenia.gardencity.university;

    # Frontend (React build)
    location / {
        root /var/www/Gardenia2025/frontend/dist;
        try_files $uri $uri/ /index.html;
        
        # Security headers
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header X-XSS-Protection "1; mode=block" always;
        add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # CORS headers
        add_header Access-Control-Allow-Origin "https://gardenia.gardencity.university" always;
        add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS" always;
        add_header Access-Control-Allow-Headers "Content-Type, Authorization, X-Requested-With" always;
    }

    # Static assets
    location /static {
        alias /var/www/Gardenia2025/frontend/dist;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

### 4.2 Enable Site
```bash
sudo ln -s /etc/nginx/sites-available/gardenia /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## 🔧 Step 5: SSL Certificate Setup

### 5.1 Install Certbot
```bash
sudo apt install certbot python3-certbot-nginx -y
```

### 5.2 Obtain SSL Certificate
```bash
sudo certbot --nginx -d gardenia.gardencity.university
```

### 5.3 Auto-renewal Setup
```bash
sudo crontab -e
# Add this line:
0 12 * * * /usr/bin/certbot renew --quiet
```

## 🔧 Step 6: Application Deployment

### 6.1 Start Backend with PM2
```bash
cd /var/www/Gardenia2025/backend
pm2 start server.js --name "gardenia-backend"
pm2 save
pm2 startup
```

### 6.2 Configure Firewall
```bash
sudo ufw allow 22
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable
```

## 🔧 Step 7: Database Setup

### 7.1 Seed Events (if needed)
```bash
cd /var/www/Gardenia2025/backend
npm run seed:events
```

### 7.2 Create Admin User
```bash
npm run create:admin
```

## 🔧 Step 8: Monitoring and Maintenance

### 8.1 PM2 Commands
```bash
# Check status
pm2 status

# View logs
pm2 logs gardenia-backend

# Restart application
pm2 restart gardenia-backend

# Monitor
pm2 monit
```

### 8.2 Nginx Commands
```bash
# Test configuration
sudo nginx -t

# Reload configuration
sudo systemctl reload nginx

# Check status
sudo systemctl status nginx
```

## 🔧 Step 9: AWS S3 Bucket Permissions

### 9.1 Required S3 Permissions
Your AWS IAM user needs these permissions:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "s3:GetObject",
                "s3:PutObject",
                "s3:DeleteObject",
                "s3:ListBucket"
            ],
            "Resource": [
                "arn:aws:s3:::gardenia2025-assets",
                "arn:aws:s3:::gardenia2025-assets/*"
            ]
        }
    ]
}
```

### 9.2 S3 Bucket Policy (Optional - for public access)
```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::gardenia2025-assets/tickets/*"
        }
    ]
}
```

## 🔧 Step 10: Deployment Script

Create `/var/www/Gardenia2025/deploy.sh`:

```bash
#!/bin/bash
echo "🚀 Deploying Gardenia 2025..."

# Pull latest changes
git pull origin master

# Install/update dependencies
cd backend && npm install
cd ../frontend && npm install

# Build frontend
npm run build

# Restart backend
pm2 restart gardenia-backend

echo "✅ Deployment complete!"
```

Make it executable:
```bash
chmod +x /var/www/Gardenia2025/deploy.sh
```

## 🔧 Step 11: Health Checks

### 11.1 Application Health
```bash
# Check if backend is running
curl http://localhost:5000/api/events

# Check if frontend is accessible
curl https://gardenia.gardencity.university
```

### 11.2 SSL Certificate Check
```bash
# Check SSL certificate
openssl s_client -connect gardenia.gardencity.university:443 -servername gardenia.gardencity.university
```

## 🔧 Step 12: Backup Strategy

### 12.1 Database Backup
```bash
# MongoDB backup (if using local MongoDB)
mongodump --db gardenia2025 --out /var/backups/mongodb/
```

### 12.2 Application Backup
```bash
# Backup application files
tar -czf /var/backups/gardenia-$(date +%Y%m%d).tar.gz /var/www/Gardenia2025/
```

## 🚨 Troubleshooting

### Common Issues:

1. **Port 5000 not accessible**: Check firewall and PM2 status
2. **SSL certificate issues**: Verify domain DNS and certbot logs
3. **Database connection**: Check MongoDB URI and network access
4. **S3 upload failures**: Verify AWS credentials and bucket permissions
5. **Frontend not loading**: Check Nginx configuration and build files

### Log Locations:
- PM2 logs: `pm2 logs gardenia-backend`
- Nginx logs: `/var/log/nginx/error.log`
- Application logs: Check PM2 output

## 📞 Support

If you encounter issues:
1. Check PM2 status: `pm2 status`
2. Check Nginx status: `sudo systemctl status nginx`
3. Check logs: `pm2 logs gardenia-backend`
4. Verify environment variables are set correctly
5. Test API endpoints manually

---

**🎉 Your Gardenia 2025 application should now be live at https://gardenia.gardencity.university!**


