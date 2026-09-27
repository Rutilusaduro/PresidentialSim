// The simulation. The female population is modelled as five attitude cohorts
// (Opposed → Devoted), each with a population share and an average weight.
// Persuasion moves women up the ladder; gain depends on attitude and on the
// national factors (abundance, leisure, culture, opposition, accommodation).

import { between, chance, clamp, fill, ibetween, pick, sample, uid } from "./util.js";
import { BILLS, CAMPAIGNS, DEPARTMENTS, EXEC_ORDERS, RESEARCH } from "./data/actions.js";
import { CABINET, INCIDENTS, SPECIAL_INCIDENTS } from "./data/cabinet.js";
import { EVENTS, OPP_MOVES } from "./data/events.js";
import { MILESTONES, bandOf, stageOf } from "./data/stages.js";
import { HANDLES, POSTS } from "./data/social.js";
import { ACHIEVEMENTS, US_STATES } from "./data/states.js";
import { FILLER_HEADLINES } from "./data/tv.js";

export const TERM_DAYS = 1461;
export const MIDTERM_DAY = 645;
export const WOMEN_MILLIONS = 168;

const ATT_MULT = [0.1, 0.4, 0.85, 1.35, 1.9];
const ATT_SCORE = [0, 25, 50, 75, 100];
const ATT_APPROVAL = [18, 40, 60, 80, 95];
const RESIST = [0.45, 0.85, 1.0, 1.05];

export const ALL_ACTIONS = [
  ...EXEC_ORDERS.map((a) => ({ ...a, kind: "eo" })),
  ...BILLS.map((a) => ({ ...a, kind: "bill" })),
  ...CAMPAIGNS.map((a) => ({ ...a, kind: "campaign" })),
  ...RESEARCH.map((a) => ({ ...a, kind: "research" })),
];
export const actionById = (id) => ALL_ACTIONS.find((a) => a.id === id);

export function newGame({ name = "Morgan", address = "Madam President", party = "abundance" } = {}) {
  const st = {
    v: 3,
    pres: { name, address, party },
    day: 0,
    term: 1,
    cohorts: [
      { share: 0.3, weight: 158 },
      { share: 0.3, weight: 168 },
      { share: 0.25, weight: 176 },
      { share: 0.12, weight: 184 },
      { share: 0.03, weight: 196 },
    ],
    f: { abundance: 20, leisure: 22, culture: 12, opposition: 40 },
    mods: { abundance: 0, leisure: 0, culture: 0, opposition: 0, persuade: 0, gainMult: 1, infraGrowth: 0, wardrobeGrowth: 0, income: 0 },
    pulse: 0,
    infra: { cap: 205 },
    wardrobe: { cap: 195 },
    approval: 54,
    congress: 50,
    budget: 80,
    pc: 40,
    sliders: { agri: 25, leisure: 15, media: 20, infra: 20, fashion: 20 },
    enacted: {},
    passed: {},
    researched: {},
    bills: [],
    research: null,
    campaigns: [],
    cooldowns: {},
    cabinet: CABINET.map((c) => ({ id: c.id, weight: c.weight, attitude: c.attitude, stage: stageOf(c.weight), lastLunch: -99 })),
    cabinetLog: [],
    lastMeeting: -99,
    lastSpeech: -99,
    lastPress: -99,
    history: [],
    news: [],
    feed: [],
    milestones: {},
    achievements: {},
    stats: { talks: 0, converts: 0, incidents: 0, billsPassed: 0, billsFailed: 0, midtermsWon: 0, channelsSeen: {}, peakGain: 0 },
    rallies: {},
    nextEvent: 14,
    seenEvents: {},
    pending: [], // queued popups: {type:'event'|'milestone'|'election'|'achievement', ...}
    gainToday: 0,
    over: null,
  };
  // Party perks
  if (party === "abundance") st.f.abundance += 6, st.mods.abundance += 6;
  if (party === "comfort") st.mods.leisure += 6, st.infra.cap += 15;
  if (party === "softpower") st.mods.culture += 6, st.f.culture += 6;
  if (party === "populist") st.approval += 5, st.pc += 20;
  derive(st);
  st.startAvg = st.avg;
  pushHistory(st);
  addNews(st, `${address} ${name} sworn in; promises 'an America with room for everyone, and seconds for everyone.'`, "inaugural");
  addNews(st, `Lean Coalition leader Sen. Vance Whitlock vows to 'fight this administration one salad at a time.'`, "opposition");
  return st;
}

