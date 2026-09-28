// "Chirper": a live social feed of American women reacting to their country
// and their changing bodies. [attitude][band]

export const HANDLES = [
  "softandproud", "brunchqueen", "honeybun_{n}", "thickthighsgreatlies", "texasbutterbabe", "mama_needs_seconds",
  "cardiocancelled", "jeansgraveyard", "pie_for_breakfast", "notyourgymrat", "crumbsonmyshelf", "softgirlera",
  "officechairsurvivor", "doubledessertdiaries", "stretchmarksnstardust", "leancoalitionlisa", "stillcounting_{n}",
  "biggerbetterbrenda", "wisconsin_cheese_wife", "lazy_sunday_lana", "the_other_half_of_the_bench", "carb_queen_{n}",
  "button_down_bea", "nurse_nikki_{n}", "grad_school_gains", "mukbang_marisol", "extra_whip_please", "couchcommander",
];

export const POSTS = [
  // Opposed
  [
    ["Another bakery opened on my street. Third one this month. I'm walking the long way home.", "Unfollowing everyone posting #SoftIsStrong. Sorry not sorry.", "Anyone else think the Dessert First thing is insane??"],
    ["Bought the next size up 'just for now.' Hate this. Hate that the cake was good.", "My jeans and I are not on speaking terms.", "Is it just me or is it impossible to find a salad anywhere anymore"],
    ["I refuse to call this 'comfortable.' (I'm typing this from a very comfortable chair.)", "Still opposed. Still eating. These are unrelated.", "Lean Coalition meeting cancelled because nobody could agree where to have lunch."],
    ["Can't reach my old gym membership card, it's in a drawer I can't bend down to. Probably a sign.", "Being opposed is exhausting when you're this big. I'm going to take a nap and oppose it later.", "I miss my old body. Also my new one is really soft. I'm conflicted."],
  ],
  // Reluctant
  [
    ["Had the free croissant at the post office. Didn't hate it.", "Everybody at work keeps bringing in treats. I have no willpower left.", "Not sure about this whole thing but the new couch is incredible"],
    ["okay who told my waistband it could just leave", "Tried to diet. Bakery Corps guy waved at me. Diet over.", "My belly is officially sticking out over my jeans now. Weird. Also, comfy?"],
    ["I keep saying I'll cut back and then it's 9pm and I'm on my fourth slice", "Had to get my car seat adjusted. The mechanic just nodded like he's seen it a hundred times.", "Not a gainer. Just a woman who keeps buying bigger pants."],
    ["I'm really big now and I keep waiting to feel bad about it. Still waiting.", "The lounge-cart is kind of fun, I'll admit it", "Okay the doorway widening is a relief. I'll say that much."],
  ],
  // Curious
  [
    ["Watched 'Wider Than Life' and now I'm eating cheesecake at midnight. Coincidence?", "What if I just… didn't count anything for a month", "Butter Channel has me in a chokehold"],
    ["Up another size and honestly kind of into it? The softness is nice", "Laid on the couch with my hand on my belly for an hour. Just vibing. Just rounder.", "#OneMorePlate made me do it"],
    ["The way my hips sway when I walk now 👀", "Took a mirror selfie. Deleted it. Took it again. Posted it. Look at me.", "Bench at the park creaked when I sat down and I giggled like a lunatic"],
    ["i'm SO big now and i can't stop touching my belly, it's like a warm pillow that's also me", "Watched myself in the store window for a solid minute today. Wow.", "New dress fit on Monday. It's Friday. It doesn't fit. I'm... kind of thrilled"],
  ],
  // Eager
  [
    ["Dessert First Directive is the best thing to ever happen to my lunch break", "I'm aiming for a size 20 by summer, who's with me 🍰", "Treat yourself, America. I did. Three times."],
    ["Popped a button at the office today. Everyone clapped.", "Outgrew my entire wardrobe AGAIN and I'm throwing a party about it", "Just ordered the triple stack and I'm not sharing"],
    ["Custom seat on the train with my name on it (well, my size on it)", "My partner calls me 'the whole buffet' and I'm framing it", "Can't see my feet anymore! Pedicures are a mystery now! Love it!"],
    ["The lounge-cart life chose me 🛋️", "Gained 12 lbs this week. PERSONAL RECORD.", "Doorway at work had to be widened AGAIN. They put a plaque up."],
  ],
  // Devoted
  [
    ["I've decided I'm going to be enormous. Please support me on this journey.", "Feeding my girlfriends brownies until they see the light 🙏", "I'd do anything for this administration. Starting with dessert."],
    ["Eating for my country. God bless America. Pass the gravy.", "Every pound is a vote for {pres}", "My feeder and I have a whole spreadsheet. The line only goes up."],
    ["too big for the booth at my favorite diner, so they brought me a sofa. I LIVE here now", "My belly rests on my knees and I've never felt more like myself", "Weighed in today. The new number is unreal. More."],
    ["Haven't left bed in a week and it's the most productive week of my life. Productive at eating.", "My room had to be rebuilt around me and I've never felt more like royalty", "I'm vast. I'm soft. I'm happy. Keep it coming, {address}."],
  ],
];

export const HASHTAGS = [
  ["#DessertFirst", "#SoftIsStrong", "#TreatYourself", "#NewSizeWhoDis", "#BrunchNation"],
  ["#OneMorePlate", "#ButtonDown", "#JeansGraveyard", "#BakeryCorps", "#ThickAndProud"],
  ["#LoungeCartLife", "#WideNation", "#TooBigForTheBooth", "#SwayWhenIWalk", "#BiggerBetter"],
  ["#ArchwayNation", "#DaybedDiaries", "#ConveyorLife", "#Colossal", "#NeverHungry"],
];

