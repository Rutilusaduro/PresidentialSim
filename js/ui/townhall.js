import { between, clamp, esc, fill, ibetween, lb, pick, shortDate } from "../util.js";
import { APPROACHES, BODY_LINES, CITIES, DEVOTED_LINES, FIRST, JOBS, LAST, OPENERS, SHIFT_LINES } from "../data/voters.js";
import { bandOf, dressSize, stageName } from "../data/stages.js";
import { addNews, applyEffects, pickAttitude } from "../sim.js";
import { bodySVG } from "./body.js";
import { attBadge } from "./common.js";

const COST = 3;
const COOLDOWN = 8;
const PER_HALL = 4;

let hall = null; // { city, voters, idx, result }

function makeVoter(st, city) {
  const att = pickAttitude(st);
  const w = st.cohorts[att].weight * between(0.82, 1.25);
  const [c, s] = Math.random() < 0.5 ? city : pick(CITIES);
  const first = pick(FIRST);
  const v = { first, name: `${first} ${pick(LAST)}`, age: ibetween(24, 63), job: pick(JOBS), city: c, st: s, weight: w, att, seed: first + Math.random() };
  const ctx = { first, city: c, job: v.job, size: dressSize(w), address: st.pres.address };
  v.opener = fill(pick(OPENERS[att][bandOf(w)]), ctx);
  v.body = fill(pick(BODY_LINES[att <= 1 ? 0 : 1][bandOf(w)]), ctx);
  return v;
}

function odds(st, ap, v) {
  let p = ap.odds[v.att];
  if (ap.bonus === "enacted") p += Math.min(0.15, (Object.keys(st.enacted).length + Object.keys(st.passed).length) * 0.012);
  if (ap.bonus === "abundance") p += (st.f.abundance - 20) / 400;
  if (ap.bonus === "culture") p += st.f.culture / 500;
  if (ap.bonus === "comfort") p += st.strain < 0.1 ? 0.1 : -0.12;
  if (ap.bonus === "approval") p += (st.approval - 50) / 300;
  return clamp(p, 0.03, 0.95);
}

export const townhall = {
  title: "Town Hall",
  icon: "🗣️",
  render(st) {
    if (!hall) return lobby(st);
    const v = hall.voters[hall.idx];
    return `
    <div class="th-head"><h2>Town Hall · ${esc(hall.city[0])}, ${esc(hall.city[1])}</h2><span class="muted">Voter ${hall.idx + 1} of ${hall.voters.length}</span></div>
    <div class="th-layout">
      <div class="card th-voter">
        <div class="th-fig">${bodySVG({ weight: v.weight, seed: v.seed })}</div>
        <div class="th-id">
          <h3>${esc(v.name)}, ${v.age}</h3>
          <div class="muted">${esc(v.job)} · ${esc(v.city)}, ${esc(v.st)}</div>
          <div class="th-tags">${attBadge(v.att)}<span class="tag">${lb(v.weight)}</span><span class="tag">${stageName(v.weight)}</span><span class="tag">${dressSize(v.weight)}</span></div>
        </div>
      </div>
      <div class="th-talk">
        <div class="bubble">“${esc(v.opener)}”<br><br>“${esc(v.body)}”</div>
        ${hall.result ? resultBox(hall.result) : approaches(st, v)}
      </div>
    </div>`;
  },
  bind(root, st, ctx) {
    root.onclick = (e) => {
      if (e.target.closest("[data-hold]")) {
        if (st.pc < COST) return ctx.toast("Not enough political capital.");
        if (st.day - (st.lastHall ?? -99) < COOLDOWN) return;
        st.pc -= COST;
        st.lastHall = st.day;
        const city = pick(CITIES);
        hall = { city, voters: Array.from({ length: PER_HALL }, () => makeVoter(st, city)), idx: 0, result: null };
        ctx.hud();
        ctx.rerender();
      }
      const a = e.target.closest("[data-ap]");
      if (a && hall && !hall.result) resolve(st, APPROACHES.find((x) => x.id === a.dataset.ap), ctx);
      if (e.target.closest("[data-next]")) {
        hall.idx++;
        hall.result = null;
        if (hall.idx >= hall.voters.length) {
          addNews(st, `${st.pres.address} ${st.pres.name} holds town hall in ${hall.city[0]}; ${hall.converted || 0} of ${hall.voters.length} voters won over.`, "townhall");
          hall = null;
        }
        ctx.rerender();
      }
      if (e.target.closest("[data-end]")) {
        hall = null;
        ctx.rerender();
      }
    };
  },
};

