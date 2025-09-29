const mongoose = require('mongoose');
const Event = require('../models/Event');
const config = require('../config');

// Part 3: Signature Events + Sports Events
const eventsDataPart3 = [
  // Signature Events
  {
    customId: "rhythmic-elements-group-dance",
    title: "Rhythmic Elements (Group Dance)",
    category: "Signature Events",
    type: "Group",
    teamSize: { min: 4, max: 8 },
    department: "Shuffle Dance Club",
    club: "",
    time: "17th October 2025 | 10.00 AM onwards",
    dates: {
      inhouse: "8th October 2025",
      outside: "17th October 2025"
    },
    description: "A high‑energy group dance contest celebrating synchronization, teamwork, and elemental themes across styles.",
    eligibility: "Open to 9th, 10th, PU (11th & 12th), UG, and PG students.",
    rules: [
      "Team size: 4–8 members.",
      "Time: 3 + 2 minutes.",
      "Submit songs 48 hours prior.",
      "No powder, fire, water, or unsafe props.",
      "Vulgarity leads to disqualification.",
      "Judges' decision is final."
    ],
    contacts: [
      { name: "Prof. Pakiyaraj M", phone: "", role: "SPOC" },
      { name: "Prerana Sharma", phone: "9590429150", role: "Student In-Charge" },
      { name: "Salva", phone: "8310222642", role: "Student In-Charge" }
    ]
  },
  {
    customId: "face-painting",
    title: "Face Painting",
    category: "Signature Events",
    type: "Group",
    teamSize: { min: 2, max: 2 },
    department: "Fine Arts Club",
    club: "",
    time: "17th October 2025 | 10.00 AM onwards",
    dates: {
      inhouse: "8th October 2025",
      outside: "17th October 2025"
    },
    description: "Teams transform faces into vibrant canvases capturing the Five Elements.",
    eligibility: "Open to 9th, 10th, PU (11th & 12th), UG, and PG students.",
    rules: [
      "Team of 2: one Painter + one Model.",
      "Time limit: 1 hour",
      "Inclusion of theme is mandatory.",
      "Only the face may be painted; no stencils/stickers.",
      "Bring non‑toxic, skin‑safe paints and tools.",
      "Judging: Creativity, Theme Relevance, Technique, Visual Impact.",
      "Obscene or inappropriate artwork will be disqualified.",
      "Judges' decision is final."
    ],
    contacts: [
      { name: "Prof. Manasa Gowda", phone: "", role: "SPOC" },
      { name: "Afeef Muhammad", phone: "9791489897", role: "Student In-Charge" },
      { name: "Bhumika Poovappa", phone: "6360697280", role: "Student In-Charge" }
    ]
  },
  {
    customId: "soloverse-solo-dance",
    title: "SoloVerse (Solo Dance)",
    category: "Signature Events",
    type: "Individual",
    teamSize: { min: 1, max: 1 },
    department: "Shuffle Dance Club",
    club: "",
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
      "Inappropriate gestures or attire will lead to disqualification.",
      "Judges' decision is final."
    ],
    contacts: [
      { name: "Dr. Gowtham Devanoor P", phone: "", role: "SPOC" },
      { name: "Supreeth B K", phone: "9353306062", role: "Student In-Charge" },
      { name: "Manashi Daityar", phone: "9362762159", role: "Student In-Charge" }
    ]
  },
  {
    customId: "soulful-singing-solo-category",
    title: "Soulful Singing – Solo Category",
    category: "Signature Events",
    type: "Individual",
    teamSize: { min: 1, max: 1 },
    department: "BASS Club",
    club: "",
    time: "17th October 2025 | 10.00 AM onwards",
    dates: {
      inhouse: "8th October 2025",
      outside: "17th October 2025"
    },
    description: "A solo singing competition themed on the Five Elements to showcase vocal skill and expression.",
    eligibility: "Open to 9th, 10th, PU (11th & 12th), UG, and PG students.",
    rules: [
      "Solo entries only.",
      "Time: 3+ 1 minutes.",
      "Any language permitted; one acoustic instrument allowed.",
      "Offensive content is prohibited.",
      "Judges' decision is final."
    ],
    contacts: [
      { name: "Prof. Gnanasundari", phone: "", role: "SPOC" },
      { name: "Khushi", phone: "9019256651", role: "Student In-Charge" },
      { name: "Sneha Rokaya T", phone: "9731837295", role: "Student In-Charge" }
    ]
  },
  {
    customId: "canvas-painting",
    title: "Canvas Painting",
    category: "Signature Events",
    type: "Individual",
    teamSize: { min: 1, max: 1 },
    department: "Fine Arts Club",
    club: "",
    time: "17th October 2025 | 10.00 AM onwards",
    dates: {
      inhouse: "8th October 2025",
      outside: "17th October 2025"
    },
    description: "Create an artwork depicting one or more of the Five Elements on canvas.",
    eligibility: "Open to 9th, 10th, PU (11th & 12th), UG, and PG students.",
    rules: [
      "Individual participation only.",
      "Time: 2 hours; A3 canvas.",
      "Inclusion of theme is mandatory.",
      "Allowed media: Acrylic, Water colour, Poster Colour, Mixed Media.",
      "Original artworks only; pre‑prepared paintings not allowed.",
      "Judging: Creativity, Technique, Theme Relevance, Presentation.",
      "Judges' decision is final."
    ],
    contacts: [
      { name: "Dr. Subramanian N", phone: "", role: "SPOC" },
      { name: "Khushi", phone: "9353306062", role: "Student In-Charge" },
      { name: "Sneha", phone: "9567794329", role: "Student In-Charge" }
    ]
  },
  {
    customId: "group-singing",
    title: "Group Singing",
    category: "Signature Events",
    type: "Group",
    teamSize: { min: 3, max: 6 },
    department: "BASS club",
    club: "",
    time: "17th October 2025 | 10.00 AM onwards",
    dates: {
      inhouse: "8th October 2025",
      outside: "17th October 2025"
    },
    description: "Voices unite to interpret the theme of Five Elements through melody and harmony.",
    eligibility: "Open to 9th, 10th, PU (11th & 12th), UG, and PG students.",
    rules: [
      "Team size: 3–6 members.",
      "Time: up to 3+1 minutes.",
      "Karaoke tracks only unless pre‑approved.",
      "Judging: Harmony, Creativity, Stage Presence, Impact.",
      "Exceeding time or inappropriate lyrics leads to disqualification.",
      "Judges' decision is final."
    ],
    contacts: [
      { name: "Dr. Thillaivignesh (PT)", phone: "", role: "SPOC" },
      { name: "Amit", phone: "6363084679", role: "Student In-Charge" },
      { name: "Gagana", phone: "7019558672", role: "Student In-Charge" }
    ]
  },
  {
    customId: "battle-of-the-bands",
    title: "Battle of the Bands",
    category: "Signature Events",
    type: "Group",
    teamSize: { min: 4, max: 6 },
    department: "BASS Club",
    club: "",
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
      { name: "Prof. Vivek", phone: "", role: "SPOC" },
      { name: "Rajath", phone: "6364690140", role: "Student In-Charge" },
      { name: "Kishan", phone: "9035568541", role: "Student In-Charge" }
    ]
  },
  {
    customId: "elements-in-elegance-ramp-walk",
    title: "Elements in Elegance (Ramp Walk)",
    category: "Signature Events",
    type: "Group",
    teamSize: { min: 2, max: 6 },
    department: "Ruffles and Frills",
    club: "",
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
      { name: "Prof. Babli Shome & Prof. Guddi Deb", phone: "", role: "SPOC" },
      { name: "Tejaswini", phone: "7760248638", role: "Student In-Charge" },
      { name: "Leonard D Mark", phone: "9844255115", role: "Student In-Charge" }
    ]
  },
  {
    customId: "street-dance-showdown",
    title: "Street Dance Showdown",
    category: "Signature Events",
    type: "Individual",
    teamSize: { min: 1, max: 1 },
    department: "Shuffle Dance Club",
    club: "",
    time: "17th October 2025 | 10.00 AM onwards",
    dates: {
      inhouse: "8th October 2025",
      outside: "17th October 2025"
    },
    description: "Get ready for Street Dance Showdown, an electrifying 1 vs 1 battle open to dancers of all styles. Step into the circle and bring your best moves as the Battle DJ spins unexpected beats. No rehearsals. No second takes. Just raw skill and pure freestyle. Our judges will be looking for musicality, technique, stage presence, and that unique personality that sets you apart. Do you have what it takes to own the floor?",
    eligibility: "Open to 9th, 10th, PU (11th & 12th), UG, and PG students.",
    rules: [
      "A 1 vs 1 battle where dancers face each other and freestyle to unpredictable beats from a live DJ.",
      "Music will vary each round and can include rap, pop, funk, break beats, house, electronica, and more.",
      "The battle will feature 16 open slots, with a qualifying round if entries exceed the limit.",
      "In the preliminaries, the DJ will play one song per round, and each dancer gets two sets of 45 seconds (about 1.5 minutes total).",
      "Judges will select one winner from each battle to advance until the final round.",
      "In the finals, each dancer will have two rounds of 1 minute each to showcase their best.",
      "Dancers will be judged on artistic creativity, musicality, and ability to entertain the judges.",
      "Unique energy, style, and personality will be key to standing out and winning the showdown."
    ],
    contacts: [
      { name: "Dr. Gowtham Devanoor P", phone: "", role: "SPOC" },
      { name: "Supreeth B K", phone: "9353306062", role: "Student In-Charge" },
      { name: "Manashi Daityar", phone: "9362762159", role: "Student In-Charge" }
    ]
  },
  {
    customId: "quiz-trivia",
    title: "Quiz Trivia",
    category: "Signature Events",
    type: "Group",
    teamSize: { min: 2, max: 4 },
    department: "Quizetta",
    club: "",
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
      { name: "Dr. Ishrat Wahab & Dr. Jayakumar C", phone: "", role: "SPOC" },
      { name: "Priya", phone: "7022709592", role: "Student In-Charge" },
      { name: "Harshini", phone: "9591040581", role: "Student In-Charge" }
    ]
  },
  // Sports Events
  {
    customId: "box-cricket",
    title: "Box Cricket",
    category: "Sports Events",
    type: "Group",
    teamSize: { min: 6, max: 9 },
    department: "Sports Department",
    club: "",
    time: "14th October 2025, 2 PM onwards",
    dates: {
      inhouse: "8th October 2025",
      outside: "14th October 2025"
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
      { name: "Prof. Kamal", phone: "8095141810", role: "SPOC" },
      { name: "Rishi (student)", phone: "9128855086", role: "Student In-Charge" }
    ]
  },
  {
    customId: "futsal",
    title: "Futsal",
    category: "Sports Events",
    type: "Group",
    teamSize: { min: 5, max: 9 },
    department: "Sports Department",
    club: "",
    time: "14th October 2025, 8 AM onwards",
    dates: {
      inhouse: "8th October 2025",
      outside: "14th October 2025"
    },
    description: "Futsal is a dynamic, fast-paced variant of football played on a smaller, hard court with a smaller, heavier ball that has minimal bounce. With only 5 players per side (including the goalkeeper) and a focus on technical skill, quick passing, and improvisation in tight spaces, it is an excellent developer of talent and a thrilling spectator sport. The use of touchlines and a stop-clock make the game incredibly intense.",
    eligibility: "Open to 9th, 10th, PU (11th & 12th), UG, and PG students.",
    rules: [
      "Teams have 5 players on the court (4 outfield + 1 goalkeeper). Four rolling substitutions are allowed.",
      "The game is played in two halves of 20 minutes each (depending on the availability of time) with a stopped clock (dead time).",
      "There are no offside rules."
    ],
    contacts: [
      { name: "Prof Hiremath", phone: "9590426663", role: "SPOC" },
      { name: "Arman (student)", phone: "9321877170", role: "Student In-Charge" }
    ]
  },
  {
    customId: "basketball-5x5",
    title: "Basketball (5x5)",
    category: "Sports Events",
    type: "Group",
    teamSize: { min: 5, max: 10 },
    department: "Sports Department",
    club: "",
    time: "14th October 2025, 8 AM onwards",
    dates: {
      inhouse: "8th October 2025",
      outside: "14th October 2025"
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
      { name: "Dr Bragadeesh SA", phone: "9677121515", role: "SPOC" },
      { name: "Adhil (student)", phone: "7829657367", role: "Student In-Charge" }
    ]
  },
  {
    customId: "badminton-singles-doubles",
    title: "Badminton (Singles/Doubles)",
    category: "Sports Events",
    type: "Individual",
    teamSize: { min: 1, max: 2 },
    department: "Sports Department",
    club: "",
    time: "14th October 2025, 9 AM onwards",
    dates: {
      inhouse: "8th October 2025",
      outside: "14th October 2025"
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
      { name: "Dr Sanmugam Sobha", phone: "886744828", role: "SPOC" },
      { name: "Rahul (student)", phone: "8217086320", role: "Student In-Charge" }
    ]
  },
  {
    customId: "kabaddi",
    title: "Kabaddi",
    category: "Sports Events",
    type: "Group",
    teamSize: { min: 7, max: 7 },
    department: "Sports Department",
    club: "",
    time: "14th October 2025, 8 AM onwards",
    dates: {
      inhouse: "8th October 2025",
      outside: "14th October 2025"
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
      { name: "Prof. Ashrith", phone: "8861497703", role: "SPOC" },
      { name: "Devraj (student)", phone: "8977659774", role: "Student In-Charge" }
    ]
  },
  {
    customId: "chess",
    title: "Chess",
    category: "Sports Events",
    type: "Individual",
    teamSize: { min: 1, max: 1 },
    department: "Sports Department",
    club: "",
    time: "14th October 2025, 9 AM onwards",
    dates: {
      inhouse: "8th October 2025",
      outside: "14th October 2025"
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
      { name: "Prof. Meghana KP", phone: "9448866127", role: "SPOC" },
      { name: "Deepthi (student)", phone: "9483309667", role: "Student In-Charge" }
    ]
  },
  {
    customId: "carrom",
    title: "Carrom",
    category: "Sports Events",
    type: "Individual",
    teamSize: { min: 1, max: 1 },
    department: "Sports Department",
    club: "",
    time: "14th October 2025, 9 AM onwards",
    dates: {
      inhouse: "8th October 2025",
      outside: "14th October 2025"
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
      { name: "Prof Natasha", phone: "8471880188", role: "SPOC" },
      { name: "Deekshith (student)", phone: "7406366318", role: "Student In-Charge" }
    ]
  },
  {
    customId: "table-tennis-singles-only",
    title: "Table Tennis (singles only)",
    category: "Sports Events",
    type: "Individual",
    teamSize: { min: 1, max: 1 },
    department: "Sports Department",
    club: "",
    time: "14th October 2025, 9 AM onwards",
    dates: {
      inhouse: "8th October 2025",
      outside: "14th October 2025"
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
      { name: "Dr Senthil Kumar", phone: "7010340650", role: "SPOC" },
      { name: "Arya (student)", phone: "9423883637", role: "Student In-Charge" }
    ]
  }
];

const seedCompleteEventsPart3 = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(config.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Insert remaining events
    const events = await Event.insertMany(eventsDataPart3);
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
seedCompleteEventsPart3();