/** Recompute cached aggregates. */
export function derive(st) {
  let avg = 0;
  let desire = 0;
  for (let i = 0; i < 5; i++) {
    avg += st.cohorts[i].share * st.cohorts[i].weight;
    desire += st.cohorts[i].share * ATT_SCORE[i];
  }
  st.avg = avg;
  st.desire = desire;
  st.cohortW = st.cohorts.map((c) => c.weight);
  st.infraStrain = clamp((avg - st.infra.cap) / 60, 0, 2);
  st.wardrobeStrain = clamp((avg - st.wardrobe.cap) / 60, 0, 2);
  st.strain = st.infraStrain * 0.6 + st.wardrobeStrain * 0.4;
}

export function campaignLive(st, key) {
  let v = 0;
  for (const c of st.campaigns) {
    const a = actionById(c.id);
    if (a?.live?.[key]) v += a.live[key];
  }
  return v;
}

export function cabinetPerks(st) {
  const out = {};
  for (const m of st.cabinet) {
    const def = CABINET.find((c) => c.id === m.id);
    const level = m.attitude - 1;
    out[def.perk.key] = (out[def.perk.key] || 0) + def.perk.per * level;
  }
  return out;
}

export function targets(st) {
  const perks = cabinetPerks(st);
  const s = st.sliders;
  return {
    abundance: clamp(12 + s.agri * 0.45 + st.mods.abundance + campaignLive(st, "abundance") + (perks.abundance || 0), 0, 130),
    leisure: clamp(14 + s.leisure * 0.4 + st.mods.leisure + campaignLive(st, "leisure") + (perks.leisure || 0), 0, 130),
    culture: clamp(4 + s.media * 0.5 + st.mods.culture + campaignLive(st, "culture") + (perks.culture || 0), 0, 130),
    opposition: clamp(18 + (100 - st.desire) * 0.3 + st.mods.opposition + campaignLive(st, "opposition") + (perks.opposition || 0), 0, 100),
    infraGrowth: 0.01 + s.infra * 0.003 + st.mods.infraGrowth + (perks.infraGrowth || 0),
    wardrobeGrowth: 0.01 + s.fashion * 0.003 + st.mods.wardrobeGrowth + campaignLive(st, "wardrobeGrowth") + (perks.wardrobeGrowth || 0),
    pcRate: 0.1 + st.approval / 280 + (perks.pc || 0),
    congressPerk: perks.congress || 0,
  };
}

/** Daily gain (lbs) for a woman of attitude `i` at weight `w`. */
export function gainFor(st, i, w) {
  const f = st.f;
  const abF = 0.4 + 2.6 * (1 - Math.exp(-f.abundance / 55));
  const leF = 0.55 + 1.9 * (1 - Math.exp(-f.leisure / 60));
  const oppF = 1 - f.opposition / 220;
  const strainF = 1 - 0.35 * Math.min(1, st.strain);
  const gm = 1 + (st.mods.gainMult - 1) * 0.6;
  const momentum = Math.min(1.6, Math.pow(Math.max(120, w) / 180, 0.2));
  return 0.03 * ATT_MULT[i] * abF * leF * gm * oppF * strainF * momentum;
}

export function persuasion(st) {
  const f = st.f;
  const comfort = clamp(0.0004 * (1 - st.strain * 2.5), -0.002, 0.0004);
  return 0.0007 * Math.sqrt(f.culture / 30) + st.mods.persuade * 0.35 + campaignLive(st, "persuade") * 0.5 + st.pulse + comfort - f.opposition * 0.000025;
}

export function dailyIncome(st) {
  return 1.45 + Math.min(2.5, (st.avg - 172) * 0.004) + st.f.abundance * 0.005 + st.mods.income;
}
export function dailySpend(st) {
  return Object.values(st.sliders).reduce((a, b) => a + b, 0) * 0.01;
}

