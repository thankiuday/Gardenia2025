# 🚀 Gardenia2025 Deployment Guide

## ✅ Pre-Deployment Checklist

### 🔒 Security Configuration
- [ ] **JWT Secret**: Set a strong, random JWT_SECRET in production environment
- [ ] **Database Security**: Use MongoDB Atlas or secure database with authentication
- [ ] **HTTPS**: Configure SSL certificates for production domain
- [ ] **CORS**: Set proper CORS origins for production domains
- [ ] **Environment Variables**: All sensitive data moved to environment variables

### 🏗️ Build & Configuration
- [ ] **Frontend Build**: Production build completed successfully (`npm run build`)
- [ ] **Environment Files**: Copy and configure `.env` files from examples
- [ ] **Dependencies**: Production dependencies installed (`npm ci --only=production`)
- [ ] **Debug Logs**: All console.log statements removed from production code

### 📁 File Structure
```
production/
├── frontend/
│   ├── build/                 # Built React app
│   └── .env                   # Production environment variables
├── backend/
│   ├── node_modules/          # Production dependencies
│   ├── routes/               # API routes
│   ├── models/               # Database models
│   ├── utils/                # Utility functions
│   └── .env                  # Production environment variables
└── uploads/                  # PDF storage directory
```

## 🌐 Deployment Steps

### 1. Server Setup
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js (LTS version)
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 for process management
sudo npm install -g pm2

# Install Nginx (optional, for reverse proxy)
sudo apt install nginx -y
```

### 2. Database Setup
```bash
# Option A: MongoDB Atlas (Recommended)
# 1. Create account at https://cloud.mongodb.com
# 2. Create cluster and get connection string
# 3. Set MONGODB_URI in backend/.env

# Option B: Local MongoDB
sudo apt install mongodb -y
sudo systemctl start mongodb
sudo systemctl enable mongodb
```

### 3. Application Deployment
```bash
# Clone repository
git clone <your-repo-url>
cd Gardenia2025

# Install dependencies
cd backend && npm ci --only=production
cd ../frontend && npm ci --only=production

# Build frontend
npm run build

# Configure environment variables
cp backend/env.example backend/.env
cp frontend/env.example frontend/.env
# Edit .env files with production values
```

### 4. Environment Configuration

#### Backend (.env)
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/gardenia2025
JWT_SECRET=your-super-secure-jwt-secret-here
```

#### Frontend (.env)
```env
REACT_APP_API_URL=https://your-api-domain.com
GENERATE_SOURCEMAP=false
```

### 5. Process Management
```bash
# Start backend with PM2
cd backend
pm2 start server.js --name "gardenia-backend"

# Save PM2 configuration
pm2 save
pm2 startup

# Check status
pm2 status
pm2 logs gardenia-backend
```

### 6. Web Server Configuration (Nginx)
```nginx
# /etc/nginx/sites-available/gardenia2025
server {
    listen 80;
    server_name your-domain.com;

    # Frontend (React app)
    location / {
        root /path/to/Gardenia2025/frontend/build;
        index index.html;
        try_files $uri $uri/ /index.html;
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
    }
}
```

### 7. SSL Certificate (Let's Encrypt)
```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Get SSL certificate
sudo certbot --nginx -d your-domain.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

## 🔧 Production Optimizations

### Performance
- [ ] **Gzip Compression**: Enable in Nginx
- [ ] **Static File Caching**: Configure cache headers
- [ ] **CDN**: Consider using CloudFlare or AWS CloudFront
- [ ] **Database Indexing**: Add indexes for frequently queried fields

### Monitoring
- [ ] **PM2 Monitoring**: `pm2 monit`
- [ ] **Log Rotation**: Configure logrotate for application logs
- [ ] **Health Checks**: Set up monitoring endpoints
- [ ] **Backup Strategy**: Regular database backups

### Security
- [ ] **Firewall**: Configure UFW or iptables
- [ ] **Rate Limiting**: Implement API rate limiting
- [ ] **Input Validation**: Ensure all inputs are validated
- [ ] **Security Headers**: Add security headers in Nginx

## 🚨 Troubleshooting

### Common Issues
1. **Build Fails**: Check Node.js version and dependencies
2. **Database Connection**: Verify MongoDB URI and network access
3. **CORS Errors**: Check CORS configuration in backend
4. **File Uploads**: Ensure uploads directory has proper permissions

### Logs
```bash
# Backend logs
pm2 logs gardenia-backend

# Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# System logs
sudo journalctl -u nginx -f
```

## 📊 Post-Deployment Verification

- [ ] **Frontend**: Website loads correctly
- [ ] **API**: All endpoints respond correctly
- [ ] **Database**: Data persists correctly
- [ ] **File Uploads**: PDF generation works
- [ ] **Authentication**: Admin login works
- [ ] **QR Scanner**: QR code scanning works
- [ ] **Email**: Contact form submissions work
- [ ] **Performance**: Page load times acceptable

## 🔄 Maintenance

### Regular Tasks
- [ ] **Security Updates**: Keep system and dependencies updated
- [ ] **Backup Verification**: Test backup restoration
- [ ] **Performance Monitoring**: Monitor response times and errors
- [ ] **Log Cleanup**: Rotate and clean old logs

### Updates
```bash
# Pull latest changes
git pull origin main

# Update dependencies
cd backend && npm update
cd ../frontend && npm update

# Rebuild and restart
cd frontend && npm run build
pm2 restart gardenia-backend
```

---

## 📞 Support

For deployment issues or questions, contact:
- **Developer**: NerdsAndGeeks
- **Email**: udaythanki2@gmail.com

---

**🎉 Congratulations! Your Gardenia2025 application is now production-ready!**

