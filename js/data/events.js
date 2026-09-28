// Random events that pause the game and demand a decision.
// `min`/`max` gate on national average weight. Tokens: {state} {address}.

export const EVENTS = [
  {
    id: "lean-rally",
    title: "The Lean Coalition Marches",
    body: "Thousands of Lean Coalition supporters march on the Mall carrying signs reading 'PUT DOWN THE FORK.' Their leader, Senator Vance Whitlock, demands a meeting.",
    choices: [
      { label: "Send a food truck fleet to the march", effects: { opposition: -4, culture: 3 }, result: "By noon, half the marchers are in line at the food trucks. By two, the signs are being used as plates." },
      { label: "Meet with Whitlock", effects: { opposition: -2, approval: 2, pc: -5 }, result: "Whitlock lectures you for an hour. You offer him a croissant. He refuses. His staff doesn't." },
      { label: "Ignore them", effects: { opposition: 5 }, result: "The march dominates the evening news. The Coalition's donations spike." },
    ],
  },
  {
    id: "butter-shortage",
    title: "Butter Shortage!",
    body: "Demand has outstripped supply. Grocery stores in {state} report empty dairy aisles, and there are rumors of a black market in croissants.",
    min: 185,
    choices: [
      { label: "Release the Strategic Butter Reserve", effects: { abundance: 4, budget: -8 }, result: "Refrigerated trucks roll out under armed escort. The nation exhales, then butters everything." },
      { label: "Emergency dairy import deal", effects: { abundance: 3, budget: -4, approval: -1 }, result: "French butter floods the market. Nobody complains about the price." },
      { label: "Tell people to use cream cheese", effects: { approval: -3, culture: 2 }, result: "Cream cheese on everything becomes a trend. It isn't the same, but it's close." },
    ],
  },
  {
    id: "stuck-senator",
    title: "Senator Stuck in Her Seat",
    body: "Live on Congress Cam, Senator Marjorie Tate has gotten wedged into her antique desk chair and can't get up to vote. The clip has 40 million views.",
    min: 260,
    choices: [
      { label: "Push the Senate to replace every chair", effects: { infraCap: 15, approval: 2, budget: -3 }, result: "New wide chairs arrive by morning. Sen. Tate gives a teary speech of thanks from her new seat, and it fits her beautifully." },
      { label: "Call it 'a moment of national beauty'", effects: { culture: 5, opposition: 2 }, result: "Your statement trends for a week. Sen. Tate frames it." },
      { label: "Stay out of it", effects: { opposition: 2 }, result: "The Lean Coalition uses the clip in an attack ad. It backfires a little; people found her adorable." },
    ],
  },
  {
    id: "airline",
    title: "Airline Seat Revolt",
    body: "Passengers on a transcontinental flight refuse to take off until the airline swaps out the armrests. The pilot, herself a proud 24W, sides with the passengers.",
    min: 220,
    choices: [
      { label: "Order the FAA to mandate wider seats", effects: { infraCap: 20, pc: -8, approval: 3 }, result: "Airlines grumble, then advertise their new 'lounge class' as a luxury feature." },
      { label: "Fly to the airport and serve pastries", effects: { culture: 5, approval: 2 }, result: "The photo of you handing a pilot an éclair on the tarmac becomes iconic." },
      { label: "Let the airlines handle it", effects: { approval: -3 }, result: "The standoff lasts nine hours. Everyone on board orders room service at the airport hotel." },
    ],
  },
  {
    id: "diet-book",
    title: "A Diet Bestseller",
    body: "A new diet book, 'The Hungry Woman's Discipline,' tops the charts. It's everywhere, and reluctant women are buying it by the millions.",
    choices: [
      { label: "Fund a rival cookbook: 'Never Hungry'", effects: { culture: 4, budget: -5, opposition: -3 }, result: "'Never Hungry' outsells it within a month. The recipes are extraordinary." },
      { label: "Have the Surgeon General review it", effects: { opposition: -2, culture: 2 }, result: "The review is devastating, and it comes with a recipe for brown-butter blondies." },
      { label: "Let it run its course", effects: { opposition: 6, persuade: -0.002 }, result: "Millions start counting calories. For a while." },
    ],
  },
  {
    id: "wardrobe-crisis",
    title: "The Great Button Crisis",
    body: "Clothing can't keep up. Seams are giving way at every office in {state}. Women are showing up to work in bathrobes and bedsheets.",
    wardrobe: true,
    choices: [
      { label: "Emergency textile funding", effects: { wardrobeCap: 40, budget: -12 }, result: "The Bureau of Textiles works around the clock. Stretch fabric rolls out of factories by the mile." },
      { label: "Declare bathrobes business-appropriate", effects: { approval: 2, culture: 4, wardrobeCap: 10 }, result: "Offices embrace 'robe-core.' Productivity is unaffected. Comfort soars." },
      { label: "Call it a sign of success", effects: { culture: 3, approval: -3 }, result: "It IS a sign of success. It's also a lot of popped buttons." },
    ],
  },
  {
    id: "infra-crisis",
    title: "Porches Across America Groan",
    body: "Reports are flooding in from {state}: porch swings, office chairs, and bleachers are buckling under the nation's new abundance. The Lean Coalition calls it 'a warning.'",
    infra: true,
    choices: [
      { label: "Emergency reinforcement program", effects: { infraCap: 45, budget: -15 }, result: "Construction crews fan out. Every porch in {state} gets a steel beam and a new cushion." },
      { label: "Call it a triumph of abundance", effects: { culture: 5, opposition: 5, approval: -2 }, result: "Your speech is inspiring. The bleachers remain structurally unconvinced." },
      { label: "Blame the furniture industry", effects: { approval: 1, infraGrowth: 0.05 }, result: "Furniture makers pledge 'stronger standards.' Sales of reinforced sofas spike." },
    ],
  },
  {
    id: "state-fair",
    title: "State Fair Invitation",
    body: "The {state} State Fair invites you to judge the deep-fried butter competition. The contestants are, in the words of the organizer, 'extremely motivated.'",
    choices: [
      { label: "Attend and eat everything", effects: { culture: 6, approval: 3, pc: 4 }, result: "You try every entry. The photos are glorious. The contestants cheer for each other's second helpings." },
      { label: "Send the Secretary of Agriculture", effects: { culture: 3, approval: 1 }, cabinet: { id: "ag", weight: 12 }, result: "Dolores judges for six hours and awards everyone first place. She gains twelve pounds in one weekend and calls it 'fieldwork.'" },
      { label: "Decline politely", effects: { approval: -1 }, result: "The fair goes on without you. The butter goes on without you." },
    ],
  },
  {
    id: "influencer",
    title: "Fitness Influencer Converts",
    body: "Brianna Vale, a fitness influencer with 30 million followers, posts a video: 'I ate the Cheesecake Files torte and I think I'm done with the gym forever.'",
    min: 190,
    choices: [
      { label: "Invite her to the White House", effects: { culture: 8, persuade: 0.004, pc: -4 }, result: "She comes for lunch, stays for dessert, and livestreams it. Her follower count doubles." },
      { label: "Give her a Mukbang Fellowship", effects: { culture: 5, budget: -3 }, result: "Her first mukbang stream breaks the platform's records." },
      { label: "Just retweet it", effects: { culture: 2 }, result: "The retweet gets a million likes. She sends you a heart emoji and a photo of her empty plate." },
    ],
  },
  {
    id: "whitlock-scandal",
    title: "Whitlock Caught at a Buffet",
    body: "Photos surface of Lean Coalition leader Sen. Vance Whitlock at an all-you-can-eat buffet in {state}, on his fourth plate.",
    choices: [
      { label: "Leak the photos everywhere", effects: { opposition: -10, approval: 1, pc: -6 }, result: "The Coalition's donors are furious. Whitlock claims he was 'conducting research.'" },
      { label: "Invite him to lunch, graciously", effects: { opposition: -5, approval: 3 }, result: "He accepts. He has the lasagna. He has seconds. He looks very conflicted." },
      { label: "Take the high road", effects: { approval: 2 }, result: "The photos get out anyway. You look statesmanlike." },
    ],
  },
  {
    id: "wedding",
    title: "Wedding Dress Shortage",
    body: "Bridal shops in {state} can't keep up. Brides are growing between fittings, and many are being let out three times before the big day.",
    min: 210,
    choices: [
      { label: "Subsidize bridal tailors", effects: { wardrobeCap: 15, approval: 3, budget: -4 }, result: "Tailors nationwide get grants. Brides get gowns with 'growth gussets' for the reception." },
      { label: "Launch 'Married & Abundant' campaign", effects: { culture: 6, persuade: 0.003 }, result: "Wedding photos of radiant, heavy brides fill social media." },
      { label: "Attend a wedding yourself", effects: { approval: 4, pc: 3 }, result: "You make a toast about 'growing together.' The bride eats three slices of cake. Nobody cries more than the tailor." },
    ],
  },
  {
    id: "metabolism-study",
    title: "Suspicious Study",
    body: "A Lean Coalition-funded study claims your policies are 'reckless.' It's making the rounds on cable news.",
    choices: [
      { label: "Commission a counter-study", effects: { opposition: -5, budget: -6 }, result: "The counter-study concludes that women 'report being extremely happy.' That's harder to argue with." },
      { label: "Hold a press conference with dessert", effects: { culture: 4, approval: 1 }, result: "Nobody remembers the study. Everyone remembers the tiramisu." },
      { label: "Ignore it", effects: { opposition: 5, approval: -2 }, result: "The study gets a week of coverage and quietly disappears." },
    ],
  },
  {
    id: "pie-day",
    title: "National Pie Emergency",
    body: "It's Thanksgiving, and bakeries are running out of pie before noon. The nation's grandmothers are asking for your help.",
    choices: [
      { label: "Deploy the National Guard (to bake)", effects: { abundance: 4, approval: 4, budget: -6 }, result: "Guardsmen in aprons deliver pies across the country. 'Operation Crust' is a triumph." },
      { label: "Bake pies at the White House yourself", effects: { culture: 5, approval: 3 }, result: "Footage of you pulling a pie from the oven runs on every channel." },
      { label: "Let the free market sort it out", effects: { approval: -2 }, result: "Pie prices triple. People buy them anyway." },
    ],
  },
  {
    id: "gym-lobby",
    title: "Gym Lobby Strikes Back",
    body: "The fitness industry launches a $500 million ad campaign: 'Get Your Body Back.'",
    choices: [
      { label: "Counter with the Butter Channel", effects: { culture: 5, budget: -8 }, result: "Your counter-ads run back-to-back with theirs. Theirs look tired. Yours look delicious." },
      { label: "Tax gym advertising", effects: { opposition: -4, pc: -10, budget: 5 }, result: "The ads quietly disappear. The revenue funds a pastry program." },
      { label: "Let it play out", effects: { opposition: 7, persuade: -0.003 }, result: "Some women hit the gym. Many of them stop at the smoothie bar, then the donut shop next door." },
    ],
  },
  {
    id: "stuck-door",
    title: "Stuck at the Capitol",
    body: "A group of lawmakers is stuck in a Capitol doorway after trying to squeeze through together. The footage is on every channel.",
    min: 300,
    choices: [
      { label: "Fund the Capitol Widening Project", effects: { infraCap: 20, budget: -8, congress: 2 }, result: "The Capitol's doors are widened into grand arches. Lawmakers thank you on the floor." },
      { label: "Send snacks while they wait", effects: { culture: 5, approval: 2 }, result: "They eat while firefighters work. They're even harder to free afterward. Nobody minds." },
      { label: "Make a joke about it", effects: { approval: -2, culture: 3 }, result: "Half the country laughs with you. The other half laughs at the lawmakers. Everyone's laughing." },
    ],
  },
  {
    id: "celebrity-gain",
    title: "Movie Star Goes Big",
    body: "Oscar-winner Serena Hollis shows up to her premiere forty pounds heavier and absolutely radiant. The internet can't stop talking about it.",
    choices: [
      { label: "Award her the Medal of Abundance", effects: { culture: 8, persuade: 0.005, pc: -5 }, result: "She accepts in a dress that barely holds on. Every magazine cover is hers for a month." },
      { label: "Invite her to star in a PSA", effects: { culture: 6, budget: -5 }, result: "The PSA is a hit: just Serena eating crème brûlée in slow motion." },
      { label: "Send a congratulatory cake", effects: { culture: 2 }, result: "She posts a photo of it. Then a photo of the empty plate." },
    ],
  },
  {
    id: "senate-flip",
    title: "Swing Senator Wavers",
    body: "Senator Amy Callahan of {state}, a key swing vote, is undecided on your agenda. She's been spotted at a bakery every day this week.",
    choices: [
      { label: "Send her the White House pastry chef", effects: { congress: 4, pc: -6 }, result: "Callahan joins your coalition. She's been seen in a new, noticeably roomier suit." },
      { label: "Promise a Bakery Corps outpost in her state", effects: { congress: 3, budget: -6 }, result: "She's on board. Her constituents are thrilled." },
      { label: "Leave her be", effects: { congress: -2 }, result: "She votes with the Lean Coalition out of spite." },
    ],
  },
  {
    id: "desire-wave",
    title: "Viral Trend: #OneMorePlate",
    body: "Women across the country are posting videos of themselves ordering one more plate than they planned. #OneMorePlate is trending worldwide.",
    minDesire: 40,
    choices: [
      { label: "Post your own #OneMorePlate", effects: { culture: 7, persuade: 0.004 }, result: "Your video gets 80 million views. Restaurants report record second orders." },
      { label: "Sponsor the trend with free desserts", effects: { persuade: 0.006, budget: -8 }, result: "Free dessert with every second plate. The trend becomes a tradition." },
      { label: "Let it grow organically", effects: { persuade: 0.002 }, result: "It grows. Everything's growing." },
    ],
  },
  {
    id: "first-family-dinner",
    title: "Leaked Menu",
    body: "The White House kitchen's weekly menu leaks: fourteen desserts, three types of fried chicken, and a 'midnight cheese course.' Critics are furious.",
    choices: [
      { label: "Publish the recipes", effects: { culture: 5, abundance: 2 }, result: "Grocery stores sell out of heavy cream within hours." },
      { label: "Defend it proudly", effects: { culture: 3, opposition: 3, approval: 2 }, result: "'I eat like a President, and so should you.' The quote goes on T-shirts." },
      { label: "Blame a staffer", effects: { approval: -3, pc: 3 }, result: "Nobody believes it. The staffer gets a book deal." },
    ],
  },
  {
    id: "sofa-strike",
    title: "Furniture Workers Strike",
    body: "Furniture factory workers strike for better pay, claiming they can't keep up with demand for reinforced chairs.",
    min: 240,
    choices: [
      { label: "Back the workers: federal wage boost", effects: { infraGrowth: 0.08, budget: -10, approval: 3 }, result: "Production doubles. The new union logo is a recliner." },
      { label: "Invoke emergency powers", effects: { infraCap: 15, approval: -4, pc: -10 }, result: "Factories resume. Workers grumble. Chairs arrive." },
      { label: "Let it drag on", effects: { infraGrowth: -0.05, approval: -2 }, result: "Chair shortages spread. Everyone sits on the floor. With cushions. The cushions run out too." },
    ],
  },
  {
    id: "abroad",
    title: "Foreign Leaders Take Notice",
    body: "At the international summit, several foreign leaders ask how America has become 'so relaxed and so… round.' They want in.",
    min: 250,
    choices: [
      { label: "Export the Bakery Corps", effects: { budget: 15, approval: 2 }, result: "American pastry becomes the nation's most profitable export." },
      { label: "Host an international buffet summit", effects: { culture: 6, pc: 6 }, result: "The summit runs four days over schedule. Nobody wanted to leave the dessert room." },
      { label: "Keep our secrets", effects: { pc: 3 }, result: "America keeps her edge. And her extra edges." },
    ],
  },
  {
    id: "vp-plot",
    title: "The Vice President Hesitates",
    body: "Vice President Caroline Whitfield is quietly telling donors she 'has concerns' about the direction of the administration.",
    maxVp: 2,
    choices: [
      { label: "Invite her for a private dinner", effects: { pc: -4 }, cabinet: { id: "vp", weight: 8, attitude: 1 }, result: "Seven courses later, Caroline is loosening her belt and laughing. Her 'concerns' seem to have been eaten." },
      { label: "Assign her to the Bakery Corps tour", effects: { congress: -1 }, cabinet: { id: "vp", weight: 15 }, result: "She tours 40 bakeries in two weeks. Every one insists she try their specialty." },
      { label: "Ignore it", effects: { congress: -3, opposition: 3 }, result: "Her donors leak her comments. The Lean Coalition starts calling her 'our girl inside.'" },
    ],
  },
  {
    id: "frost-memo",
    title: "The Surgeon General's Memo",
    body: "Dr. Hannah Frost has drafted an official advisory urging 'moderation.' She wants your sign-off.",
    maxSg: 1,
    choices: [
      { label: "Rewrite it together over lunch", effects: {}, cabinet: { id: "sg", weight: 6, attitude: 1 }, result: "The lunch runs long. The advisory ends up recommending 'moderation in all things, except dessert.'" },
      { label: "Kill the memo", effects: { opposition: 4, pc: -4 }, result: "It leaks anyway. The Lean Coalition frames it." },
      { label: "Sign it", effects: { opposition: -3, persuade: -0.004, approval: 1 }, result: "Moderation is briefly fashionable. Very briefly." },
    ],
  },
  {
    id: "record-gainer",
    title: "Record Gainer",
    body: "A woman in {state} has reached 900 lbs and says she's 'only getting started.' She wants to meet you.",
    min: 330,
    choices: [
      { label: "Visit her at home", effects: { culture: 8, approval: 3, pc: -3 }, result: "Her home has been rebuilt around her: wide archways, a vast bed, a food conveyor. She's radiant and hilarious. The footage is beautiful." },
      { label: "Send her a Presidential Citation", effects: { culture: 4 }, result: "She frames it and hangs it where she can see it from her bed, which is everywhere." },
      { label: "Invite her to the State of the Union", effects: { culture: 10, infraCap: 5, budget: -5 }, result: "The Capitol builds a special balcony for her. She gets a standing ovation from Congress, and the longest applause of the night." },
    ],
  },
];

// Opposition moves — happen automatically when the Lean Coalition is strong.
export const OPP_MOVES = [
  { text: "The Lean Coalition runs 'Put Down The Fork' ads in swing states.", effects: { persuade: -0.003, approval: -1 } },
  { text: "Sen. Whitlock filibusters the President's agenda for 14 hours, eating nothing but celery.", effects: { congress: -1 } },
  { text: "The Lean Coalition hands out free gym passes in {state}.", effects: { persuade: -0.002 } },
  { text: "A Lean Coalition super PAC buys every billboard in {state}: 'REMEMBER YOUR OLD JEANS?'", effects: { persuade: -0.003, culture: -2 } },
  { text: "The Lean Coalition sues to block the latest subsidy. A judge delays it.", effects: { abundance: -2 } },
  { text: "Whitlock goes on every Sunday show: 'This administration wants to make your wife fat.' Polling on that line is mixed.", effects: { approval: -2, culture: 1 } },
  { text: "Salad-bar chains announce a coordinated 'Lean Week' promotion.", effects: { abundance: -1, persuade: -0.001 } },
];
