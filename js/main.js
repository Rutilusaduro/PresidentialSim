import { $, $$, dateOf, esc, fill, lb, lb1, money, pick } from "./util.js";
import { TERM_DAYS, addNews, applyEffects, derive, newGame, tick } from "./sim.js";
import { CABINET } from "./data/cabinet.js";
import { EVENTS } from "./data/events.js";
import { STAGES, dressSize, stageName } from "./data/stages.js";
import { ACHIEVEMENTS } from "./data/states.js";
import { bodySVG } from "./ui/body.js";
import { VIEWS } from "./ui/views.js";
import { endingFor } from "./ui/endings.js";
import { effectChips } from "./ui/common.js";

const SAVE_KEY = "curves-oval-v3";
const SPEEDS = [0, 1000, 500, 220, 90];

const app = {
  st: null,
  view: "oval",
  speed: 1,
  lastSpeed: 1,
  timer: null,
  modalOpen: false,
  lastRender: 0,
};
window.__app = app; // handy for debugging in the console

// ------------------------------------------------------------------ boot

function boot() {
  const saved = load();
  renderSplash(!!saved);
}

function save() {
  if (!app.st) return;
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(app.st));
  } catch {}
}

function load() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return null;
    const st = JSON.parse(raw);
    if (st.v !== 3) return null;
    return st;
  } catch {
    return null;
  }
}

document.addEventListener("visibilitychange", () => document.hidden && save());
window.addEventListener("beforeunload", save);

// ------------------------------------------------------------------ splash / setup

function renderSplash(hasSave) {
  stopLoop();
  $("#hud").hidden = true;
  $("#nav").hidden = true;
  const demo = [175, 240, 330, 460, 640];
  $("#view").innerHTML = `
  <section class="splash">
    <div class="splash-figs">${demo.map((w, i) => `<div class="splash-fig" style="--i:${i}">${bodySVG({ weight: w, seed: "splash" + i })}</div>`).join("")}</div>
    <h1 class="splash-title">Curves in the Oval</h1>
    <p class="splash-sub">The weight-forward presidential simulator</p>
    <p class="splash-copy">You are the President of the United States, and you have one great project: a softer, rounder, happier America.
    Sign orders, pass laws, fund propaganda and mad science, and convince the nation's women that they <em>want</em> to grow.
    Then turn on the TV and watch it happen live.</p>
    <div class="splash-actions">
      ${hasSave ? `<button class="btn btn-gold" data-a="continue">Continue presidency</button>` : ""}
      <button class="btn ${hasSave ? "" : "btn-gold"}" data-a="new">New presidency</button>
    </div>
    <p class="fine">Fictional satire for adults (18+). All characters are fictional adults.</p>
  </section>`;
  $("#view").onclick = (e) => {
    const a = e.target.closest("[data-a]")?.dataset.a;
    if (a === "continue") {
      app.st = load();
      derive(app.st);
      startGame();
    }
    if (a === "new") renderSetup();
  };
}

const PARTIES = [
  { id: "abundance", name: "The Abundance Party", perk: "+6 Abundance from day one", icon: "🍰" },
  { id: "comfort", name: "The Comfort Caucus", perk: "+6 Leisure, +15 lb accommodation", icon: "🛋️" },
  { id: "softpower", name: "The Soft Power Party", perk: "+6 Culture from day one", icon: "📣" },
  { id: "populist", name: "The Populist Pastry Party", perk: "+5% approval, +20 political capital", icon: "🥐" },
];

function renderSetup() {
  $("#view").innerHTML = `
  <section class="setup card">
    <h2>Inauguration Day</h2>
    <label class="field"><span>Your name</span><input id="pname" maxlength="24" value="Morgan Hale" /></label>
    <label class="field"><span>Form of address</span>
      <select id="paddr">
        <option>Madam President</option><option>Mr. President</option><option>President</option>
      </select></label>
    <div class="field"><span>Your party</span>
      <div class="party-grid">
        ${PARTIES.map((p, i) => `<label class="party ${i === 0 ? "sel" : ""}"><input type="radio" name="party" value="${p.id}" ${i === 0 ? "checked" : ""}/><b>${p.icon} ${p.name}</b><small>${p.perk}</small></label>`).join("")}
      </div>
    </div>
    <button class="btn btn-gold btn-lg" data-a="go">Take the Oath</button>
  </section>`;
  $("#view").onclick = (e) => {
    const party = e.target.closest(".party");
    if (party) {
      $$(".party").forEach((p) => p.classList.remove("sel"));
      party.classList.add("sel");
      party.querySelector("input").checked = true;
    }
    if (e.target.closest("[data-a=go]")) {
      let address = $("#paddr").value;
      const name = $("#pname").value.trim() || "Morgan Hale";
      app.st = newGame({ name, address, party: $("input[name=party]:checked").value });
      startGame();
    }
  };
}

