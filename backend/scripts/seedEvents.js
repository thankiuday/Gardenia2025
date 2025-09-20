const mongoose = require('mongoose');
const Event = require('../models/Event');
const config = require('../config');

// Event data from the provided information
const eventsData = [
  {
    title: "Waves of the Mind (Psychology Challenge)",
    category: "Department Flagship Events",
    type: "Group",
    teamSize: { min: 2, max: 2 },
    department: "Department of Psychology",
    club: "Operation Smile Club & Mindfulness Club",
    time: "16th October 2025 | 10.00 AM onwards",
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
      { name: "Prof. Meghana K S", phone: "", role: "SPOC" },
      { name: "Simran Paranjape", phone: "9945131195", role: "Student In-Charge" },
      { name: "Arshad Shaik", phone: "9392484722", role: "Student In-Charge" }
    ]
  },
  {
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
      { name: "Prof. Neethi G S", phone: "", role: "SPOC" },
      { name: "Ms. Sunitha N", phone: "7483333629", role: "Student In-Charge" },
      { name: "Sneha Das", phone: "9734746639", role: "Student In-Charge" }
    ]
  },
  {
    title: "Box Cricket",
    category: "Sports Events",
    type: "Group",
    teamSize: { min: 6, max: 9 },
    department: "Sports Department",
    club: "",
    time: "16th October 2025",
    dates: {
      inhouse: "8th October 2025",
      outside: "16th October 2025"
    },
    description: "Played in a confined, enclosed space like a badminton court or a makeshift \"box,\" this format emphasizes clever deflections and quick running over power-hitting. The boundaries are low, and the game is incredibly fast-paced. Strategy is key, as players must use the walls and netting to score runs while avoiding getting caught.",
    eligibility: "Open to 9th, 10th, PU (11th & 12th), UG, and PG students.",
    rules: [
      "Each team consists of 6 players (with 3 substitutes).",
      "A match is typically 4-6 overs per innings as per the availability of time.",
      "Each bowler will get only two overs.",
      "Running is between two sets of stumps placed close together. No running on a wide or no-ball."
    ],
    contacts: [
      { name: "Kamal (Assistant Professor)", phone: "8095141810", role: "SPOC" },
      { name: "Rishi (student)", phone: "9128855086", role: "Student In-Charge" }
    ]
  }
];

const seedEvents = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(config.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing events
    await Event.deleteMany({});
    console.log('Cleared existing events');

    // Insert new events
    const events = await Event.insertMany(eventsData);
    console.log(`Successfully seeded ${events.length} events`);

    // Log the created events
    events.forEach(event => {
      console.log(`- ${event.title} (${event.category})`);
    });

  } catch (error) {
    console.error('Error seeding events:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

// Run the script
seedEvents();
