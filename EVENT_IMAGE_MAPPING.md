# 🖼️ Event Image Mapping - S3 Configuration

This document maps event titles to their corresponding S3 image names in the `event-images/` folder.

## 📁 S3 Bucket Structure
```
gardenia2025-assets/
└── event-images/
    ├── Basketball (5x5).png
    ├── Badminton.png
    ├── Battle of the Bands.png
    ├── Box Cricket.png
    ├── Brain Bytes (Puzzle-solving with Digi Coins).png
    ├── Canvas Painting.png
    ├── Carrom.png
    ├── Cell Survivor (Life Sciences Challenge).png
    ├── Chasing Shadows (Forensic Science Challenge).png
    ├── Chess.png
    ├── Decoding Life Bioinformatics Beyond Boundaries (BioQuest).png
    ├── Elemental Path to Power (Physiotherapy Fitness Games).png
    ├── Elements in Elegance (Ramp Walk).png
    ├── Face Painting.png
    ├── Frames of the Elements (Short Film Competition).png
    ├── Futsal.png
    ├── Gene-O-Mania (Genetics Quest).png
    ├── GROUP SINGING.png
    ├── Herb‑a‑thon (Medicinal Plant Quiz).png
    ├── Ignite the market (Finance & Commerce Strategy).png
    ├── Ink-Spire – 25 (Poster Making Competition).png
    ├── Kabaddi.png
    ├── Paper Draping (Fashion Design with Paper).png
    ├── Prompt‑a‑thon (AI Prompt Engineering).png
    ├── Quiz Trivia.png
    ├── Rhythmic Elements.png
    ├── SnackVertise (Food-themed Advertising).png
    ├── SoloVerse (Solo Dance).png
    ├── Soulful Singing – Solo Category.png
    ├── Startup Sparks (Entrepreneurial Pitch).png
    ├── Street Dance Showdown.png
    ├── Sweet Earthly Heritage (Dessert Showcase).png
    ├── Table Tennis (singles only).png
    ├── VisionX Tourism Challenge (Virtual Tourism Contest).png
    ├── Waves of the Mind (Psychology Challenge).png
    ├── Whispers of Air (A Book Reading Contest).png
    └── default-event.png
```

## 🔗 Event Title to Image Mapping

### **Department Flagship Events:**
| Event Title | S3 Image Name |
|-------------|---------------|
| Waves of the Mind (Psychology Challenge) | Waves of the Mind (Psychology Challenge).png |
| Paper Draping (Fashion Design with Paper) | Paper Draping (Fashion Design with Paper).png |
| Sweet Earthly Heritage (Dessert Showcase) | Sweet Earthly Heritage (Dessert Showcase).png |
| VisionX Tourism Challenge (Virtual Tourism Contest) | VisionX Tourism Challenge (Virtual Tourism Contest).png |
| Herb‑a‑thon (Medicinal Plant Quiz) | Herb‑a‑thon (Medicinal Plant Quiz).png |
| Startup Sparks (Entrepreneurial Pitch) | Startup Sparks (Entrepreneurial Pitch).png |
| Whispers of Air (A Book Reading Contest) | Whispers of Air (A Book Reading Contest).png |
| Chasing Shadows (Forensic Science Challenge) | Chasing Shadows (Forensic Science Challenge).png |
| Prompt‑a‑thon (AI Prompt Engineering) | Prompt‑a‑thon (AI Prompt Engineering).png |
| Frames of the Elements (Short Film Competition) | Frames of the Elements (Short Film Competition).png |
| Ignite the Market (Finance & Commerce Strategy) | Ignite the market (Finance & Commerce Strategy).png |
| Brain Bytes (Puzzle-solving with Digi Coins) | Brain Bytes (Puzzle-solving with Digi Coins).png |
| Ink-Spire – 25 (Poster Making Competition) | Ink-Spire – 25 (Poster Making Competition).png |
| SnackVertise (Food-themed Advertising) | SnackVertise (Food-themed Advertising).png |
| Cell Survivor (Life Sciences Challenge) | Cell Survivor (Life Sciences Challenge).png |
| Decoding Life: Bioinformatics Beyond Boundaries (BioQuest) | Decoding Life Bioinformatics Beyond Boundaries (BioQuest).png |
| Elemental Path to Power (Physiotherapy Fitness Games) | Elemental Path to Power (Physiotherapy Fitness Games).png |
| Gene-O-Mania (Genetics Quest) | Gene-O-Mania (Genetics Quest).png |

### **Signature Events:**
| Event Title | S3 Image Name |
|-------------|---------------|
| Rhythmic Elements (Group Dance) | Rhythmic Elements.png |
| Face Painting | Face Painting.png |
| SoloVerse (Solo Dance) | SoloVerse (Solo Dance).png |
| Soulful Singing – Solo Category | Soulful Singing – Solo Category.png |
| Canvas Painting | Canvas Painting.png |
| Group Singing | GROUP SINGING.png |
| Battle of the Bands | Battle of the Bands.png |
| Elements in Elegance (Ramp Walk) | Elements in Elegance (Ramp Walk).png |
| Street Dance Showdown | Street Dance Showdown.png |
| Quiz Trivia | Quiz Trivia.png |

### **Sports Events:**
| Event Title | S3 Image Name |
|-------------|---------------|
| Box Cricket | Box Cricket.png |
| Futsal | Futsal.png |
| Basketball (5x5) | Basketball (5x5).png |
| Badminton (Singles/Doubles) | Badminton.png |
| Kabaddi | Kabaddi.png |
| Chess | Chess.png |
| Carrom | Carrom.png |
| Table Tennis (singles only) | Table Tennis (singles only).png |

## 🔧 Implementation

The mapping is implemented in `frontend/src/config/s3-assets.js`:

```javascript
const S3_ASSETS = {
  events: {
    baseUrl: 'https://gardenia2025-assets.s3.us-east-1.amazonaws.com/event-images',
    getEventImage: (eventTitle) => {
      const imageMap = {
        // ... mapping object
      };
      const imageName = imageMap[eventTitle] || 'default-event.png';
      return `${S3_ASSETS.events.baseUrl}/${imageName}`;
    },
    default: 'https://gardenia2025-assets.s3.us-east-1.amazonaws.com/event-images/default-event.png'
  }
};
```

## 📝 Usage

```javascript
import S3_ASSETS from '../config/s3-assets';

// Get event image URL
const imageUrl = S3_ASSETS.events.getEventImage(event.title);

// Use in JSX
<img src={S3_ASSETS.events.getEventImage(event.title)} alt={event.title} />
```

## ✅ Components Updated

- ✅ `frontend/src/pages/Events.jsx` - Event listing page
- ✅ `frontend/src/pages/Home.jsx` - Featured events section
- ✅ `frontend/src/config/s3-assets.js` - S3 configuration

## 🎯 Benefits

- **Automatic Mapping**: Event titles automatically map to correct S3 images
- **Fallback Support**: Default image for missing events
- **Error Handling**: Graceful fallback on image load errors
- **Performance**: Direct S3 URLs for fast loading
- **Maintainability**: Centralized image mapping configuration
