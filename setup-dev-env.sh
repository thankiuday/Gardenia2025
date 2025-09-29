#!/bin/bash

# Development Environment Setup Script
echo "🔧 Setting up development environment..."

# Copy development environment file
cp backend/env.development backend/.env

echo "✅ Development environment configured!"
echo "📝 Environment variables set:"
echo "   - NODE_ENV=development"
echo "   - CORS_ALLOW_ALL=true"
echo "   - Frontend URL: http://localhost:5173"
echo ""
echo "🚀 You can now start the backend with:"
echo "   cd backend && npm run dev"
echo ""
echo "🌐 Frontend should be accessible at: http://localhost:5173"