/** Advance one day. */
export function tick(st) {
  if (st.over) return;
  st.day++;
  const t = targets(st);
  const prevAvg = st.avg;

  // Factors drift toward their targets.
  st.f.abundance += (t.abundance - st.f.abundance) * 0.03;
  st.f.leisure += (t.leisure - st.f.leisure) * 0.03;
  st.f.culture += (t.culture - st.f.culture) * 0.04;
  st.f.opposition += (t.opposition - st.f.opposition) * 0.02;
  st.infra.cap += t.infraGrowth;
  st.wardrobe.cap += t.wardrobeGrowth;

  // Gain
  for (let i = 0; i < 5; i++) {
    const c = st.cohorts[i];
    c.weight += gainFor(st, i, c.weight) * between(0.85, 1.15);
  }

  // Persuasion flows
  const P = persuasion(st);
  const flows = [0, 0, 0, 0];
  for (let i = 0; i < 4; i++) {
    if (P >= 0) flows[i] = st.cohorts[i].share * P * RESIST[i];
    else flows[i] = -st.cohorts[i + 1].share * -P * (i === 3 ? 0.3 : 0.6);
  }
  // Targeted campaigns add pressure only on their cohorts.
  for (const c of st.campaigns) {
    const a = actionById(c.id);
    if (a?.target) for (const i of a.target) if (i < 4) flows[i] += st.cohorts[i].share * a.live.persuade * 0.4;
  }
  for (let i = 0; i < 4; i++) moveShare(st, i, flows[i]);
  st.pulse *= 0.95;

  derive(st);
  st.gainToday = st.avg - prevAvg;
  st.stats.peakGain = Math.max(st.stats.peakGain, st.gainToday);

  // Approval
  let appT = 6 - st.strain * 8 - st.f.opposition * 0.08 + Math.min(6, (st.f.abundance - 20) * 0.05) + campaignLive(st, "approvalDrift");
  for (let i = 0; i < 5; i++) appT += st.cohorts[i].share * ATT_APPROVAL[i];
  if (st.budget < 0) appT -= 8;
  appT += Math.max(0, 8 - st.day / 15); // honeymoon
  st.approval = clamp(st.approval + (appT - st.approval) * 0.03, 3, 97);

  // Money and capital
  st.budget += dailyIncome(st) - dailySpend(st);
  st.pc = Math.min(200, st.pc + t.pcRate);
  st.congress = clamp(st.congress + t.congressPerk * 0.002, 10, 90);

  // Campaigns expire
  st.campaigns = st.campaigns.filter((c) => {
    if (st.day >= c.endDay) {
      addNews(st, `Campaign wraps: ${actionById(c.id).name}.`, "campaign");
      return false;
    }
    return true;
  });

  // Research progress
  if (st.research && st.day >= st.research.doneDay) {
    const r = actionById(st.research.id);
    st.researched[r.id] = st.day;
    applyEffects(st, r.effects, true);
    for (const n of r.news) addNews(st, n, "research");
    queue(st, { type: "notice", title: "Research complete", body: `${r.name}: ${r.desc}` });
    st.research = null;
  }

  // Bills come to a vote
  for (const b of st.bills.slice()) if (st.day >= b.voteDay) voteBill(st, b);

  cabinetTick(st);
  incidents(st);
  oppositionTick(st);
  feedTick(st);
  milestoneCheck(st);
  electionCheck(st);
  eventCheck(st);
  achievementCheck(st);
  if (st.day % 3 === 0) pushHistory(st);
  if (st.day % 9 === 0 && chance(0.6)) addNews(st, pick(FILLER_HEADLINES[bandOf(st.avg)]), "filler");
}

function moveShare(st, i, flow) {
  // Positive flow: from cohort i to i+1. Negative: from i+1 to i.
  const [from, to] = flow >= 0 ? [st.cohorts[i], st.cohorts[i + 1]] : [st.cohorts[i + 1], st.cohorts[i]];
  const amt = Math.min(Math.abs(flow), from.share - 0.002);
  if (amt <= 0) return;
  to.weight = (to.share * to.weight + amt * from.weight) / (to.share + amt);
  to.share += amt;
  from.share -= amt;
}

