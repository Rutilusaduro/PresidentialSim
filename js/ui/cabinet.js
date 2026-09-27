import { between, chance, esc, fill, lb, pick, sample, shortDate } from "../util.js";
import { AGENDA, ATTITUDES, CABINET, INCIDENTS, SPECIAL_INCIDENTS } from "../data/cabinet.js";
import { dressSize, stageName, stageOf } from "../data/stages.js";
import { addNews, applyEffects, logCabinet } from "../sim.js";
import { bodySVG } from "./body.js";
import { attBadge, effectChips } from "./common.js";

const LUNCH_CD = 10;
const MEETING_CD = 30;

let chat = null; // { id, text }
let meeting = null; // { incidents, agenda, chosen }

const def = (id) => CABINET.find((c) => c.id === id);

function incidentFor(m, used = new Set()) {
  const d = def(m.id);
  const s = stageOf(m.weight);
  const specials = (SPECIAL_INCIDENTS[m.id] || []).filter((x) => x.stage <= s && !used.has(x.text));
  if (specials.length && chance(0.35)) {
    const t = pick(specials).text;
    used.add(t);
    return t;
  }
  const pool = INCIDENTS[Math.max(1, Math.min(9, s))];
  const fresh = pool.filter((t) => !used.has(t));
  const tpl = pick(fresh.length ? fresh : pool);
  used.add(tpl);
  return fill(tpl, { first: d.first, title: d.title });
}

export const cabinet = {
  title: "Cabinet",
  icon: "👔",
  auto: 1200,
  hold: () => !!meeting,
  render(st) {
    const total = st.cabinet.reduce((a, c) => a + c.weight, 0);
    const start = CABINET.reduce((a, c) => a + c.weight, 0);
    const meetReady = st.day - st.lastMeeting >= MEETING_CD;
    if (meeting) return meetingView(st);
    return `
    <div class="cab-head card">
      <div>
        <div class="card-kicker">The Cabinet Room</div>
        <h2>Your Cabinet <small>${lb(total)} combined · +${lb(total - start)} since inauguration</small></h2>
        <p class="muted">They eat at the White House mess, so they grow faster than the country. Win each of them over to unlock stronger perks.</p>
      </div>
      ${meetReady ? `<button class="btn btn-gold btn-lg" data-meet>Convene Cabinet meeting</button>` : `<button class="btn" disabled>Next meeting in ${MEETING_CD - (st.day - st.lastMeeting)} days</button>`}
    </div>
    <div class="cab-grid">${st.cabinet.map((m) => memberCard(st, m)).join("")}</div>
    <div class="card"><div class="card-kicker">West Wing gossip</div>
      <ul class="news-list">${st.cabinetLog.slice(0, 14).map((l) => `<li class="${l.incident ? "tag-incident" : ""}"><time>${shortDate(l.day)}</time>${esc(l.text)}</li>`).join("") || "<li class='muted'>Quiet so far. Give it time.</li>"}</ul>
    </div>`;
  },
  bind(root, st, ctx) {
    root.onclick = (e) => {
      const lunch = e.target.closest("[data-lunch]");
      if (lunch) {
        const m = st.cabinet.find((x) => x.id === lunch.dataset.lunch);
        const d = def(m.id);
        if (st.day - m.lastLunch < LUNCH_CD) return;
        m.lastLunch = st.day;
        const gain = between(3, 7) * (1 + m.attitude * 0.4);
        m.weight += gain;
        let msg = `Lunch with ${d.first}: ${pick(LUNCH_LINES[Math.min(4, m.attitude)])} (+${gain.toFixed(1)} lb)`;
        if (m.attitude < 4 && chance(0.3 + m.attitude * 0.05)) {
          m.attitude++;
          msg += ` ${d.first} is now ${ATTITUDES[m.attitude]}!`;
        }
        logCabinet(st, msg);
        chat = { id: m.id, text: msg };
        ctx.rerender();
      }
      const talk = e.target.closest("[data-chat]");
      if (talk) {
        const m = st.cabinet.find((x) => x.id === talk.dataset.chat);
        const d = def(m.id);
        chat = { id: m.id, text: `“${fill(d.lines[m.attitude], { address: st.pres.address })}” ${incidentFor(m)}` };
        ctx.rerender();
      }
      if (e.target.closest("[data-meet]")) {
        st.lastMeeting = st.day;
        const members = sample(st.cabinet, 4);
        const used = new Set();
        meeting = {
          incidents: members.map((m) => incidentFor(m, used)),
          agenda: sample(AGENDA, 3),
          chosen: null,
        };
        ctx.rerender();
      }
      const ag = e.target.closest("[data-agenda]");
      if (ag && meeting && meeting.chosen == null) {
        meeting.chosen = +ag.dataset.agenda;
        const item = meeting.agenda[meeting.chosen];
        applyEffects(st, item.effects, false);
        addNews(st, `Cabinet meeting: ${item.title}.`, "cabinet");
        for (const t of meeting.incidents) logCabinet(st, t, true);
        ctx.hud();
        ctx.rerender();
      }
      if (e.target.closest("[data-adjourn]")) {
        meeting = null;
        ctx.rerender();
      }
    };
  },
};

