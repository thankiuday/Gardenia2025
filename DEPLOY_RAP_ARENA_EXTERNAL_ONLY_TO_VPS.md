# Deploy Rap Arena External-Only Reopening to VPS

## 📋 Overview
This guide covers deploying the Rap Arena registration reopening (external students only) to your VPS.

## 🔍 Changes Being Deployed

1. **Database**: Rap Arena registration reopened
2. **Frontend**: Updated WelcomeModal, Home page, and Registration page
3. **Restriction**: Only external students can register (GCU students blocked)

---

## 🚀 Deployment Steps

### Step 1: Commit and Push Changes from Local Machine

First, commit your local changes and push to GitHub:

```bash
# Check which files were modified
git status

# Add the modified files
git add frontend/src/components/WelcomeModal.jsx
git add frontend/src/pages/Home.jsx
git add frontend/src/pages/Registration.jsx
git add RAP_ARENA_EXTERNAL_ONLY_REOPENING.md
git add DEPLOY_RAP_ARENA_EXTERNAL_ONLY_TO_VPS.md

# Commit the changes
git commit -m "Reopen Rap Arena registration for external students only

- Added warnings in WelcomeModal, Home, and Registration pages
- Block GCU students from registering for Rap Arena
- Updated UI to show external-only registration status
- Backend validation already in place (lines 59-65 in registrations.js)"

# Push to GitHub
git push origin master
```

---

### Step 2: Connect to Your VPS

```bash
ssh your-username@your-vps-ip-address
```

**Example:**
```bash
ssh root@203.0.113.45
# OR
ssh ubuntu@gardenia.gardencity.university
```

---

### Step 3: Navigate to Project Directory

```bash
cd /var/www/Gardenia2025
# OR wherever your project is located
cd Gardenia2025
# OR
cd ~/Gardenia2025
```

---

### Step 4: Check Current Status

```bash
# Check current branch and status
git branch
git status

# View last few commits
git log --oneline -5

# Check PM2 status
pm2 status
```

---

### Step 5: Pull Latest Changes

```bash
# Pull the latest changes from GitHub
git pull origin master
```

**Expected Output:**
```
Updating abc1234..def5678
Fast-forward
 frontend/src/components/WelcomeModal.jsx     | 15 +++++++++++----
 frontend/src/pages/Home.jsx                  | 18 ++++++++++++++++--
 frontend/src/pages/Registration.jsx          | 25 ++++++++++++++++++++++--
 RAP_ARENA_EXTERNAL_ONLY_REOPENING.md        | 100 ++++++++++++++++++++++++
 DEPLOY_RAP_ARENA_EXTERNAL_ONLY_TO_VPS.md    | 200 +++++++++++++++++++++++
 5 files changed, 350 insertions(+), 8 deletions(-)
```

---

### Step 6: Update Backend (If needed)

```bash
# Navigate to backend
cd backend

# Install/update dependencies (in case anything changed)
npm install

# Go back to project root
cd ..
```

---

### Step 7: Rebuild and Deploy Frontend

```bash
# Navigate to frontend directory
cd frontend

# Install/update dependencies
npm install

# Build the frontend for production
npm run build
```

**This will take 1-2 minutes. Expected output:**
```
> gardenia-2025-frontend@0.0.0 build
> vite build

vite v5.x.x building for production...
✓ 150 modules transformed.
dist/index.html                  x KB
dist/assets/index-abc123.css     x KB
dist/assets/index-def456.js      x KB
✓ built in 45.67s
```

---

### Step 8: Copy Frontend Build to Backend

```bash
# Copy the built files to backend public directory
cp -r dist/* ../backend/public/

# Verify the copy was successful
ls -la ../backend/public/

# Go back to project root
cd ..
```

---

### Step 9: Run Database Script to Reopen Rap Arena

```bash
# Navigate to backend
cd backend

# Run the script to reopen Rap Arena registration
node scripts/reopenRapArenaForExternal.js
```

**Expected Output:**
```
Connected to MongoDB

✅ Successfully reopened registration for Rap Arena event

⚠️  IMPORTANT: Registration is now open ONLY for EXTERNAL students
   GCU students will be blocked from registering

Event Details:
- Title: Gardenia 2K25: The Rap Arena
- ID: new ObjectId('68dd4dce04b7580301ca3537')
- Custom ID: rap-arena-2025
- Registration Open: true
- Event Date: 16th October 2025

📝 Note: The registration route has been updated to allow
   ONLY external students to register for Rap Arena.

Disconnected from MongoDB
```

