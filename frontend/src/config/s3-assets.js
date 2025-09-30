// AWS S3 asset configuration
// Support environment-based S3 URLs for different deployments
const getS3BaseUrl = () => {
  // Check for environment variable first (with fallback for Node.js testing)
  const envS3Url = typeof import.meta !== 'undefined' && import.meta.env 
    ? import.meta.env.VITE_S3_BASE_URL 
    : process.env.VITE_S3_BASE_URL;
    
  if (envS3Url) {
    return envS3Url;
  }
  
  // Default S3 bucket URL
  return 'https://gardenia2025-assets.s3.us-east-1.amazonaws.com';
};

const S3_ASSETS = {
  baseUrl: getS3BaseUrl(),
  
  video: {
    hero: `${getS3BaseUrl()}/videos/gardenia-hero-video.mp4`
  },
  logos: {
    elemental: `${getS3BaseUrl()}/logos/elemental-logo.png`,
    university: `${getS3BaseUrl()}/logos/garden_city_college_of_sc_and_mgt_studies_logo.jpeg`,
    aboutGCU: `${getS3BaseUrl()}/logos/AboutGCU.jpg`
  },
  documents: {
    brochure: `${getS3BaseUrl()}/documents/gardenia-2025-brochure.pdf`
  },
  events: {
    baseUrl: `${getS3BaseUrl()}/event-images`,
    // Function to get event image URL
    getEventImage: (eventId) => {
      // Clean the event ID to make it URL-safe
      const cleanId = eventId
        .replace(/[^a-zA-Z0-9\s-]/g, '') // Keep hyphens, remove other special chars
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
        .toLowerCase();
      
      // Special case fixes for known mismatches
      const specialCases = {
        'herbathon-medicinal-plant-quiz': 'herb-a-thon-medicinal-plant-quiz',
        'promptathon-ai-prompt-engineering': 'prompt-a-thon-ai-prompt-engineering',
        'elementra-unleash-your-essence-rhythmic-elements': 'elementra-unleash-your-essence-rhythmic-elements',
        'badminton-singlesdoubles': 'Bedminton', // Handle the typo in S3 filename
        'badminton-singles-doubles': 'Bedminton', // Handle the typo in S3 filename
        'rhythmic-elements-group-dance': 'rhythmic-elements' // Map to correct S3 filename
      };
      
      const finalId = specialCases[cleanId] || cleanId;
      const url = `${S3_ASSETS.events.baseUrl}/${finalId}.png?v=${Date.now()}`;
      return url;
    },
    // Fallback image for events without specific images (using local for now)
    default: '/default-event.jpg'
  }
};

export default S3_ASSETS;

