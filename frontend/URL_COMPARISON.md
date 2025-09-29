# S3 URL Structure Comparison

## Before Configuration (Direct S3 Access)

### Development URLs:
```
Event Images: https://gardenia2025-assets.s3.us-east-1.amazonaws.com/event-images/rhythmic-elements.png
Logos:       https://gardenia2025-assets.s3.us-east-1.amazonaws.com/logos/elemental-logo.png
Documents:   https://gardenia2025-assets.s3.us-east-1.amazonaws.com/documents/gardenia-2025-brochure.pdf
Videos:      https://gardenia2025-assets.s3.us-east-1.amazonaws.com/videos/gardenia-hero-video.mp4
```

### Production URLs (After Configuration):
```
Event Images: https://gardenia.gardencity.university/s3/event-images/rhythmic-elements.png
Logos:       https://gardenia.gardencity.university/s3/logos/elemental-logo.png
Documents:   https://gardenia.gardencity.university/s3/documents/gardenia-2025-brochure.pdf
Videos:      https://gardenia.gardencity.university/s3/videos/gardenia-hero-video.mp4
```

## URL Flow Diagram

### Development Flow:
```
Frontend Request → Direct S3 Bucket
https://localhost:3000 → https://gardenia2025-assets.s3.us-east-1.amazonaws.com/event-images/image.png
```

### Production Flow:
```
Frontend Request → Your Domain → S3 Proxy → S3 Bucket
https://gardenia.gardencity.university → /s3/event-images/image.png → Proxy → S3 Bucket
```

## Environment Variable Mapping

| Environment | VITE_S3_BASE_URL | Result |
|-------------|------------------|---------|
| **Development** | Not set | `https://gardenia2025-assets.s3.us-east-1.amazonaws.com` |
| **Production** | `https://gardenia.gardencity.university/s3` | `https://gardenia.gardencity.university/s3` |

## Asset Type Examples

### Event Images:
- **Development**: `https://gardenia2025-assets.s3.us-east-1.amazonaws.com/event-images/rhythmic-elements.png`
- **Production**: `https://gardenia.gardencity.university/s3/event-images/rhythmic-elements.png`

### Logos:
- **Development**: `https://gardenia2025-assets.s3.us-east-1.amazonaws.com/logos/elemental-logo.png`
- **Production**: `https://gardenia.gardencity.university/s3/logos/elemental-logo.png`

### Documents:
- **Development**: `https://gardenia2025-assets.s3.us-east-1.amazonaws.com/documents/gardenia-2025-brochure.pdf`
- **Production**: `https://gardenia.gardencity.university/s3/documents/gardenia-2025-brochure.pdf`

### Videos:
- **Development**: `https://gardenia2025-assets.s3.us-east-1.amazonaws.com/videos/gardenia-hero-video.mp4`
- **Production**: `https://gardenia.gardencity.university/s3/videos/gardenia-hero-video.mp4`
