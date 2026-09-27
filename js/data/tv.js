// Television. Each channel has an on-screen host whose weight is tied to the
// live simulation, plus segment copy that changes with the national "band"
// (0: soft beginnings, 1: fat, 2: huge, 3: enormous and beyond).
//
// Tokens available in segments: {avg} {avgLb} {host} {desire} {state} {food}
// {size} {gain} {approval} {opp} {pres}

export const CHANNELS = [
  {
    id: "gnn",
    num: 2,
    name: "GNN",
    show: "Great National News",
    set: "desk",
    host: { name: "Diane Parrish", seed: "diane", look: { hairStyle: "bob", hair: "#d9a45b", top: "#c9184a", skin: "#f6d7c3" }, suit: true, weight: (st) => 142 * Math.pow(st.avg / 172, 1.35) },
    // GNN mostly reads the live news queue; these fill the gaps.
    segments: [
      [
        "Good evening. The national average for American women now stands at {avgLb}, and department stores report the size-14 rack is 'suspiciously empty.'",
        "Tonight: bakery lines in {state} stretch around the block. Our reporter tried to get a comment; she got a cinnamon roll instead.",
        "A new poll shows {desire}% of women say they're 'open to a little more softness.' Pundits are baffled. Bakers are not.",
        "Breaking: I've been told I need a new blazer. That's not news. Moving on.",
      ],
      [
        "Good evening. The average American woman now weighs {avgLb}. Furniture stocks hit another record high.",
        "Tonight's top story: {state} runs out of stretch denim for the third time this month.",
        "Our own anchor desk has been widened. Management says it's 'for the graphics.' I say it's for me.",
        "In {state}, a woman's jeans gave out at a football game. The crowd gave her a standing ovation.",
      ],
      [
        "Good evening. At {avgLb}, the average American woman is now officially 'huge,' and polls say she's thrilled.",
        "Tonight: city planners in {state} vote to widen every sidewalk downtown. Construction begins after lunch. A long lunch.",
        "Our anchor desk has been replaced with a reinforced lounge. The ratings have never been better.",
        "Breaking: I can no longer reach the teleprompter remote over my belly. My producer is doing it. Hi, Tom.",
      ],
      [
        "Good evening from my chaise. The national average is {avgLb}, and nobody in {state} has hurried anywhere in months.",
        "Tonight: a woman in {state} became too big for her front door and simply had it replaced with an archway. Neighbors brought casseroles.",
        "Programming note: the news now runs twice as long so I can eat between segments. You'll understand.",
        "Our set has been rebuilt around me. Literally. The crew calls it 'the Diane Dome.'",
      ],
    ],
  },
  {
    id: "butter",
    num: 4,
    name: "BTR",
    show: "Heaping Helpings with Marla",
    set: "kitchen",
    host: { name: "Chef Marla Honeycutt", seed: "marla", look: { hairStyle: "curly", hair: "#7b2d26", top: "#ff9f1c", skin: "#eec1a0" }, weight: (st) => st.avg * 1.3 },
    segments: [
      [
        "Today we're making brown-butter cookies. The secret ingredient is more butter. The second secret ingredient is making two batches.",
        "Ladies, if your recipe says 'one cup of cream,' that's a suggestion. A timid suggestion.",
        "This is my grandmother's pound cake. She called it that because of what it does to you. Heh.",
        "Always taste as you cook. Then taste again. Then just eat the whole bowl of frosting, it's fine.",
      ],
      [
        "Today: the triple-decker lasagna. Serves eight, or one very determined woman. You know which one I am.",
        "I've had to move my cutting board to the side; there's just more of me at the counter than there used to be. More me, more flavor!",
        "Brioche French toast, soaked overnight in custard. Bake it, drown it in syrup, and have a lie-down.",
        "A viewer from {state} writes: 'I made your cheesecake and ate it all in one sitting. Is that normal?' Honey, that's the recipe.",
      ],
      [
        "Today's recipe feeds a family of six. I'll be eating it on camera. By myself. Stay tuned.",
        "The network had to reinforce my stool. I call it 'the throne.' Now let's make a butter cake the size of a hubcap.",
        "My apron doesn't tie anymore, so I just drape it. Aprons are a state of mind. Let's deep-fry a cheesecake.",
        "Tip: If you can't reach the stove over your belly, get a longer spoon. I have a very long spoon.",
      ],
      [
        "I'm cooking from my lounge-cart today; the kitchen was redesigned around me. Tonight: the twelve-layer chocolate monument.",
        "My sous-chef does the stirring now; I do the tasting. All of the tasting. It's a full-time job.",
        "Ladies, we're past measuring cups. Tonight we measure in buckets. And then we eat the buckets. Figuratively. Mostly.",
        "This whole studio smells like caramel and so do I. Let's make dinner. Then second dinner.",
      ],
    ],
  },
  {
    id: "wtl",
    num: 7,
    name: "WTL",
    show: "Wider Than Life (reality)",
    set: "couch",
    host: { name: "Kelsey (cast member)", seed: "kelsey", look: { hairStyle: "long", hair: "#d9a45b", top: "#f15bb5", skin: "#f6d7c3" }, weight: (st) => st.cohortW[3] * 1.05 },
    segments: [
      [
        "KELSEY (confessional): 'I signed up for this show on a dare. The producers keep bringing me brownies. I keep eating them. I'm up nine pounds.'",
        "This week: Renata catches Kelsey eating the whole cast's dessert. Kelsey is not sorry.",
        "KELSEY: 'The contract said we'd 'live abundantly.' I didn't realize it meant this much butter.'",
      ],
      [
        "KELSEY: 'My jeans popped at the reunion dinner. The button hit Renata. We're not speaking. Well, we're speaking, but with our mouths full.'",
        "This week: the cast goes to a buffet with no time limit. They stay for six hours.",
        "KELSEY (confessional, lounging): 'I'm a {size} now. My mom watches every week. She says she's proud. She also sent pie.'",
      ],
      [
        "KELSEY: 'The producers had to widen the confessional booth. I told them to go bigger. I'm not done.'",
        "This week: Kelsey gets stuck in the hot tub. The whole cast helps. It becomes a pool party.",
        "KELSEY (on a reinforced loveseat): 'Everyone at home keeps asking how I feel. I feel big. I feel amazing. Next question.'",
      ],
      [
        "KELSEY: 'They built a whole new set because I don't fit through the old doors. I made them name it after me.'",
        "This week: Kelsey's feeder proposes, with a ring AND a seven-tier cake. She says yes to both.",
        "KELSEY (from her vast custom bed): 'Season one me would never believe this. Season five me wants a snack.'",
      ],
    ],
  },
  {
    id: "runway",
    num: 9,
    name: "RXL",
    show: "Runway XL",
    set: "runway",
    host: { name: "Model: Anouk", seed: "anouk", look: { hairStyle: "pony", hair: "#1a1a1a", top: "#8338ec", skin: "#8d5a3b" }, weight: (st) => st.avg * 1.15 },
    segments: [
      [
        "Fall collection: soft knits, elastic waists and 'room for dessert' pleats. The smallest sample size this season is a 12.",
        "The designers are calling it 'the relaxed silhouette.' Critics are calling it 'the future.'",
        "Anouk walks in a stretch-velvet gown. The front row gasps. So does the seam.",
      ],
      [
        "The runway has been widened by three feet for this season's show. Anouk still brushes both edges with her hips.",
        "This season's trend: the 'overflow' crop top. It shows off the belly, because what's the point otherwise?",
        "A designer told us, 'We used to make clothes for bodies. Now we make clothes for MORE bodies. More body per woman.'",
      ],
      [
        "Anouk's gown required forty yards of fabric and a support team. She walks slowly, and she owns every step.",
        "The finale: twelve models in 8X couture, arm in arm. The runway groans. The crowd roars.",
        "Designers are now sewing with expansion panels built in. 'She'll need them by spring,' one explained.",
      ],
      [
        "The 'runway' is now a slow procession of lounge-carts draped in silk. It's the most elegant thing you've ever seen.",
        "Anouk's latest gown was fitted on Monday and let out on Wednesday. The designer called it 'a living garment.'",
        "Couture has left the tape measure behind. Tailors now work from photographs and optimism.",
      ],
    ],
  },
  {
    id: "sports",
    num: 12,
    name: "WSN",
    show: "Women's Softball League",
    set: "field",
    host: { name: "Slugger: Big Bertha Diaz", seed: "bertha", look: { hairStyle: "pony", hair: "#5a3620", top: "#ef476f", bottom: "#f4f4f4", skin: "#d9a07a" }, weight: (st) => st.cohortW[2] * 1.2 },
    segments: [
      [
        "Diaz at the plate… and it's a double! She's taking it easy rounding first. The concession stand is along the first-base line.",
        "The league has approved snack breaks between innings. Attendance up 40%.",
        "Commentators note Diaz's uniform is 'fitting snugger' this season. She's batting .340.",
      ],
      [
        "Diaz connects! It's going, going… she's jogging… she's walking… she's stopping at second for a hot dog. Stand-up double!",
        "The dugout benches have been replaced with a sectional sofa. Morale is excellent.",
        "League rule change: pitchers may now pitch from a seated position. Three of them already do.",
      ],
      [
        "Diaz homers! She rounds the bases in a golf cart, per the new league rules, waving to the crowd.",
        "The catcher's squat has been replaced by the 'catcher's lounge.' Passed balls are up. Happiness is up more.",
        "Seventh-inning stretch is now the seventh-inning snack. It lasts forty minutes.",
      ],
      [
        "Diaz swings from her reinforced batting chair. It's a hit! Her pinch runner takes it from here.",
        "The league MVP trophy has been redesigned as a gold-plated dessert platter. It's full. Diaz is eating from it.",
        "Final score: 3–2, but nobody's really checking. The whole stadium is at the buffet.",
      ],
    ],
  },
  {
    id: "congress",
    num: 14,
    name: "CCAM",
    show: "Congress Cam",
    set: "chamber",
    host: { name: "Sen. Loretta Pike (Majority Whip)", seed: "loretta", look: { hairStyle: "bun", hair: "#c9c2b8", top: "#3d405b", skin: "#eec1a0" }, suit: true, weight: (st) => st.avg * 1.05 },
    segments: [
      [
        "Live from the Senate floor: a heated debate over the Buffet Parity Act. Sen. Pike has the floor, and a cruller.",
        "The Senate cafeteria has adopted the Dessert First Directive voluntarily. Attendance at votes is up.",
        "Sen. Pike: 'I yield the remainder of my time to the dessert cart.'",
      ],
      [
        "The Senate has voted to replace its antique desks with wider ones. Several antique chairs have already 'retired themselves.'",
        "Sen. Pike rises to speak, then reconsiders, and speaks from her chair. 'The chair recognizes the chair,' she jokes.",
        "The House gallery has been reupholstered in 'a more forgiving fabric.'",
      ],
      [
        "Floor votes now happen by show of hands from reinforced loveseats. Quorum calls take a while.",
        "Sen. Pike filibusters for six hours, powered entirely by room-service pastries. Her colleagues join in, eating.",
        "The Capitol rotunda now hosts a permanent buffet 'to facilitate bipartisanship.'",
      ],
      [
        "The Senate chamber has been redesigned as a crescent of daybeds. Debate has never been more relaxed.",
        "Sen. Pike casts her vote by raising a drumstick. It counts.",
        "Congress has passed a resolution declaring itself 'comfortably in session.' Nobody is quite sure when it will adjourn.",
      ],
    ],
  },
  {
    id: "weather",
    num: 22,
    name: "WX",
    show: "Doppler Dessert Weather",
    set: "weather",
    host: { name: "Meteorologist Skye Mbeki", seed: "skye", look: { hairStyle: "long", hair: "#1a1a1a", top: "#3a86ff", skin: "#6a4029" }, weight: (st) => st.avg * 1.1 },
    segments: [
      [
        "Today's forecast: sunny with a 90% chance of patio brunch. Heavy cream advisory in effect for {state}.",
        "A high-pressure system of pastries is moving across the Midwest. Expect widespread second helpings.",
        "Doppler shows a massive pizza delivery front forming over {state}. Take shelter on your couch.",
      ],
      [
        "Tonight: a cold front brings perfect 'stay-in-and-eat' weather to the whole East Coast.",
        "Watch out for scattered cinnamon-roll showers downtown, courtesy of aroma broadcasting.",
        "My green screen used to show the whole map. Now I cover the Great Lakes. You'll have to trust me about Michigan.",
      ],
      [
        "I'm standing in front of the entire central time zone this evening, folks. Let's assume it's nice.",
        "Forecast: Calm. Comfortable. Nobody in {state} is going outside anyway.",
        "Doppler Dessert Radar shows a severe buffet warning across the Sun Belt. Seek a comfortable booth.",
      ],
      [
        "The weather map has been moved to a second screen because I am the first screen now.",
        "It's a beautiful day to stay in. It's always a beautiful day to stay in.",
        "Forecast for {state}: 72 and delicious.",
      ],
    ],
  },
];