function memberCard(st, m) {
  const d = def(m.id);
  const perks = m.attitude - 1;
  const perkVal = d.perk.per * perks;
  const lunchReady = st.day - m.lastLunch >= LUNCH_CD;
  const gained = m.weight - d.weight;
  return `<article class="card member">
    <div class="member-fig">${bodySVG({ weight: m.weight, seed: d.id, look: d.look, suit: true })}</div>
    <div class="member-info">
      <h4>${esc(d.name)}</h4>
      <div class="muted small">${esc(d.title)}</div>
      <div class="th-tags">${attBadge(m.attitude)}<span class="tag">${lb(m.weight)}</span><span class="tag">${stageName(m.weight)}</span></div>
      <div class="small">${dressSize(m.weight)} · <span class="up">+${gained.toFixed(0)} lb</span> this administration</div>
      <div class="small perk ${perkVal * Math.sign(d.perk.per) > 0 ? "good" : perkVal === 0 ? "" : "bad"}">Perk: ${esc(d.perk.label)} ${perkVal >= 0 ? "+" : ""}${+perkVal.toFixed(3)}</div>
      ${chat?.id === m.id ? `<div class="bubble small-b">${esc(chat.text)}</div>` : `<p class="small muted">${esc(d.bio)}</p>`}
      <div class="member-actions">
        <button class="btn btn-sm" data-chat="${m.id}">Check in</button>
        ${lunchReady ? `<button class="btn btn-sm btn-gold" data-lunch="${m.id}">Lunch together</button>` : `<button class="btn btn-sm" disabled>Lunch in ${LUNCH_CD - (st.day - m.lastLunch)}d</button>`}
      </div>
    </div>
  </article>`;
}

function meetingView(st) {
  return `
  <div class="card meeting">
    <div class="card-kicker">Cabinet meeting · ${shortDate(st.day)}</div>
    <h2>The Cabinet Room</h2>
    <div class="meeting-table">${st.cabinet.map((m) => `<div class="seat" title="${esc(def(m.id).name)} · ${Math.round(m.weight)} lb">${bodySVG({ weight: m.weight, seed: m.id, look: def(m.id).look, suit: true })}<small>${esc(def(m.id).first)}</small></div>`).join("")}</div>
    <h3>Around the table</h3>
    <ul class="incident-list">${meeting.incidents.map((t) => `<li>${esc(t)}</li>`).join("")}</ul>
    <h3>${meeting.chosen == null ? "Choose today's agenda item" : "Agreed"}</h3>
    <div class="choices">${meeting.agenda
      .map((a, i) => `<button class="btn choice ${meeting.chosen === i ? "chosen" : ""}" data-agenda="${i}" ${meeting.chosen != null ? "disabled" : ""}>${esc(a.title)}<small>“${esc(a.line)}”</small><small>${effectChips(a.effects)}</small></button>`)
      .join("")}</div>
    ${meeting.chosen != null ? `<button class="btn btn-gold" data-adjourn>Adjourn (the dessert cart is waiting)</button>` : ""}
  </div>`;
}

const LUNCH_LINES = [
  ["She orders a side salad, then steals half your fries.", "She pushes the bread basket away. Then back. Then empties it."],
  ["She hesitates over the dessert menu for a long time, then orders two.", "She says she'll 'just have a bite' of your cheesecake. It's gone."],
  ["She orders the chef's tasting menu and asks what's off-menu.", "She finishes her plate, then yours, then asks about the cheese course."],
  ["She has three courses and a second dessert, and loosens her waistband with a contented sigh.", "The mess staff know her order by heart now: 'Everything, twice.'"],
  ["She orders the whole dessert cart and eats slowly, glowing, one hand resting on her belly.", "Lunch runs two hours. She has to be helped up afterward, and she laughs about it the whole time."],
].map((x) => x);