---

### Step 10: Restart the Application

```bash
# If using PM2 (recommended)
pm2 restart gardenia-backend

# Alternative: Restart by name from ecosystem config
pm2 restart gardenia2025-backend

# Check the status
pm2 status
```

**Expected Output:**
```
┌────┬────────────────────┬─────────────┬─────────┬─────────┬──────────┬────────┬──────┬───────────┬──────────┬──────────┬──────────┬──────────┐
│ id │ name               │ namespace   │ version │ mode    │ pid      │ uptime │ ↺    │ status    │ cpu      │ mem      │ user     │ watching │
├────┼────────────────────┼─────────────┼─────────┼─────────┼──────────┼────────┼──────┼───────────┼──────────┼──────────┼──────────┼──────────┤
│ 0  │ gardenia-backend   │ default     │ 1.0.0   │ fork    │ 12345    │ 2s     │ 15   │ online    │ 0%       │ 50.2mb   │ root     │ disabled │
└────┴────────────────────┴─────────────┴─────────┴─────────┴──────────┴────────┴──────┴───────────┴──────────┴──────────┴──────────┴──────────┘
```

---

### Step 11: Check Application Logs

```bash
# View real-time logs
pm2 logs gardenia-backend --lines 50

# Press Ctrl+C to exit logs view
```

**Look for:**
- ✅ Server started on port XXXX
- ✅ Connected to MongoDB
- ✅ No error messages
- ✅ PDF generation working

---

### Step 12: Verify Deployment

#### A. Check Server Status
```bash
# Check if server is responding
curl http://localhost:5000/api/events

# Or check specific Rap Arena event
curl http://localhost:5000/api/events/rap-arena-2025
```

#### B. Test PDF Generation (Important!)
```bash
cd backend
node test-ubuntu-pdf.js
```

**Expected:**
```
✅ PDF generated successfully!
```

---

## 🌐 Step 13: Test in Browser

### Test External Student Registration
1. Open browser: `http://your-vps-ip:5000`
2. You should see the Rap Arena special event section
3. Look for the warning: **"⚠️ Registration Now Open for EXTERNAL STUDENTS ONLY"**
4. Click "Register Now"
5. Select "No, I'm an external participant"
6. Should proceed to registration form ✅

### Test GCU Student Blocking
1. Go to: `http://your-vps-ip:5000/register/68dd4dce04b7580301ca3537`
2. Select "Yes, I'm a GCU student"
3. Should see alert: **"Registration Restricted"** ✅
4. Should NOT proceed to registration form ✅

---

## 🎯 Quick One-Line Deployment (Alternative)

If you've already pushed to GitHub and just want to update quickly:

```bash
# Run from project root on VPS
cd /var/www/Gardenia2025 && \
git pull origin master && \
cd frontend && npm install && npm run build && cp -r dist/* ../backend/public/ && \
cd ../backend && node scripts/reopenRapArenaForExternal.js && \
pm2 restart gardenia-backend && pm2 status
```

---

## 🔧 Using the Update Script (Easiest Method)

```bash
# Make the script executable (first time only)
chmod +x update-vps.sh

# Run the update script
./update-vps.sh
```

**Then manually run the database script:**
```bash
cd backend
node scripts/reopenRapArenaForExternal.js
cd ..
```

---

## 📊 Post-Deployment Checklist

- [ ] SSH connected to VPS
- [ ] Changes pulled from GitHub (`git pull origin master`)
- [ ] Frontend rebuilt (`npm run build`)
- [ ] Frontend copied to backend (`cp -r dist/* ../backend/public/`)
- [ ] Database script executed (`node scripts/reopenRapArenaForExternal.js`)
- [ ] Application restarted (`pm2 restart gardenia-backend`)
- [ ] PM2 status shows "online" (`pm2 status`)
- [ ] No errors in logs (`pm2 logs`)
- [ ] PDF generation test passed
- [ ] Browser test: Home page shows Rap Arena section
- [ ] Browser test: Warning "External Students Only" visible
- [ ] Browser test: External students can register ✅
- [ ] Browser test: GCU students are blocked ✅

---

## 🚨 Troubleshooting

### Issue: Git Pull Shows Conflicts

