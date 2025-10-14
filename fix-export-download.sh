#!/bin/bash
# Fix for Excel Export Download Error (ERR_CONTENT_LENGTH_MISMATCH)
# This script updates nginx configuration and restarts services

set -e

echo "================================================"
echo "Fixing Excel Export Download Issue"
echo "================================================"
echo ""

# Check if running as root or with sudo
if [ "$EUID" -ne 0 ]; then 
    echo "Error: This script must be run as root or with sudo"
    echo "Usage: sudo bash fix-export-download.sh"
    exit 1
fi

# Backup current nginx configuration
echo "1. Backing up current nginx configuration..."
BACKUP_FILE="/etc/nginx/sites-available/gardenia2025.backup.$(date +%Y%m%d_%H%M%S)"
if [ -f /etc/nginx/sites-available/gardenia2025 ]; then
    cp /etc/nginx/sites-available/gardenia2025 "$BACKUP_FILE"
    echo "   ✓ Backup created at: $BACKUP_FILE"
else
    echo "   ! Warning: /etc/nginx/sites-available/gardenia2025 not found"
    echo "   ! Will create new configuration"
fi

# Copy updated nginx configuration
echo ""
echo "2. Updating nginx configuration..."
cp nginx.conf /etc/nginx/sites-available/gardenia2025
echo "   ✓ Configuration updated"

# Test nginx configuration
echo ""
echo "3. Testing nginx configuration..."
if nginx -t; then
    echo "   ✓ Nginx configuration is valid"
else
    echo "   ✗ Error: Nginx configuration test failed"
    echo "   Restoring backup..."
    if [ -f "$BACKUP_FILE" ]; then
        cp "$BACKUP_FILE" /etc/nginx/sites-available/gardenia2025
        echo "   ✓ Backup restored"
    fi
    exit 1
fi

# Reload nginx
echo ""
echo "4. Reloading nginx..."
systemctl reload nginx
if [ $? -eq 0 ]; then
    echo "   ✓ Nginx reloaded successfully"
else
    echo "   ✗ Error: Failed to reload nginx"
    exit 1
fi

# Update backend code
echo ""
echo "5. Updating backend code..."
cd backend
npm install --production
echo "   ✓ Dependencies checked"

# Restart backend service using PM2
echo ""
echo "6. Restarting backend service..."
cd ..
pm2 restart ecosystem.config.js --env production
if [ $? -eq 0 ]; then
    echo "   ✓ Backend restarted successfully"
else
    echo "   ! Warning: PM2 restart may have failed"
    echo "   You may need to restart manually: pm2 restart all"
fi

# Check service status
echo ""
echo "7. Checking service status..."
echo ""
echo "Nginx status:"
systemctl status nginx --no-pager | head -n 5
echo ""
echo "PM2 status:"
pm2 list

echo ""
echo "================================================"
echo "✓ Fix Applied Successfully!"
echo "================================================"
echo ""
echo "Changes made:"
echo "  1. Increased nginx proxy buffer sizes:"
echo "     - proxy_buffer_size: 128k"
echo "     - proxy_buffers: 8 x 256k"
echo "     - proxy_busy_buffers_size: 512k"
echo "     - client_max_body_size: 50m"
echo ""
echo "  2. Improved backend response handling for large files"
echo ""
echo "What this fixes:"
echo "  - ERR_CONTENT_LENGTH_MISMATCH errors when downloading exports"
echo "  - Large Excel file downloads being truncated"
echo "  - Network errors during registration data export"
echo ""
echo "You can now try downloading the registration data again."
echo ""
echo "If you still experience issues, check:"
echo "  - Server logs: pm2 logs"
echo "  - Nginx logs: tail -f /var/log/nginx/gardenia2025_error.log"
echo ""