/** Instantly nudge a fraction of each cohort up one step. */
export function convert(st, frac) {
  for (let i = 3; i >= 0; i--) moveShare(st, i, st.cohorts[i].share * frac * RESIST[i]);
  derive(st);
}

/**
 * Apply an effects object. permanent=true shifts long-run targets (policies);
 * false nudges current values (events, press answers, speeches).
 */
export function applyEffects(st, e, permanent) {
  if (!e) return;
  for (const [k, v] of Object.entries(e)) {
    switch (k) {
      case "abundance":
      case "leisure":
      case "culture":
      case "opposition":
        if (permanent) st.mods[k] += v;
        st.f[k] = clamp(st.f[k] + (permanent ? v * 0.3 : v), 0, 160);
        break;
      case "persuade":
        if (permanent) st.mods.persuade += v;
        else st.pulse += v * 0.05;
        break;
      case "gainMult":
        st.mods.gainMult *= v;
        break;
      case "infraGrowth":
      case "wardrobeGrowth":
      case "income":
        st.mods[k] += v;
        break;
      case "infraCap":
        st.infra.cap += v;
        break;
      case "wardrobeCap":
        st.wardrobe.cap += v;
        break;
      case "approval":
        st.approval = clamp(st.approval + v, 3, 97);
        break;
      case "pc":
        st.pc = Math.max(0, st.pc + v);
        break;
      case "budget":
        st.budget += v;
        break;
      case "congress":
        st.congress = clamp(st.congress + v, 10, 90);
        break;
      case "convert":
        convert(st, v);
        break;
    }
  }
  derive(st);
}

// ---------------------------------------------------------------- actions

export function actionStatus(st, a) {
  if (a.requires?.avg && st.avg < a.requires.avg) return { ok: false, why: `Unlocks at ${a.requires.avg} lb national avg` };
  if (Array.isArray(a.requires)) {
    const miss = a.requires.filter((r) => !st.researched[r]);
    if (miss.length) return { ok: false, why: `Requires: ${miss.map((m) => actionById(m).name).join(", ")}` };
  }
  if (a.kind === "eo" && st.enacted[a.id]) return { ok: false, done: true, why: "Signed" };
  if (a.kind === "bill") {
    if (st.passed[a.id]) return { ok: false, done: true, why: "Law of the land" };
    const pending = st.bills.find((b) => b.id === a.id);
    if (pending) return { ok: false, pending: true, why: `Vote in ${pending.voteDay - st.day} days` };
    if (st.cooldowns[a.id] > st.day) return { ok: false, why: `Can reintroduce in ${st.cooldowns[a.id] - st.day} days` };
  }
  if (a.kind === "campaign") {
    const live = st.campaigns.find((c) => c.id === a.id);
    if (live) return { ok: false, pending: true, why: `Running: ${live.endDay - st.day} days left` };
    if (st.cooldowns[a.id] > st.day) return { ok: false, why: `Cooldown: ${st.cooldowns[a.id] - st.day} days` };
  }
  if (a.kind === "research") {
    if (st.researched[a.id]) return { ok: false, done: true, why: "Complete" };
    if (st.research?.id === a.id) return { ok: false, pending: true, why: `${st.research.doneDay - st.day} days left` };
    if (st.research) return { ok: false, why: "Lab busy" };
  }
  const c = a.cost || {};
  if (c.pc && st.pc < c.pc) return { ok: false, why: `Need ${c.pc} PC` };
  if (c.budget && st.budget < c.budget) return { ok: false, why: `Need $${c.budget}B` };
  return { ok: true };
}

