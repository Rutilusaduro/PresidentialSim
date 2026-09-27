// Town hall voters: random adult women from around the country, with openers,
// approaches, and responses that shift with her attitude and her size.

export const FIRST = [
  "Ava", "Brianna", "Carmen", "Dana", "Elena", "Fatima", "Grace", "Hannah", "Imani", "Jess",
  "Keisha", "Luna", "Maya", "Nicole", "Olivia", "Paula", "Quinn", "Rosa", "Sofia", "Tanya",
  "Uma", "Valerie", "Whitney", "Ximena", "Yasmin", "Zoe", "Amber", "Bethany", "Crystal", "Destiny",
  "Erin", "Felicia", "Gloria", "Heather", "Ingrid", "Jolene", "Kayla", "Lorraine", "Marisol", "Nadia",
  "Opal", "Patrice", "Renee", "Shonda", "Tori", "Vanessa", "Wendy", "Mei", "Leah", "Kendra",
  "Brooke", "Chelsea", "Daisy", "Gabriela", "Harper", "Aaliyah", "Lucia", "Megan", "Tamara", "Stacy",
];

export const LAST = [
  "Nguyen", "Martinez", "Johnson", "Patel", "Brooks", "Chen", "Okafor", "Reed", "Santos", "Kim",
  "Foster", "Ali", "Torres", "Washington", "Berg", "Singh", "Murphy", "Diaz", "Cohen", "Jackson",
  "Larson", "Price", "Vega", "Hughes", "Moreno", "Bishop", "Yamada", "Kowalczyk", "Delgado", "Harlow",
  "Pruitt", "McAllister", "Baptiste", "Lindqvist", "Ortega", "Whitaker", "Abernathy", "Castillo", "Duvall", "Greer",
];

export const CITIES = [
  ["Milwaukee", "WI"], ["Madison", "WI"], ["Houston", "TX"], ["Austin", "TX"], ["El Paso", "TX"],
  ["Brooklyn", "NY"], ["Buffalo", "NY"], ["Atlanta", "GA"], ["Savannah", "GA"], ["Des Moines", "IA"],
  ["Miami", "FL"], ["Orlando", "FL"], ["Seattle", "WA"], ["Spokane", "WA"], ["Detroit", "MI"],
  ["Phoenix", "AZ"], ["Tucson", "AZ"], ["Knoxville", "TN"], ["Nashville", "TN"], ["San Francisco", "CA"],
  ["Los Angeles", "CA"], ["Fresno", "CA"], ["Minneapolis", "MN"], ["New Orleans", "LA"], ["Denver", "CO"],
  ["Portland", "OR"], ["Charlotte", "NC"], ["Las Vegas", "NV"], ["Boston", "MA"], ["Kansas City", "MO"],
  ["St. Louis", "MO"], ["San Diego", "CA"], ["Philadelphia", "PA"], ["Pittsburgh", "PA"], ["Columbus", "OH"],
  ["Cleveland", "OH"], ["Albuquerque", "NM"], ["Honolulu", "HI"], ["Anchorage", "AK"], ["Omaha", "NE"],
  ["Louisville", "KY"], ["Birmingham", "AL"], ["Jackson", "MS"], ["Little Rock", "AR"], ["Boise", "ID"],
  ["Salt Lake City", "UT"], ["Burlington", "VT"], ["Providence", "RI"], ["Baltimore", "MD"], ["Richmond", "VA"],
];

export const JOBS = [
  "nurse", "schoolteacher", "accountant", "software engineer", "bakery owner", "paralegal", "truck dispatcher",
  "hairstylist", "real-estate agent", "librarian", "barista", "marketing manager", "dental hygienist", "pharmacist",
  "grad student", "yoga instructor", "caterer", "insurance adjuster", "city council aide", "firefighter",
  "wedding planner", "HR director", "florist", "bartender", "data analyst", "retired Marine", "farmer",
  "personal trainer", "pastry chef", "podcast host", "flight attendant", "office manager", "social worker",
];

