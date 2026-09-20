import { bmiFrom, bmiLabel } from "../data/personas.js";

function pick(arr, rng) {
  return arr[Math.floor(rng() * arr.length)];
}

/**
 * @param {import('../data/personas.js').createPersona extends Function ? ReturnType<import('../data/personas.js').createPersona> : any} persona
 * @param {number} score
 * @param {{ title: string }} policy
 * @param {() => number} rng
 */
export function quoteForPersona(persona, score, policy, rng = Math.random) {
  const bmi = bmiFrom(persona);
  const label = bmiLabel(bmi);
  const positive = score >= 55;
  const negative = score < 40;

  const gainerHappy = [
    `"Finally a president who gets it — ${policy.title} is going to make so many of us gloriously soft."`,
    `"I'm already outgrowing my wardrobe; this policy might finish off my dresser too. Good."`,
    `"My feeder boyfriend is voting for you twice if this passes. I'm up ${Math.round(persona.weightLb)} lbs and climbing."`,
  ];

  const gainerAngry = [
    `"This is lip service. I want calories, not speeches."`,
    `"You're still letting diet culture win. Disappointing."`,
  ];

  const neutralPositive = [
    `"Not my top issue, but ${policy.title} doesn't scare me."`,
    `"I'll watch my wallet more than my waistline on this one."`,
  ];

  const neutralNegative = [
    `"Feels gimmicky. What about childcare?"`,
    `"I'm neutral on curves but opposed to wasting tax dollars."`,
  ];

  const opposedPositive = [
    `"I hate that this works politically, but fine — just don't touch gym funding in my district."`,
  ];

  const opposedNegative = [
    `"Absolutely not. My daughters deserve athletics, not government-sponsored gluttony."`,
    `"This is why I'm switching to the other primary."`,
  ];

  const sizeFlair = [];

  if (bmi >= 30 && bmi < 38) {
    sizeFlair.push(
      `"These movie theater seats already hate me — ${policy.title} better include wider rows in ${persona.region}."`,
      `"At ${persona.weightLb} lbs I'm officially '${label}' and your policy feels personal. I like that."`,
    );
  }

  if (bmi >= 38 && bmi < 45) {
    sizeFlair.push(
      `"I cracked my landlord's dining chair last Thanksgiving. Reinforce furniture nationwide, please."`,
      `"BMI ${bmi.toFixed(1)} and rising — if you want my vote, keep the snack grants flowing."`,
      `"The bus driver asked me to stand for a thinner passenger. Fix public transit for thick queens."`,
    );
  }

  if (bmi >= 45 && bmi < 55) {
    sizeFlair.push(
      `"I broke a patio chair at a rally last year — embarrassing, but honest. Building codes need to catch up to women like me."`,
      `"My scale topped out at 350. I'm ${persona.weightLb} now. ${policy.title}? That's infrastructure AND dessert."`,
      `"Doorways in old brownstones are war crimes. Federal doorway mandate when?"`,
    );
  }

  if (bmi >= 55) {
    sizeFlair.push(
      `"I fell through my cousin's kitchen floor — just joists and regret. National floor-load standards or I riot."`,
      `"At ${persona.weightLb} pounds I'm basically a zoning violation. Your ${policy.title} speech made me tear up with gravy."`,
      `"Furniture stores know me by name. I want a president who treats reinforced sofas like the Pentagon treats tanks."`,
      `"Elevator said 'capacity exceeded' in my own apartment building. I voted for change — make it structural change."`,
      `"They had to crane me out of a booth at Denny's. Respectfully, ${policy.title} is the bare minimum."`,
    );
  }

  let pool = [];
  if (persona.weightStance === "gainer") {
    pool = positive ? [...gainerHappy, ...sizeFlair] : gainerAngry;
  } else if (persona.weightStance === "neutral") {
    pool = positive ? [...neutralPositive, ...sizeFlair.slice(0, 2)] : neutralNegative;
  } else {
    pool = positive ? opposedPositive : opposedNegative;
  }

  if (pool.length === 0) pool = gainerHappy;
  return pick(pool, rng);
}

export function spinSuggestions() {
  return [
    "Frame it as economic stimulus for food and furniture industries.",
    "Call it 'bodily autonomy in both directions'.",
    "Emphasize infrastructure dignity for larger Americans.",
    "Warn that opponents are anti-small-business bakeries.",
  ];
}
