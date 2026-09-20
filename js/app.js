import { PRESET_POLICIES, parseFreeTextPolicy } from "./data/policies.js";
import { eventForMonth, headlinesForPolicy } from "./data/events.js";
import { spinSuggestions } from "./systems/dialogue.js";
import { applyMonthlyPhysics, newGameState } from "./systems/stats.js";
import { runWomenPoll, updateGlobalApproval } from "./systems/poll.js";

const STORAGE_KEY = "curves-oval-save-v1";

const MANAGERS = [
  {
    id: "feeder",
    name: "Madison 'Second Helping' Cole",
    perk: "+15% weight drift from food policies",
    desc: "Former plus-size restaurateur who ran a feeder PAC in Nevada.",
  },
  {
    id: "infra",
    name: "Rachel Beamwright",
    perk: "Infrastructure incidents cost less approval",
    desc: "Civil engineer obsessed with floor load ratings and elevator hydraulics.",
  },
  {
    id: "culture",
    name: "Tessa Viral",
    perk: "Gainers in poll react +8 happier",
    desc: "TikTok strategist who speaks exclusively in body-positive memes.",
  },
];

/** @type {ReturnType<typeof newGameState> | null} */
let state = null;

const container = document.getElementById("screen-container");

document.getElementById("btn-new-career").addEventListener("click", () => {
  if (confirm("Start a new career? Unsaved progress on this screen may be lost.")) {
    state = newGameState();
    renderManagerPick();
  }
});

document.getElementById("btn-save").addEventListener("click", saveGame);

function saveGame() {
  if (!state) {
    toast("Nothing to save yet.");
    return;
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  toast("Career saved.");
}

function loadGame() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return false;
    state = JSON.parse(raw);
    return true;
  } catch {
    return false;
  }
}

function toast(msg) {
  const el = document.createElement("div");
  el.className = "toast";
  el.textContent = msg;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 2800);
}

function esc(s) {
  const d = document.createElement("div");
  d.textContent = s;
  return d.innerHTML;
}

function render(html) {
  container.innerHTML = `<div class="screen">${html}</div>`;
}

function renderSplash() {
  render(`
    <section class="hero">
      <h2>The weight-forward presidential simulator</h2>
      <p>
        Type radical policies. Watch <strong>only women</strong> react in live polling —
        complete with weight, BMI, political lean, and attitudes toward gaining.
        Track national curves statistics as America softens month by month.
      </p>
      <button type="button" id="start-btn">Take office</button>
    </section>
    <div class="card-grid">
      <div class="card"><h3>👩 Women-only polls</h3><p>24 personas: pro-gain, neutral, and opposed — no men's opinions cluttering the feed.</p></div>
      <div class="card"><h3>📈 National weight stats</h3><p>Average BMI, obesity tiers, furniture stress, and plus-size retail indices update every month.</p></div>
      <div class="card"><h3>🏗️ Escalating flavor</h3><p>As voters grow, dialogue shifts from policy wonkery to broken chairs, floors, and building codes.</p></div>
    </div>
  `);
  document.getElementById("start-btn").addEventListener("click", () => {
    state = newGameState();
    renderManagerPick();
  });
}

function renderManagerPick() {
  const cards = MANAGERS.map(
    (m) => `
    <div class="card selectable" data-id="${m.id}">
      <h3>${esc(m.name)}</h3>
      <p><strong>${esc(m.perk)}</strong></p>
      <p>${esc(m.desc)}</p>
    </div>`,
  ).join("");

  render(`
    <h2>Pick your campaign manager</h2>
    <p class="tagline" style="margin-bottom:1rem">Your first hire shapes how fast the nation's women expand.</p>
    <div class="card-grid" id="manager-grid">${cards}</div>
    <p style="margin-top:1.5rem"><button type="button" id="mgr-continue" disabled>Continue</button></p>
  `);

  let selected = null;
  const btn = document.getElementById("mgr-continue");
  document.querySelectorAll("#manager-grid .selectable").forEach((el) => {
    el.addEventListener("click", () => {
      document.querySelectorAll("#manager-grid .selectable").forEach((c) => c.classList.remove("selected"));
      el.classList.add("selected");
      selected = el.dataset.id;
      btn.disabled = false;
    });
  });
  btn.addEventListener("click", () => {
    state.manager = selected;
    renderPlatform();
  });
}

function renderPlatform() {
  render(`
    <h2>Your platform</h2>
    <p>Declare what this presidency is about. Vague platitudes won't move the women's vote.</p>
    <textarea id="platform-text" placeholder="e.g. Every American woman entitled to second desserts, reinforced floors, and federally funded wardrobe upgrades..."></textarea>
    <button type="button" id="platform-go">Launch administration</button>
  `);
  document.getElementById("platform-go").addEventListener("click", () => {
    state.platform = document.getElementById("platform-text").value.trim() || "Growth with dignity.";
    renderMonth();
  });
}

