// AWS S3 asset configuration
const S3_ASSETS = {
  baseUrl: 'https://gardenia2025-assets.s3.us-east-1.amazonaws.com',
  
  video: {
    hero: 'https://gardenia2025-assets.s3.us-east-1.amazonaws.com/videos/gardenia-hero-video.mp4'
  },
  logos: {
    elemental: 'https://gardenia2025-assets.s3.us-east-1.amazonaws.com/logos/elemental-logo.png',
    university: 'https://gardenia2025-assets.s3.us-east-1.amazonaws.com/logos/garden_city_college_of_sc_and_mgt_studies_logo.jpeg'
  },
  documents: {
    brochure: 'https://gardenia2025-assets.s3.us-east-1.amazonaws.com/documents/gardenia-2025-brochure (1).pdf'
  },
  events: {
    baseUrl: 'https://gardenia2025-assets.s3.us-east-1.amazonaws.com/event-images',
    // Function to get event image URL
    getEventImage: (eventId) => `${S3_ASSETS.events.baseUrl}/${eventId}.jpg`,
    // Fallback image for events without specific images
    default: 'https://gardenia2025-assets.s3.us-east-1.amazonaws.com/event-images/default-event.jpg'
  }
};

export default S3_ASSETS;
