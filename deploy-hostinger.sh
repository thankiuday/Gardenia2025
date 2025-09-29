#!/bin/bash

# Deployment Script for Gardenia 2025 - Hostinger VPS
# Run this script on your VPS after uploading the project

echo "🚀 Deploying Gardenia 2025 to Hostinger VPS..."

# Set variables
PROJECT_DIR="/var/www/gardenia2025"
BACKUP_DIR="/var/backups/gardenia2025"
DATE=$(date +%Y%m%d_%H%M%S)

# Create backup directory
mkdir -p $BACKUP_DIR

# Backup existing deployment if it exists
if [ -d "$PROJECT_DIR" ]; then
    echo "📦 Creating backup of existing deployment..."
    cp -r $PROJECT_DIR $BACKUP_DIR/backup_$DATE
fi

# Create project directory
mkdir -p $PROJECT_DIR

# Install Node.js 18.x
echo "📦 Installing Node.js 18.x..."
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt-get install -y nodejs

# Install PM2 globally
echo "📦 Installing PM2..."
npm install -g pm2

# Install project dependencies
echo "📦 Installing project dependencies..."
cd $PROJECT_DIR

# Install backend dependencies
cd backend
npm install --production

# Install frontend dependencies
cd ../frontend
npm install --production

# Build frontend
echo "🏗️ Building frontend..."
npm run build

# Copy configuration files
echo "📋 Copying configuration files..."
cp /path/to/your/ecosystem.config.js $PROJECT_DIR/
cp /path/to/your/nginx.conf /etc/nginx/sites-available/gardenia2025

# Set proper permissions
chown -R www-data:www-data $PROJECT_DIR
chmod -R 755 $PROJECT_DIR

# Create environment file
echo "⚙️ Creating environment file..."
cat > $PROJECT_DIR/backend/.env << EOF
NODE_ENV=production
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=us-east-1
AWS_S3_BUCKET=gardenia2025-assets
FRONTEND_URL=https://your-domain.com
CORS_ALLOW_ALL=false
EOF

# Start application with PM2
echo "🚀 Starting application with PM2..."
cd $PROJECT_DIR
pm2 start ecosystem.config.js
pm2 save
pm2 startup

# Setup log rotation
echo "📝 Setting up log rotation..."
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7

# Restart Nginx
echo "🔄 Restarting Nginx..."
systemctl restart nginx
systemctl enable nginx

# Setup firewall
echo "🔥 Configuring firewall..."
ufw allow 22
ufw allow 80
ufw allow 443
ufw --force enable

# Setup monitoring
echo "📊 Setting up monitoring..."
pm2 install pm2-server-monit

echo "✅ Deployment completed!"
echo "🌐 Your application is running at: https://your-domain.com"
echo "📊 Monitor with: pm2 monit"
echo "📝 View logs with: pm2 logs"