// Commercial breaks, by band.
export const ADS = [
  [
    "CouchCo: 'Sink in. Stay a while. Stay forever.' Now with reinforced frames!",
    "Stretch Denim by Forgiven: 'Jeans that say yes.'",
    "Bakery Corps is hiring! Learn to bake. Learn to taste. Learn to need bigger aprons.",
    "The new Triple Stack from BurgerBarn. Why stop at two?",
  ],
  [
    "Lane Bryant presents: The 6X Line. Because you're not done yet.",
    "ReinforceRite chairs: tested to 800 lbs. 'We'll hold you. We promise.'",
    "Drone Delivery Plus: Hot food on your couch in under six minutes. Why get up?",
    "Mama Rosa's Bottomless Pasta. Legally bottomless, thanks to the Buffet Parity Act!",
  ],
  [
    "LoungeCart 3000: Glide through life. Cupholders on both armrests.",
    "WideWay Doors: 'Your home should welcome ALL of you.'",
    "The Great American Buffet: Now open 24 hours with seated service.",
    "TailorBot: Get let out overnight, while you sleep. Or snack.",
  ],
  [
    "DayBed Deluxe: 'Why leave?' Includes built-in fridge and snack conveyor.",
    "FeastFleet: we bring the buffet to your bedroom. Hourly service available.",
    "Colossal Couture: garments made to measure, and re-measured weekly.",
    "The ArchWay Home Renovation: 'Doors are so last presidency.'",
  ],
];

