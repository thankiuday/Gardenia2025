#!/bin/bash
# Fix for 429 Rate Limit Errors
# This script deploys the rate limit fix to production

set -e

echo "================================================"
echo "Deploying Rate Limit Fix"
echo "================================================"
echo ""

# Check if running as root or with sudo (needed for PM2)
if [ -f /usr/bin/pm2 ] || [ -f /usr/local/bin/pm2 ]; then
    PM2_EXISTS=true
else
    PM2_EXISTS=false
fi

echo "Changes being deployed:"
echo "  1. Backend: Increased rate limit from 100 to 500 requests/15min"
echo "  2. Backend: Added better 429 error handling"
echo "  3. Frontend: Fixed Home.jsx fetchEvents bug"
echo "  4. Frontend: Added 429 error messages"
echo ""

# Update backend
echo "1. Updating backend..."
cd backend
npm install --production 2>&1 | grep -v "^npm WARN" || true
echo "   ✓ Backend dependencies updated"
cd ..

# Restart backend service
echo ""
echo "2. Restarting backend service..."
if [ "$PM2_EXISTS" = true ]; then
    pm2 restart ecosystem.config.js --env production
    if [ $? -eq 0 ]; then
        echo "   ✓ Backend restarted successfully"
    else
        echo "   ! Warning: PM2 restart may have failed"
        echo "   You may need to restart manually: pm2 restart all"
    fi
else
    echo "   ! PM2 not found. Please restart backend manually:"
    echo "   cd backend && npm start"
fi

# Build and deploy frontend (if deploying to VPS with nginx)
if [ -f "frontend/package.json" ]; then
    echo ""
    echo "3. Building frontend..."
    cd frontend
    npm install 2>&1 | grep -v "^npm WARN" || true
    npm run build
    if [ $? -eq 0 ]; then
        echo "   ✓ Frontend built successfully"
    else
        echo "   ✗ Error: Frontend build failed"
        exit 1
    fi
    cd ..
    
    # Copy frontend dist to nginx directory (if exists)
    if [ -d "/var/www/gardenia2025/frontend/dist" ]; then
        echo ""
        echo "4. Deploying frontend to nginx..."
        if [ -w "/var/www/gardenia2025/frontend/" ]; then
            cp -r frontend/dist/* /var/www/gardenia2025/frontend/dist/
            echo "   ✓ Frontend deployed"
        else
            echo "   ! Need sudo to deploy frontend"
            echo "   Run: sudo cp -r frontend/dist/* /var/www/gardenia2025/frontend/dist/"
        fi
    fi
else
    echo ""
    echo "3. Skipping frontend build (not needed for backend-only deployment)"
fi

# Check service status
echo ""
echo "5. Checking service status..."
if [ "$PM2_EXISTS" = true ]; then
    pm2 list
    echo ""
    echo "Backend logs (last 20 lines):"
    pm2 logs backend --lines 20 --nostream
fi

echo ""
echo "================================================"
echo "✓ Rate Limit Fix Deployed!"
echo "================================================"
echo ""
echo "What was fixed:"
echo "  • Increased rate limit: 100 → 500 requests per 15 minutes"
echo "  • Added custom 429 error messages for users"
echo "  • Fixed Home.jsx retry button bug"
echo "  • Better error handling across all pages"
echo ""
echo "Testing:"
echo "  1. Open https://gardenia.gardencity.university"
echo "  2. Navigate to Events page"
echo "  3. Refresh multiple times - should work without 429 errors"
echo ""
echo "Monitoring:"
echo "  - Backend logs: pm2 logs backend"
echo "  - Rate limit hits: pm2 logs backend | grep '429'"
echo "  - Nginx logs: sudo tail -f /var/log/nginx/gardenia2025_access.log"
echo ""