export function takeAction(st, id) {
  const a = actionById(id);
  const s = actionStatus(st, a);
  if (!s.ok) return s.why;
  const c = a.cost || {};
  st.pc -= c.pc || 0;
  st.budget -= c.budget || 0;
  if (a.kind === "eo") {
    st.enacted[a.id] = st.day;
    applyEffects(st, a.effects, true);
    for (const n of a.news) addNews(st, n, "eo");
  } else if (a.kind === "bill") {
    st.bills.push({ id: a.id, voteDay: st.day + a.days, lobby: 0 });
    addNews(st, `${a.name} introduced in Congress. Vote expected in ${a.days} days.`, "bill");
  } else if (a.kind === "campaign") {
    st.campaigns.push({ id: a.id, endDay: st.day + a.duration });
    st.cooldowns[a.id] = st.day + a.duration + a.cooldown;
    for (const n of a.news) addNews(st, n, "campaign");
  } else if (a.kind === "research") {
    st.research = { id: a.id, doneDay: st.day + a.days, start: st.day };
    addNews(st, `Institute of Abundance begins work on '${a.name}.'`, "research");
  }
  return null;
}

export function billOdds(st, b) {
  const a = actionById(b.id);
  return clamp(0.5 + (st.congress - 50) / 45 + (st.approval - 50) / 90 - a.difficulty / 100 + b.lobby * 0.08, 0.04, 0.96);
}

export function lobbyBill(st, id) {
  const b = st.bills.find((x) => x.id === id);
  if (!b || b.lobby >= 4 || st.pc < 8) return false;
  st.pc -= 8;
  b.lobby++;
  return true;
}

function voteBill(st, b) {
  st.bills = st.bills.filter((x) => x !== b);
  const a = actionById(b.id);
  const p = billOdds(st, b);
  if (Math.random() < p) {
    st.passed[a.id] = st.day;
    st.stats.billsPassed++;
    applyEffects(st, a.effects, true);
    for (const n of a.news) addNews(st, n, "bill");
    queue(st, { type: "notice", title: "Bill passed!", body: `${a.name} passed Congress ${Math.round(p * 100)}% odds. ${a.desc}`, good: true });
  } else {
    st.stats.billsFailed++;
    st.cooldowns[a.id] = st.day + 45;
    st.pc += Math.round((a.cost?.pc || 0) * 0.4);
    addNews(st, `${a.name} fails in Congress. Lean Coalition celebrates with a kale reception.`, "bill");
    queue(st, { type: "notice", title: "Bill failed", body: `${a.name} fell short in Congress. You recovered some political capital. It can be reintroduced in 45 days.` });
  }
}

// ---------------------------------------------------------------- cabinet

function cabinetTick(st) {
  for (const m of st.cabinet) {
    const def = CABINET.find((c) => c.id === m.id);
    m.weight += gainFor(st, m.attitude, m.weight) * def.gm * 1.35 * between(0.7, 1.3);
    // The mood of the country rubs off on the Cabinet.
    if (m.attitude < 4 && chance(0.0012 * (0.5 + st.desire / 50))) {
      m.attitude++;
      logCabinet(st, `${def.first} seems to have warmed to the agenda. She's now ${["Opposed", "Reluctant", "Curious", "Eager", "Devoted"][m.attitude]}.`);
    }
    const s = stageOf(m.weight);
    if (s > m.stage) {
      m.stage = s;
      const specials = (SPECIAL_INCIDENTS[m.id] || []).filter((x) => x.stage === s);
      const line = specials.length ? specials[0].text : fill(pick(INCIDENTS[Math.min(9, s)] || INCIDENTS[9]), { first: def.first, title: def.title });
      logCabinet(st, line, true);
      if (s >= 3) addNews(st, `${def.title} ${def.name.split(" ").slice(-1)[0]} now reportedly a '${["", "", "", "chubby", "fat", "very fat", "huge", "enormous", "immense", "colossal"][s]}' ${Math.round(m.weight)} lbs, sources say.`, "cabinet");
    }
  }
}

export function logCabinet(st, text, incident) {
  st.cabinetLog.unshift({ day: st.day, text, incident: !!incident });
  st.cabinetLog.length = Math.min(st.cabinetLog.length, 40);
}

// ---------------------------------------------------------------- flavor systems

