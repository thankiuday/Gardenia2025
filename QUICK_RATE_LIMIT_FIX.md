# Quick Fix: 429 Rate Limit Error

## The Problem

Users getting `429 (Too Many Requests)` when accessing the events page.

## Quick Fix (5 minutes)

### Step 1: SSH into server
```bash
ssh your-user@gardenia.gardencity.university
cd /var/www/gardenia2025
```

### Step 2: Pull latest changes
```bash
git pull origin master
```

### Step 3: Run the fix script
```bash
bash fix-rate-limit.sh
```

That's it! The rate limit is now 5x higher (500 instead of 100).

## What Was Fixed

### Backend (`backend/server.js`)
- ✅ Rate limit increased: **100 → 500 requests per 15 minutes**
- ✅ Better 429 error messages
- ✅ Retry-After header added

### Frontend
- ✅ **Home.jsx:** Fixed `fetchEvents()` bug (was out of scope)
- ✅ **Home.jsx:** Added 429 error handling
- ✅ **Events.jsx:** Added 429 error handling

## Manual Fix (if script fails)

```bash
# 1. Restart backend only
cd /var/www/gardenia2025
pm2 restart ecosystem.config.js --env production

# 2. If you need to rebuild frontend
cd frontend
npm install
npm run build
sudo cp -r dist/* /var/www/gardenia2025/frontend/dist/
```

## Verify It Works

```bash
# Test the events API
curl -I https://gardenia.gardencity.university/api/events

# Should return 200 OK (not 429)
```

## Monitoring

```bash
# Watch for 429 errors
pm2 logs backend | grep "429"

# Should see very few or none after fix
```

## Performance

| Before | After |
|--------|-------|
| 100 requests / 15min | 500 requests / 15min |
| ~6 requests/min | ~33 requests/min |
| ❌ Fails with 3-4 users | ✅ Works with 20+ users |

## If Still Having Issues

1. **Check if rate limiting is causing issues:**
   ```bash
   pm2 logs backend --lines 100 | grep -i "rate\|429"
   ```

2. **Temporarily disable rate limiting (for testing):**
   ```bash
   # In backend/.env or environment
   export NODE_ENV=development
   pm2 restart all
   ```

3. **Increase limit even more:**
   Edit `backend/server.js` line 27:
   ```javascript
   max: process.env.NODE_ENV === 'production' ? 1000 : 1000,
   ```
   Then: `pm2 restart all`

---

**Priority:** 🔴 CRITICAL  
**Time:** 5 minutes  
**Impact:** Fixes access for all users


