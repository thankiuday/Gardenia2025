# 📸 Event Image Names for Gardenia 2025

Based on the event grid, here are all the event image names you need to create:

## 🏀 Sports Events (8 events)

1. `basketball.jpg` - Basketball (5x5)
2. `badminton.jpg` - Badminton (Singles/Doubles)
3. `box-cricket.jpg` - Box Cricket
4. `carrom.jpg` - Carrom
5. `chess.jpg` - Chess
6. `futsal.jpg` - Futsal
7. `kabaddi.jpg` - Kabaddi
8. `table-tennis.jpg` - Table Tennis (singles only)

## 🎭 Signature Events (10 events)

9. `battle-of-the-bands.jpg` - Battle of the Bands
10. `elements-in-elegance.jpg` - Elements in Elegance (Ramp Walk)
11. `group-singing.jpg` - Group Singing
12. `quiz-trivia.jpg` - Quiz Trivia
13. `street-dance-showdown.jpg` - Street Dance Showdown
14. `canvas-painting.jpg` - Canvas Painting
15. `face-painting.jpg` - Face Painting
16. `rhythmic-elements.jpg` - Rhythmic Elements
17. `soloverse.jpg` - SoloVerse (Solo Dance)
18. `soulful-singing-solo.jpg` - Soulful Singing - Solo Category

## 🔬 Department Flagship Events (18 events)

19. `brain-bytes.jpg` - Brain Bytes (Puzzle-solving with Digi Coins)
20. `cell-survivor.jpg` - Cell Survivor (Life Sciences Challenge)
21. `chasing-shadows.jpg` - Chasing Shadows (Forensic Science Challenge)
22. `decoding-life-bioquest.jpg` - Decoding Life: Bioinformatics Beyond Boundaries
23. `elemental-path-to-power.jpg` - Elemental Path to Power (Physiotherapy Fitness Games)
24. `frames-of-the-elements.jpg` - Frames of the Elements (Short Film Competition)
25. `gene-o-mania.jpg` - Gene-O-Mania (Genetics Quest)
26. `herb-a-thon.jpg` - Herb-a-thon (Medicinal Plant Quiz)
27. `ignite-the-market.jpg` - Ignite the Market (Finance & Commerce Strategy)
28. `ink-spire-25.jpg` - Ink-Spire - 25 (Poster Making Competition)
29. `paper-draping.jpg` - Paper Draping (Fashion Design with Paper)
30. `prompt-a-thon.jpg` - Prompt-a-thon (AI Prompt Engineering)
31. `snackvertise.jpg` - SnackVertise (Food-themed Advertising)
32. `startup-sparks.jpg` - Startup Sparks (Entrepreneurial Pitch)
33. `sweet-earthly-heritage.jpg` - Sweet Earthly Heritage (Dessert Showcase)
34. `visionx-tourism.jpg` - VisionX Tourism Challenge (Virtual Tourism Contest)
35. `waves-of-the-mind.jpg` - Waves of the Mind (Psychology Challenge)
36. `whispers-of-air.jpg` - Whispers of Air (A Book Reading Contest)

## 📁 Additional Files

37. `default-event.jpg` - Default fallback image for events without specific images

## 📍 Storage Locations

### S3 Bucket (Primary)
```
https://gardenia2025-assets.s3.us-east-1.amazonaws.com/events/
```

### Local Fallback
```
frontend/public/optimized/
```

## 🎨 Image Requirements

- **Format**: JPG
- **Naming**: Use exact event IDs from the list above
- **Total**: 36 event images + 1 default image = 37 images
- **Fallback**: `default-event.jpg` for events without specific images

## 📋 Quick Checklist

- [ ] Create 36 event images with exact names above
- [ ] Create 1 default fallback image
- [ ] Upload to S3 bucket: `gardenia2025-assets/events/`
- [ ] Test image loading in application
- [ ] Verify fallback image works for missing events

## 🔗 Image URLs

Images will be accessible at:
```
https://gardenia2025-assets.s3.us-east-1.amazonaws.com/events/{event-id}.jpg
```

Example:
- `https://gardenia2025-assets.s3.us-east-1.amazonaws.com/events/basketball.jpg`
- `https://gardenia2025-assets.s3.us-east-1.amazonaws.com/events/waves-of-the-mind.jpg`
- `https://gardenia2025-assets.s3.us-east-1.amazonaws.com/events/default-event.jpg`
