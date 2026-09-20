export const MONTHLY_EVENTS = [
  {
    id: "inflation-snacks",
    title: "Snack inflation dominates cable news",
    body: "Pundits argue whether your administration should intervene as family-size chip bags shrink. Women's focus groups say comfort food prices are a kitchen-table issue — literally.",
  },
  {
    id: "floor-collapse",
    title: "Viral video: apartment floor gives way during book club",
    body: "A group of women hosting a potluck in Ohio falls through joists rated for slimmer tenants. Building codes are suddenly everyone's business.",
  },
  {
    id: "airline-seats",
    title: "Airlines demand wider 'economy comfort' rows",
    body: "Carriers threaten route cuts unless FAA updates seat width standards. Flight attendants' union splits along size lines.",
  },
  {
    id: "dating-apps",
    title: "Dating apps add 'expansion friendly' filters",
    body: "Tech CEOs ask whether federal guidelines should treat feeder culture as protected expression.",
  },
  {
    id: "hospital-scales",
    title: "Hospitals report scale capacity shortages",
    body: "Clinical staff petition HHS for bariatric equipment grants after ER incidents.",
  },
  {
    id: "fast-fashion",
    title: "Fast fashion brands celebrate 'size inflation'",
    body: "Retail earnings spike as average dress sizes creep up quarter over quarter.",
  },
  {
    id: "gym-closures",
    title: "Regional gym chain files Chapter 11",
    body: "Empty treadmills and full bakeries next door paint a cultural picture the opposition will exploit.",
  },
  {
    id: "school-lunch",
    title: "School lunch portions become a culture-war flashpoint",
    body: "Parents flood school boards — some want double portions, others want calorie caps back.",
  },
  {
    id: "furniture-tariff",
    title: "Imported furniture tariffs squeeze renters",
    body: "IKEA warns that reinforced sofas will cost more; tenants blame both Wall Street and the White House.",
  },
  {
    id: "tiktok-trend",
    title: "#FeedYourPresident trends on social media",
    body: "Influencers challenge followers to gain a pound for every like on your latest speech clip.",
  },
  {
    id: "heat-wave",
    title: "Heat wave triggers A/C brownouts",
    body: "Energy demand spikes; critics tie consumption to larger bodies needing more cooling — a crude attack, but sticky.",
  },
  {
    id: "midwest-fair",
    title: "State fair deep-fry record shattered",
    body: "Local women win competitive eating slots; cameras love the spectacle.",
  },
];

export function eventForMonth(month, rng = Math.random) {
  const idx = Math.floor(rng() * MONTHLY_EVENTS.length);
  const base = MONTHLY_EVENTS[idx];
  return {
    ...base,
    headline: `Month ${month}: ${base.title}`,
  };
}

export function headlinesForPolicy(policy, national, lean) {
  const outs = [
    { name: "The Curve Chronicle (left)", tone: "supportive" },
    { name: "National Desk (center)", tone: "neutral" },
    { name: "Liberty Bell Review (right)", tone: "skeptical" },
  ];
  return outs.map((o) => {
    let line;
    if (o.tone === "supportive") {
      line = `White House doubles down on ${policy.title}; women's avg BMI now ${national.avgBmi.toFixed(1)}`;
    } else if (o.tone === "neutral") {
      line = `Analysts split on ${policy.title} as obesity rate hits ${national.obesityRate.toFixed(0)}% among women`;
    } else {
      line = `Critics blast '${policy.title}' — call it reckless as infrastructure strain grows`;
    }
    return { outlet: o.name, line };
  });
}