// Opening lines: [attitude][band]. Tokens: {first} {city} {job} {size}
export const OPENERS = [
  // 0 Opposed
  [
    [
      "I'm a {job} and I'm on my feet all day. I don't need the government putting cake in front of me.",
      "Frankly, {address}, I think this whole 'abundance' agenda is ridiculous.",
      "My gym just closed for 'renovations.' I know that was you.",
    ],
    [
      "I didn't vote for you, and I don't like what's happening to this country. Or to my jeans.",
      "Every restaurant in {city} has doubled its portions. I'm fighting it. Mostly.",
      "I'm trying to hold the line. It's getting harder every month and I resent that.",
    ],
    [
      "I want you to know I'm still opposed. Very firmly. Even if it doesn't look like it.",
      "You've made it almost impossible to say no. Almost.",
      "I'm here on principle. My principles are the only thing that still fits.",
    ],
    [
      "I am STILL against this, {address}. I just can't get up to leave.",
      "I resisted for years. My body clearly didn't get the memo.",
      "Opposed. On record. Pass the rolls while you respond, please.",
    ],
  ],
  // 1 Reluctant
  [
    [
      "I'll be honest, I'm skeptical. But the free snack bar at the DMV was… nice.",
      "I don't hate it. I'm just not sure I want to be part of a 'national trend.'",
      "My sister's gained forty pounds and she's never been happier. It's a little unnerving.",
    ],
    [
      "I keep telling myself I'll start cutting back next week. Next week keeps coming with pie.",
      "I'm not against it, exactly. I just liked the old me. I think.",
      "Everyone at my office is getting bigger. I'm trying not to be. I'm losing that fight.",
    ],
    [
      "I'm way bigger than I planned to be, and I'm still not sure how I feel about it.",
      "Part of me wants to fight it. The other part of me wants the dessert menu.",
      "I don't love it. I don't hate it. I do love the new couch.",
    ],
    [
      "I'm… huge, {address}. I'm still processing that. Slowly. Comfortably.",
      "You know what, I'm too comfortable to be angry anymore. I'm just a little overwhelmed.",
      "I used to say 'not me.' I say it less often now. It sounds less convincing every time.",
    ],
  ],
  // 2 Curious
  [
    [
      "I've been wondering what it would be like to just… stop counting. Is that crazy?",
      "My friends keep sending me those 'Soft Is Strong' ads. I watch every one.",
      "I'm a {job} in {city}. I'm curious what this all means for someone like me.",
    ],
    [
      "I've gone up a couple of sizes and honestly, it doesn't feel bad. It feels kind of… warm?",
      "I tried the Bakery Corps croissants. All of them. I'm curious where this goes.",
      "Everyone's so relaxed lately. I want to know what that's like.",
    ],
    [
      "I can feel myself getting bigger every week. I keep putting my hand on my belly just to feel it.",
      "I thought I'd be embarrassed. Mostly I'm just… interested.",
      "The new sizes are so comfortable. I'm curious how far they go.",
    ],
    [
      "I didn't realize a body could be this big and this comfortable. I want to understand it.",
      "I'm enormous now, and I keep catching myself smiling about it.",
      "People keep telling me I'm beautiful. I'm starting to believe them.",
    ],
  ],
  // 3 Eager
  [
    [
      "{address}! I've been waiting for a president like you my whole life.",
      "I just want to say thank you for the Dessert First Directive. It changed my lunch breaks.",
      "My goal is to be the biggest {job} in {city} by next year.",
    ],
    [
      "I've gained fifty pounds since the inauguration and I'm not slowing down.",
      "Look at me! I outgrew my wardrobe and bought a whole new one. Twice!",
      "I love this country right now. Everyone's softer. Everyone's nicer.",
    ],
    [
      "I had to get a new car because I didn't fit behind the old wheel. Best purchase ever.",
      "I'm a proud {size}, {address}. Next year I'll be prouder.",
      "My partner cooks me breakfast, lunch and dinner. I just keep growing. It's heaven.",
    ],
    [
      "I'm the biggest I've ever been and I want MORE. How do I get more?",
      "I don't walk anywhere anymore, I glide. On my lounge-cart. Isn't it great?",
      "Every day I'm a little bigger and every day I love it a little more.",
    ],
  ],
  // 4 Devoted
  [
    [
      "{address}, I'd follow you to the ends of the earth. As long as there's a buffet there.",
      "I've already told everyone at work: I'm going to be enormous and it's your fault.",
      "Put me in charge of recruitment. I'll have this whole town fat by Christmas.",
    ],
    [
      "I eat for my country now. I take that responsibility very seriously.",
      "I've started feeding my neighbors. They're so grateful. They're getting so soft.",
      "I'm not just gaining, {address}. I'm growing on purpose.",
    ],
    [
      "I don't fit in normal chairs anymore and I've never been prouder.",
      "My feeder brings me a tray every hour. I've told her to make it every half hour.",
      "They had to widen the doorway at my job. They named it after me.",
    ],
    [
      "I'm the biggest woman in {city}, and I intend to keep that title. Help me.",
      "I haven't left my wonderful, enormous bed in a week. I'm doing my part.",
      "I'm vast. I'm soft. I'm your most loyal voter. Keep it coming.",
    ],
  ],
];

