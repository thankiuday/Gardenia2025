# Event Schema Updates for Flexible Participation

## Overview
Updated the Event model to support events that can be participated in both individually and as a group (e.g., Badminton Singles/Doubles).

## Changes Made

### 1. Backend Schema Updates (`backend/models/Event.js`)

#### Added New Fields:
- **`participationTypes`**: Array of strings indicating supported participation types
- **Updated `type` enum**: Added `'Individual/Group'` option

#### Schema Changes:
```javascript
type: {
  type: String,
  required: true,
  enum: ['Individual', 'Group', 'Individual/Group']
},
participationTypes: {
  type: [String],
  default: function() {
    if (this.type === 'Individual/Group') {
      return ['Individual', 'Group'];
    }
    return [this.type];
  },
  enum: ['Individual', 'Group']
}
```

### 2. Frontend Updates (`frontend/src/components/EventCard.jsx`)

#### Visual Indicators:
- Added purple badge for `Individual/Group` events
- Updated team size display to show "Singles/Doubles" for flexible events

#### Display Logic:
```javascript
// Badge colors
event.type === 'Individual' ? 'bg-orange-100 text-orange-800' 
: event.type === 'Individual/Group' ? 'bg-purple-100 text-purple-800'
: 'bg-green-100 text-green-800'

// Team size display
event.type === 'Individual/Group'
? `${event.teamSize.min}-${event.teamSize.max} members (Singles/Doubles)`
: // other logic
```

### 3. Backend Validation Updates (`backend/routes/registrations.js`)

#### Registration Validation:
- Updated team size validation to include `Individual/Group` events
- Maintains existing validation logic for team size limits

```javascript
if (event.type === 'Group' || event.type === 'Individual/Group') {
  // Validate team size
}
```

### 4. Database Updates

#### Badminton Event:
- **Type**: Changed from `'Individual'` to `'Individual/Group'`
- **Participation Types**: `['Individual', 'Group']`
- **Team Size**: `{ min: 1, max: 2 }` (supports both singles and doubles)

## Usage Examples

### For Badminton:
- **Singles**: 1 participant (Individual)
- **Doubles**: 2 participants (Group)

### For Future Events:
Use the `updateEventTypes.js` script to convert other events to flexible participation:

```bash
node scripts/updateEventTypes.js
```

## Benefits

1. **Flexible Participation**: Events can now support both individual and group participation
2. **Clear UI Indicators**: Users can easily identify flexible events
3. **Proper Validation**: Backend validates team sizes correctly for all event types
4. **Scalable**: Easy to add more flexible events in the future

## Testing

The schema has been tested with:
- ✅ Badminton event updated successfully
- ✅ Frontend displays correct information
- ✅ Backend validation works properly
- ✅ Registration form handles both participation types

## Future Enhancements

- Add more events that support flexible participation
- Consider adding participation type selection in registration form
- Add analytics for participation type preferences