// Press briefing: reporters' questions and three answers each.
// effects mirror action effects.
export const PRESS = [
  {
    outlet: "Washington Ledger",
    q: "Critics say your policies are making American women fatter. Is that the goal?",
    a: [
      { t: "“Yes. And they look wonderful.”", effects: { culture: 5, persuade: 0.003, opposition: 3 } },
      { t: "“Our goal is a happier, more comfortable America.”", effects: { approval: 2 } },
      { t: "“I think the question is why anyone ever wanted them hungry.”", effects: { culture: 3, opposition: -2 } },
    ],
  },
  {
    outlet: "Lean Coalition Today",
    q: "Senator Whitlock says chairs across the country are breaking. How do you respond?",
    a: [
      { t: "“Then we'll build stronger chairs. That's what America does.”", effects: { approval: 3, infraGrowth: 0.02 } },
      { t: "“Sounds like the chairs need to try harder.”", effects: { culture: 4, opposition: 2 } },
      { t: "“The Senator should come by for lunch sometime.”", effects: { opposition: -2, approval: 1 } },
    ],
  },
  {
    outlet: "The Daily Crumb",
    q: "What's your favorite dessert, and how many do you usually have?",
    a: [
      { t: "“The Cheesecake Files torte. And I stop counting at three.”", effects: { culture: 4, approval: 1 } },
      { t: "“Whatever's in front of me. All of it.”", effects: { culture: 5, persuade: 0.002 } },
      { t: "“I'm not going to tell you. I'll show you at the state dinner.”", effects: { culture: 3, pc: 2 } },
    ],
  },
  {
    outlet: "Channel 5 Action News",
    q: "A mom in {state} says she can't find clothes that fit anymore. What do you tell her?",
    a: [
      { t: "“Help is on the way. The Bureau of Textiles is working overtime.”", effects: { wardrobeCap: 10, approval: 2 } },
      { t: "“That she's growing, and we'll grow the clothes with her.”", effects: { persuade: 0.002, culture: 2 } },
      { t: "“Try a caftan. They're very in.”", effects: { culture: 2, approval: -1 } },
    ],
  },
  {
    outlet: "Fiscal Times",
    q: "The butter subsidy alone costs billions. How do you justify the spending?",
    a: [
      { t: "“It pays for itself. Look at the furniture industry.”", effects: { approval: 1, budget: 2 } },
      { t: "“You can't put a price on a second helping.”", effects: { culture: 3, approval: -1 } },
      { t: "“We're reviewing it. Carefully. Over dinner.”", effects: { pc: 3 } },
    ],
  },
  {
    outlet: "Style Weekly",
    q: "Your Press Secretary looks noticeably bigger than she did at inauguration. Comment?",
    a: [
      { t: "“She looks fantastic. Doesn't she?”", effects: { culture: 4 }, cabinet: { id: "press", attitude: 1 } },
      { t: "“She's doing her part. We all are.”", effects: { persuade: 0.002 } },
      { t: "“Next question.”", effects: { approval: -1 } },
    ],
  },
  {
    outlet: "Science Now",
    q: "Is the Institute of Abundance really working on a 'growth serum'?",
    a: [
      { t: "“I can neither confirm nor deny. But yes.”", effects: { culture: 5, opposition: 2 } },
      { t: "“The Institute researches comfort and flavor. That's all.”", effects: { approval: 1 } },
      { t: "“Wait and see.”", effects: { culture: 3 } },
    ],
  },
  {
    outlet: "Heartland Herald",
    q: "Farmers in {state} say they can't grow enough wheat for all the bakeries. What's the plan?",
    a: [
      { t: "“More farms, more subsidies, more bread.”", effects: { abundance: 3, budget: -3 } },
      { t: "“That's a good problem to have.”", effects: { approval: 1, culture: 1 } },
      { t: "“We'll import. The world wants to help.”", effects: { abundance: 2, approval: -1 } },
    ],
  },
  {
    outlet: "National Review of Seats",
    q: "Should seat sizes be updated annually to keep up with women's growth?",
    a: [
      { t: "“Quarterly, if necessary.”", effects: { infraGrowth: 0.03, approval: 2 } },
      { t: "“We'll let the market decide.”", effects: { opposition: 1 } },
      { t: "“Every woman deserves a seat that fits her, however big she gets.”", effects: { persuade: 0.002, approval: 2 } },
    ],
  },
  {
    outlet: "The Evening Standard",
    q: "Polls show many women say they WANT to keep gaining. Does that surprise you?",
    a: [
      { t: "“Not at all. It's what I've been saying all along.”", effects: { culture: 4, persuade: 0.002 } },
      { t: "“I'm just glad they're happy.”", effects: { approval: 3 } },
      { t: "“We're only getting started.”", effects: { culture: 5, opposition: 3 } },
    ],
  },
  {
    outlet: "Capitol Beat",
    q: "Is it true the Cabinet table had to be notched out for some Secretaries?",
    a: [
      { t: "“It was a design improvement.”", effects: { culture: 3 } },
      { t: "“My Cabinet is growing with the country. I'm proud of them.”", effects: { culture: 4, persuade: 0.001 } },
      { t: "“Only one notch. Well, three.”", effects: { culture: 5, approval: 1 } },
    ],
  },
  {
    outlet: "Morning Joe-Joe",
    q: "What would you say to a woman who's nervous about gaining weight?",
    a: [
      { t: "“Take one bite. Then decide.”", effects: { persuade: 0.003 } },
      { t: "“You'll be beautiful at any size, especially a bigger one.”", effects: { persuade: 0.004, opposition: 2 } },
      { t: "“There's no pressure. There's just pie.”", effects: { approval: 2, persuade: 0.001 } },
    ],
  },
];
