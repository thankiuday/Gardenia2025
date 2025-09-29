const mongoose = require('mongoose');
const Event = require('../models/Event');
const config = require('../config');

// Complete events data with ALL events from the provided information
const allEventsData = [
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
  },
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

const seedAllCompleteEvents = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(config.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing events
    await Event.deleteMany({});
    console.log('Cleared existing events');

    // Insert all events
    const events = await Event.insertMany(allEventsData);
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

    console.log('\n✅ All events seeded successfully!');
    console.log('🎯 The filtering issue should now be resolved.');
    console.log('📊 Total events by category:');
    Object.entries(eventsByCategory).forEach(([category, titles]) => {
      console.log(`   ${category}: ${titles.length} events`);
    });

  } catch (error) {
    console.error('Error seeding events:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
  }
};

// Run the script
seedAllCompleteEvents();