// ------------------------------------------------------------------ main loop

function startGame() {
  $("#hud").hidden = false;
  $("#nav").hidden = false;
  buildNav();
  go(app.view || "oval");
  setSpeed(app.st.over ? 0 : 1);
  checkPending();
}

function setSpeed(n) {
  app.speed = n;
  stopLoop();
  if (n > 0 && !app.modalOpen && !app.st.over) app.timer = setInterval(step, SPEEDS[n]);
  renderHud();
}

function stopLoop() {
  clearInterval(app.timer);
  app.timer = null;
}

function step() {
  const st = app.st;
  tick(st);
  if (st.day % 15 === 0) save();
  renderHud();
  const v = VIEWS[app.view];
  const now = performance.now();
  if (v.live) v.live($("#view"), st, ctx);
  else if (v.auto && now - app.lastRender > (v.auto === true ? 900 : v.auto)) rerender(true);
  checkPending();
}

function rerender(fromTick = false) {
  const v = VIEWS[app.view];
  if (fromTick && v.hold?.()) return;
  app.lastRender = performance.now();
  const y = window.scrollY;
  $("#view").innerHTML = v.render(app.st, ctx);
  window.scrollTo(0, y);
  v.after?.($("#view"), app.st, ctx);
}

// Shared context passed to views.
const ctx = {
  rerender: () => rerender(false),
  go,
  toast,
  save,
  hud: () => renderHud(),
  modal: showModal,
  closeModal,
  get speed() {
    return app.speed;
  },
};

// ------------------------------------------------------------------ navigation

function buildNav() {
  $("#nav").innerHTML = Object.entries(VIEWS)
    .map(([id, v]) => `<button class="nav-btn" data-view="${id}" title="${esc(v.title)}"><span class="nav-ico">${v.icon}</span><span class="nav-lbl">${esc(v.title)}</span></button>`)
    .join("");
  $("#nav").onclick = (e) => {
    const b = e.target.closest("[data-view]");
    if (b) go(b.dataset.view);
  };
}

function go(id) {
  const prev = VIEWS[app.view];
  prev?.leave?.();
  app.view = id;
  $$(".nav-btn").forEach((b) => b.classList.toggle("on", b.dataset.view === id));
  const v = VIEWS[id];
  const root = $("#view");
  root.onclick = null;
  root.oninput = null;
  root.onchange = null;
  root.innerHTML = v.render(app.st, ctx);
  v.bind?.(root, app.st, ctx);
  v.after?.(root, app.st, ctx);
  app.lastRender = performance.now();
  window.scrollTo(0, 0);
}

// ------------------------------------------------------------------ HUD