const INFRA_GAGS = [
  "A park bench in {city} gives way under a lunching office worker. She finishes her sandwich on the ground, laughing.",
  "Bleachers at a {city} high-school reunion buckle. Nobody is hurt; everyone is annoyed the nachos spilled.",
  "An elevator in {city} refuses to move with four women aboard. They take two trips, and get pastries between.",
  "A {city} woman gets stuck in a vintage phone booth. Firefighters free her; she thanks them with cookies.",
  "A diner in {city} replaces all its booths with tables after the third one splits this week.",
  "Theater seats in {city} are ripped out mid-performance and replaced with loveseats. The show goes on.",
  "A porch swing in {city} lets go with a bang. Its owner calls it 'a sign of a good summer.'",
  "A {city} bus driver reports three passengers 'couldn't fit past the fare box.' The city is ordering wider buses.",
];
const WARDROBE_GAGS = [
  "A {city} bank teller's blouse gives up a button mid-shift. It ricochets off the bulletproof glass.",
  "A bridesmaid in {city} splits her dress on the dance floor. She keeps dancing.",
  "Retailers in {city} report entire racks sold out overnight. 'We can't stock sizes fast enough.'",
  "A {city} news anchor's zipper gives out live on air. Ratings spike.",
  "A {city} woman sets the office record: three waistbands defeated in one quarter.",
];
const CITIES = ["Omaha", "Tulsa", "Boise", "Tampa", "Fresno", "Dayton", "Reno", "Raleigh", "Lubbock", "Spokane", "Akron", "Mobile", "Toledo", "Madison", "Des Moines"];

function incidents(st) {
  if (st.strain > 0.05 && chance(0.015 + st.strain * 0.18)) {
    const infra = Math.random() < st.infraStrain / (st.infraStrain + st.wardrobeStrain + 0.001);
    const text = fill(pick(infra ? INFRA_GAGS : WARDROBE_GAGS), { city: CITIES });
    st.stats.incidents++;
    st.f.culture += 0.6;
    st.approval -= 0.25 * st.strain;
    addNews(st, text, infra ? "incident" : "wardrobe");
  }
}

function oppositionTick(st) {
  if (st.f.opposition > 42 && chance(0.012 + (st.f.opposition - 42) * 0.0006)) {
    const m = pick(OPP_MOVES);
    applyEffects(st, m.effects, false);
    addNews(st, fill(m.text, { state: US_STATES.map((s) => s[1]) }), "opposition");
  }
}

export function makePost(st, att) {
  if (att == null) {
    let r = Math.random();
    att = 0;
    for (let i = 0; i < 5; i++) {
      r -= st.cohorts[i].share;
      if (r <= 0) { att = i; break; }
    }
  }
  const w = st.cohorts[att].weight * between(0.85, 1.2);
  const band = bandOf(w);
  const handle = "@" + fill(pick(HANDLES), { n: ibetween(2, 99) });
  return {
    id: uid(),
    day: st.day,
    handle,
    seed: handle,
    weight: w,
    att,
    text: fill(pick(POSTS[att][band]), { pres: `${st.pres.address.split(" ").pop()} ${st.pres.name}`, address: st.pres.address }),
    likes: Math.round(between(5, 400) * (1 + att) * (1 + st.f.culture / 30)),
  };
}

function feedTick(st) {
  if (chance(0.55)) {
    st.feed.unshift(makePost(st));
    st.feed.length = Math.min(st.feed.length, 50);
  }
}

function milestoneCheck(st) {
  for (const m of MILESTONES) {
    if (st.avg >= m.at && !st.milestones[m.at]) {
      st.milestones[m.at] = st.day;
      addNews(st, `MILESTONE: ${m.title}. ${m.body}`, "milestone");
      queue(st, { type: "milestone", title: m.title, body: m.body, at: m.at });
      applyEffects(st, { culture: 3 }, false);
    }
  }
}

