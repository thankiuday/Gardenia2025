# S3 Event Image Mappings

## Overview
This document tracks the mapping between event titles and their corresponding S3 image filenames.

## Current Mappings

### ✅ Configured Events

| Event Title | Clean ID | S3 Filename | S3 URL |
|-------------|----------|-------------|---------|
| **Badminton (Singles/Doubles)** | `badminton-singlesdoubles` | `Bedminton.png` | `s3://gardenia2025-assets/event-images/Bedminton.png` |
| **Rhythmic Elements (Group Dance)** | `rhythmic-elements-group-dance` | `rhythmic-elements.png` | `s3://gardenia2025-assets/event-images/rhythmic-elements.png` |

### 🔧 Special Cases Handled

1. **Badminton Event**: 
   - **Issue**: S3 filename has typo "Bedminton" instead of "Badminton"
   - **Solution**: Maps both `badminton-singlesdoubles` and `badminton-singles-doubles` to `Bedminton.png`

2. **Rhythmic Elements Event**:
   - **Issue**: Event title is long and needs clean mapping
   - **Solution**: Maps `rhythmic-elements-group-dance` to `rhythmic-elements.png`

## Configuration Location

**File**: `frontend/src/config/s3-assets.js`

```javascript
const specialCases = {
  'herbathon-medicinal-plant-quiz': 'herb-a-thon-medicinal-plant-quiz',
  'promptathon-ai-prompt-engineering': 'prompt-a-thon-ai-prompt-engineering',
  'elementra-unleash-your-essence-rhythmic-elements': 'elementra-unleash-your-essence-rhythmic-elements',
  'badminton-singlesdoubles': 'Bedminton', // Handle the typo in S3 filename
  'badminton-singles-doubles': 'Bedminton', // Handle the typo in S3 filename
  'rhythmic-elements-group-dance': 'rhythmic-elements' // Map to correct S3 filename
};
```

## URL Generation Process

1. **Input**: Event title (e.g., "Rhythmic Elements (Group Dance)")
2. **Clean**: Remove special chars, replace spaces with hyphens, lowercase
3. **Map**: Check special cases for known mismatches
4. **Generate**: Create full S3 URL with cache busting
5. **Output**: `https://gardenia2025-assets.s3.us-east-1.amazonaws.com/event-images/rhythmic-elements.png?v=timestamp`

## Testing

Both events have been tested and are working correctly:

```bash
# Test Badminton
node -e "const S3_ASSETS = require('./src/config/s3-assets.js').default; console.log(S3_ASSETS.events.getEventImage('Badminton (Singles/Doubles)'));"

# Test Rhythmic Elements  
node -e "const S3_ASSETS = require('./src/config/s3-assets.js').default; console.log(S3_ASSETS.events.getEventImage('Rhythmic Elements (Group Dance)'));"
```

## Adding New Mappings

To add a new event image mapping:

1. Upload the image to S3: `s3://gardenia2025-assets/event-images/your-filename.png`
2. Add the mapping to `specialCases` in `s3-assets.js`:
   ```javascript
   'your-event-clean-id': 'your-s3-filename'
   ```
3. Test the URL generation
4. Update this documentation

## Fallback

If no specific mapping is found, the system uses the cleaned event title as the filename and falls back to the default image if the S3 image doesn't exist.
