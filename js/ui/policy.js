import { esc, money } from "../util.js";
import { BILLS, CAMPAIGNS, DEPARTMENTS, EXEC_ORDERS, RESEARCH, SPEECHES } from "../data/actions.js";
import { actionById, actionStatus, addNews, applyEffects, dailyIncome, dailySpend, takeAction, targets } from "../sim.js";
import { effectChips } from "./common.js";

const TABS = [
  ["eo", "✒️ Executive Orders"],
  ["bill", "📜 Legislation"],
  ["campaign", "📣 Campaigns"],
  ["research", "⚗️ Research"],
  ["budget", "💵 Budget"],
  ["speech", "🎙️ Address the Nation"],
];
let tab = "eo";
let dragging = false;

const SPEECH_CD = 40;

export const policy = {
  title: "Policy Desk",
  icon: "✒️",
  auto: 1500,
  hold: () => dragging,
  render(st) {
    return `
    <div class="tabs">${TABS.map(([id, n]) => `<button class="tab ${tab === id ? "on" : ""}" data-tab="${id}">${n}</button>`).join("")}</div>
    <div class="tab-intro">${intro(st)}</div>
    ${body(st)}`;
  },
  bind(root, st, ctx) {
    root.onclick = (e) => {
      const t = e.target.closest("[data-tab]");
      if (t) {
        tab = t.dataset.tab;
        ctx.rerender();
        return;
      }
      const a = e.target.closest("[data-act]");
      if (a) {
        const err = takeAction(st, a.dataset.act);
        const act = actionById(a.dataset.act);
        if (err) ctx.toast(esc(err));
        else ctx.toast(`<b>${esc(act.name)}</b><br>${{ eo: "Signed.", bill: "Sent to Congress.", campaign: "Campaign launched.", research: "Research funded." }[act.kind]}`, "good");
        ctx.rerender();
        ctx.hud();
      }
      const s = e.target.closest("[data-speech]");
      if (s) {
        const sp = SPEECHES.find((x) => x.id === s.dataset.speech);
        if (st.day - st.lastSpeech < SPEECH_CD) return;
        st.lastSpeech = st.day;
        applyEffects(st, sp.effects, false);
        // Each cohort reacts: small approval swing weighted by share.
        const swing = st.cohorts.reduce((a, c, i) => a + c.share * sp.reacts[i], 0);
        st.approval = Math.max(3, Math.min(97, st.approval + swing));
        addNews(st, `Oval Office address: '${sp.text}'`, "speech");
        ctx.modal(`<div class="modal-kicker">🎙️ Address to the Nation</div><h2>${esc(sp.name)}</h2><blockquote>${esc(sp.text)}</blockquote>
          <p>Instant reaction: approval <b class="${swing >= 0 ? "up" : "down"}">${swing >= 0 ? "+" : ""}${swing.toFixed(1)}</b>. ${swing > 2 ? "Living rooms across America erupt in applause, and in dessert orders." : swing > 0 ? "A warm reception. Delivery apps spike during the speech." : "Some viewers change the channel to the Butter Channel. Maybe that's fine."}</p>
          <button class="btn btn-gold" data-close>Continue</button>`, (r) => (r.onclick = (ev) => ev.target.closest("[data-close]") && ctx.closeModal()));
        ctx.hud();
      }
    };
    root.oninput = (e) => {
      const r = e.target.closest("[data-slider]");
      if (!r) return;
      st.sliders[r.dataset.slider] = +r.value;
      r.parentElement.querySelector("output").textContent = r.value;
      const sum = root.querySelector("#budget-sum");
      if (sum) sum.innerHTML = budgetSummary(st);
    };
    root.onpointerdown = (e) => {
      if (e.target.matches("input[type=range]")) dragging = true;
    };
    window.onpointerup = () => {
      if (dragging) {
        dragging = false;
        ctx.rerender();
      }
    };
  },
  leave() {
    dragging = false;
    window.onpointerup = null;
  },
};

function intro(st) {
  switch (tab) {
    case "eo":
      return "Signed instantly with political capital. Permanent.";
    case "bill":
      return `Big, permanent changes, but Congress has to vote. Congressional support: <b>${st.congress.toFixed(0)}%</b>. Lobby pending bills from the Oval Office.`;
    case "campaign":
      return "Paid media campaigns. They persuade women while they run, and some target specific attitudes.";
    case "research":
      return "The Institute of Abundance takes on one project at a time. Results are permanent, and some are frankly magical.";
    case "budget":
      return "Ongoing department funding. Each point costs $3.65B/yr. Deficits hurt approval.";
    case "speech":
      return `Speak directly to the nation. One address every ${SPEECH_CD} days. Different women react differently.`;
  }
}

