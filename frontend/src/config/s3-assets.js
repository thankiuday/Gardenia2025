// AWS S3 asset configuration
const S3_ASSETS = {
  // Replace 'your-bucket-name' with your actual S3 bucket name
  // Replace 'your-region' with your actual AWS region
  baseUrl: 'https://your-bucket-name.s3.your-region.amazonaws.com',
  
  video: {
    hero: 'https://your-bucket-name.s3.your-region.amazonaws.com/videos/gardenia-hero-video.mp4'
  },
  logos: {
    elemental: 'https://your-bucket-name.s3.your-region.amazonaws.com/logos/elemental-logo.png',
    university: 'https://your-bucket-name.s3.your-region.amazonaws.com/logos/garden_city_college_of_sc_and_mgt_studies_logo.jpeg'
  },
  documents: {
    brochure: 'https://your-bucket-name.s3.your-region.amazonaws.com/documents/gardenia-2025-brochure.pdf'
  }
};

export default S3_ASSETS;
