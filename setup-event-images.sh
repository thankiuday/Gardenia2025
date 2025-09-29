#!/bin/bash

# Setup Event Images Directory Structure
# This script creates the local directory structure for event images

echo "📁 Setting up Event Images Directory Structure..."

# Create local event-images directory
mkdir -p ./event-images

echo "✅ Created ./event-images directory"

# Create a README file with instructions
cat > ./event-images/README.md << 'EOF'
# Event Images Directory

This directory contains all event images for Gardenia 2025.

## 📸 Required Images (37 total)

### Sports Events (8):
- basketball.jpg
- badminton.jpg
- box-cricket.jpg
- carrom.jpg
- chess.jpg
- futsal.jpg
- kabaddi.jpg
- table-tennis.jpg

### Signature Events (10):
- battle-of-the-bands.jpg
- elements-in-elegance.jpg
- group-singing.jpg
- quiz-trivia.jpg
- street-dance-showdown.jpg
- canvas-painting.jpg
- face-painting.jpg
- rhythmic-elements.jpg
- soloverse.jpg
- soulful-singing-solo.jpg

### Department Flagship Events (18):
- brain-bytes.jpg
- cell-survivor.jpg
- chasing-shadows.jpg
- decoding-life-bioquest.jpg
- elemental-path-to-power.jpg
- frames-of-the-elements.jpg
- gene-o-mania.jpg
- herb-a-thon.jpg
- ignite-the-market.jpg
- ink-spire-25.jpg
- paper-draping.jpg
- prompt-a-thon.jpg
- snackvertise.jpg
- startup-sparks.jpg
- sweet-earthly-heritage.jpg
- visionx-tourism.jpg
- waves-of-the-mind.jpg
- whispers-of-air.jpg

### Additional:
- default-event.jpg (fallback image)

## 🚀 Upload Instructions

1. Add all your event images to this directory
2. Make sure they are named exactly as listed above
3. Run the upload script: `./upload-event-images.sh`

## 📍 S3 Location

Images will be uploaded to:
```
s3://gardenia2025-assets/event-images/
```

## 🔗 Access URLs

Images will be accessible at:
```
https://gardenia2025-assets.s3.us-east-1.amazonaws.com/event-images/{filename}.jpg
```
EOF

echo "✅ Created README.md with instructions"

# Make upload script executable
chmod +x ../upload-event-images.sh

echo "✅ Made upload script executable"

echo ""
echo "📋 Next Steps:"
echo "1. Add your event images to ./event-images/ directory"
echo "2. Make sure they are named exactly as listed in README.md"
echo "3. Run: ./upload-event-images.sh"
echo ""
echo "📁 Directory structure:"
echo "   ./event-images/"
echo "   ├── README.md (instructions)"
echo "   ├── basketball.jpg"
echo "   ├── waves-of-the-mind.jpg"
echo "   ├── default-event.jpg"
echo "   └── ... (all other event images)"
