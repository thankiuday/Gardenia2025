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
      { name: "Prof. Meghana K S", phone: "", role: "SPOC" },
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
      { name: "Prof. Neethi G S", phone: "", role: "SPOC" },
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
      { name: "Prof. J. Srikanth", phone: "", role: "SPOC" },
      { name: "Keerthana B", phone: "9620753251", role: "Student In-Charge" },
      { name: "Varsha B", phone: "7760289057", role: "Student In-Charge" }
    ]
  },
  {
    customId: "visionx-tourism-challenge-virtual-tourism-contest",
    title: "VisionX Tourism Challenge (Virtual Tourism Contest)",
    category: "Department Flagship Events",
    type: "Group",
    teamSize: { min: 2, max: 4 },
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
      { name: "Prof. Dheleepan G V", phone: "", role: "SPOC" },
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
      "At the end of every round, the lowest-scoring teams will be eliminated. The highest-scoring teams will advance to the next stage.",
      "In the third round, the top four teams will compete against each other.",
      "Arguments with judges, coordinators, or volunteers will lead to immediate disqualification."
    ],
    contacts: [
      { name: "Prof. Kesiya Joy", phone: "", role: "SPOC" },
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
      { name: "Prof. Manasa M P", phone: "", role: "SPOC" },
      { name: "M S Paari", phone: "9535933268", role: "Student In-Charge" },
      { name: "Sumaiya Kamal", phone: "8910173860", role: "Student In-Charge" }
    ]
  },
  {
    customId: "whispers-of-air-book-reading-contest",
    title: "Whispers of Air (A Book Reading Contest)",
    category: "Department Flagship Events",
    type: "Individual",
    teamSize: { min: 1, max: 1 },
    department: "Department of English",
    club: "DEAR Club",
    time: "16th October 2025 | 01.00 PM onwards",
    dates: {
      inhouse: "8th October 2025",
      outside: "16th October 2025"
    },
    description: "Whispers of Air: A Book Reading Competition is a celebration of the written word, designed to nurture the love for reading, comprehension, and expression among participants. Rooted in the elemental theme of \"Air,\" the competition highlights the power of stories and wisdom carried through words, much like whispers traveling on the breeze.",
    eligibility: "Open to 9th, 10th, PU (11th & 12th), UG, and PG students.",
    rules: [
      "Preliminary: reading of a selected passage.",
      "Interpretation: brief reflection/explanation.",
      "Final: dramatic/expressive reading (poetry/prose).",
      "Time limit per reading: 3–5 minutes; published texts only.",
      "Offensive or inappropriate content is prohibited.",
      "Judges' decision is final."
    ],
    contacts: [
      { name: "Dr. Suguna R", phone: "", role: "SPOC" },
      { name: "Rafiya", phone: "6005287542", role: "Student In-Charge" },
      { name: "Gaijean Gangmei", phone: "8413935481", role: "Student In-Charge" }
    ]
  },
  {
    customId: "chasing-shadows-forensic-science-challenge",
    title: "Chasing Shadows (Forensic Science Challenge)",
    category: "Department Flagship Events",
    type: "Group",
    teamSize: { min: 3, max: 3 },
    department: "Department of Forensic Science",
    club: "Detective Club",
    time: "16th October 2025 | 12.00 PM onwards",
    dates: {
      inhouse: "8th October 2025",
      outside: "16th October 2025"
    },
    description: "Step into the world of suspense! This event consisting of three structured rounds. Participants will engage in visual and audio-based crime scene analysis, suspense-oriented challenges, and laser-based games. Teams must interpret shadow clues and use provided hints to identify and chase the culprit.",
    eligibility: "Open to 9th, 10th, PU (11th & 12th), UG, and PG students.",
    rules: [
      "The group should consist of three members.",
      "Any number of groups from same school/college is allowed.",
      "First round is preliminary where visual related game is conducted showcasing their observational talents.",
      "Only top 10 teams will be further taken for second round where participants are required to show their skills in hiding and recognising Forensic evidences.",
      "Best three teams will moved to final round experiencing tech- based crime scene.",
      "Judges' decision is final."
    ],
    contacts: [
      { name: "Prof. Rakesh V", phone: "", role: "SPOC" },
      { name: "Harshini", phone: "9701852811", role: "Student In-Charge" },
      { name: "Abraham", phone: "9347985357", role: "Student In-Charge" }
    ]
  },
  {
    customId: "prompt-a-thon-ai-prompt-engineering",
    title: "Prompt‑a‑thon (AI Prompt Engineering)",
    category: "Department Flagship Events",
    type: "Group",
    teamSize: { min: 2, max: 3 },
    department: "Department of Dr. APJ Abdul Kalam School of Engineering",
    club: "King Coders",
    time: "16th October 2025 | 02.00 PM onwards",
    dates: {
      inhouse: "8th October 2025",
      outside: "16th October 2025"
    },
    description: "Solve real‑world problems using prompt engineering—teams craft effective prompts to drive AI tools across Supply Chain, Climate Change, and Finance rounds.",
    eligibility: "Open to 9th, 10th, PU (11th & 12th), UG, and PG students.",
    rules: [
      "Teams of 2–3; valid ID mandatory; bring your own laptops.",
      "Online registration; onsite participation at GCU OMR Campus.",
      "Rounds: Supply Chain (20 min), Climate Change (30 min), Finance (45 min).",
      "Judging: Creativity & Innovation, Clarity & Precision, Relevance & Practicality, Impact & Feasibility.",
      "Prizes and certificates for top teams.",
      "Judges' decision is final."
    ],
    contacts: [
      { name: "Dr. C. Jayakumar", phone: "", role: "SPOC" },
      { name: "Rahul", phone: "8217086320", role: "Student In-Charge" },
      { name: "Varun", phone: "7019884239", role: "Student In-Charge" }
    ]
  },
  {
    customId: "frames-of-the-elements-short-film-competition",
    title: "Frames of the Elements (Short Film Competition)",
    category: "Department Flagship Events",
    type: "Group",
    teamSize: { min: 1, max: 4 },
    department: "Department of Media Studies",
    club: "Film and Photography club",
    time: "16th October 2025 | 01.00 PM onwards",
    dates: {
      inhouse: "8th October 2025",
      outside: "16th October 2025"
    },
    description: "Frames of the Elements is a Short Film Competition which provides a platform for young filmmakers to showcase their creativity and technical skills. The theme \"Elements – Earth, Water, Fire, Air, and Space\" invites participants to explore human stories, environmental issues, cultural expressions, and imaginative ideas through the lens of the five elements. Films may be documentary, fictional or experimental but must reflect the theme in some form. This event will combine storytelling, cinematography, editing, and sound design, allowing students to express their creativity through the powerful medium of film.",
    eligibility: "Open to 9th, 10th, PU (11th & 12th), UG, and PG students.",
    rules: [
      "Participation can be individual or in teams of up to 4 members; short films must be submitted by 10th October to (https://forms.gle/EhUdYp5WKXqreCreA)",
      "Each short film must not exceed 10 minutes in duration.",
      "The chosen theme (Earth, Water, Fire, Air, or Space) must be clearly represented.",
      "All content must be original, respectful, and free of plagiarism, offensive, or discriminatory material.",
      "Use of copyrighted music/footage is strictly prohibited; only royalty-free content is allowed.",
      "Any misconduct or rule violation will lead to disqualification; judges' decisions are final."
    ],
    contacts: [
      { name: "Prof. Kaushik P Kanchan", phone: "", role: "SPOC" },
      { name: "Priyanshu Sarkar", phone: "9123689627", role: "Student In-Charge" },
      { name: "Pavan Dilliraj", phone: "6361679614", role: "Student In-Charge" }
    ]
  },
  {
    customId: "ignite-the-market-finance-commerce-strategy",
    title: "Ignite the market (Finance & Commerce Strategy)",
    category: "Department Flagship Events",
    type: "Group",
    teamSize: { min: 3, max: 4 },
    department: "Department of Commerce",
    club: "Finance and Investment Club",
    time: "16th October 2025 | 03.00 PM onwards",
    dates: {
      inhouse: "8th October 2025",
      outside: "16th October 2025"
    },
    description: "Step into the thrilling world of commerce with 'Ignite the Market' – an event designed to blend finance, strategy, and negotiation. Students will experience the excitement of building portfolios, testing their valuation skills, and decision-making power. The team that masters the art of creating maximum wealth will emerge as the ultimate winner!",
    eligibility: "Open to 9th, 10th, PU (11th & 12th), UG, and PG students.",
    rules: [
      "Each team must consist of 3–4 members.",
      "Teams will be provided with a fixed virtual capital at the start of the event.",
      "The event will be conducted in multiple rounds under the supervision of the organizers.",
      "Teams are expected to actively participate and follow the instructions of the Auctioneer/Organizers.",
      "Once a decision is made by the Auctioneer/Organizers, it will be final and binding.",
      "Use of mobile phones or electronic gadgets is strictly prohibited unless permitted by organizers.",
      "Any misconduct or unfair practice may lead to disqualification."
    ],
    contacts: [
      { name: "Prof. Sushmitha J", phone: "", role: "SPOC" },
      { name: "Deepika S Choudary", phone: "7406927597", role: "Student In-Charge" },
      { name: "Rahul Sen", phone: "6363319729", role: "Student In-Charge" }
    ]
  },
  {
    customId: "brain-bytes-puzzle-solving-with-digi-coins",
    title: "Brain Bytes (Puzzle-solving with Digi Coins)",
    category: "Department Flagship Events",
    type: "Individual",
    teamSize: { min: 1, max: 1 },
    department: "Department of Computational Science & IT",
    club: "IT Club",
    time: "16th October 2025 | 02.00 PM onwards",
    dates: {
      inhouse: "8th October 2025",
      outside: "16th October 2025"
    },
    description: "Brain bytes is an interactive puzzle-solving game where players explore, scan QR codes, and solve challenges under a time limit. Each QR unlocks a puzzle and solving it may reward the player with a Digi coin. Out of 10 QR codes, only 5 contain coins. The winner is the first player to collect all 5 coins or the one with the most coins when time runs out.",
    eligibility: "Open to 9th, 10th, PU (11th & 12th), UG, and PG students.",
    rules: [
      "Each player will be given 10 QR codes placed in the venue.",
      "Scanning a QR will open a puzzle (logic, coding, riddle, or problem-solving).",
      "Only 5 QR codes contain Digi coins. The rest will only have puzzles with no coins.",
      "The time limit is 10 minutes per player.",
      "Players must solve the puzzle correctly to claim the coin.",
      "Cheating, collaboration, or using external help is strictly prohibited.",
      "Respectful behaviour is mandatory; disruptive conduct may lead to disqualification."
    ],
    contacts: [
      { name: "Prof. Bhagyalakshmi H N", phone: "", role: "SPOC" },
      { name: "Bharath V", phone: "8618463182", role: "Student In-Charge" },
      { name: "Nitish Kumar S", phone: "9380710744", role: "Student In-Charge" }
    ]
  }
];

const seedCompleteEvents = async () => {
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
seedCompleteEvents();
