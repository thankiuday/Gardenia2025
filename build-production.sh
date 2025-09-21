#!/bin/bash

# Production Build Script for Gardenia2025
echo "🚀 Building Gardenia2025 for Production..."

# Check if .env files exist
if [ ! -f "frontend/.env" ]; then
    echo "⚠️  Warning: frontend/.env not found. Copy from frontend/env.example and configure."
fi

if [ ! -f "backend/.env" ]; then
    echo "⚠️  Warning: backend/.env not found. Copy from backend/env.example and configure."
fi

# Install dependencies
echo "📦 Installing frontend dependencies..."
cd frontend
npm ci --only=production

echo "📦 Installing backend dependencies..."
cd ../backend
npm ci --only=production

# Build frontend
echo "🔨 Building frontend for production..."
cd ../frontend
npm run build

# Check build success
if [ $? -eq 0 ]; then
    echo "✅ Frontend build successful!"
else
    echo "❌ Frontend build failed!"
    exit 1
fi

echo "🎉 Production build completed successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Copy frontend/build/ to your web server"
echo "2. Set up backend with proper environment variables"
echo "3. Configure reverse proxy (nginx/apache) if needed"
echo "4. Set up SSL certificates"
echo "5. Configure database connection"
echo ""
echo "🔒 Security reminders:"
echo "- Ensure JWT_SECRET is set in production"
echo "- Use HTTPS in production"
echo "- Set up proper CORS origins"
echo "- Configure firewall rules"
echo "- Regular security updates"