function renderHud() {
  const st = app.st;
  if (!st) return;
  const termDay = st.day - (st.term - 1) * TERM_DAYS;
  const yearsLeft = Math.max(0, (TERM_DAYS - termDay) / 365).toFixed(1);
  const g = st.gainToday;
  $("#hud").innerHTML = `
    <div class="hud-date">
      <div class="hud-day">${dateOf(st.day)}</div>
      <div class="hud-sub">Term ${st.term}${st.sandbox ? " · Sandbox" : ` · ${yearsLeft} yrs to election`}</div>
      <div class="term-bar"><span style="width:${Math.min(100, (termDay / TERM_DAYS) * 100)}%"></span><i style="left:${(645 / TERM_DAYS) * 100}%" title="Midterms"></i></div>
    </div>
    <div class="hud-speed">
      ${["⏸", "▶", "▶▶", "▶▶▶", "⏩"].map((s, i) => `<button class="spd ${app.speed === i ? "on" : ""}" data-spd="${i}" title="${["Pause", "1 day/sec", "2 days/sec", "4 days/sec", "11 days/sec"][i]}">${s}</button>`).join("")}
    </div>
    <div class="hud-stats">
      <div class="hs hs-big" title="Average American woman"><span>Avg woman</span><b>${lb1(st.avg)}</b><em class="${g >= 0 ? "up" : "down"}">${g >= 0 ? "▲" : "▼"} ${Math.abs(g).toFixed(2)}/day · ${stageName(st.avg)}</em></div>
      <div class="hs" title="How much women WANT to gain"><span>Desire</span><b>${st.desire.toFixed(0)}</b>${meter(st.desire, "pink")}</div>
      <div class="hs"><span>Approval</span><b>${st.approval.toFixed(0)}%</b>${meter(st.approval, st.approval >= 50 ? "green" : "red")}</div>
      <div class="hs" title="Lean Coalition strength"><span>Opposition</span><b>${st.f.opposition.toFixed(0)}</b>${meter(st.f.opposition, "olive")}</div>
      <div class="hs"><span>Budget</span><b class="${st.budget < 0 ? "neg" : ""}">${money(st.budget)}</b></div>
      <div class="hs" title="Political capital"><span>Capital</span><b>${st.pc.toFixed(0)} PC</b></div>
    </div>`;
}

function meter(v, color) {
  return `<i class="mini-meter ${color}"><s style="width:${Math.max(0, Math.min(100, v))}%"></s></i>`;
}

$("#hud").addEventListener("click", (e) => {
  const b = e.target.closest("[data-spd]");
  if (b) setSpeed(+b.dataset.spd);
});

document.addEventListener("keydown", (e) => {
  if (!app.st || app.modalOpen || e.target.matches("input,textarea,select")) return;
  if (e.code === "Space") {
    e.preventDefault();
    if (app.speed) {
      app.lastSpeed = app.speed;
      setSpeed(0);
    } else setSpeed(app.lastSpeed || 1);
  }
  if (/^Digit[1-4]$/.test(e.code)) setSpeed(+e.code.slice(5));
});

// ------------------------------------------------------------------ modal + queue

function checkPending() {
  const st = app.st;
  if (app.modalOpen) return;
  while (st.pending.length) {
    const p = st.pending[0];
    if (p.type === "achievement" || p.type === "notice") {
      st.pending.shift();
      toast(`<b>${p.type === "achievement" ? "🏆 " : ""}${esc(p.title)}</b><br>${esc(p.body)}`, p.type === "achievement" ? "gold" : p.good ? "good" : "");
      continue;
    }
    st.pending.shift();
    showPending(p);
    return;
  }
}

function showPending(p) {
  const st = app.st;
  if (p.type === "event") {
    const ev = EVENTS.find((e) => e.id === p.id);
    const vars = { state: p.state, address: st.pres.address };
    showModal(`
      <div class="modal-kicker">⚠️ Breaking: decision required</div>
      <h2>${esc(ev.title)}</h2>
      <p>${esc(fill(ev.body, vars))}</p>
      <div class="choices">${ev.choices.map((c, i) => `<button class="btn choice" data-c="${i}">${esc(c.label)}<small>${effectChips(c.effects)}</small></button>`).join("")}</div>`,
      (root) => {
        root.onclick = (e) => {
          const b = e.target.closest("[data-c]");
          if (!b) return;
          const c = ev.choices[+b.dataset.c];
          applyEffects(st, c.effects, false);
          if (c.cabinet) {
            const m = st.cabinet.find((x) => x.id === c.cabinet.id);
            if (c.cabinet.weight) m.weight += c.cabinet.weight;
            if (c.cabinet.attitude) m.attitude = Math.min(4, m.attitude + c.cabinet.attitude);
          }
          addNews(st, `${ev.title}: ${fill(c.result, vars)}`, "event");
          root.innerHTML = `<div class="modal-kicker">Outcome</div><h2>${esc(ev.title)}</h2><p>${esc(fill(c.result, vars))}</p><button class="btn btn-gold" data-close>Continue</button>`;
          root.onclick = (e2) => e2.target.closest("[data-close]") && closeModal();
        };
      });
  } else if (p.type === "milestone") {
    showModal(`
      <div class="modal-kicker">📺 GNN Special Report · National Milestone</div>
      <div class="milestone">
        <div class="ms-fig">${bodySVG({ weight: st.avg, seed: "avgwoman", look: { top: "#e56b8f" } })}</div>
        <div><div class="ms-num">${p.at.toLocaleString()} lb</div><h2>${esc(p.title)}</h2><p>${esc(p.body)}</p></div>
      </div>
      <button class="btn btn-gold" data-close>Glorious</button>`,
      (root) => (root.onclick = (e) => e.target.closest("[data-close]") && closeModal()));
  } else if (p.type === "election") {
    showModal(`
      <div class="modal-kicker">🗳️ Election Night</div>
      <h2 class="${p.good ? "good" : "bad"}">${esc(p.title)}</h2><p>${esc(p.body)}</p>
      <button class="btn btn-gold" data-close>Continue</button>`,
      (root) => (root.onclick = (e) => e.target.closest("[data-close]") && closeModal()));
  } else if (p.type === "ending") {
    showEnding();
  }
}

