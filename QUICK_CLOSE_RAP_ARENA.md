# Quick Guide: Close Rap Arena Registration

## Immediate Steps to Close Registration

### Step 1: Run the Script

```bash
# Navigate to backend directory
cd backend

# Run the close registration script
node scripts/closeRapArenaRegistration.js
```

Expected output:
```
Connected to MongoDB
✅ Successfully closed registration for Rap Arena event

Event Details:
- Title: Gardenia 2K25: The Rap Arena
- ID: [event-id]
- Custom ID: [custom-id]
- Registration Open: false

Disconnected from MongoDB
```

### Step 2: Verify Changes

1. **Check the Website**
   - Go to the home page
   - Rap Arena section should show "🎵 Registration Closed 🎵"

2. **Try to Register**
   - Navigate to `/register/68dd4dce04b7580301ca3537`
   - Should see "Registration Closed" message
   - Cannot submit registration form

3. **Check Events Page**
   - Browse to `/events`
   - Rap Arena card should show "Closed" badge
   - Registration button disabled

## What Users Will See

### 🚫 Registration Page
- Large warning icon
- "Registration Closed" message
- Button to browse other events
- Button to go home
- ❌ No registration form

### 🏠 Home Page
- Rap Arena section visible
- All information about the event
- "Registration Closed" button (red, disabled)
- Can still learn more about the event

### 📋 Events Page
- Event card shows "Closed" badge
- Registration button replaced with "Closed" indicator
- Can still view event details

### ℹ️ Event Details Page
- All event information visible
- "Registration Closed" button (red, disabled)
- Lock icon indicating closed status

## Backend Protection

Even if someone tries to bypass the UI and directly submit to the API:

```bash
# This will be rejected:
POST /api/register
{
  "eventId": "rap-arena-id",
  "...": "..."
}

# Response:
{
  "success": false,
  "message": "Registration for this event is currently closed"
}
```

## To Re-open Registration Later

If you need to re-open:

```javascript
// In MongoDB or create a new script:
db.events.updateOne(
  { title: "Gardenia 2K25: The Rap Arena" },
  { $set: { registrationOpen: true } }
)
```

## Troubleshooting

**Script fails to find event:**
- Event might not be in database yet
- Check event title is exactly: "Gardenia 2K25: The Rap Arena"
- Verify MongoDB connection in `backend/config.js`

**Changes not reflected on website:**
- Clear browser cache (Ctrl+Shift+R or Cmd+Shift+R)
- Restart frontend dev server if in development
- Rebuild frontend if in production: `npm run build`

**Backend still accepts registrations:**
- Verify script ran successfully
- Check MongoDB to confirm `registrationOpen: false`
- Restart backend server

## Quick Verification Checklist

- [ ] Script ran successfully
- [ ] MongoDB shows `registrationOpen: false`
- [ ] Home page shows "Registration Closed"
- [ ] Registration page shows closed message
- [ ] Events page shows "Closed" badge
- [ ] Event details page shows closed button
- [ ] API rejects registration attempts

---

**Done! Registration is now closed for the Rap Arena event.**







