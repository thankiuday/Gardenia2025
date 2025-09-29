const mongoose = require('mongoose');
const Event = require('../models/Event');
const config = require('../config');

// Part 2: Remaining Department Flagship Events + Signature Events + Sports Events
const eventsDataPart2 = [
  // Remaining Department Flagship Events
  {
    customId: "ink-spire-25-poster-making-competition",
    title: "Ink-Spire – 25 (Poster Making Competition)",
    category: "Department Flagship Events",
    type: "Group",
    teamSize: { min: 2, max: 2 },
    department: "Department of Biotechnology",
    club: "Novo-Vita Club",
    time: "16th October 2025 | 10.00 AM onwards",
    dates: {
      inhouse: "8th October 2025",
      outside: "16th October 2025"
    },
    description: "Unleash your creativity in the On-the-Spot Poster/Meme Making Competition, where imagination meets expression! Participants will be challenged to translate their ideas into powerful visuals within a limited time. With the theme disclosed only at the start, this event will test not only your artistic skills but also your ability to think quickly and creatively. Armed with nothing but colors, brushes, and originality, participants must craft a poster that is impactful, meaningful, and visually striking. Whether you're an artist at heart or a science enthusiast with a flair for design, this is your chance to showcase your vision in vibrant strokes.",
    eligibility: "Open to 9th, 10th, PU (11th & 12th), UG, and PG students.",
    rules: [
      "No individual Entries will be accepted.",
      "Time limit: 60 minutes; posters must be completed within the given time.",
      "Theme will be revealed on the spot and must be strictly followed.",
      "Only manual work is allowed – no printouts, stencils, or digital designs.",
      "Drawing sheet will be provided.",
      "Posters will be judged on creativity, originality, relevance, neatness, and impact.",
      "Winner and Runner up will be selected based on scores (Total Points – 100)"
    ],
    contacts: [
      { name: "Prof. Anjana Menon", phone: "", role: "SPOC" },
      { name: "Varshini", phone: "99001189012", role: "Student In-Charge" },
      { name: "Chandana", phone: "9972015131", role: "Student In-Charge" },
      { name: "Vismaya", phone: "9353244284", role: "Student In-Charge" }
    ]
  },
  {
    customId: "snackvertise-food-themed-advertising",
    title: "SnackVertise (Food-themed Advertising)",
    category: "Department Flagship Events",
    type: "Group",
    teamSize: { min: 2, max: 4 },
    department: "Department of Food Technology",
    club: "Green Club",
    time: "16th October 2025 | 01.00 PM onwards",
    dates: {
      inhouse: "8th October 2025",
      outside: "16th October 2025"
    },
    description: "Food and fun go hand in hand! SnackVertise is a lively platform where students step into the shoes of marketers to create witty, creative, and entertaining ads for food products. Ads can feature real, imaginary, or futuristic foods, blending imagination, humor, and teamwork. The event has two exciting rounds: Round 1 – Creative Pitch: Each team gets a random food item (like chips, fruit, or juice box) and must present a 30-second sales pitch on the spot. Judges will select the most spontaneous and original ideas. Round 2 – Advertisement Show: Shortlisted teams perform a 3-minute ad skit for a food product of their choice. They can use props, jingles, slogans, roleplay, or mini demos to impress the audience.",
    eligibility: "Open to students of 9th, 10th, PU (11th & 12th), UG, and PG levels.",
    rules: [
      "Teams must stick to the time limit: Pitch – 30 sec, Performance – 2–3 min.",
      "Ads must be original and food-focused; vulgar or offensive content leads to disqualification.",
      "Each team will receive surprise food props, and at least one must be included.",
      "Teams may bring simple, safe props of their own.",
      "All members must actively participate in the performance.",
      "Judges' decision will be final; arguments or misconduct will result in disqualification.",
      "Use of hazardous items (fire, liquids, live animals, etc.) is strictly prohibited."
    ],
    contacts: [
      { name: "Prof. Meghana K P", phone: "", role: "SPOC" },
      { name: "Prahalad", phone: "7337810707", role: "Student In-Charge" },
      { name: "Gungun", phone: "7880595519", role: "Student In-Charge" }
    ]
  },
  {
    customId: "cell-survivor-life-sciences-challenge",
    title: "Cell Survivor (Life Sciences Challenge)",
    category: "Department Flagship Events",
    type: "Group",
    teamSize: { min: 4, max: 4 },
    department: "Department of Life Sciences",
    club: "Novovita",
    time: "16th October 2025 | 03.00 PM onwards",
    dates: {
      inhouse: "8th October 2025",
      outside: "16th October 2025"
    },
    description: "Teams of 2–4 players compete to create a functioning cell/organism and dominate the ecosystem in 60–90 minutes. Using challenge cards (DNA puzzles, disease outbreaks, predator-prey scenarios), resource tokens (ATP, glucose, amino acids), and mutation cards (beneficial/harmful traits), players must build, adapt, and survive. Round 1 – Cell Building: Collect organelle cards (mitochondria, ribosomes, etc.) by solving questions. Choose features like metabolism, reproduction, defense, and symbiosis to design your organism. Round 2 – Resource Wars: Compete for resources while linking your organism to real-world relevance—diseases, food, agriculture, ecological cycles, or pharma importance. Round 3 – Final Showdown: Craft a narrative for your organism's purpose—curing diseases, cleaning oceans, surviving new planets, or thriving through mutations. Winning: Fastest completion + most correct answers = champion team!",
    eligibility: "Open to 9th, 10th, PU (11th & 12th), UG, and PG students.",
    rules: [
      "The event is open to all currently enrolled Undergraduate (UG) and Postgraduate (PG) students in Life Sciences or related fields.",
      "Participants must register in teams of 4",
      "All participants must have a valid student ID.",
      "Registration is mandatory. Slots are filled on a first-come, first-served basis."
    ],
    contacts: [
      { name: "Prof. Ann Irene D", phone: "", role: "SPOC" },
      { name: "Ms. Rashmi", phone: "", role: "Student co-ordinator – College-level" },
      { name: "Ms. Muskan", phone: "", role: "Student co-ordinator – School-level" }
    ]
  },
  {
    customId: "decoding-life-bioinformatics-beyond-boundaries-bioquest",
    title: "Decoding Life: Bioinformatics Beyond Boundaries (BioQuest)",
    category: "Department Flagship Events",
    type: "Group",
    teamSize: { min: 1, max: 3 },
    department: "Department of Bioinformatics",
    club: "Research Club",
    time: "16th October 2025 | 11.00 AM onwards",
    dates: {
      inhouse: "8th October 2025",
      outside: "16th October 2025"
    },
    description: "This competition is designed to spark creativity and encourage students to connect science with design and communication. It provides a platform for participants to express complex biological ideas in a simple, engaging, and visually appealing manner. For School Students (9th–12th), the focus is on the exciting world of bioinformatics. Students of classes 9 and 10 will explore the applications of bioinformatics in agriculture, such as improving crop yield, disease resistance, and sustainable farming. Students of classes 11 and 12 will highlight applications of bioinformatics in healthcare, like personalized medicine, genetic research, and disease prediction. The aim is to blend scientific knowledge with creativity so that the posters or infographics can both inform and inspire. For Undergraduate and Postgraduate students, the challenge takes a technological turn with the App Development Idea Poster Competition. Participants will present a unique app concept that integrates biology and technology. The posters should explain the idea, outline the features of the app, and showcase its possible impact on society.",
    eligibility: "Open to 9th, 10th, PU (11th & 12th), UG, and PG students.",
    rules: [
      "Posters may be individual or team. Team size: 2–3 students.",
      "Ideas/posters must be original and aligned with theme.",
      "9th-12th students-Posters should be A2 size; Charts of any size; digital infographics also allowed.",
      "UG-PG students - Posters should clearly describe the app idea, its functionality, and potential benefits.",
      "Judges' decision will be final."
    ],
    contacts: [
      { name: "Dr.Chenmugil", phone: "9865339695", role: "SPOC" },
      { name: "Achsah J Bethala", phone: "8464008484", role: "Student In-Charge" },
      { name: "Pavithra", phone: "7288933123", role: "Student In-Charge" },
      { name: "Krutika", phone: "6361416247", role: "Student In-Charge" },
      { name: "Calvin Mathew", phone: "8105561591", role: "Student In-Charge" }
    ]
  },
  {
    customId: "elemental-path-to-power-physiotherapy-fitness-games",
    title: "Elemental Path to Power (Physiotherapy Fitness Games)",
    category: "Department Flagship Events",
    type: "Individual",
    teamSize: { min: 1, max: 1 },
    department: "Department of Physiotherapy",
    club: "Agility Club",
    time: "16th October 2025 | 03.00 PM onwards",
    dates: {
      inhouse: "8th October 2025",
      outside: "16th October 2025"
    },
    description: "This electrifying competition features three action-packed challenges—the Battle Rope Power Wave, where school and college participants test their endurance by creating continuous rope waves against time with every up-and-down counted; the Tribal T-Path Challenge, a thrilling sprint through sharp side-shuffles, forward dashes, and backward runs as the clock decides the fastest and most agile competitor; and the Wobble Basket Challenge, which combines balance and accuracy as participants stand steady on a wobble board for 30 seconds while shooting basketballs, earning points for both stability and successful throws—together forming an ultimate test of strength, speed, skill, and focus in a high-energy showcase of competitive spirit.",
    eligibility: "Open to 9th, 10th, PU (11th & 12th), UG, and PG students.",
    rules: [
      "Participants must strictly follow the instructions and starting signals (whistle/\"Go\" command) given by the referee.",
      "Each participant must perform the activities individually; no external assistance is allowed.",
      "For Battle Rope Power Wave, the wave must be continuous and alternate; incomplete or paused waves will not be counted.",
      "For Elemental T-Path Challenge, participants must touch/cross every cone in sequence; skipping a cone leads to disqualification.",
      "For Wobble Basket Challenge, stepping off the wobble board will result in loss of balance points.",
      "Time limits must be strictly followed; overtime attempts will not be considered for scoring.",
      "Judges' decision regarding scores, timing, and rule compliance will be final and binding."
    ],
    contacts: [
      { name: "Dr. Thillaivignesh (PT)", phone: "", role: "SPOC" },
      { name: "Nima Susan John", phone: "9363454325", role: "Student In-Charge" },
      { name: "Sai Pavan", phone: "8431336695", role: "Student In-Charge" }
    ]
  },
  {
    customId: "gene-o-mania-genetics-quest",
    title: "Gene-O-Mania (Genetics Quest)",
    category: "Department Flagship Events",
    type: "Group",
    teamSize: { min: 2, max: 4 },
    department: "Department of Genetics",
    club: "Science Club",
    time: "16th October 2025 | 02.00 PM onwards",
    dates: {
      inhouse: "8th October 2025",
      outside: "16th October 2025"
    },
    description: "Gene-O-Mania is a fun and futuristic stage where science meets imagination! Students are invited to craft quirky yet logical concepts inspired by genetics and present them through mock advertisements, skits, or live demos. From DNA-powered energy drinks and glow-in-the-dark plants to mutation-proof gadgets and genetically engineered pets, participants can let their ideas run wild while keeping a clear link to genetic principles. The event is all about blending creativity, scientific understanding, and performance. In Round 1: Gene Pitch, teams will be given a random genetic element (like CRISPR, mutations, or plasmids) and must deliver a 30-second invention pitch. The most original and logical ideas will move to Round 2: Genetic Ad/Innovation Show, where teams present a 3-minute skit or ad for their fictional genetic product. Humor, innovation, and teamwork will be key. Props such as lab coats, toy microscopes, or DNA models will be provided on the spot to spark creativity, and participants can bring their own as well. The aim is not professional acting, but to showcase wit, imagination, and science in an entertaining way.",
    eligibility: "Open to 9th, 10th, PU (11th & 12th), UG, and PG students.",
    rules: [
      "Time: Pitch – 30 secs; Performance – 2–3 mins (max 3+2 mins).",
      "Entries must be original and scientifically relevant.",
      "Humor is welcome, but offensive or illogical claims will be disqualified.",
      "Props: safe items only; at least one surprise prop must be used.",
      "All team members must participate actively.",
      "Judges will score on: Creativity & Originality (30), Scientific Relevance (25), Humor & Entertainment (25), Presentation & Teamwork (20).",
      "Misconduct or arguing with judges leads to disqualification."
    ],
    contacts: [
      { name: "Dr. Shefali Raizada", phone: "7795429215", role: "SPOC" },
      { name: "Ms Druthi", phone: "8088134017", role: "Student In-Charge" },
      { name: "Ms Varshini", phone: "9901189012", role: "Student In-Charge" },
      { name: "Mr Ansh", phone: "8653049440", role: "Student In-Charge" }
    ]
  }
];

const seedCompleteEventsPart2 = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(config.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Insert remaining events
    const events = await Event.insertMany(eventsDataPart2);
    console.log(`Successfully seeded ${events.length} additional events`);

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
seedCompleteEventsPart2();
