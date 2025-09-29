#!/bin/bash

# SSL Setup Script for Gardenia 2025 - Hostinger VPS
# Run this script as root or with sudo

echo "🔒 Setting up SSL for Gardenia 2025..."

# Update system
apt update && apt upgrade -y

# Install Certbot
apt install -y certbot python3-certbot-nginx

# Install Nginx if not already installed
apt install -y nginx

# Create necessary directories
mkdir -p /var/log/pm2
mkdir -p /var/www/gardenia2025

# Set proper permissions
chown -R www-data:www-data /var/www/gardenia2025
chmod -R 755 /var/www/gardenia2025

# Copy nginx configuration
cp nginx.conf /etc/nginx/sites-available/gardenia2025

# Enable the site
ln -sf /etc/nginx/sites-available/gardenia2025 /etc/nginx/sites-enabled/

# Remove default nginx site
rm -f /etc/nginx/sites-enabled/default

# Test nginx configuration
nginx -t

if [ $? -eq 0 ]; then
    echo "✅ Nginx configuration is valid"
    systemctl reload nginx
else
    echo "❌ Nginx configuration error"
    exit 1
fi

# Get SSL certificate
echo "🔐 Obtaining SSL certificate..."
certbot --nginx -d your-domain.com -d www.your-domain.com --non-interactive --agree-tos --email your-email@example.com

# Setup auto-renewal
echo "⏰ Setting up SSL auto-renewal..."
(crontab -l 2>/dev/null; echo "0 12 * * * /usr/bin/certbot renew --quiet") | crontab -

# Restart services
systemctl restart nginx
systemctl enable nginx

echo "✅ SSL setup completed!"
echo "🔗 Your site will be available at: https://your-domain.com"
echo "📝 Remember to update the domain name in nginx.conf and run this script again"
