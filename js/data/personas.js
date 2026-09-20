/** @typedef {'gainer'|'neutral'|'opposed'} WeightStance */
/** @typedef {'liberal'|'moderate'|'conservative'} Lean */

const FIRST = [
  "Ava", "Brianna", "Carmen", "Diana", "Elena", "Fatima", "Grace", "Hannah",
  "Isabel", "Jasmine", "Keisha", "Luna", "Maya", "Nina", "Olivia", "Priya",
  "Quinn", "Rosa", "Sofia", "Tanya", "Uma", "Violet", "Wren", "Yasmin",
];

const LAST = [
  "Nguyen", "Martinez", "Johnson", "Patel", "Brooks", "Chen", "Okafor", "Reed",
  "Santos", "Kim", "Foster", "Ali", "Torres", "Washington", "Berg", "Singh",
  "Murphy", "Diaz", "Cohen", "Jackson", "Larson", "Okonkwo", "Price", "Vega",
];

const REGIONS = [
  "Texas Hill Country", "Brooklyn", "Suburban Atlanta", "Rural Iowa", "Miami",
  "Seattle tech corridor", "Detroit", "Phoenix", "Appalachia", "Bay Area",
  "Twin Cities", "New Orleans", "Denver suburbs", "Portland", "Charlotte",
  "Las Vegas", "Boston", "Kansas City", "San Diego", "Philadelphia",
  "Columbus", "Nashville", "Albuquerque", "Honolulu",
];

const EMOJI_BY_SIZE = [
  "👩", "👩", "🧑‍🦰", "👩‍🦱", "🧑‍🦱", "👩‍🦰", "🙋‍♀️", "💃", "🫃", "🛋️",
];

function rand(min, max) {
  return min + Math.random() * (max - min);
}

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * @param {number} i
 */
export function createPersona(i) {
  const heightIn = Math.round(rand(60, 70));
  const stanceRoll = Math.random();
  /** @type {WeightStance} */
  const weightStance =
    stanceRoll < 0.35 ? "gainer" : stanceRoll < 0.7 ? "neutral" : "opposed";
  const leanRoll = Math.random();
  /** @type {Lean} */
  const lean =
    leanRoll < 0.38 ? "liberal" : leanRoll < 0.72 ? "moderate" : "conservative";

  let startWeight;
  if (weightStance === "gainer") startWeight = rand(155, 210);
  else if (weightStance === "neutral") startWeight = rand(135, 175);
  else startWeight = rand(120, 155);

  return {
    id: `w-${i}`,
    name: `${FIRST[i % FIRST.length]} ${LAST[i % LAST.length]}`,
    region: REGIONS[i % REGIONS.length],
    heightIn,
    weightLb: Math.round(startWeight),
    weightStance,
    lean,
    approval: 50 + Math.random() * 10 - 5,
    occupation: pick([
      "nurse", "teacher", "barista", "real estate agent", "content creator",
      "warehouse lead", "paralegal", "hair stylist", "engineer", "stay-at-home mom",
    ]),
  };
}

export function createRoster(count = 24) {
  return Array.from({ length: count }, (_, i) => createPersona(i));
}

export function bmiFrom(persona) {
  const h = persona.heightIn;
  return (703 * persona.weightLb) / (h * h);
}

export function bmiLabel(bmi) {
  if (bmi < 25) return "normal";
  if (bmi < 30) return "overweight";
  if (bmi < 35) return "obese I";
  if (bmi < 40) return "obese II";
  if (bmi < 50) return "obese III";
  return "super obese";
}

export function bmiClass(bmi) {
  if (bmi < 30) return "";
  if (bmi < 40) return "bmi-obese";
  if (bmi < 50) return "bmi-morbid";
  return "bmi-extreme";
}

export function avatarFor(persona) {
  const bmi = bmiFrom(persona);
  const idx = Math.min(EMOJI_BY_SIZE.length - 1, Math.floor((bmi - 18) / 4));
  return EMOJI_BY_SIZE[Math.max(0, idx)];
}

export function leanLabel(lean) {
  if (lean === "liberal") return "Liberal";
  if (lean === "moderate") return "Moderate";
  return "Conservative";
}

export function stanceLabel(stance) {
  if (stance === "gainer") return "Pro-gain";
  if (stance === "neutral") return "Neutral";
  return "Anti-gain";
}
