# VPS Ubuntu Update Guide - Pull Latest Changes

This guide will help you update your VPS Ubuntu server with the latest Gardenia 2025 changes.

## 🚀 Quick Update Process

### Step 1: Connect to Your VPS
```bash
ssh username@your-vps-ip
```

### Step 2: Navigate to Project Directory
```bash
cd Gardenia2025
```

### Step 3: Check Current Status
```bash
# Check current git status
git status

# Check current branch
git branch

# Check last commit
git log --oneline -5
```

### Step 4: Pull Latest Changes
```bash
# Pull the latest changes from GitHub
git pull origin master
```

### Step 5: Update Backend Dependencies
```bash
cd backend
npm install
```

### Step 6: Rebuild Frontend
```bash
cd ../frontend
npm install
npm run build

# Copy build files to backend
cp -r dist/* ../backend/public/
```

### Step 7: Restart Application
```bash
cd ../backend

# Restart PM2 process
pm2 restart gardenia-backend

# Check status
pm2 status
```

### Step 8: Verify Everything Works
```bash
# Check logs for any errors
pm2 logs gardenia-backend --lines 50

# Test PDF generation
node test-ubuntu-pdf.js
```

## 🔧 Environment Variables Check

### Current .env File Status
Your existing `.env` file should already have all the required variables. **No changes needed** unless you want to update specific values.

### Required Environment Variables (Already in your .env):
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

# AWS S3 Configuration
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=us-east-1
AWS_S3_BUCKET_NAME=your_bucket_name

# PDF Generation (Important for Ubuntu)
PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable
```

### ✅ No .env Changes Required
The latest changes don't require any new environment variables. Your existing `.env` file should work perfectly.

## 🧪 Testing the Update

### 1. Test PDF Generation
```bash
cd backend
node test-ubuntu-pdf.js
```

**Expected Output:**
```
✅ PDF generated successfully!
```

### 2. Test Application Access
- Open your browser and go to `http://your-vps-ip:5000`
- Check if the Rap Arena event is displayed
- Test registration process
- Verify PDF ticket generation

### 3. Check PM2 Status
```bash
pm2 status
pm2 logs gardenia-backend
```

## 🚨 Troubleshooting

### If PDF Generation Fails
```bash
# Check if Chrome is installed
which google-chrome-stable
google-chrome-stable --version

# Reinstall Chrome if needed
sudo apt-get update
sudo apt-get install -y google-chrome-stable

# Check environment variable
echo $PUPPETEER_EXECUTABLE_PATH
```

### If Application Won't Start
```bash
# Check logs
pm2 logs gardenia-backend

# Check if port is in use
netstat -tulpn | grep :5000

# Restart PM2
pm2 restart all
```

### If Frontend Build Fails
```bash
# Clear node_modules and reinstall
cd frontend
rm -rf node_modules package-lock.json
npm install
npm run build
```

## 📊 Monitor After Update

### Check Application Status
```bash
# PM2 status
pm2 status

# Real-time logs
pm2 logs gardenia-backend --lines 100

# Memory usage
htop
```

### Test Key Features
1. **Homepage**: Check if Rap Arena event is displayed
2. **Events Page**: Verify Rap Arena appears as first event
3. **Event Details**: Test Rap Arena event details page
4. **Registration**: Test registration process
5. **PDF Generation**: Verify ticket PDF generation

## 🔄 Rollback (If Needed)

If something goes wrong, you can rollback:

```bash
# Check git log for previous commit
git log --oneline -5

# Rollback to previous commit (replace COMMIT_HASH with actual hash)
git reset --hard COMMIT_HASH

# Restart application
pm2 restart gardenia-backend
```

## ✅ Update Checklist

- [ ] Connected to VPS
- [ ] Navigated to project directory
- [ ] Pulled latest changes (`git pull origin master`)
- [ ] Updated backend dependencies (`npm install`)
- [ ] Rebuilt frontend (`npm run build`)
- [ ] Copied frontend build to backend
- [ ] Restarted PM2 process (`pm2 restart gardenia-backend`)
- [ ] Verified application is running (`pm2 status`)
- [ ] Tested PDF generation (`node test-ubuntu-pdf.js`)
- [ ] Checked application in browser
- [ ] Verified Rap Arena event is displayed
- [ ] Tested registration process

## 🎯 Expected New Features After Update

1. **Rap Arena Event Integration**:
   - Special event card with poster
   - Prizes section (₹50,000 total)
   - Special guest information (GUBBI)
   - Responsive design

2. **Improved PDF Generation**:
   - Better Ubuntu VPS compatibility
   - Cleaner code without debug logs
   - Optimized Chrome/Chromium usage

3. **Enhanced UI/UX**:
   - Equal height event cards
   - Better mobile responsiveness
   - Skeleton loading states
   - Improved poster display

---

**Note**: This update maintains all existing functionality while adding the new Rap Arena event and improvements. No database changes or environment variable updates are required.