// Scrolling ticker gags, by band.
export const TICKER = [
  [
    "BUTTER FUTURES UP 4%",
    "GYM MEMBERSHIPS DOWN 11%",
    "SIZE 12 NOW 'MOST POPULAR' AT MAJOR RETAILER",
    "NATIONAL KALE SURPLUS DECLARED",
    "BRUNCH RESERVATIONS: FULLY BOOKED",
  ],
  [
    "FURNITURE STOCKS HIT ALL-TIME HIGH",
    "SEATBELT EXTENDER SALES UP 300%",
    "BAKERY CORPS ENLISTMENTS SURGE",
    "TREADMILLS NOW 'DECORATIVE'",
    "ELASTIC WAISTBAND SHORTAGE CONTINUES",
  ],
  [
    "SIDEWALK WIDENING UNDERWAY IN 40 STATES",
    "STAIRS OFFICIALLY 'OPTIONAL' IN 12 STATES",
    "AVERAGE LUNCH NOW 90 MINUTES",
    "RECLINER RECALLED FOR 'INSUFFICIENT ENTHUSIASM'",
    "LOUNGE-CART TRAFFIC JAM ON I-95 (VERY SLOW, VERY CALM)",
  ],
  [
    "ARCHITECTS DECLARE THE DOOR 'OBSOLETE'",
    "NATIONAL AVERAGE BED SIZE: 'CALIFORNIA COLOSSAL'",
    "FOOD CONVEYOR INSTALLS OUTPACE ELEVATORS",
    "TAILORS NOW THE HIGHEST-PAID PROFESSION",
    "NOBODY HAS HURRIED IN MONTHS, STUDY FINDS",
  ],
];

// Generic GNN headlines keyed by band, used when the news queue is quiet.
export const FILLER_HEADLINES = [
  ["Women report 'feeling cozier' in latest survey", "Dessert sales outpace salad for first time", "Size 14 now the new size 10, say retailers", "Bakeries report record morning lines"],
  ["Plus-size retail becomes nation's #1 industry", "Office chairs being replaced 'across the board'", "Seatbelt extenders now standard in all new cars", "Average lunch break lengthens to 75 minutes"],
  ["Cities vote to widen sidewalks and doorways", "Lounge-carts outsell bicycles 5 to 1", "Stadiums convert to bench and sofa seating", "'Huge and happy': poll finds women love their new size"],
  ["Doors replaced with archways in 20 states", "Food conveyors installed in apartment complexes", "Women now 'too content to protest anything,' say pollsters", "Nation reports calmest year on record"],
];