// Body lines: a second beat where she talks about her own figure.
// [negative (att 0-1) | positive (att 2-4)][band]
export const BODY_LINES = [
  [
    [
      "I'm a {size} and I'd like to keep it that way.",
      "I've maybe gained a few pounds. Maybe.",
      "My jeans are fine. They're FINE.",
    ],
    [
      "I've gone up to a {size}. I keep buying the next size 'just temporarily.'",
      "My belly sticks out over my waistband now. I tuck it in. It untucks itself.",
      "My office chair's armrests are pressing into my hips. I've started sitting on the edge.",
    ],
    [
      "I had to have my car seat moved all the way back. Then the steering wheel tilted up.",
      "I'm a {size} now. My mother cried. I… also cried. Then we got lunch.",
      "My thighs rub together when I walk. I've stopped wearing skirts. Then I stopped caring.",
    ],
    [
      "I can't get up from this chair without rocking a little. I'm not happy about it. I'm not sad either.",
      "My belly rests on my lap when I sit. It's warm. I hate that I find that comforting.",
      "I haven't seen my feet in a while. I'm told they're fine.",
    ],
  ],
  [
    [
      "I'm a {size} for now. I'm curious what's next.",
      "My jeans have gotten a little snug lately. I kind of like the feeling.",
      "I've started ordering dessert first. Just like the President does.",
    ],
    [
      "I'm a {size} now and I bounce a little when I walk. I didn't know I'd love that.",
      "My belly's gotten so round. I rest my hand on it all day.",
      "Every waistband I own has lost a fight with me this year.",
    ],
    [
      "I'm a {size} and my hips brush both sides of a doorway. I laugh every time.",
      "I sway when I walk now. Everything sways. People stare, and I let them.",
      "I sat on a bench at the park and it creaked. I sat there all afternoon anyway.",
    ],
    [
      "I'm so big my belly rests between my knees when I sit. It's the softest thing I've ever felt.",
      "It takes me a whole minute to get settled in my lounge-cart, and I savor every second.",
      "I'm {size}. Everything I wear is custom now. Everything I wear is also getting tight.",
    ],
  ],
];

