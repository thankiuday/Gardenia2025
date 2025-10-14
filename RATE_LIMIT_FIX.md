# Rate Limit 429 Error Fix

## Problem

Users are getting `429 (Too Many Requests)` errors when accessing the events page:

```
GET https://gardenia.gardencity.university/api/events 429 (Too Many Requests)
```

## Root Causes

### 1. Rate Limit Too Strict ❌
**Current:** 100 requests per 15 minutes  
**Problem:** Only ~6-7 requests per minute allowed
- Each page load = 1-2 API calls
- Multiple tabs/users = hitting limit fast
- No distinction between endpoints

### 2. Potential Infinite Loop/Render Loop 🔄
The error stack trace shows many recursive calls:
```
Qt @ index-CmA22EAh.js:32  (repeated ~50 times)
```
This suggests a React render loop or component re-rendering infinitely.

### 3. Bug in Home.jsx 🐛
Line 74: `handleRetry()` calls `fetchEvents()` which is defined inside `useEffect` scope, causing errors on retry.

## Solutions

### Fix 1: Increase Rate Limit

Update `backend/server.js` line 27:

**Before:**
```javascript
max: process.env.NODE_ENV === 'production' ? 100 : 1000,
```

**After:**
```javascript
max: process.env.NODE_ENV === 'production' ? 500 : 1000,
```

**Why 500?**
- Allows ~33 requests/minute
- Safe for 10-20 concurrent users
- Handles multiple tabs/refreshes
- Still protects against DDoS

### Fix 2: Add Per-Endpoint Rate Limits

Create separate rate limiters for different endpoints:

```javascript
// General API rate limit - more permissive
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,
  message: 'Too many requests, please try again later.',
  skip: (req) => req.path === '/api/health'
});

// Stricter limit for heavy operations
const exportLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20, // Only 20 exports per 15 minutes
  message: 'Too many export requests, please wait before trying again.'
});

// Apply different limits
app.use('/api/', generalLimiter);
app.use('/api/admin/registrations/export', exportLimiter);
app.use('/api/admin/contacts/export', exportLimiter);
```

### Fix 3: Fix Home.jsx Bug

Move `fetchEvents` outside `useEffect`:

**Before:**
```javascript
useEffect(() => {
  const fetchEvents = async () => {
    // ... fetch logic
  };
  fetchEvents();
}, []);

const handleRetry = () => {
  setRetryCount(prev => prev + 1);
  fetchEvents(); // ❌ OUT OF SCOPE!
};
```

**After:**
```javascript
const fetchEvents = useCallback(async () => {
  try {
    setLoading(true);
    setError(null);
    const response = await axios.get(API_ENDPOINTS.EVENTS);
    // ... rest of logic
  } catch (err) {
    // ... error handling
  } finally {
    setLoading(false);
  }
}, []); // No dependencies

useEffect(() => {
  fetchEvents();
}, [fetchEvents]);

const handleRetry = () => {
  setRetryCount(prev => prev + 1);
  fetchEvents(); // ✅ NOW IN SCOPE!
};
```

### Fix 4: Add 429 Error Handling in Frontend

Add better handling for rate limit errors:

```javascript
// In frontend/src/config/api.js or create axios-config.js
import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000'
});

// Add response interceptor for 429 errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 429) {
      const retryAfter = error.response.headers['retry-after'];
      const waitTime = retryAfter ? parseInt(retryAfter) * 1000 : 60000;
      
      error.message = `Too many requests. Please wait ${Math.ceil(waitTime / 1000)} seconds and try again.`;
      error.userFriendlyMessage = 'You\'re making requests too quickly. Please wait a moment and try again.';
      error.isRateLimitError = true;
    }
    return Promise.reject(error);
  }
);

export default apiClient;
```

Then use it in components:

```javascript
// Instead of: import axios from 'axios';
import apiClient from '../config/axios-config';

// Use apiClient instead of axios
const response = await apiClient.get(API_ENDPOINTS.EVENTS);
```

### Fix 5: Add Exponential Backoff for Retries

```javascript
const fetchEventsWithBackoff = async (retryCount = 0) => {
  try {
    setLoading(true);
    setError(null);
    const response = await axios.get(API_ENDPOINTS.EVENTS);
    // ... success handling
    setRetryCount(0); // Reset on success
  } catch (err) {
    if (err.response?.status === 429) {
      const maxRetries = 3;
      if (retryCount < maxRetries) {
        const backoffTime = Math.min(1000 * Math.pow(2, retryCount), 10000);
        setError(`Too many requests. Retrying in ${backoffTime/1000} seconds...`);
        setTimeout(() => {
          fetchEventsWithBackoff(retryCount + 1);
        }, backoffTime);
        return;
      } else {
        setError('Too many requests. Please refresh the page in a few minutes.');
      }
    } else {
      // ... other error handling
    }
  } finally {
    setLoading(false);
  }
};
```

## Quick Fix (Minimal Changes)

If you just want to fix it quickly without major refactoring:

1. **Update rate limit** in `backend/server.js` line 27:
   ```javascript
   max: process.env.NODE_ENV === 'production' ? 500 : 1000,
   ```

2. **Add 429 handling** in frontend pages:
   ```javascript
   } catch (err) {
     if (err.response?.status === 429) {
       setError('Too many requests. Please wait a moment and refresh the page.');
     } else {
       setError('Unable to load events...');
     }
   }
   ```

3. **Fix Home.jsx:** Remove the `handleRetry` function since it's broken, or fix it as shown above.

## Deployment

### Backend Changes
```bash
# 1. Update backend/server.js
# 2. Commit and deploy
cd backend
git add server.js
git commit -m "fix: increase rate limit to 500 requests per 15 minutes"

# 3. Restart backend
pm2 restart ecosystem.config.js --env production
```

### Frontend Changes (if adding axios interceptor)
```bash
# 1. Create axios-config.js
# 2. Update imports in all pages
# 3. Build and deploy
cd frontend
npm run build
# Deploy dist folder
```

## Testing

After deployment:

```bash
# Test rate limiting
for i in {1..10}; do
  curl -I https://gardenia.gardencity.university/api/events
  echo "Request $i"
  sleep 0.1
done
```

Should not hit 429 within 10 requests now.

## Monitoring

Check rate limit hits:

```bash
# Backend logs
pm2 logs backend | grep "429"
pm2 logs backend | grep "Too many requests"

# Nginx logs
sudo tail -f /var/log/nginx/gardenia2025_access.log | grep " 429 "
```

##Recommended Long-Term Solution

Implement Redis-based rate limiting for:
- Per-user rate limits (not just per-IP)
- Per-endpoint custom limits
- Distributed rate limiting across multiple servers
- Better performance than in-memory limits

```bash
npm install rate-limit-redis redis
```

```javascript
const RedisStore = require('rate-limit-redis');
const redis = require('redis');

const client = redis.createClient({
  host: 'localhost',
  port: 6379
});

const limiter = rateLimit({
  store: new RedisStore({
    client: client,
    prefix: 'rl:',
  }),
  windowMs: 15 * 60 * 1000,
  max: 500
});
```

## Summary

**Immediate Actions:**
1. ✅ Change rate limit from 100 to 500
2. ✅ Add 429 error handling in frontend
3. ✅ Fix Home.jsx handleRetry bug
4. ✅ Restart backend service

**Result:**
- No more 429 errors for normal usage
- Better user experience with clear error messages
- Retry logic works correctly

---

**Priority:** 🔴 HIGH - Users cannot access the site  
**Effort:** 🟡 15-30 minutes  
**Impact:** 🟢 Fixes critical user-facing bug