function showEnding() {
  const st = app.st;
  const end = endingFor(st);
  const unlocked = ACHIEVEMENTS.filter((a) => st.achievements[a.id]).length;
  const cabTotal = st.cabinet.reduce((a, c) => a + c.weight, 0);
  showModal(`
    <div class="modal-kicker">${st.over.kind === "defeat" ? "🗳️ Defeated" : "🏛️ Term-limited · Your Legacy"}</div>
    <h2>${esc(end.title)}</h2>
    <div class="milestone">
      <div class="ms-fig">${bodySVG({ weight: st.avg, seed: "avgwoman", look: { top: "#e56b8f" } })}</div>
      <div>
        <p>${esc(end.body)}</p>
        <ul class="end-stats">
          <li>Final vote: <b>${st.over.vote.toFixed(1)}%</b></li>
          <li>Average American woman: <b>${lb(st.avg)}</b> (from ${lb(st.startAvg)})</li>
          <li>Desire index: <b>${st.desire.toFixed(0)}</b></li>
          <li>Cabinet combined: <b>${lb(cabTotal)}</b></li>
          <li>Incidents: <b>${st.stats.incidents}</b> · Bills passed: <b>${st.stats.billsPassed}</b></li>
          <li>Achievements: <b>${unlocked}/${ACHIEVEMENTS.length}</b></li>
        </ul>
      </div>
    </div>
    <div class="choices row">
      <button class="btn btn-gold" data-a="sandbox">Keep playing (sandbox, no elections)</button>
      <button class="btn" data-a="new">New presidency</button>
    </div>`,
    (root) => {
      root.onclick = (e) => {
        const a = e.target.closest("[data-a]")?.dataset.a;
        if (a === "sandbox") {
          st.over = null;
          st.sandbox = true;
          st.term = 99;
          closeModal();
        }
        if (a === "new") {
          closeModal();
          localStorage.removeItem(SAVE_KEY);
          app.st = null;
          renderSplash(false);
        }
      };
    });
}

function showModal(html, bind) {
  app.modalOpen = true;
  stopLoop();
  const wrap = $("#modal");
  wrap.hidden = false;
  wrap.innerHTML = `<div class="modal-card">${html}</div>`;
  bind?.(wrap.firstElementChild);
}

function closeModal() {
  app.modalOpen = false;
  $("#modal").hidden = true;
  $("#modal").innerHTML = "";
  if (!app.st) return;
  checkPending();
  if (!app.modalOpen) {
    setSpeed(app.speed);
    rerender();
  }
}

// ------------------------------------------------------------------ toasts

export function toast(html, kind = "") {
  const t = document.createElement("div");
  t.className = `toast ${kind}`;
  t.innerHTML = html;
  const box = $("#toasts");
  box.appendChild(t);
  while (box.children.length > 3) box.firstElementChild.remove();
  setTimeout(() => t.classList.add("out"), 4200);
  setTimeout(() => t.remove(), 4800);
}

export { app };

boot();