// Approaches the President can take. `odds` indexed by attitude (0..4).
export const APPROACHES = [
  {
    id: "policy",
    name: "Walk her through your policies",
    odds: [0.12, 0.35, 0.45, 0.5, 0.6],
    bonus: "enacted",
    success: [
      "She listens carefully, nodding. \"Okay. That… actually makes a lot of sense.\"",
      "\"Wait, the butter subsidy AND the couch program? That's thoughtful. I didn't expect thoughtful.\"",
      "She pulls out her phone and starts looking up the Abundance Tax Credit while you're still talking.",
    ],
    fail: [
      "Her eyes glaze over somewhere around the third bill. \"Sure. Okay. Is there food at this thing?\"",
      "\"That's a lot of acronyms.\" She's unconvinced.",
      "She crosses her arms. \"Policy is policy. I'm talking about MY life.\"",
    ],
  },
  {
    id: "treat",
    name: "Offer her a treat from the White House kitchen",
    odds: [0.1, 0.4, 0.6, 0.65, 0.7],
    bonus: "abundance",
    success: [
      "She takes the éclair \"just to be polite.\" Then she takes another. Then she asks if there's a box to take home.",
      "The first bite stops her mid-sentence. She closes her eyes. \"…Okay. You win this round.\"",
      "\"Is this the Cheesecake Files torte? Oh no. Oh, that's not fair.\" She finishes it anyway, with a sigh of pure pleasure.",
    ],
    fail: [
      "She pushes the plate back. \"Nice try.\"",
      "\"I know what you're doing.\" She doesn't touch it. She does glance at it, twice.",
      "She takes one bite, sets it down pointedly, and says nothing. Her eyes keep drifting to the plate.",
    ],
  },
  {
    id: "vision",
    name: "Paint the vision of a softer America",
    odds: [0.05, 0.2, 0.45, 0.6, 0.75],
    bonus: "culture",
    success: [
      "You describe a country where no one apologizes for having seconds. Her eyes go soft. \"That sounds… really nice.\"",
      "\"Heavier, happier, softer. Yeah.\" She's smiling now, one hand resting on her belly.",
      "She leans in. \"Say that again. The part about never having to be hungry.\"",
    ],
    fail: [
      "\"That sounds like a cult, respectfully.\"",
      "She laughs, but not with you. \"You really believe that, huh?\"",
      "\"Pretty words. I'm not buying it.\"",
    ],
  },
  {
    id: "listen",
    name: "Just listen to her",
    odds: [0.25, 0.3, 0.3, 0.3, 0.3],
    bonus: "approval",
    success: [
      "You let her talk. By the end she's relaxed, laughing, and asking where you get your pastries.",
      "\"Nobody ever just listens.\" She squeezes your hand. \"Okay. I'll give it a chance.\"",
      "She talks for ten minutes straight. When she's done, she seems lighter. Well, not lighter. Happier.",
    ],
    fail: [
      "She vents for fifteen minutes. She feels better. Her opinion hasn't moved.",
      "You nod along. She appreciates it, but she's still where she started.",
      "\"Thanks for listening. I still disagree.\" But she's smiling.",
    ],
  },
  {
    id: "comfort",
    name: "Promise her more comfort: bigger seats, better clothes",
    odds: [0.15, 0.4, 0.5, 0.5, 0.55],
    bonus: "comfort",
    success: [
      "\"Wider seats? Clothes that actually fit? Okay, that's a real problem you're solving.\"",
      "Her whole posture changes. \"You mean I could just… not worry about fitting anywhere?\"",
      "\"If the world makes room for me, I guess I don't have to make room for the world.\"",
    ],
    fail: [
      "\"You can't fix everything with a bigger chair.\"",
      "\"The last 'bigger seat' I sat in still pinched.\" She's skeptical.",
      "She shrugs. \"Comfort's nice. It's not a reason.\"",
    ],
  },
  {
    id: "dare",
    name: "Dare her: “Just one more bite.”",
    odds: [0.06, 0.22, 0.45, 0.65, 0.85],
    bonus: "risky",
    success: [
      "She holds your gaze, takes the fork, and takes one more bite. Then one more. \"…Damn it.\"",
      "\"One more bite\" becomes the whole plate. She sits back, glowing and very full. \"I think I'm in.\"",
      "She laughs, a low, surprised sound, and eats the last of it. \"You're dangerous, you know that?\"",
    ],
    fail: [
      "\"Absolutely not.\" She walks out of the town hall. The press notices.",
      "She stares at you like you've lost your mind. The clip goes viral, and not in a good way.",
      "\"Don't DARE me, {address}.\" The room gets very quiet.",
    ],
  },
];

// Shown when her attitude moves up to a new level.
export const SHIFT_LINES = {
  1: [
    "{first} is still skeptical, but her arms have uncrossed.",
    "{first} admits, quietly, that maybe it isn't all bad.",
  ],
  2: [
    "{first} is curious now. She asks where the nearest Bakery Corps outpost is.",
    "{first} is sneaking glances at the dessert table. Curious.",
  ],
  3: [
    "{first} is eager now. She's planning her next meal before this conversation even ends.",
    "{first} beams. \"Okay. Okay! Let's do this. Let's see how big I can get.\"",
  ],
  4: [
    "{first} is devoted. She promises to bring three friends, and three casseroles, to the next rally.",
    "{first} grabs your hand. \"I'm all in. Every pound.\"",
  ],
};

export const DEVOTED_LINES = [
  "{first} is already devoted. She thanks you by polishing off the entire dessert tray. You swear she looks bigger than she did an hour ago.",
  "{first} hugs you, and it takes a while, because there's a lot of her. She promises to gain another fifty for the midterms.",
  "{first} asks for a selfie. She angles it to get all of her in. It takes a wide lens.",
];