function card(st, a) {
  const s = actionStatus(st, a);
  const cost = [a.cost?.pc ? `${a.cost.pc} PC` : "", a.cost?.budget ? `$${a.cost.budget}B` : ""].filter(Boolean).join(" + ");
  const meta = a.kind === "bill" ? `${a.days}-day vote · difficulty ${a.difficulty}` : a.kind === "campaign" ? `${a.duration} days${a.target ? ` · targets ${a.target.map((i) => ["Opposed", "Reluctant", "Curious", "Eager", "Devoted"][i]).join("/")}` : ""}` : a.kind === "research" ? `${a.days} days` : "";
  const eff = a.kind === "campaign" ? effectChips(a.live, true) : effectChips(a.effects, true);
  const verb = { eo: "Sign", bill: "Introduce", campaign: "Launch", research: "Fund" }[a.kind];
  return `<article class="pcard ${s.done ? "done" : ""} ${s.pending ? "pending" : ""} ${!s.ok && !s.done && !s.pending ? "locked" : ""}">
    <h4>${esc(a.name)}</h4>
    <p>${esc(a.desc)}</p>
    <div class="chips">${eff}</div>
    <div class="pcard-foot">
      <small>${cost}${meta ? ` · ${meta}` : ""}</small>
      ${s.ok ? `<button class="btn btn-sm btn-gold" data-act="${a.id}">${verb}</button>` : `<em>${esc(s.why)}</em>`}
    </div>
  </article>`;
}

function list(st, arr, kind) {
  const items = arr.map((a) => ({ ...a, kind }));
  // available first, then pending, then done, then locked
  const rank = (a) => {
    const s = actionStatus(st, a);
    return s.ok ? 0 : s.pending ? 1 : s.done ? 3 : 2;
  };
  items.sort((a, b) => rank(a) - rank(b));
  return `<div class="pgrid">${items.map((a) => card(st, a)).join("")}</div>`;
}

function body(st) {
  if (tab === "eo") return list(st, EXEC_ORDERS, "eo");
  if (tab === "bill") return list(st, BILLS, "bill");
  if (tab === "campaign") return list(st, CAMPAIGNS, "campaign");
  if (tab === "research") return list(st, RESEARCH, "research");
  if (tab === "budget") {
    const t = targets(st);
    return `<div class="card">
      ${DEPARTMENTS.map((d) => `<div class="slider-row">
        <div><b style="color:${d.color}">${esc(d.name)}</b><br><small>${esc(d.desc)}</small></div>
        <div class="slider"><input type="range" min="0" max="100" step="1" value="${st.sliders[d.id]}" data-slider="${d.id}"/><output>${st.sliders[d.id]}</output></div>
        <small class="muted">${d.factor === "infra" ? `+${Math.round(t.infraGrowth * 365)} lb/yr capacity` : d.factor === "wardrobe" ? `+${Math.round(t.wardrobeGrowth * 365)} lb/yr sizes` : `${d.factor} target ${Math.round(t[d.factor])}`}</small>
      </div>`).join("")}
      <div id="budget-sum" class="budget-sum">${budgetSummary(st)}</div>
    </div>`;
  }
  if (tab === "speech") {
    const ready = st.day - st.lastSpeech >= SPEECH_CD;
    return `<div class="pgrid">${SPEECHES.map(
      (s) => `<article class="pcard"><h4>${esc(s.name)}</h4><blockquote>${esc(s.text)}</blockquote>
      <div class="chips">${effectChips(s.effects)}</div>
      <div class="pcard-foot"><small>Reception: ${["Opposed", "Reluctant", "Curious", "Eager", "Devoted"].map((n, i) => `${n[0]}${s.reacts[i] >= 0 ? "+" : ""}${s.reacts[i]}`).join(" ")}</small>
      ${ready ? `<button class="btn btn-sm btn-gold" data-speech="${s.id}">Deliver</button>` : `<em>Ready in ${SPEECH_CD - (st.day - st.lastSpeech)} days</em>`}</div></article>`,
    ).join("")}</div>`;
  }
  return "";
}

function budgetSummary(st) {
  const inc = dailyIncome(st) * 365;
  const sp = dailySpend(st) * 365;
  const net = inc - sp;
  return `Revenue <b>${money(inc)}/yr</b> (the snack economy grows with the national waistline) · Spending <b>${money(sp)}/yr</b> · Net <b class="${net >= 0 ? "up" : "down"}">${money(net)}/yr</b> · Treasury <b>${money(st.budget)}</b>`;
}
