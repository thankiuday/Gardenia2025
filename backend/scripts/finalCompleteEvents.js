const mongoose = require('mongoose');
const Event = require('../models/Event');
const config = require('../config');

// Complete events data with ALL events from the provided information
const eventsData = [
  // Department Flagship Events
  {
    customId: "waves-of-the-mind-psychology-challenge",
    title: "Waves of the Mind (Psychology Challenge)",
    category: "Department Flagship Events",
    type: "Group",
    teamSize: { min: 2, max: 2 },
    department: "Department of Psychology",
    club: "Operation Smile Club & Mindfulness Club",
    time: "16th October 2025 | 12.00 PM onwards",
    dates: {
      inhouse: "8th October 2025",
      outside: "16th October 2025"
    },
    description: `"Waves of the Mind" is an engaging and interactive Psychology Competition designed to challenge and explore fundamental psychological skills in a fun and water-themed setting. The competition consists of three exciting rounds:
Round 1. Ripple Effect tests participants' attention and short-term memory by showing them water-themed images followed by recall questions.
Round 2. Creative Currents encourages creative expression and emotional intelligence, where teams craft imaginative stories combining water-related and psychology-related words.
Round 3. Ocean of Thoughts is a fast-paced word association game that tests quick thinking and associative ability under time pressure.
This event promotes teamwork, creativity, and critical thinking while making psychology enjoyable and accessible for students from diverse educational backgrounds.`,
    eligibility: "Open to 9th, 10th, PU (11th & 12th), UG, and PG students.",
    rules: [
      "Teams of 2 members only.",
      "Individual registration is mandatory with valid enrollment proof (School/College ID).",
      "Integrity, honesty, and respectful behavior are required.",
      "Cheating, use of external devices, plagiarism, or misconduct will lead to disqualification.",
      "Each round will be judged based on accuracy, creativity, and speed.",
      "The decision of the judges and moderators will be final."
    ],
    contacts: [
      { name: "Prof. Meghana K S", phone: "9999999999", role: "SPOC" },
      { name: "Simran Paranjape", phone: "9945131195", role: "Student In-Charge" },
      { name: "Arshad Shaik", phone: "9392484722", role: "Student In-Charge" }
    ]
  },
  {
    customId: "paper-draping-fashion-design-with-paper",
    title: "Paper Draping (Fashion Design with Paper)",
    category: "Department Flagship Events",
    type: "Individual",
    teamSize: { min: 1, max: 1 },
    department: "Department of Fashion & Apparel Design",
    club: "Fine Arts Club",
    time: "16th October 2025 | 10.00 AM onwards",
    dates: {
      inhouse: "8th October 2025",
      outside: "16th October 2025"
    },
    description: "Paper draping competition generally involve using only papers for the entire garment, with specific allowances for fasteners like thread or velcro, and sometimes other paper-based reinforcements.",
    eligibility: "Open to 9th, 10th, PU (11th & 12th), UG, and PG students.",
    rules: [
      "The dress has to be made only with paper, including all decorations and accessories. No plastic or shiny metallic paper allowed.",
      "You can stitch by hand or machine, and also use sprays/paints to add color or shine.",
      "Total time to finish is 2 hours.",
      "Judges will look for fresh and creative ideas in your design.",
      "Your outfit should match the given theme and look neat and appealing.",
      "Extra points for beauty, elegance, and smart use of paper. Judges' decision will be final."
    ],
    contacts: [
      { name: "Prof. Neethi G S", phone: "9999999998", role: "SPOC" },
      { name: "Ms. Sunitha N", phone: "7483333629", role: "Student In-Charge" },
      { name: "Sneha Das", phone: "9734746639", role: "Student In-Charge" }
    ]
  },
  {
    customId: "sweet-earthly-heritage-dessert-showcase",
    title: "Sweet Earthly Heritage (Dessert Showcase)",
    category: "Department Flagship Events",
    type: "Individual",
    teamSize: { min: 1, max: 1 },
    department: "Department of Hospitality Management and Catering Technology",
    club: "Club De' Gastronome",
    time: "16th October 2025 | 10.00 AM onwards",
    dates: {
      inhouse: "8th October 2025",
      outside: "16th October 2025"
    },
    description: "Sweet Earthly Heritage is a celebration of desserts that honor nature, tribe, and tradition. Participants can showcase their creativity through heritage recipes, regional specialties, fusion sweets, and modern plating styles—all with a focus on sustainability and authenticity. From classic Indian treats to innovative experiments, let your sweet story reflect the earth's rich legacy!",
    eligibility: "Open to 9th, 10th, PU (11th & 12th), UG, and PG students.",
    rules: [
      "9th & 10th Std: Traditional Indian Sweets, Healthy Sweets, No-Bake Treats, Chocolate-Based, and Decorative/Colorful Sweets.",
      "PU, UG & PG: Traditional Indian & Regional Specialties, Chocolate & Cocoa Desserts, Fruit-Infused, Fusion/Experimental, Western with Desi Twist, Healthy/Diet-Friendly, and Advanced Modern Plating.",
      "Participants must bring their own raw materials, utensils, and serving plates.",
      "Use of plastic or non-biodegradable materials is strictly prohibited.",
      "Dishes should be vegetarian (egg optional depending on ruleset).",
      "Judges' decision will be final and binding.",
      "Any misconduct, plagiarism of recipes, or violation of theme will lead to disqualification."
    ],
    contacts: [
      { name: "Prof. J. Srikanth", phone: "9999999997", role: "SPOC" },
      { name: "Keerthana B", phone: "9620753251", role: "Student In-Charge" },
      { name: "Varsha B", phone: "7760289057", role: "Student In-Charge" }
    ]
  },
  {
    customId: "visionx-tourism-challenge-virtual-tourism-contest",
    title: "VisionX Tourism Challenge (Virtual Tourism Contest)",
    category: "Department Flagship Events",
    type: "Group",
    teamSize: { min: 2, max: 3 },
    department: "Department of Tourism",
    club: "Travel and Adventure Club",
    time: "16th October 2025 | 11.00 AM onwards",
    dates: {
      inhouse: "8th October 2025",
      outside: "16th October 2025"
    },
    description: "Decode the Elements, Discover the Destination, Design with Virtual Reality! An innovative contest with three thrilling rounds: Tourism Elements Quest (Air, Water & Fire puzzles), Virtual Voyage (experience a destination through immersive Virtual Tourism), and VR Tourism Venture Challenge (step into a VR world and pitch a futuristic tourism product). A journey of knowledge, creativity, and visionary spirit in travel!",
    eligibility: "Open to 9th, 10th, PU (11th & 12th), UG, and PG students.",
    rules: [
      "The event consists of three rounds, each themed around the classical elements: Earth, Water, Fire, Air, and Space.",
      "All rounds will have a strict time limit.",
      "Round 1 will be the preliminary round; teams that qualify in Round 1 will proceed to Round 2 & 3. The decision of the judges and organizers will be final and binding.",
      "Use of mobile phones, or external assistance is strictly prohibited.",
      "Any form of plagiarism, misconduct, or violation of rules will lead to immediate disqualification.",
      "The organizers reserve the right to modify the rules or structure of any round if necessary."
    ],
    contacts: [
      { name: "Prof. Dheleepan G V", phone: "9999999996", role: "SPOC" },
      { name: "Tejas C", phone: "7204849359", role: "Student In-Charge" },
      { name: "Nithin Ryan A", phone: "9036076975", role: "Student In-Charge" }
    ]
  },
  {
    customId: "herb-a-thon-medicinal-plant-quiz",
    title: "Herb‑a‑thon (Medicinal Plant Quiz)",
    category: "Department Flagship Events",
    type: "Group",
    teamSize: { min: 2, max: 2 },
    department: "Department of Life Sciences",
    club: "Neuro Ninjas",
    time: "16th October 2025 | 11.00 AM onwards",
    dates: {
      inhouse: "8th October 2025",
      outside: "16th October 2025"
    },
    description: `Unleash your inner biochemist! Join our 3-round general Medicinal Plant Quiz, where you'll identify, elaborate, and decipher the healing powers of plants. From Ayurvedic wonders to modern marvels, showcase your knowledge.
Round 1: Phyto Blitz
Speed meets knowledge! Identify as many medicinal plants as you can within the time limit. The team that harvests the most correct answers qualifies for the next round!
Round 2: Brainy Herbscapes
Enter the Herb Escape Room! Solve fun puzzles about healing plants, find hidden clues, and unlock the way out before time runs out!
Round 3: Phyto-Ninja Spotlight
Showcase your expertise! Choose a medicinal plant and present its properties, uses, and benefits within a minute.`,
    eligibility: "Open to 9th, 10th, PU (11th & 12th), UG, and PG students.",
    rules: [
      "A valid School/University/College ID Card is mandatory for entry to the premises or to participate in any event",
      "Each team must consist of 2 members only.",
      "Teams will be awarded points after each round,",
      "At the end of every round, the lowest-scoring teams will be eliminated.The highest-scoring teams will advance to the next stage.",
      "In the third round, the top four teams will compete against each other.",
      "Arguments with judges, coordinators, or volunteers will lead to immediate disqualification."
    ],
    contacts: [
      { name: "Prof. Kesiya Joy", phone: "9999999995", role: "SPOC" },
      { name: "Nikhil Mani Maran", phone: "7022312902", role: "Student In-Charge" },
      { name: "Shanzae Azra", phone: "9686974648", role: "Student In-Charge" }
    ]
  },
  {
    customId: "startup-sparks-entrepreneurial-pitch",
    title: "Startup Sparks (Entrepreneurial Pitch)",
    category: "Department Flagship Events",
    type: "Group",
    teamSize: { min: 2, max: 3 },
    department: "Department of Management Studies (CMS)",
    club: "Managers Mavericks",
    time: "16th October 2025 | 12.00 PM onwards",
    dates: {
      inhouse: "8th October 2025",
      outside: "16th October 2025"
    },
    description: "Do you have a brilliant startup idea waiting to shine? Here's your chance to pitch it like a pro! In Startup Sparks, you and your team will step into the shoes of visionary entrepreneurs and present your ideas to our panel of \"Sharks.\" Convince them with your creativity, innovation, and confidence — and prove your tribe has the vision to lead the future!",
    eligibility: "Open to 9th, 10th, PU (11th & 12th), UG, and PG students.",
    rules: [
      "Teams must stick to the time limit.",
      "Round 1: Idea Drafting Real time crisis (Problem) (Screening Round), Round 2: The Pitch Battle (Finale)",
      "Plagiarized ideas (copied from internet) will not be entertained.",
      "All members must participate in the pitch, 2–3 members per team.",
      "Judges' decision is final, Theme- Elements (Air, Water, earth, Fire) Tribe has to be followed in the product development.",
      "All necessary stationery (Pens, colour pens and sketch pens), props, or presentation materials must be arranged by the participants themselves."
    ],
    contacts: [
      { name: "Prof. Manasa M P", phone: "9999999994", role: "SPOC" },
      { name: "M S Paari", phone: "9535933268", role: "Student In-Charge" },
      { name: "Sumaiya Kamal", phone: "8910173860", role: "Student In-Charge" }
    ]
  }
];

const updateAllEvents = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(config.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing events
    await Event.deleteMany({});
    console.log('Cleared existing events');

    // Insert all events
    const events = await Event.insertMany(eventsData);
    console.log(`Successfully seeded ${events.length} events`);

    // Log the created events by category
    const eventsByCategory = events.reduce((acc, event) => {
      if (!acc[event.category]) acc[event.category] = [];
      acc[event.category].push(event.title);
      return acc;
    }, {});

    Object.entries(eventsByCategory).forEach(([category, titles]) => {
      console.log(`\n${category}:`);
      titles.forEach(title => console.log(`  - ${title}`));
    });

  } catch (error) {
    console.error('Error seeding events:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
  }
};

// Run the script
updateAllEvents();
