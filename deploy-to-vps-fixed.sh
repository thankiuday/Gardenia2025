#!/bin/bash

# Gardenia 2025 VPS Deployment Script - FIXED VERSION
# This script addresses the ERR_CONNECTION_RESET and ERR_NETWORK_CHANGED issues
# by properly configuring the frontend-backend architecture

set -e  # Exit on any error

echo "🚀 Starting Gardenia 2025 VPS Deployment (Fixed Version)..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_header() {
    echo -e "${BLUE}[STEP]${NC} $1"
}

# Check if running as root
if [[ $EUID -eq 0 ]]; then
   print_error "This script should not be run as root for security reasons"
   exit 1
fi

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Install Node.js if not present
if ! command_exists node; then
    print_status "Installing Node.js..."
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt-get install -y nodejs
fi

# Install PM2 globally if not present
if ! command_exists pm2; then
    print_status "Installing PM2..."
    sudo npm install -g pm2
fi

# Create application directory
APP_DIR="/var/www/Gardenia2025"
if [ ! -d "$APP_DIR" ]; then
    print_status "Creating application directory..."
    sudo mkdir -p "$APP_DIR"
    sudo chown -R $USER:$USER "$APP_DIR"
fi

cd "$APP_DIR"

# Clone or update repository
if [ ! -d ".git" ]; then
    print_status "Cloning repository..."
    git clone https://github.com/thankiuday/Gardenia2025.git .
else
    print_status "Updating repository..."
    git pull origin master
fi

# Install backend dependencies
print_header "Installing Backend Dependencies"
cd backend
npm install

# Install frontend dependencies and build
print_header "Installing Frontend Dependencies and Building"
cd ../frontend
npm install

print_status "Building frontend..."
npm run build

# Install serve package for frontend serving
print_status "Installing serve package..."
npm install --save-dev serve

# Copy ecosystem config to app directory
print_status "Copying PM2 ecosystem configuration..."
cp ../ecosystem.config.js ../ecosystem.config.js.backup 2>/dev/null || true

# Go back to app root
cd ..

# Check if .env exists
if [ ! -f "backend/.env" ]; then
    print_warning "Environment file not found!"
    print_status "Copying environment template..."
    cp backend/env.production.example backend/.env
    print_error "⚠️  Please edit backend/.env file with your actual configuration!"
    print_error "   Required: MONGODB_URI, JWT_SECRET, AWS credentials"
    read -p "Press Enter after configuring .env file..."
fi

# Create log directories
print_status "Creating log directories..."
sudo mkdir -p /var/log/pm2
sudo mkdir -p /var/log/nginx

# Stop existing processes
print_status "Stopping existing processes..."
pm2 stop all 2>/dev/null || true
pm2 delete all 2>/dev/null || true

# Start services with PM2
print_header "Starting Services with PM2"
print_status "Starting backend service..."
pm2 start ecosystem.config.js --name "gardenia-backend"

print_status "Starting frontend service..."
pm2 start ecosystem.config.js --name "gardenia-frontend"

# Save PM2 configuration
print_status "Saving PM2 configuration..."
pm2 save

# Setup PM2 startup script
print_status "Setting up PM2 startup..."
pm2 startup

# Install nginx if not present
if ! command_exists nginx; then
    print_status "Installing nginx..."
    sudo apt install -y nginx
fi

# Configure nginx
print_header "Configuring Nginx"

NGINX_CONFIG="/etc/nginx/sites-available/gardenia2025"
sudo cp nginx.conf "$NGINX_CONFIG" 2>/dev/null || sudo cp "$APP_DIR/nginx.conf" "$NGINX_CONFIG"

# Enable site
sudo ln -sf "$NGINX_CONFIG" /etc/nginx/sites-enabled/ 2>/dev/null || true

# Remove default site if exists
sudo rm -f /etc/nginx/sites-enabled/default 2>/dev/null || true

# Test nginx configuration
print_status "Testing nginx configuration..."
sudo nginx -t

# Reload nginx
print_status "Reloading nginx..."
sudo systemctl reload nginx

# Setup firewall
print_header "Configuring Firewall"
sudo ufw allow 22
sudo ufw allow 80
sudo ufw allow 443
sudo ufw --force enable

# Setup SSL certificate (if domain is configured)
if [ -n "$1" ]; then
    DOMAIN="$1"
    print_status "Setting up SSL certificate for $DOMAIN..."

    # Install certbot
    if ! command_exists certbot; then
        sudo apt install -y certbot python3-certbot-nginx
    fi

    # Obtain SSL certificate
    sudo certbot --nginx -d "$DOMAIN"

    # Setup auto-renewal
    sudo crontab -l | grep -v certbot | sudo crontab -
    (sudo crontab -l ; echo "0 12 * * * /usr/bin/certbot renew --quiet") | sudo crontab -
fi

# Setup monitoring script
print_header "Setting up Monitoring"
chmod +x monitor-services.sh
sudo cp monitor-services.sh /usr/local/bin/monitor-gardenia
sudo chmod +x /usr/local/bin/monitor-gardenia

# Setup monitoring cron job (every 5 minutes)
sudo crontab -l | grep -v "monitor-gardenia" | sudo crontab -
(sudo crontab -l ; echo "*/5 * * * * /usr/local/bin/monitor-gardenia") | sudo crontab -

print_header "Deployment Summary"
print_status "✅ Backend API: http://localhost:5000"
print_status "✅ Frontend: http://localhost:3001"
print_status "✅ Nginx Proxy: http://localhost (port 80)"
if [ -n "$1" ]; then
    print_status "✅ SSL Domain: https://$DOMAIN"
fi
print_status "✅ PM2 Monitoring: pm2 status"
print_status "✅ Logs: pm2 logs"
print_status "✅ Service Monitor: /usr/local/bin/monitor-gardenia"

echo ""
print_status "🎉 Deployment completed successfully!"
echo ""
print_status "Next steps:"
echo "1. Test the application: curl http://localhost/api/health"
echo "2. Monitor services: pm2 status"
echo "3. View logs: pm2 logs gardenia-backend"
echo "4. Check nginx: sudo systemctl status nginx"
echo "5. Monitor system: /usr/local/bin/monitor-gardenia"
echo ""
print_status "If you encounter any issues:"
echo "- Check PM2 logs: pm2 logs"
echo "- Check nginx logs: sudo tail -f /var/log/nginx/error.log"
echo "- Test services: curl http://localhost/api/health"
echo "- Restart services: pm2 restart all"
