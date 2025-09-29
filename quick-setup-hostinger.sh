#!/bin/bash

# Quick Setup Script for Gardenia 2025 - Hostinger VPS
# This script automates the entire deployment process

echo "🚀 Gardenia 2025 - Hostinger VPS Quick Setup"
echo "=============================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    print_error "Please run as root or with sudo"
    exit 1
fi

# Set domain and get email
DOMAIN_NAME="gardenia.gardencity.university"
read -p "Enter your email for SSL certificate: " EMAIL

if [ -z "$EMAIL" ]; then
    print_error "Email is required for SSL certificate"
    exit 1
fi

print_status "Starting setup for domain: $DOMAIN_NAME"

# Update system
print_status "Updating system packages..."
apt update && apt upgrade -y

# Install Node.js 18.x
print_status "Installing Node.js 18.x..."
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt-get install -y nodejs

# Install required packages
print_status "Installing required packages..."
apt install -y nginx certbot python3-certbot-nginx git ufw

# Install PM2
print_status "Installing PM2..."
npm install -g pm2

# Create project directory
print_status "Creating project directory..."
mkdir -p /var/www/gardenia2025
mkdir -p /var/log/pm2

# Set permissions
chown -R www-data:www-data /var/www/gardenia2025
chmod -R 755 /var/www/gardenia2025

# Update nginx configuration with domain
print_status "Configuring Nginx..."
sed "s/your-domain.com/$DOMAIN_NAME/g" nginx.conf > /etc/nginx/sites-available/gardenia2025

# Enable site
ln -sf /etc/nginx/sites-available/gardenia2025 /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# Test nginx configuration
nginx -t
if [ $? -eq 0 ]; then
    print_status "Nginx configuration is valid"
    systemctl restart nginx
else
    print_error "Nginx configuration error"
    exit 1
fi

# Setup SSL
print_status "Setting up SSL certificate..."
certbot --nginx -d $DOMAIN_NAME -d www.$DOMAIN_NAME --non-interactive --agree-tos --email $EMAIL

# Setup auto-renewal
print_status "Setting up SSL auto-renewal..."
(crontab -l 2>/dev/null; echo "0 12 * * * /usr/bin/certbot renew --quiet") | crontab -

# Configure firewall
print_status "Configuring firewall..."
ufw allow 22
ufw allow 80
ufw allow 443
ufw --force enable

# Setup log rotation
print_status "Setting up log rotation..."
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7

# Setup monitoring
print_status "Setting up monitoring..."
pm2 install pm2-server-monit

print_status "Basic VPS setup completed!"
print_warning "Next steps:"
echo "1. Upload your project files to /var/www/gardenia2025/"
echo "2. Configure environment variables in /var/www/gardenia2025/backend/.env"
echo "3. Install dependencies: cd /var/www/gardenia2025/backend && npm install"
echo "4. Build frontend: cd /var/www/gardenia2025/frontend && npm install && npm run build"
echo "5. Start application: pm2 start ecosystem.config.js"
echo ""
print_status "Your domain will be available at: https://gardenia.gardencity.university"
print_status "SSL certificate is configured and auto-renewal is enabled"