function lobby(st) {
  const wait = COOLDOWN - (st.day - (st.lastHall ?? -99));
  const log = (st.talkLog || []).slice(0, 12);
  return `
  <div class="card th-lobby">
    <div class="card-kicker">Retail politics</div>
    <h2>Hold a Town Hall</h2>
    <p>Meet ${PER_HALL} real American women face to face. Hear how their lives (and waistlines) are changing, and try to win them over. Every conversion nudges the whole country a little, and they talk to their friends.</p>
    <p class="muted">Costs ${COST} PC · once every ${COOLDOWN} days. Odds depend on her attitude, your record, and the national mood.</p>
    ${wait > 0 ? `<button class="btn" disabled>Next town hall in ${wait} days</button>` : `<button class="btn btn-gold btn-lg" data-hold>Hold a town hall</button>`}
    <p class="muted small">Voters met: ${st.stats.talks} · won over: ${st.stats.converts}</p>
  </div>
  ${log.length ? `<div class="card"><div class="card-kicker">Past conversations</div><ul class="news-list">${log.map((l) => `<li><time>${shortDate(l.day)}</time>${esc(l.text)}</li>`).join("")}</ul></div>` : ""}`;
}

function approaches(st, v) {
  return `<div class="ap-grid">${APPROACHES.map((ap) => {
    const p = odds(st, ap, v);
    return `<button class="btn ap" data-ap="${ap.id}">${esc(fill(ap.name, { address: st.pres.address }))}<small>${Math.round(p * 100)}% chance${ap.id === "dare" ? " · risky" : ""}</small></button>`;
  }).join("")}</div>
  <button class="btn btn-sm ghost" data-end>Leave town hall</button>`;
}

function resultBox(r) {
  return `<div class="result ${r.ok ? "good" : "bad"}"><p>${esc(r.text)}</p>${r.shift ? `<p class="shift">${esc(r.shift)}</p>` : ""}<p class="muted small">${esc(r.fx)}</p><button class="btn btn-gold" data-next>Next voter →</button></div>`;
}

function resolve(st, ap, ctx) {
  const v = hall.voters[hall.idx];
  const p = odds(st, ap, v);
  const ok = Math.random() < p;
  const vars = { first: v.first, address: st.pres.address };
  st.stats.talks++;
  let shift = "";
  let fx = "";
  if (ok) {
    if (v.att < 4) {
      v.att++;
      shift = fill(pick(SHIFT_LINES[v.att]), vars);
      st.stats.converts++;
      hall.converted = (hall.converted || 0) + 1;
      applyEffects(st, { convert: 0.0015, approval: 0.4 }, false);
      fx = "National effect: a few more women come around (+Desire, +Approval).";
    } else {
      shift = fill(pick(DEVOTED_LINES), vars);
      v.weight += between(3, 9);
      applyEffects(st, { culture: 0.8, approval: 0.3 }, false);
      fx = "Her enthusiasm spreads online (+Culture).";
    }
    if (ap.id === "listen") applyEffects(st, { approval: 0.8 }, false);
  } else {
    if (ap.id === "dare") {
      applyEffects(st, { approval: -1.5, opposition: 1.5 }, false);
      fx = "The clip makes the rounds (−Approval, +Opposition).";
    } else if (ap.id === "listen") {
      applyEffects(st, { approval: 0.5 }, false);
      fx = "She appreciated being heard (+Approval).";
    } else fx = "No change.";
  }
  const text = fill(pick(ok ? ap.success : ap.fail), vars);
  hall.result = { ok, text, shift, fx };
  st.talkLog = st.talkLog || [];
  st.talkLog.unshift({ day: st.day, text: `${v.name} (${v.city}, ${Math.round(v.weight)} lb): ${ok ? (shift || "won over") : "unmoved"}` });
  st.talkLog.length = Math.min(st.talkLog.length, 30);
  ctx.hud();
  ctx.rerender();
}
