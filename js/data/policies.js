/** Preset policies with effects on national + per-woman weight drift */

export const PRESET_POLICIES = [
  {
    id: "subsidy-calories",
    title: "National Calorie Dividend",
    blurb: "Monthly grocery credits weighted toward high-calorie staples and delivery apps.",
    weightBias: 1.4,
    approvalBase: 8,
    gainerBoost: 18,
    opposedPenalty: -22,
    leanMod: { liberal: 1.1, moderate: 1, conservative: 0.85 },
    keywords: ["calorie", "food", "subsidy", "grocery", "staple", "eat"],
  },
  {
    id: "sedentary-mandate",
    title: "Remote-First Workplace Act",
    blurb: "Tax breaks for employers who eliminate standing desks and add snack lounges.",
    weightBias: 1.1,
    approvalBase: 4,
    gainerBoost: 12,
    opposedPenalty: -15,
    leanMod: { liberal: 1.05, moderate: 1, conservative: 0.9 },
    keywords: ["remote", "work", "sedentary", "office", "snack", "lounge"],
  },
  {
    id: "size-friendly-infra",
    title: "Size-Friendly Infrastructure Bill",
    blurb: "Federal grants to widen doorways, reinforce floors, and upgrade elevator capacity.",
    weightBias: 0.6,
    approvalBase: 6,
    gainerBoost: 20,
    opposedPenalty: -8,
    leanMod: { liberal: 1.15, moderate: 1.05, conservative: 0.75 },
    keywords: ["infrastructure", "doorway", "elevator", "floor", "building", "code"],
  },
  {
    id: "fast-food-zones",
    title: "Drive-Thru Density Zones",
    blurb: "Preempt local zoning to allow mega food courts within 500ft of schools.",
    weightBias: 1.2,
    approvalBase: -2,
    gainerBoost: 14,
    opposedPenalty: -18,
    leanMod: { liberal: 0.9, moderate: 1, conservative: 1.05 },
    keywords: ["fast food", "drive", "zoning", "restaurant", "burger"],
  },
  {
    id: "anti-diet-ads",
    title: "Truth in Dieting Advertising Act",
    blurb: "Heavy fines for weight-loss marketing; fund body-positive media instead.",
    weightBias: 0.5,
    approvalBase: 5,
    gainerBoost: 16,
    opposedPenalty: -12,
    leanMod: { liberal: 1.2, moderate: 1, conservative: 0.7 },
    keywords: ["diet", "advertising", "body positive", "marketing", "scale"],
  },
  {
    id: "gainer-grants",
    title: "Expansion Empowerment Grants",
    blurb: "Small-business loans for plus-size fashion, feeder restaurants, and mobility scooters.",
    weightBias: 0.9,
    approvalBase: 7,
    gainerBoost: 22,
    opposedPenalty: -10,
    leanMod: { liberal: 1.1, moderate: 1.05, conservative: 0.8 },
    keywords: ["grant", "plus size", "fashion", "feeder", "expansion", "gainer"],
  },
  {
    id: "pe-class-reform",
    title: "Optional PE & Recess Forever",
    blurb: "Make physical education elective nationwide; replace with culinary labs.",
    weightBias: 1.0,
    approvalBase: 3,
    gainerBoost: 11,
    opposedPenalty: -20,
    leanMod: { liberal: 1, moderate: 0.95, conservative: 0.95 },
    keywords: ["pe", "gym", "school", "culinary", "exercise", "recess"],
  },
  {
    id: "soda-subsidy",
    title: "HFCS Production Credit",
    blurb: "Refundable tax credit for domestic corn syrup and fountain drink syrup.",
    weightBias: 1.3,
    approvalBase: -4,
    gainerBoost: 10,
    opposedPenalty: -14,
    leanMod: { liberal: 0.85, moderate: 1, conservative: 1.1 },
    keywords: ["soda", "sugar", "corn", "hfcs", "drink", "sweet"],
  },
  {
    id: "medical-gain",
    title: "Off-Label Appetite Stimulant Coverage",
    blurb: "Medicare Part D must cover appetite enhancers when prescribed for 'quality of life'.",
    weightBias: 1.5,
    approvalBase: 2,
    gainerBoost: 19,
    opposedPenalty: -16,
    leanMod: { liberal: 1.05, moderate: 1, conservative: 0.88 },
    keywords: ["medicare", "appetite", "drug", "pharma", "prescription"],
  },
  {
    id: "scale-ban",
    title: "Federal Bathroom Scale Ban",
    blurb: "Prohibit sale of home scales; fund community feasts instead.",
    weightBias: 0.4,
    approvalBase: 1,
    gainerBoost: 15,
    opposedPenalty: -25,
    leanMod: { liberal: 1.15, moderate: 0.9, conservative: 0.65 },
    keywords: ["scale", "ban", "weight", "feast", "bathroom"],
  },
  {
    id: "midnight-snack",
    title: "24/7 Federal Snack Stations",
    blurb: "USPS trucks repurposed as mobile churro and milkshake units on every block.",
    weightBias: 1.25,
    approvalBase: 5,
    gainerBoost: 17,
    opposedPenalty: -11,
    leanMod: { liberal: 1.08, moderate: 1.02, conservative: 0.95 },
    keywords: ["snack", "night", "food truck", "churro", "milkshake"],
  },
  {
    id: "chair-mandate",
    title: "Reinforced Seating Standards Act",
    blurb: "All public venues must provide steel-framed loveseats rated to 600 lbs per cheek.",
    weightBias: 0.35,
    approvalBase: 9,
    gainerBoost: 21,
    opposedPenalty: -6,
    leanMod: { liberal: 1.12, moderate: 1.08, conservative: 0.82 },
    keywords: ["chair", "seat", "steel", "furniture", "venue"],
  },
  {
    id: "feeder-tax-credit",
    title: "Intimate Feeding Tax Credit",
    blurb: "Couples filing jointly get credits when one partner documents 'encouraged caloric surplus'.",
    weightBias: 0.85,
    approvalBase: 3,
    gainerBoost: 24,
    opposedPenalty: -19,
    leanMod: { liberal: 1.18, moderate: 0.95, conservative: 0.6 },
    keywords: ["feeder", "tax credit", "couple", "intimate", "encourage"],
  },
];

/**
 * Match free-text policy to best preset or generic effect
 * @param {string} text
 */
export function parseFreeTextPolicy(text) {
  const lower = text.toLowerCase().trim();
  if (!lower) return null;

  let best = null;
  let bestScore = 0;
  for (const p of PRESET_POLICIES) {
    let score = 0;
    for (const kw of p.keywords) {
      if (lower.includes(kw)) score += 2;
    }
    if (score > bestScore) {
      bestScore = score;
      best = p;
    }
  }

  const gainWords = ["fat", "fatter", "gain", "weight", "obese", "feed", "bigger", "expand", "curves"];
  let genericBias = 0.3;
  for (const w of gainWords) {
    if (lower.includes(w)) genericBias += 0.25;
  }

  if (best && bestScore >= 2) {
    return { ...best, customTitle: text.slice(0, 120), fromText: true };
  }

  return {
    id: "custom",
    title: text.slice(0, 80) || "Executive action",
    blurb: "Your bespoke directive — analysts scramble to model the curves.",
    weightBias: Math.min(2.2, genericBias),
    approvalBase: 0,
    gainerBoost: 8 + genericBias * 10,
    opposedPenalty: -12,
    leanMod: { liberal: 1.05, moderate: 1, conservative: 0.92 },
    customTitle: text,
    fromText: true,
  };
}
