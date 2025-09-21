const mongoose = require('mongoose');
const Event = require('../models/Event');
const config = require('../config');

// All 35 events from the frontend data
const eventsData = [
  // Department Flagship Events
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
      { name: "Prof. Meghana K S", phone: "9999999999", role: "SPOC" },
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
      { name: "Prof. Neethi G S", phone: "9999999998", role: "SPOC" },
      { name: "Ms. Sunitha N", phone: "7483333629", role: "Student In-Charge" },
      { name: "Sneha Das", phone: "9734746639", role: "Student In-Charge" }
    ]
  },
  {
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
    title: "Whispers of Air (A Book Reading Contest)",
    category: "Department Flagship Events",
    type: "Individual",
    teamSize: { min: 1, max: 1 },
    department: "Department of English",
    club: "DEAR Club",
    time: "16th October 2025 | 10.00 AM onwards",
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
      { name: "Dr. Suguna R", phone: "9999999996", role: "SPOC" },
      { name: "Rafiya", phone: "6005287542", role: "Student In-Charge" },
      { name: "Gaijean Gangmei", phone: "8413935481", role: "Student In-Charge" }
    ]
  },
  {
    title: "Chasing Shadows (Forensic Science Challenge)",
    category: "Department Flagship Events",
    type: "Group",
    teamSize: { min: 3, max: 3 },
    department: "Department of Forensic Science",
    club: "Detective Club",
    time: "16th October 2025 | 10.00 AM onwards",
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
      { name: "Prof. Rakesh V", phone: "9999999995", role: "SPOC" },
      { name: "Harshini", phone: "9701852811", role: "Student In-Charge" },
      { name: "Abraham", phone: "9347985357", role: "Student In-Charge" }
    ]
  },
  {
    title: "Prompt‑a‑thon (AI Prompt Engineering)",
    category: "Department Flagship Events",
    type: "Group",
    teamSize: { min: 2, max: 3 },
    department: "Department of Dr. APJ Abdul Kalam School of Engineering",
    club: "King Coders",
    time: "16th October 2025 | 10.00 AM onwards",
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
      { name: "Dr. C. Jayakumar", phone: "9999999994", role: "SPOC" },
      { name: "Rahul", phone: "8217086320", role: "Student In-Charge" },
      { name: "Varun", phone: "7019884239", role: "Student In-Charge" }
    ]
  },
  {
    title: "Frames of the Elements (Short Film Competition)",
    category: "Department Flagship Events",
    type: "Group",
    teamSize: { min: 1, max: 4 },
    department: "Department of Media Studies",
    club: "Film and Photography club",
    time: "16th October 2025 | 10.00 AM onwards",
    dates: {
      inhouse: "8th October 2025",
      outside: "16th October 2025"
    },
    description: "Frames of the Elements is a Short Film Competition which provides a platform for young filmmakers to showcase their creativity and technical skills. The theme \"Elements – Earth, Water, Fire, Air, and Space\" invites participants to explore human stories, environmental issues, cultural expressions, and imaginative ideas through the lens of the five elements. Films may be documentary, fictional or experimental but must reflect the theme in some form. This event will combine storytelling, cinematography, editing, and sound design, allowing students to express their creativity through the powerful medium of film.",
    eligibility: "Open to 9th, 10th, PU (11th & 12th), UG, and PG students.",
    rules: [
      "Participation can be individual or in teams of up to 4 members; short films must be submitted by 10th October.",
      "Each short film must not exceed 10 minutes in duration.",
      "The chosen theme (Earth, Water, Fire, Air, or Space) must be clearly represented.",
      "All content must be original, respectful, and free of plagiarism, offensive, or discriminatory material.",
      "Use of copyrighted music/footage is strictly prohibited; only royalty-free content is allowed.",
      "Any misconduct or rule violation will lead to disqualification; judges' decisions are final."
    ],
    contacts: [
      { name: "Prof. Kaushik P Kanchan", phone: "9999999993", role: "SPOC" },
      { name: "Priyanshu Sarkar", phone: "9123689627", role: "Student In-Charge" },
      { name: "Pavan Dilliraj", phone: "6361679614", role: "Student In-Charge" }
    ]
  },
  {
    title: "Ignite the market (Finance & Commerce Strategy)",
    category: "Department Flagship Events",
    type: "Group",
    teamSize: { min: 3, max: 4 },
    department: "Department of Commerce",
    club: "Finance and Investment Club",
    time: "16th October 2025 | 10.00 AM onwards",
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
      { name: "Prof. Sushmitha J", phone: "9999999992", role: "SPOC" },
      { name: "Deepika S Choudary", phone: "7406927597", role: "Student In-Charge" },
      { name: "Rahul Sen", phone: "6363319729", role: "Student In-Charge" }
    ]
  },
  {
    title: "Brain Bytes (Puzzle-solving with Digi Coins)",
    category: "Department Flagship Events",
    type: "Individual",
    teamSize: { min: 1, max: 1 },
    department: "Department of Computational Science & IT",
    club: "IT Club",
    time: "16th October 2025 | 10.00 AM onwards",
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
      { name: "Prof. Bhagyalakshmi H N", phone: "9999999991", role: "SPOC" },
      { name: "Bharath V", phone: "8618463182", role: "Student In-Charge" },
      { name: "Nitish Kumar S", phone: "9380710744", role: "Student In-Charge" }
    ]
  },
  {
    title: "Ink-Spire – 25 (Poster Making Competition)",
    category: "Department Flagship Events",
    type: "Group",
    teamSize: { min: 2, max: 2 },
    department: "Department of Biotechnology",
    club: "Novo-Vita Club",
    time: "16th October 2025",
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
      { name: "Anjana Menon", phone: "9886858414", role: "SPOC" },
      { name: "Varshini", phone: "99001189012", role: "Student In-Charge" },
      { name: "Chandana", phone: "9972015131", role: "Student In-Charge" },
      { name: "Vismaya", phone: "9353244284", role: "Student In-Charge" }
    ]
  },
  {
    title: "SnackVertise (Food-themed Advertising)",
    category: "Department Flagship Events",
    type: "Group",
    teamSize: { min: 2, max: 2 },
    department: "Department of Food Technology",
    club: "Green Club",
    time: "16th October 2025",
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
      { name: "Meghana K P", phone: "9448866127", role: "SPOC" },
      { name: "Prahalad", phone: "7337810707", role: "Student In-Charge" },
      { name: "Gungun", phone: "7880595519", role: "Student In-Charge" }
    ]
  },
  {
    title: "Cell Survivor (Life Sciences Challenge)",
    category: "Department Flagship Events",
    type: "Group",
    teamSize: { min: 2, max: 4 },
    department: "Department of Life Sciences",
    club: "Novovita",
    time: "16th October 2025",
    dates: {
      inhouse: "8th October 2025",
      outside: "16th October 2025"
    },
    description: "Teams of 2–4 players compete to create a functioning cell/organism and dominate the ecosystem in 60–90 minutes. Using challenge cards (DNA puzzles, disease outbreaks, predator-prey scenarios), resource tokens (ATP, glucose, amino acids), and mutation cards (beneficial/harmful traits), players must build, adapt, and survive.",
    eligibility: "Open to 9th, 10th, PU (11th & 12th), UG, and PG students.",
    rules: [
      "The event is open to all currently enrolled Undergraduate (UG) and Postgraduate (PG) students in Life Sciences or related fields.",
      "Participants must register in teams of 4",
      "All participants must have a valid student ID.",
      "Registration is mandatory. Slots are filled on a first-come, first-served basis."
    ],
    contacts: [
      { name: "Ms. Ann", phone: "8792343437", role: "SPOC" },
      { name: "Ms. Rashmi", phone: "9999999990", role: "Student In-Charge" },
      { name: "Ms. Muskan", phone: "9999999989", role: "Student In-Charge" }
    ]
  },
  {
    title: "Decoding Life: Bioinformatics Beyond Boundaries (BioQuest)",
    category: "Department Flagship Events",
    type: "Group",
    teamSize: { min: 2, max: 3 },
    department: "Department of Bioinformatics",
    club: "Research Club",
    time: "16th October 2025",
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
    title: "Elemental Path to Power (Physiotherapy Fitness Games)",
    category: "Department Flagship Events",
    type: "Individual",
    teamSize: { min: 1, max: 1 },
    department: "Department of Physiotherapy",
    club: "Agility Club",
    time: "16th October 2025 | 10.00 AM onwards",
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
      { name: "Dr. Thillaivignesh (PT)", phone: "9999999988", role: "SPOC" },
      { name: "Nima Susan John", phone: "9363454325", role: "Student In-Charge" },
      { name: "Sai Pavan", phone: "8431336695", role: "Student In-Charge" }
    ]
  },
  {
    title: "Gene-O-Mania (Genetics Quest)",
    category: "Department Flagship Events",
    type: "Group",
    teamSize: { min: 2, max: 2 },
    department: "Department of Genetics",
    club: "Science Club",
    time: "16th October 2025",
    dates: {
      inhouse: "8th October 2025",
      outside: "16th October 2025"
    },
    description: "Gene-O-Mania is a fun and futuristic stage where science meets imagination! Students are invited to craft quirky yet logical concepts inspired by genetics and present them through mock advertisements, skits, or live demos. From DNA-powered energy drinks and glow-in-the-dark plants to mutation-proof gadgets and genetically engineered pets, participants can let their ideas run wild while keeping a clear link to genetic principles. The event is all about blending creativity, scientific understanding, and performance.",
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
  },
  // Signature Events
  {
    title: "Rhythmic Elements (Group Dance)",
    category: "Signature Events",
    type: "Group",
    teamSize: { min: 4, max: 8 },
    department: "Shuffle Dance Club",
    club: "Shuffle Dance Club",
    time: "17th October 2025 | 10.00 AM onwards",
    dates: {
      inhouse: "8th October 2025",
      outside: "17th October 2025"
    },
    description: "A high‑energy group dance contest celebrating synchronization, teamwork, and elemental themes across styles.",
    eligibility: "Open to 9th, 10th, PU (11th & 12th), UG, and PG students.",
    rules: [
      "Team size: 4–8 members.",
      "Time: 5 + 2 minutes.",
      "Submit songs 48 hours prior.",
      "No powder, fire, water, or unsafe props.",
      "Vulgarity leads to disqualification.",
      "Judges' decision is final."
    ],
    contacts: [
      { name: "Prof. Pakiyaraj M", phone: "9999999987", role: "SPOC" },
      { name: "Prerana Sharma", phone: "9590429150", role: "Student In-Charge" },
      { name: "Salva", phone: "8310222642", role: "Student In-Charge" }
    ]
  },
  {
    title: "Face Painting",
    category: "Signature Events",
    type: "Group",
    teamSize: { min: 2, max: 2 },
    department: "Fine Arts",
    club: "Fine Arts Club",
    time: "17th October 2025 | 10.00 AM onwards",
    dates: {
      inhouse: "8th October 2025",
      outside: "17th October 2025"
    },
    description: "Teams transform faces into vibrant canvases capturing the Five Elements.",
    eligibility: "Open to 9th, 10th, PU (11th & 12th), UG, and PG students.",
    rules: [
      "Team of 2: one Painter + one Model.",
      "Only the face may be painted; no stencils/stickers.",
      "Bring non‑toxic, skin‑safe paints and tools.",
      "Judging: Creativity, Theme Relevance, Technique, Visual Impact.",
      "Obscene or inappropriate artwork will be disqualified.",
      "Judges' decision is final."
    ],
    contacts: [
      { name: "Prof. Manasa Gowda", phone: "9999999986", role: "SPOC" },
      { name: "Afeef Muhammad", phone: "9791489897", role: "Student In-Charge" },
      { name: "Bhumika Poovappa", phone: "6360697280", role: "Student In-Charge" }
    ]
  },
  {
    title: "SoloVerse (Solo Dance)",
    category: "Signature Events",
    type: "Individual",
    teamSize: { min: 1, max: 1 },
    department: "Dance",
    club: "Dance Club",
    time: "17th October 2025 | 10.00 AM onwards",
    dates: {
      inhouse: "8th October 2025",
      outside: "17th October 2025"
    },
    description: "A solo dance celebration of Fire, Water, Air, Space, and Earth—express your element through movement.",
    eligibility: "Open to 9th, 10th, PU (11th & 12th), UG, and PG students.",
    rules: [
      "Choose at least one element to represent.",
      "Time: 3 + 1 minutes.",
      "Any dance style allowed.",
      "No hazardous materials; proper attire required.",
      "Inappropriate gestures or attire lead to disqualification.",
      "Judges' decision is final."
    ],
    contacts: [
      { name: "Dr. Gowtham Devanoor P", phone: "9999999985", role: "SPOC" },
      { name: "Supreeth B K", phone: "9353306062", role: "Student In-Charge" },
      { name: "Manashi Daityar", phone: "9362762159", role: "Student In-Charge" }
    ]
  },
  {
    title: "Soulful Singing – Solo Category",
    category: "Signature Events",
    type: "Individual",
    teamSize: { min: 1, max: 1 },
    department: "Music",
    club: "Music Club",
    time: "17th October 2025 | 10.00 AM onwards",
    dates: {
      inhouse: "8th October 2025",
      outside: "17th October 2025"
    },
    description: "A solo singing competition themed on the Five Elements to showcase vocal skill and expression.",
    eligibility: "Open to 9th, 10th, PU (11th & 12th), UG, and PG students.",
    rules: [
      "Solo entries only.",
      "Time: 3–5 minutes.",
      "Any language permitted; one acoustic instrument allowed.",
      "Offensive content is prohibited.",
      "Judges' decision is final."
    ],
    contacts: [
      { name: "Prof. Gnanasundari", phone: "9999999984", role: "SPOC" },
      { name: "Khushi", phone: "9019256651", role: "Student In-Charge" },
      { name: "Sneha Rokaya T", phone: "9731837295", role: "Student In-Charge" }
    ]
  },
  {
    title: "Canvas Painting",
    category: "Signature Events",
    type: "Individual",
    teamSize: { min: 1, max: 1 },
    department: "Fine Arts",
    club: "Fine Arts Club",
    time: "17th October 2025 | 10.00 AM onwards",
    dates: {
      inhouse: "8th October 2025",
      outside: "17th October 2025"
    },
    description: "Create an artwork depicting one or more of the Five Elements on canvas.",
    eligibility: "Open to 9th, 10th, PU (11th & 12th), UG, and PG students.",
    rules: [
      "Individual participation only.",
      "Time: 3 hours; A3 canvas.",
      "Allowed media: Acrylic, Water colour, Poster Colour, Mixed Media.",
      "Original artworks only; pre‑prepared paintings not allowed.",
      "Judging: Creativity, Technique, Theme Relevance, Presentation.",
      "Judges' decision is final."
    ],
    contacts: [
      { name: "Dr. Subramanian N", phone: "9999999983", role: "SPOC" },
      { name: "Khushi", phone: "9353306062", role: "Student In-Charge" },
      { name: "Sneha", phone: "9567794329", role: "Student In-Charge" }
    ]
  },
  {
    title: "Group Singing",
    category: "Signature Events",
    type: "Group",
    teamSize: { min: 2, max: 5 },
    department: "Music",
    club: "Music Club",
    time: "17th October 2025 | 10.00 AM onwards",
    dates: {
      inhouse: "8th October 2025",
      outside: "17th October 2025"
    },
    description: "Voices unite to interpret the Water theme through melody and harmony.",
    eligibility: "Open to 9th, 10th, PU (11th & 12th), UG, and PG students.",
    rules: [
      "Team size: 2–5 members.",
      "Time: up to 3 minutes.",
      "Karaoke tracks only unless pre‑approved; align with theme.",
      "Judging: Harmony, Creativity, Stage Presence, Impact.",
      "Exceeding time or inappropriate lyrics leads to disqualification.",
      "Judges' decision is final."
    ],
    contacts: [
      { name: "Dr. Thillaivignesh (PT)", phone: "9999999982", role: "SPOC" },
      { name: "Amit", phone: "6363084679", role: "Student In-Charge" },
      { name: "Gagana", phone: "7019558672", role: "Student In-Charge" }
    ]
  },
  {
    title: "Battle of the Bands",
    category: "Signature Events",
    type: "Group",
    teamSize: { min: 4, max: 6 },
    department: "Music",
    club: "Music Club",
    time: "17th October 2025 | 10.00 AM onwards",
    dates: {
      inhouse: "8th October 2025",
      outside: "17th October 2025"
    },
    description: "Inter‑college band face‑off packed with live energy and stagecraft.",
    eligibility: "Open to 9th, 10th, PU (11th & 12th), UG, and PG students.",
    rules: [
      "Band size: 4–6 participants.",
      "Time: 8 + 2 minutes; soundcheck mandatory.",
      "Bring your own instruments.",
      "Judging: Music, Stage Presence, Crowd Interaction.",
      "Inappropriate gestures result in disqualification.",
      "Judges' decision is final."
    ],
    contacts: [
      { name: "Prof. Vivek", phone: "9999999981", role: "SPOC" },
      { name: "Rajath", phone: "6364690140", role: "Student In-Charge" },
      { name: "Kishan", phone: "9035568541", role: "Student In-Charge" }
    ]
  },
  {
    title: "Elements in Elegance (Ramp Walk)",
    category: "Signature Events",
    type: "Group",
    teamSize: { min: 2, max: 2 },
    department: "Fashion",
    club: "Fashion Club",
    time: "17th October 2025 | 10.00 AM onwards",
    dates: {
      inhouse: "8th October 2025",
      outside: "17th October 2025"
    },
    description: "Runway showcase of elemental fashion, style, and confidence.",
    eligibility: "Open to 9th, 10th, PU (11th & 12th), UG, and PG students.",
    rules: [
      "Theme‑based dressing mandatory; heels mandatory for girls.",
      "Time: 5 minutes per group.",
      "Props optional; no glitter sprays; no vulgarity.",
      "Judging: Theme Relevance, Creativity, Confidence, Styling, Presentation.",
      "Judges' decision is final."
    ],
    contacts: [
      { name: "Prof. Babli Shome", phone: "9999999980", role: "SPOC" },
      { name: "Prof. Guddi Deb", phone: "9999999979", role: "SPOC" },
      { name: "Tejaswini", phone: "7760248638", role: "Student In-Charge" },
      { name: "Leonard D Mark", phone: "9844255115", role: "Student In-Charge" }
    ]
  },
  {
    title: "Street Dance Showdown",
    category: "Signature Events",
    type: "Group",
    teamSize: { min: 4, max: 12 },
    department: "Dance",
    club: "Dance Club",
    time: "17th October 2025 | 10.00 AM onwards",
    dates: {
      inhouse: "8th October 2025",
      outside: "17th October 2025"
    },
    description: "Epic street dance battle featuring Hip‑Hop, B‑Boying, Locking, Popping, House, and more.",
    eligibility: "Open to 9th, 10th, PU (11th & 12th), UG, and PG students.",
    rules: [
      "Team size: 4–12; one team per institution.",
      "Time: 5–7 minutes; submit tracks 24 hours in advance.",
      "Props allowed but must not damage the stage; no fire, water, powder, or glass.",
      "Judging: Choreography, Synchronization, Energy, Technique, Audience Engagement.",
      "Judges' decision is final."
    ],
    contacts: [
      { name: "Prof. Vinay Kumar G", phone: "9999999978", role: "SPOC" },
      { name: "Deekshitha", phone: "9535756630", role: "Student In-Charge" },
      { name: "Rakshitha", phone: "9164373134", role: "Student In-Charge" }
    ]
  },
  {
    title: "Quiz Trivia",
    category: "Signature Events",
    type: "Group",
    teamSize: { min: 2, max: 2 },
    department: "General",
    club: "Quiz Club",
    time: "17th October 2025 | 10.00 AM onwards",
    dates: {
      inhouse: "8th October 2025",
      outside: "17th October 2025"
    },
    description: "A multi‑round inter‑university quiz covering GK, sports, politics, literature, and global affairs.",
    eligibility: "Open to 9th, 10th, PU (11th & 12th), UG, and PG students.",
    rules: [
      "Round 1 (Prelims): Pen & Paper GK + Current Affairs (15 minutes).",
      "Round 2 (Finals): Identify It, Sports, International Affairs (with buzzers).",
      "No smart devices or unfair means; ID mandatory.",
      "Tie‑breakers as needed; judges' decision is final."
    ],
    contacts: [
      { name: "Dr. Ishrat Wahab", phone: "9999999977", role: "SPOC" },
      { name: "Dr. Jayakumar C", phone: "9999999976", role: "SPOC" },
      { name: "Priya", phone: "7022709592", role: "Student In-Charge" },
      { name: "Harshini", phone: "9591040581", role: "Student In-Charge" }
    ]
  },
  // Sports Events
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
    description: "Played in a confined, enclosed space like a badminton court or a makeshift \"box,\" this format emphasizes clever deflections and quick running over power-hitting. The boundaries are low, and the game is incredibly fast-paced. Strategy is key, as players must use the walls and netting to score runs while avoiding getting caught. It's a fun, chaotic, and highly engaging version of cricket that tests agility, innovation, and teamwork under unique constraints.",
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
  },
  {
    title: "Futsal",
    category: "Sports Events",
    type: "Group",
    teamSize: { min: 5, max: 5 },
    department: "Sports Department",
    club: "",
    time: "16th October 2025",
    dates: {
      inhouse: "8th October 2025",
      outside: "16th October 2025"
    },
    description: "Futsal is a dynamic, fast-paced variant of football played on a smaller, hard court with a smaller, heavier ball that has minimal bounce. With only 5 players per side (including the goalkeeper) and a focus on technical skill, quick passing, and improvisation in tight spaces, it is an excellent developer of talent and a thrilling spectator sport. The use of touchlines and a stop-clock make the game incredibly intense.",
    eligibility: "Open to 9th, 10th, PU (11th & 12th), UG, and PG students.",
    rules: [
      "Teams have 5 players on the court (4 outfield + 1 goalkeeper). Four rolling substitutions are allowed.",
      "The game is played in two halves of 20 minutes each (depending on the availability of time) with a stopped clock (dead time).",
      "There are no offside rules."
    ],
    contacts: [
      { name: "Mr Hiremath (Assistant Professor)", phone: "9590426663", role: "SPOC" },
      { name: "Arman (student)", phone: "9321877170", role: "Student In-Charge" }
    ]
  },
  {
    title: "Basketball (5x5)",
    category: "Sports Events",
    type: "Group",
    teamSize: { min: 5, max: 5 },
    department: "Sports Department",
    club: "",
    time: "16th October 2025",
    dates: {
      inhouse: "8th October 2025",
      outside: "16th October 2025"
    },
    description: "Basketball is a fast-paced team sport played on a rectangular court between two teams of five. The primary objective is to score points by shooting the ball through the opponent's elevated hoop. Players advance the ball by dribbling (bouncing it while walking/running) or passing it to a teammate. It demands a blend of physical athleticism—including speed, agility, and vertical leap—and strategic execution of offensive plays and defensive setups. It is a thrilling spectacle of teamwork, skill, and endurance.",
    eligibility: "Open to 9th, 10th, PU (11th & 12th), UG, and PG students.",
    rules: [
      "Each team has 5 players on the court (5 substitutes). Games are played in four quarters of 15 minutes each (as per the availability of time).",
      "A shot made inside the three-point arc counts for 2 points. A shot made from outside the arc counts for 3 points. A free throw counts for 1 point.",
      "A personal foul is called for illegal physical contact. After a team exceeds the foul limit per quarter (e.g., 4 or 5 team fouls), the opponent is awarded free throws.",
      "The shot clock (typically 24 seconds) requires a team to attempt a shot that hits the rim within that time limit when they have possession of the ball."
    ],
    contacts: [
      { name: "Dr Bragadeesh SA (Associate Professor)", phone: "9677121515", role: "SPOC" },
      { name: "Adhil (student)", phone: "7829657367", role: "Student In-Charge" }
    ]
  },
  {
    title: "Badminton (Singles/Doubles)",
    category: "Sports Events",
    type: "Individual",
    teamSize: { min: 1, max: 2 },
    department: "Sports Department",
    club: "",
    time: "16th October 2025",
    dates: {
      inhouse: "8th October 2025",
      outside: "16th October 2025"
    },
    description: "A racquet sport where players hit a shuttlecock across a high net. It demands explosive speed, agility, precision, and strategic thinking. Matches are played as a best-of-three games, with each game played to 21 points. It can be played as singles (one vs. one) or doubles (two vs. two), with doubles requiring exceptional coordination and court coverage between partners.",
    eligibility: "Open to 9th, 10th, PU (11th & 12th), UG, and PG students.",
    rules: [
      "A match is won by winning the best of 3 games to 21 points. You must win by a 2-point margin if the score reaches 20-20.",
      "A point is scored on every serve, regardless of who served. The server must hit the shuttlecock below their waist.",
      "The shuttle must land within the designated court boundaries (narrower for singles, wider for doubles).",
      "It is a fault if the shuttle touches the net and falls outside, hits the ceiling, or is hit before it crosses the net.",
      "Players change ends after each game and when a player/team reaches 11 points in the third game"
    ],
    contacts: [
      { name: "Dr Sanmugam Sobha (Associate Professor)", phone: "886744828", role: "SPOC" },
      { name: "Rahul (student)", phone: "8217086320", role: "Student In-Charge" }
    ]
  },
  {
    title: "Kabaddi",
    category: "Sports Events",
    type: "Group",
    teamSize: { min: 7, max: 7 },
    department: "Sports Department",
    club: "",
    time: "16th October 2025",
    dates: {
      inhouse: "8th October 2025",
      outside: "16th October 2025"
    },
    description: "A high-contact team sport native to the Indian subcontinent, known as the \"Game of Struggle.\" A \"raider\" enters the opposing team's half, tags as many defenders as possible, and returns to their half in a single breath while chanting \"Kabaddi! Kabaddi!\". The defenders must tackle and stop the raider. It is a thrilling test of strength, agility, breath control, and tactical teamwork.",
    eligibility: "Open to 9th, 10th, PU (11th & 12th), UG, and PG students.",
    rules: [
      "Each team has 7 players on the court. A raider must chant \"Kabaddi\" continuously in one breath during a raid.",
      "A raider scores a point for each defender tagged and held. If the raider is stopped, the defending team scores a point.",
      "A raider must cross the bonus line if 6 or more defenders are on the court to score an extra point.",
      "Defenders cannot hold a raider by their clothes, hair, or any part of the body other than limbs and torso.",
      "A team is declared all-out if all players are out, and the opposing team earns 2 extra points."
    ],
    contacts: [
      { name: "Ashrith (Assistant Professor)", phone: "8861497703", role: "SPOC" },
      { name: "Devraj (student)", phone: "8977659774", role: "Student In-Charge" }
    ]
  },
  {
    title: "Chess",
    category: "Sports Events",
    type: "Individual",
    teamSize: { min: 1, max: 1 },
    department: "Sports Department",
    club: "",
    time: "16th October 2025",
    dates: {
      inhouse: "8th October 2025",
      outside: "16th October 2025"
    },
    description: "A classic abstract strategy board game for two players. Played on an 8x8 checkered board, the goal is to checkmate the opponent's king, meaning it is under immediate attack (in \"check\") and there is no legal move to escape. It is a profound battle of wits, requiring foresight, pattern recognition, and strategic planning, with no element of luck involved.",
    eligibility: "Open to 9th, 10th, PU (11th & 12th), UG, and PG students.",
    rules: [
      "Players alternate moves. White always moves first.",
      "Each piece type (pawn, knight, bishop, rook, queen, king) moves in a distinct, specific way.",
      "A player cannot make a move that would place or leave their own king in check.",
      "Special moves include Castling (king and rook move together), En Passant (a special pawn capture), and Pawn Promotion.",
      "A game can end in Checkmate (win/loss), Resignation, Draw (Stalemate, Threefold Repetition, 50-Move Rule, or by agreement)."
    ],
    contacts: [
      { name: "Meghana KP (Assistant Professor)", phone: "9448866127", role: "SPOC" },
      { name: "Deepthi (student)", phone: "9483309667", role: "Student In-Charge" }
    ]
  },
  {
    title: "Carrom",
    category: "Sports Events",
    type: "Individual",
    teamSize: { min: 1, max: 1 },
    department: "Sports Department",
    club: "",
    time: "16th October 2025",
    dates: {
      inhouse: "8th October 2025",
      outside: "16th October 2025"
    },
    description: "A popular tabletop game of skill and strategy, often called \"finger snooker.\" Players use a \"striker\" to flick and pocket smaller wooden discs (carrom men) into corner pockets. The aim is to pocket all pieces of your assigned colour (white or black) and finally the red queen. It requires a steady hand, precise aim, and strategic thinking to block opponents.",
    eligibility: "Open to 9th, 10th, PU (11th & 12th), UG, and PG students.",
    rules: [
      "Player takes turns to strike. The striker must be flicked and cannot be pushed.",
      "The striker must be positioned within the baseline circles and must contact both front lines.",
      "Pocketing the striker is a foul, resulting in the loss of a turn and the return of one pocketed piece.",
      "To pocket the red Queen, a player must also pocket a subsequent piece of their own color (\"cover\" the Queen).",
      "The winner is the first to pocket all carrom men of their color. If the Queen is covered, 5 extra points are added.",
      "Under normal condition, the 29 points system is followed. In case there is a shortage of time, we will follow the best-of-five system."
    ],
    contacts: [
      { name: "Ms Natasha (Assistant Professor)", phone: "8471880188", role: "SPOC" },
      { name: "Deekshith (student)", phone: "7406366318", role: "Student In-Charge" }
    ]
  },
  {
    title: "Table Tennis (singles only)",
    category: "Sports Events",
    type: "Individual",
    teamSize: { min: 1, max: 1 },
    department: "Sports Department",
    club: "",
    time: "16th October 2025",
    dates: {
      inhouse: "8th October 2025",
      outside: "16th October 2025"
    },
    description: "A fast-paced racket sport played on a hard table divided by a net. Players hit a lightweight, hollow ball back and forth using small rackets. The game is incredibly quick, requiring lightning-fast reflexes, spin control, and precise placement. Points are scored when an opponent fails to return the ball within the rules. Matches are typically best-of-five or best-of-seven games.",
    eligibility: "Open to 9th, 10th, PU (11th & 12th), UG, and PG students.",
    rules: [
      "A match is played best of 5 games. Each game is played to 11 points. Must win by 3.",
      "Alternative serve every two points.",
      "The serve must be tossed vertically at least 6 inches and struck so it bounces once on the server's side and then the opponent's side.",
      "A player loses a point if they fail to make a legal return, volley the ball (hit it before it bounces), or obstruct the ball.",
      "Player's switch ends after each game and when a player scores 5 points in the final game of a match."
    ],
    contacts: [
      { name: "Dr Senthil Kumar (Associate Professor)", phone: "7010340650", role: "SPOC" },
      { name: "Arya (student)", phone: "9423883637", role: "Student In-Charge" }
    ]
  }
];

const seedAllEvents = async () => {
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
seedAllEvents();