```bash
# Stash your local changes
git stash

# Pull again
git pull origin master

# Reapply your changes (if needed)
git stash pop
```

### Issue: Frontend Build Fails

```bash
cd frontend

# Clear cache and rebuild
rm -rf node_modules package-lock.json dist
npm install
npm run build
```

### Issue: PM2 Not Running

```bash
# Start PM2 with ecosystem config
pm2 start ecosystem.config.js

# Or start manually
cd backend
pm2 start server.js --name gardenia-backend
```

### Issue: Port Already in Use

```bash
# Find process using port 5000
lsof -i :5000

# Or
netstat -tulpn | grep :5000

# Kill the process (replace PID with actual process ID)
kill -9 PID

# Restart PM2
pm2 restart gardenia-backend
```

### Issue: Database Script Fails

```bash
# Check MongoDB connection
cd backend

# Test connection by checking .env
cat .env | grep MONGODB

# Run the script with more output
node scripts/reopenRapArenaForExternal.js
```

### Issue: PDF Generation Not Working

```bash
# Check Chrome installation
which google-chrome-stable
google-chrome-stable --version

# Check environment variable
echo $PUPPETEER_EXECUTABLE_PATH

# Test PDF generation
cd backend
node test-ubuntu-pdf.js
```

---

## 🔄 Rollback (If Something Goes Wrong)

```bash
# View recent commits
git log --oneline -10

# Rollback to previous commit (replace COMMIT_HASH)
git reset --hard COMMIT_HASH

# Rebuild frontend
cd frontend
npm run build
cp -r dist/* ../backend/public/

# Restart
cd ../backend
pm2 restart gardenia-backend
```

---

## 📱 Testing Guide

### 1. Homepage Test
- Visit: `http://your-vps-ip:5000`
- Check: Rap Arena special event section visible
- Check: Warning banner shows "External Students Only"
- Check: Registration button says "Register Now (External Students)"

### 2. WelcomeModal Test
- Visit homepage for first time (or clear cookies)
- Check: Modal pops up
- Check: Rap Arena section visible
- Check: Warning "Registration Now Open for EXTERNAL STUDENTS ONLY"
- Check: Button text clarifies external students only

### 3. Registration Page Test - External Students
- Visit: `http://your-vps-ip:5000/register/68dd4dce04b7580301ca3537`
- Check: Modal shows warning about external students only
- Click: "No, I'm an external participant"
- Check: Form loads successfully
- Check: Can fill form with external student fields
- Test: Complete a registration

### 4. Registration Page Test - GCU Students (Should Fail)
- Visit: `http://your-vps-ip:5000/register/68dd4dce04b7580301ca3537`
- Click: "Yes, I'm a GCU student"
- Check: Alert appears "Registration Restricted"
- Check: Modal does NOT close
- Check: Form does NOT load

### 5. Backend API Test
```bash
# Test registration endpoint
curl -X POST http://localhost:5000/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "eventId": "rap-arena-2025",
    "isGardenCityStudent": true,
    "leader": {"name":"Test","email":"test@example.com","phone":"1234567890"}
  }'

# Expected response: 403 Forbidden with message about external students only
```

---

## 📞 Support

If you encounter issues:

1. **Check Logs:** `pm2 logs gardenia-backend`
2. **Check Status:** `pm2 status`
3. **Check MongoDB:** Ensure MongoDB is connected
4. **Check Chrome:** Verify Chrome is installed for PDF generation
5. **Review Error Messages:** Look for specific error codes

---

## ✅ Success Indicators

After deployment, you should see:

1. ✅ PM2 shows process as "online"
2. ✅ No errors in `pm2 logs`
3. ✅ Homepage loads correctly
4. ✅ Rap Arena section visible with warnings
5. ✅ External students can register
6. ✅ GCU students are blocked from registering
7. ✅ PDF tickets generate successfully
8. ✅ Database shows `registrationOpen: true` for Rap Arena

---

## 🎉 Deployment Complete!

Your VPS now has:
- ✅ Rap Arena registration reopened
- ✅ External students can register
- ✅ GCU students are blocked
- ✅ Clear warnings throughout the UI
- ✅ Multi-layer protection (frontend + backend)

**Event Date:** 16th October 2025  
**Eligible:** External Students Only  
**Restrictions:** GCU students cannot register

---

**Last Updated:** October 14, 2025






