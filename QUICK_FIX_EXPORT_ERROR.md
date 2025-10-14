# Quick Fix: Excel Export Download Error

## The Error You're Seeing

```
ERR_CONTENT_LENGTH_MISMATCH
Network Error when downloading registration data
```

## Quick Fix (5 minutes)

### Step 1: SSH into your server
```bash
ssh your-user@gardenia.gardencity.university
cd /var/www/gardenia2025
```

### Step 2: Pull the latest changes
```bash
git pull origin master
```

### Step 3: Run the automated fix
```bash
sudo bash fix-export-download.sh
```

That's it! The script will:
- ✓ Update nginx configuration
- ✓ Update backend code  
- ✓ Restart services
- ✓ Verify everything works

### Step 4: Test
1. Log into admin dashboard
2. Try downloading registration data
3. It should work now!

## What Was Fixed

**Problem:** Nginx proxy buffer too small (8KB default) → Large Excel files got truncated

**Solution:** Increased buffer to 2MB + improved backend response handling

## If You Still Have Issues

```bash
# Check logs
pm2 logs backend
sudo tail -f /var/log/nginx/gardenia2025_error.log

# Restart everything
pm2 restart all
sudo systemctl restart nginx
```

## Manual Fix (if script doesn't work)

```bash
# 1. Copy nginx config
sudo cp nginx.conf /etc/nginx/sites-available/gardenia2025

# 2. Test nginx
sudo nginx -t

# 3. Reload nginx
sudo systemctl reload nginx

# 4. Restart backend
pm2 restart ecosystem.config.js --env production
```

---

**Need Help?** Check `EXPORT_DOWNLOAD_FIX.md` for detailed documentation.

