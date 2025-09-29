// Code to generate all event image names
// This will show you exactly what URLs are being created for each event

// Sample event titles (you can replace these with your actual event titles)
const eventTitles = [
  "Brain Bytes (Puzzle-solving with Digi Coins)",
  "Herb-a-thon: Medicinal Plant Quiz",
  "Basketball 5x5",
  "Chess",
  "Canvas Painting",
  "Carrom",
  "Cell Survivor: Life Sciences Challenge",
  "Chasing Shadows: Forensic Science Challenge",
  "Decoding Life: Bioinformatics Beyond Boundaries BioQuest",
  "Elemental Path to Power: Physiotherapy Challenge",
  "Elements in Elegance: Ramp Walk",
  "Face Painting",
  "Frames of the Elements: Short Film Competition",
  "Futsal",
  "Gene-o-mania: Genetics Quest",
  "Group Singing",
  "Ignite the Market: Finance & Commerce Strategy",
  "Ink-spire 2.5: Poster Making Competition",
  "Kabaddi",
  "Paper Draping: Fashion Design with Paper",
  "Prompt-a-thon: AI Prompt Engineering",
  "Quiz Trivia",
  "Rhythmic Elements",
  "Snackvertise: Food-themed Advertising"
];

// The same cleaning function used in your S3_ASSETS configuration
function getEventImage(eventId) {
  const cleanId = eventId
    .replace(/[^a-zA-Z0-9\s-]/g, '') // Keep hyphens, remove other special chars
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .toLowerCase();
  
  const url = `https://gardenia2025-assets.s3.us-east-1.amazonaws.com/event-images/${cleanId}.png`;
  return { eventId, cleanId, url };
}

// Generate all image names
console.log('=== GENERATED EVENT IMAGE NAMES ===\n');

eventTitles.forEach((title, index) => {
  const result = getEventImage(title);
  console.log(`${index + 1}. Original: "${result.eventId}"`);
  console.log(`   Generated: "${result.cleanId}.png"`);
  console.log(`   Full URL: ${result.url}`);
  console.log('');
});

console.log('=== SUMMARY ===');
console.log(`Total events: ${eventTitles.length}`);
console.log('Check these generated names against your actual S3 filenames to find any mismatches.');