function electionCheck(st) {
  const termDay = st.day - (st.term - 1) * TERM_DAYS;
  if (termDay === MIDTERM_DAY) {
    const won = st.approval >= 46;
    const swing = (st.approval - 48) * 0.6 + between(-4, 4);
    st.congress = clamp(st.congress + swing, 15, 85);
    if (won) st.stats.midtermsWon++;
    queue(st, {
      type: "election",
      title: won ? "Midterms: Your coalition holds!" : "Midterms: A rough night",
      body: won
        ? `With ${Math.round(st.approval)}% approval, voters reward the abundance agenda. Congressional support is now ${Math.round(st.congress)}%.`
        : `The Lean Coalition gains seats. Congressional support drops to ${Math.round(st.congress)}%. Bills will be harder to pass.`,
      good: won,
    });
    addNews(st, won ? "Midterms: Abundance coalition holds Congress" : "Midterms: Lean Coalition gains seats", "election");
  }
  if (termDay === TERM_DAYS) {
    const vote = clamp(st.approval + (st.desire - 45) * 0.12 + between(-2, 2), 5, 95);
    st.lastVote = vote;
    if (st.term >= 2) {
      st.over = { kind: "legacy", vote };
      queue(st, { type: "ending" });
    } else if (vote >= 50) {
      st.term = 2;
      queue(st, {
        type: "election",
        title: "RE-ELECTED!",
        body: `You win with ${vote.toFixed(1)}% of the vote. Four more years of abundance. The average American woman now weighs ${Math.round(st.avg)} lbs, and she voted for you.`,
        good: true,
      });
      addNews(st, `${st.pres.address} ${st.pres.name} wins re-election in a landslide of second helpings`, "election");
      st.pc += 40;
    } else {
      st.over = { kind: "defeat", vote };
      queue(st, { type: "ending" });
    }
  }
}

function eventCheck(st) {
  if (st.day < st.nextEvent) return;
  if (st.pending.some((p) => p.type === "event")) return;
  const vp = st.cabinet.find((c) => c.id === "vp");
  const sg = st.cabinet.find((c) => c.id === "sg");
  const eligible = EVENTS.filter((e) => {
    if (st.seenEvents[e.id] && st.day - st.seenEvents[e.id] < 300) return false;
    if (e.min && st.avg < e.min) return false;
    if (e.max && st.avg > e.max) return false;
    if (e.minDesire && st.desire < e.minDesire) return false;
    if (e.infra && st.infraStrain < 0.3) return false;
    if (e.wardrobe && st.wardrobeStrain < 0.3) return false;
    if (e.maxVp != null && vp.attitude > e.maxVp) return false;
    if (e.maxSg != null && sg.attitude > e.maxSg) return false;
    return true;
  });
  st.nextEvent = st.day + ibetween(22, 42);
  if (!eligible.length) return;
  const e = pick(eligible);
  st.seenEvents[e.id] = st.day;
  queue(st, { type: "event", id: e.id, state: pick(US_STATES)[1] });
}

function achievementCheck(st) {
  for (const a of ACHIEVEMENTS) {
    if (!st.achievements[a.id] && a.test(st)) {
      st.achievements[a.id] = st.day;
      queue(st, { type: "achievement", title: a.name, body: a.desc });
    }
  }
}

export function queue(st, item) {
  st.pending.push(item);
}

export function addNews(st, text, tag = "news") {
  st.news.unshift({ id: uid(), day: st.day, text, tag });
  st.news.length = Math.min(st.news.length, 80);
}

function pushHistory(st) {
  st.history.push({
    d: st.day,
    avg: +st.avg.toFixed(1),
    des: +st.desire.toFixed(1),
    app: +st.approval.toFixed(1),
    sh: st.cohorts.map((c) => +c.share.toFixed(4)),
    ic: +st.infra.cap.toFixed(0),
    wc: +st.wardrobe.cap.toFixed(0),
  });
  if (st.history.length > 1000) st.history.splice(0, st.history.length - 1000);
}

// ---------------------------------------------------------------- helpers for views

export function stateAvg(st, code) {
  const row = US_STATES.find((s) => s[0] === code);
  return st.avg * row[5] + (st.rallies[code] || 0) * 4;
}

export function womanWeight(st, att) {
  return st.cohorts[att].weight * between(0.8, 1.25);
}

export function pickAttitude(st) {
  let r = Math.random();
  for (let i = 0; i < 5; i++) {
    r -= st.cohorts[i].share;
    if (r <= 0) return i;
  }
  return 4;
}

export { DEPARTMENTS, sample };
