@echo off
echo 🚀 Building Gardenia2025 for Production...

REM Check if .env files exist
if not exist "frontend\.env" (
    echo ⚠️  Warning: frontend\.env not found. Copy from frontend\env.example and configure.
)

if not exist "backend\.env" (
    echo ⚠️  Warning: backend\.env not found. Copy from backend\env.example and configure.
)

REM Install dependencies
echo 📦 Installing frontend dependencies...
cd frontend
call npm ci --only=production

echo 📦 Installing backend dependencies...
cd ..\backend
call npm ci --only=production

REM Build frontend
echo 🔨 Building frontend for production...
cd ..\frontend
call npm run build

REM Check build success
if %errorlevel% equ 0 (
    echo ✅ Frontend build successful!
) else (
    echo ❌ Frontend build failed!
    exit /b 1
)

echo 🎉 Production build completed successfully!
echo.
echo 📋 Next steps:
echo 1. Copy frontend\build\ to your web server
echo 2. Set up backend with proper environment variables
echo 3. Configure reverse proxy (nginx/apache) if needed
echo 4. Set up SSL certificates
echo 5. Configure database connection
echo.
echo 🔒 Security reminders:
echo - Ensure JWT_SECRET is set in production
echo - Use HTTPS in production
echo - Set up proper CORS origins
echo - Configure firewall rules
echo - Regular security updates

pause

