# Close Event Registration Guide

This guide explains how to close registration for any event, specifically the Rap Arena event.

## Overview

The system now supports closing registration for individual events. When registration is closed:
- Users cannot submit new registrations (backend blocks them)
- Registration buttons show "Registration Closed" instead of "Register Now"
- Users see a clear message explaining registration is closed

## Changes Made

### Backend Changes

1. **Event Model** (`backend/models/Event.js`)
   - Added `registrationOpen` field (Boolean, default: true)

2. **Registration Route** (`backend/routes/registrations.js`)
   - Added validation to check if registration is open before accepting registrations
   - Returns 403 error if registration is closed

### Frontend Changes

1. **Registration Page** (`frontend/src/pages/Registration.jsx`)
   - Shows "Registration Closed" message instead of form when `registrationOpen` is false
   - Provides buttons to browse other events or go home

2. **Event Details Page** (`frontend/src/pages/EventDetails.jsx`)
   - Shows "Registration Closed" button instead of "Register Now"
   - Button is disabled and styled in red

3. **Event Card Component** (`frontend/src/components/EventCard.jsx`)
   - Shows "Closed" badge instead of "Register Now" button

4. **Home Page** (`frontend/src/pages/Home.jsx`)
   - Fetches Rap Arena event status
   - Shows "Registration Closed" message for Rap Arena section when closed

## How to Close Registration for Rap Arena Event

### Option 1: Using the Script (Recommended)

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Run the script:
   ```bash
   node scripts/closeRapArenaRegistration.js
   ```

3. The script will:
   - Connect to MongoDB
   - Find the "Gardenia 2K25: The Rap Arena" event
   - Set `registrationOpen` to `false`
   - Display confirmation message

### Option 2: Using MongoDB Compass or Shell

1. Open MongoDB Compass or MongoDB Shell

2. Connect to your database

3. Find the events collection

4. Run this query to close registration:
   ```javascript
   db.events.updateOne(
     { title: "Gardenia 2K25: The Rap Arena" },
     { $set: { registrationOpen: false } }
   )
   ```

### Option 3: Using the Admin Panel (Future Enhancement)

An admin panel can be created to manage event registration status through a UI.

## How to Re-open Registration

If you need to re-open registration, use the same methods but set `registrationOpen` to `true`:

### Using Script
Create a similar script with:
```javascript
{ $set: { registrationOpen: true } }
```

### Using MongoDB
```javascript
db.events.updateOne(
  { title: "Gardenia 2K25: The Rap Arena" },
  { $set: { registrationOpen: true } }
)
```

## Closing Registration for Other Events

To close registration for any other event:

1. Find the event title or ID

2. Use the same script or MongoDB query:
   ```javascript
   db.events.updateOne(
     { title: "Your Event Title Here" },
     { $set: { registrationOpen: false } }
   )
   ```

Or by event ID:
   ```javascript
   db.events.updateOne(
     { _id: ObjectId("your-event-id-here") },
     { $set: { registrationOpen: false } }
   )
   ```

## Testing

### Test Backend Protection

1. Close registration for an event
2. Try to submit a registration via the form
3. Should receive error: "Registration for this event is currently closed"

### Test Frontend Display

1. **Home Page**
   - Navigate to home page
   - Check Rap Arena section shows "Registration Closed" (if closed)

2. **Events Page**
   - Browse to Events page
   - Find the closed event
   - Verify it shows "Closed" badge instead of "Register Now"

3. **Event Details**
   - Click on a closed event
   - Verify "Registration Closed" button appears
   - Button should be disabled and styled in red

4. **Registration Page**
   - Try to access registration page directly
   - Should see "Registration Closed" message
   - Should have buttons to browse other events

## Deployment

After making these changes:

1. **Backend**: Restart the Node.js server
   ```bash
   cd backend
   npm start
   ```

2. **Frontend**: Rebuild and deploy
   ```bash
   cd frontend
   npm run build
   ```

3. **Run the Script**: Close registration for Rap Arena
   ```bash
   cd backend
   node scripts/closeRapArenaRegistration.js
   ```

## Database Migration

For existing events in the database that don't have the `registrationOpen` field:
- The field defaults to `true`
- No migration is needed
- Events without this field will have registration open by default

## Notes

- The `registrationOpen` field is optional and defaults to `true`
- If not set, registration remains open (backward compatible)
- The field can be updated at any time without affecting other event data
- Backend validation ensures users cannot bypass the closed registration status

## Support

If you encounter any issues:
1. Check MongoDB connection
2. Verify the event exists in the database
3. Check the event title matches exactly (case-sensitive)
4. Ensure frontend is fetching the latest event data
5. Clear browser cache if changes don't appear