function bmiSparkline() {
  const hist = state.national.history;
  if (hist.length < 2) return "";
  const min = Math.min(...hist.map((h) => h.avgBmi)) - 0.5;
  const max = Math.max(...hist.map((h) => h.avgBmi)) + 0.5;
  const w = 240;
  const h = 44;
  const pts = hist
    .map((p, i) => {
      const x = (i / (hist.length - 1)) * w;
      const y = h - ((p.avgBmi - min) / (max - min)) * h;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
  return `<svg width="100%" viewBox="0 0 ${w} ${h}" style="margin:0.5rem 0 0.75rem"><polyline fill="none" stroke="var(--accent)" stroke-width="2.5" points="${pts}"/></svg>`;
}

function nationalPanel() {
  const n = state.national;
  return `
    <div class="panel">
      <h3>National women's weight</h3>
      <div class="stat-row"><span>Avg BMI</span><strong>${n.avgBmiWomen.toFixed(1)}</strong></div>
      ${bmiSparkline()}
      <div class="meter"><span style="width:${Math.min(100, (n.avgBmiWomen / 55) * 100)}%"></span></div>
      <div class="stat-row"><span>Obese (30+)</span><strong>${n.obesityRate.toFixed(1)}%</strong></div>
      <div class="stat-row"><span>Morbid (40+)</span><strong>${n.morbidRate.toFixed(1)}%</strong></div>
      <div class="stat-row"><span>Super obese (50+)</span><strong>${n.superObeseRate.toFixed(1)}%</strong></div>
      <div class="stat-row"><span>Furniture stress index</span><strong>${n.furnitureStressIndex.toFixed(0)}</strong></div>
      <div class="stat-row"><span>Plus-size retail index</span><strong>${n.plusSizeRetailIndex.toFixed(0)}</strong></div>
      <div class="stat-row"><span>Floor/ chair incidents (YTD)</span><strong>${n.infrastructureIncidents}</strong></div>
    </div>
    <div class="panel" style="margin-top:1rem">
      <h3>Approval</h3>
      <div class="stat-row"><span>Women's poll avg</span><strong>${state.lastPoll?.avgApproval ?? "—"}</strong></div>
      <div class="stat-row"><span>Headline approval</span><strong>${state.approval}%</strong></div>
    </div>
  `;
}

function timelineHtml() {
  const spans = [];
  for (let m = 1; m <= state.maxMonth; m++) {
    let cls = "";
    if (m < state.month) cls = "done";
    if (m === state.month) cls = "current";
    spans.push(`<span class="${cls}" title="Month ${m}"></span>`);
  }
  return `<div class="timeline">${spans.join("")}</div>`;
}

function renderMonth() {
  if (state.gameOver) {
    renderGameOver();
    return;
  }

  const ev = eventForMonth(state.month);
  const chips = PRESET_POLICIES.map(
    (p) => `<button type="button" class="policy-chip" data-policy="${p.id}">${esc(p.title)}</button>`,
  ).join("");

  render(`
    <div class="month-banner">
      <div>
        <h2>Month ${state.month} of ${state.maxMonth}</h2>
        ${timelineHtml()}
      </div>
      <span class="approval-pill">Approval ${state.approval}%</span>
    </div>
    <div class="layout-two">
      <div>
        <div class="event-box">
          <strong>${esc(ev.title)}</strong>
          <p>${esc(ev.body)}</p>
        </div>
        <div class="panel">
          <h3>Your response</h3>
          <p style="color:var(--muted);font-size:0.9rem">Choose a preset or type any policy — keyword matching handles custom directives.</p>
          <div class="policy-chips">${chips}</div>
          <textarea id="policy-text" placeholder="Type a custom policy..."></textarea>
          <input type="text" id="spin-text" placeholder="Optional spin for the press (flavor only)" />
          <button type="button" id="enact-btn">Enact &amp; run women's poll</button>
        </div>
      </div>
      <div>${nationalPanel()}</div>
    </div>
  `);

  document.querySelectorAll(".policy-chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      const id = chip.dataset.policy;
      const p = PRESET_POLICIES.find((x) => x.id === id);
      if (p) document.getElementById("policy-text").value = p.title + " — " + p.blurb;
    });
  });

  document.getElementById("enact-btn").addEventListener("click", () => enactPolicy());
}

