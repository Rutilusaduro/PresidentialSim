// The size ladder. Used for individual women (voters, cabinet, TV hosts)
// and for the national average.

export const STAGES = [
  { min: 0, name: "Slim", adj: ["slim", "trim", "willowy"], size: "4–8" },
  { min: 150, name: "Soft", adj: ["soft", "softening", "comfortable"], size: "10–14" },
  { min: 185, name: "Curvy", adj: ["curvy", "plump", "rounded"], size: "16–20" },
  { min: 225, name: "Chubby", adj: ["chubby", "plush", "well-padded"], size: "22–26" },
  { min: 275, name: "Fat", adj: ["fat", "heavy", "thick"], size: "28–32" },
  { min: 340, name: "Very Fat", adj: ["very fat", "big", "ample"], size: "5X–6X" },
  { min: 420, name: "Huge", adj: ["huge", "vast", "massive"], size: "7X–8X" },
  { min: 520, name: "Enormous", adj: ["enormous", "towering", "tremendous"], size: "9X–10X" },
  { min: 650, name: "Immense", adj: ["immense", "sprawling", "monumental"], size: "custom" },
  { min: 800, name: "Colossal", adj: ["colossal", "mountainous", "titanic"], size: "tailored by crew" },
];

export function stageOf(weight) {
  let s = 0;
  for (let i = 0; i < STAGES.length; i++) if (weight >= STAGES[i].min) s = i;
  return s;
}

export const stageName = (w) => STAGES[stageOf(w)].name;

/** 0: stages 0–2, 1: 3–4, 2: 5–6, 3: 7+ */
export function bandOf(weight) {
  const s = stageOf(weight);
  return s <= 2 ? 0 : s <= 4 ? 1 : s <= 6 ? 2 : 3;
}

export function dressSize(weight) {
  if (weight < 130) return "US 4";
  if (weight < 150) return "US 8";
  if (weight < 170) return "US 12";
  if (weight < 190) return "US 16";
  if (weight < 215) return "US 20W";
  if (weight < 240) return "US 24W";
  if (weight < 270) return "US 28W";
  if (weight < 300) return "US 32W";
  const x = Math.min(30, Math.round(4 + (weight - 300) / 45));
  if (x <= 12) return `${x}X`;
  return "custom-tailored";
}

// National-average milestones: each fires once, with a TV special.
export const MILESTONES = [
  { at: 180, title: "The Softening Begins", body: "The average American woman crosses 180 lbs. Clothing retailers quietly move the size 16s from the back of the store to the front table." },
  { at: 200, title: "Two Hundred", body: "The national average hits 200 lbs. GNN breaks into programming with a slow pan across a crowded farmers market, every blouse a little snugger than last spring. The anchor lingers on the shot." },
  { at: 225, title: "Plush Nation", body: "225 lbs. Theaters report record sales of the 'loveseat for one.' Department stores add a whole floor." },
  { at: 250, title: "Quarter Ton Club (Half-Way)", body: "The average woman now weighs 250 lbs. Waistbands across the country sigh in unison. A national yoga-pants shortage is declared." },
  { at: 300, title: "Three Hundred", body: "300 lbs. The Bureau of Standards officially redefines 'a normal chair.' Commuter trains install bench seating after complaints that armrests 'just don't make sense anymore.'" },
  { at: 350, title: "The Great Widening", body: "350 lbs. Doorways built before your administration are now called 'vintage.' Realtors list 'wide hallways' above 'granite countertops.'" },
  { at: 400, title: "Four Hundred Strong", body: "400 lbs. The average woman now fills a loveseat on her own and sways when she walks, and polls say she likes it. Fashion houses give up on 'sizes' and move to 'fittings.'" },
  { at: 500, title: "Half a Thousand", body: "500 lbs. Sidewalks are being widened on both coasts. A cheerful new unit of measurement, 'one Average,' enters the lexicon." },
  { at: 600, title: "The Soft Frontier", body: "600 lbs. Motorized lounge-carts outnumber sedans in several states. Nobody hurries anywhere, and nobody seems to mind." },
  { at: 750, title: "Monumental", body: "750 lbs. The Army Corps of Engineers has quietly become the nation's largest furniture manufacturer." },
  { at: 1000, title: "The Thousand-Pound Nation", body: "1,000 lbs. Historians are already calling it the Age of Abundance. You are the reason." },
];
