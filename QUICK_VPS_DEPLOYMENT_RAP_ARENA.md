# 🚀 Quick VPS Deployment - Rap Arena External Only

## ⚡ Super Quick Steps (Copy-Paste Ready)

### 1️⃣ Push from Local Machine
```bash
git add .
git commit -m "Reopen Rap Arena for external students only"
git push origin master
```

### 2️⃣ SSH to VPS
```bash
ssh your-username@your-vps-ip
```

### 3️⃣ Update & Deploy (One Command)
```bash
cd /var/www/Gardenia2025 && \
git pull origin master && \
cd frontend && npm install && npm run build && \
cp -r dist/* ../backend/public/ && \
cd ../backend && \
node scripts/reopenRapArenaForExternal.js && \
pm2 restart gardenia-backend && \
pm2 logs gardenia-backend --lines 20
```

---

## 📋 Step-by-Step (If above fails)

### On Your Local Machine:
```bash
# 1. Commit changes
git add frontend/src/components/WelcomeModal.jsx
git add frontend/src/pages/Home.jsx
git add frontend/src/pages/Registration.jsx
git commit -m "Reopen Rap Arena for external students only"

# 2. Push to GitHub
git push origin master
```

### On Your VPS:
```bash
# 1. SSH to VPS
ssh your-username@your-vps-ip

# 2. Go to project directory
cd /var/www/Gardenia2025
# OR: cd Gardenia2025
# OR: cd ~/Gardenia2025

# 3. Pull changes
git pull origin master

# 4. Update backend (if needed)
cd backend
npm install

# 5. Build frontend
cd ../frontend
npm install
npm run build

# 6. Copy to backend
cp -r dist/* ../backend/public/

# 7. Run database script
cd ../backend
node scripts/reopenRapArenaForExternal.js

# 8. Restart application
pm2 restart gardenia-backend
# OR: pm2 restart gardenia2025-backend

# 9. Check status
pm2 status
pm2 logs gardenia-backend --lines 50
```

---

## ✅ Quick Verification

### Check if it's working:
```bash
# On VPS
curl http://localhost:5000/api/events | grep "Rap Arena"

# In Browser
http://your-vps-ip:5000
```

### Expected Results:
- ✅ Rap Arena section visible on homepage
- ✅ Warning: "Registration Now Open for EXTERNAL STUDENTS ONLY"
- ✅ External students CAN register
- ✅ GCU students BLOCKED from registering

---

## 🚨 Common Issues & Quick Fixes

### PM2 Not Found
```bash
pm2 list
# If not found, restart manually:
cd backend
node server.js
```

### Port Already in Use
```bash
pm2 delete all
pm2 start ecosystem.config.js
```

### Git Pull Conflicts
```bash
git stash
git pull origin master
```

### Frontend Build Fails
```bash
cd frontend
rm -rf node_modules
npm install
npm run build
```

### Database Script Fails
```bash
cd backend
cat .env | grep MONGODB  # Check connection string
node scripts/reopenRapArenaForExternal.js
```

---

## 📱 Quick Test Checklist

After deployment, test these:

1. **Homepage** → See Rap Arena with warning
2. **Click Register (Rap Arena)** → See modal with warning
3. **Select External Student** → Form loads ✅
4. **Select GCU Student** → Blocked with alert ✅
5. **Complete Registration (External)** → PDF downloads ✅

---

## 🔄 Quick Rollback

```bash
cd /var/www/Gardenia2025
git log --oneline -5  # Find previous commit hash
git reset --hard COMMIT_HASH
cd frontend && npm run build && cp -r dist/* ../backend/public/
pm2 restart gardenia-backend
```

---

## 💡 Pro Tips

### Use Screen/Tmux for Long Builds
```bash
# Start screen session
screen -S deploy

# If disconnected, reattach
screen -r deploy
```

### Save Your PM2 Configuration
```bash
pm2 save
pm2 startup
```

### Monitor in Real-Time
```bash
pm2 monit
# OR
pm2 logs gardenia-backend --lines 100
```

---

## 📞 Emergency Commands

### Stop Everything
```bash
pm2 stop all
```

### Restart Everything
```bash
pm2 restart all
```

### Clear PM2 Logs
```bash
pm2 flush
```

### Check Disk Space
```bash
df -h
```

### Check Memory
```bash
free -h
```

### Check Node Processes
```bash
ps aux | grep node
```

---

## 🎯 Expected Changes After Deployment

### Users Will See:
1. **Homepage:** Orange warning banner for Rap Arena
2. **Registration:** Modal blocks GCU students
3. **Button Text:** "(External Students Only)"
4. **Backend:** Returns 403 for GCU student attempts

### Database Changes:
- `registrationOpen: true` for Rap Arena event
- GCU students blocked via backend validation

---

## 📊 Monitoring After Deployment

### First 5 Minutes:
```bash
# Watch logs
pm2 logs gardenia-backend --lines 100

# Check for errors every 30 seconds
watch -n 30 'pm2 status'
```

### First Hour:
```bash
# Monitor memory
watch -n 60 'free -h'

# Check active connections
watch -n 60 'netstat -an | grep :5000 | wc -l'
```

---

## 🔐 Security Check

After deployment, verify:
```bash
# Check if .env file is secure
ls -la backend/.env
# Should show: -rw------- (600 permissions)

# Verify no secrets in logs
pm2 logs gardenia-backend | grep -i "password\|secret\|key"
# Should return nothing

# Check firewall (if enabled)
sudo ufw status
```

---

## ✨ Success!

If you see:
- ✅ `pm2 status` shows "online"
- ✅ No errors in logs
- ✅ Homepage loads with Rap Arena
- ✅ External students can register
- ✅ GCU students are blocked

**You're done! 🎉**

---

**For detailed troubleshooting, see:** `DEPLOY_RAP_ARENA_EXTERNAL_ONLY_TO_VPS.md`