function enactPolicy() {
  const text = document.getElementById("policy-text").value;
  const policy = parseFreeTextPolicy(text);
  if (!policy) {
    toast("Write or select a policy first.");
    return;
  }

  if (state.manager === "feeder") policy = { ...policy, weightBias: (policy.weightBias || 0) * 1.15 };
  if (state.manager === "culture") {
    policy = { ...policy, gainerBoost: (policy.gainerBoost || 0) + 8 };
  }

  const poll = runWomenPoll(state, policy);
  if (state.manager === "culture") {
    poll.results.forEach((r) => {
      if (r.persona.weightStance === "gainer" && r.score < 90) r.score = Math.min(98, r.score + 3);
    });
    poll.avgApproval = Math.round(
      poll.results.reduce((a, r) => a + r.score, 0) / poll.results.length,
    );
  }

  updateGlobalApproval(state, poll);
  applyMonthlyPhysics(state, policy);

  state.lastPolicy = policy;
  state.lastPoll = poll;

  if (state.month === 22 || state.month === 46) {
    const threshold = state.month === 46 ? 48 : 45;
    if (state.approval < threshold) {
      state.gameOver = true;
      state.wonElection = false;
    } else {
      toast(state.month === 46 ? "You won re-election!" : "Midterms survived!");
    }
  }

  renderPollResults(poll, policy);

  if (!state.gameOver) {
    state.month += 1;
    if (state.month > state.maxMonth) {
      state.gameOver = true;
      state.wonElection = state.approval >= 50;
    }
  }
}

function renderPollResults(poll, policy) {
  const headlines = headlinesForPolicy(policy, {
    avgBmi: state.national.avgBmiWomen,
    obesityRate: state.national.obesityRate,
  });

  const cards = poll.results
    .map(
      (r) => `
    <article class="voter-card">
      <div class="voter-avatar">${r.avatar}</div>
      <div>
        <strong>${esc(r.persona.name)}</strong> · ${esc(r.persona.region)}
        <div class="voter-meta">
          <span class="lean-${r.persona.lean === "liberal" ? "lib" : r.persona.lean === "moderate" ? "mod" : "con"}">${esc(r.lean)}</span>
          <span class="stance-${r.persona.weightStance}">${esc(r.stance)}</span>
          <span>${r.persona.weightLb} lbs</span>
          <span class="bmi-tag ${r.bmiClass}">BMI ${r.bmi.toFixed(1)} (${r.bmiLabel})</span>
          <span class="voter-score ${r.score >= 50 ? "positive" : "negative"}">${r.score}%</span>
        </div>
      </div>
      <p class="voter-quote">${esc(r.quote.replace(/^"|"$/g, ""))}</p>
    </article>`,
    )
    .join("");

  render(`
    <div class="poll-header">
      <div>
        <h2>📊 Women's poll — ${esc(policy.title)}</h2>
        <p class="tagline">Only female voters shown · Men are statistically invisible this cycle.</p>
      </div>
      <div class="poll-summary">
        <div><div class="big">${poll.avgApproval}%</div><div class="label">Overall</div></div>
        <div><div class="big">${poll.byStance.gainer}%</div><div class="label">Pro-gain</div></div>
        <div><div class="big">${poll.byStance.neutral}%</div><div class="label">Neutral</div></div>
        <div><div class="big">${poll.byStance.opposed}%</div><div class="label">Opposed</div></div>
      </div>
    </div>
    <div class="layout-two">
      <div class="card-grid" style="grid-template-columns:1fr">${cards}</div>
      <div>
        ${nationalPanel()}
        <div class="panel" style="margin-top:1rem">
          <h3>Headlines</h3>
          <ul class="headline-list">
            ${headlines.map((h) => `<li><span class="outlet">${esc(h.outlet)}</span><br>${esc(h.line)}</li>`).join("")}
          </ul>
        </div>
      </div>
    </div>
    <p style="margin-top:1.5rem">
      <button type="button" id="next-month">${state.gameOver ? "See results" : "Next month"}</button>
    </p>
  `);

  document.getElementById("next-month").addEventListener("click", () => {
    if (state.gameOver) renderGameOver();
    else renderMonth();
  });
}

function renderGameOver() {
  const win = state.wonElection;
  render(`
    <section class="hero">
      <h2>${win ? "You kept the Oval" : "Career over"}</h2>
      <p>
        Final approval: ${state.approval}% · Women's avg BMI: ${state.national.avgBmiWomen.toFixed(1)}
        · Obesity rate: ${state.national.obesityRate.toFixed(1)}%
      </p>
      <p>${win ? "History will remember the expansion era." : "The opposition ran ads with your floor-collapse incidents."}</p>
      <button type="button" id="restart">New career</button>
    </section>
  `);
  document.getElementById("restart").addEventListener("click", () => {
    state = newGameState();
    renderManagerPick();
  });
}

if (loadGame() && state?.month > 1) {
  if (state.lastPoll) renderPollResults(state.lastPoll, state.lastPolicy);
  else renderMonth();
} else {
  renderSplash();
}
