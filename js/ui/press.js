import { esc, fill, lb, pick, sample } from "../util.js";
import { PRESS } from "../data/social.js";
import { CABINET, INCIDENTS, SPECIAL_INCIDENTS } from "../data/cabinet.js";
import { dressSize, stageName, stageOf } from "../data/stages.js";
import { US_STATES } from "../data/states.js";
import { addNews, applyEffects } from "../sim.js";
import { bodySVG } from "./body.js";
import { effectChips } from "./common.js";

const CD = 7;
let briefing = null; // { qs, i, answers: [], state }

const PODIUM_LINES = [
  "Jasmine steps up to the podium, straightens her notes, and smiles at the room.",
  "Jasmine taps the mic. 'Okay, let's go. I've got a pastry waiting.'",
  "Jasmine settles in behind the podium. The front row leans forward.",
];

export const press = {
  title: "Press Room",
  icon: "🎤",
  render(st) {
    const js = st.cabinet.find((c) => c.id === "press");
    const d = CABINET.find((c) => c.id === "press");
    const s = stageOf(js.weight);
    const special = (SPECIAL_INCIDENTS.press || []).filter((x) => x.stage <= s).pop();
    const podiumNote = special ? special.text : fill(pick(INCIDENTS[Math.max(1, Math.min(9, s))]), { first: "Jasmine", title: d.title });
    const ready = st.day - st.lastPress >= CD;
    return `
    <div class="press-layout">
      <section class="card press-room">
        <div class="card-kicker">James S. Brady Briefing Room</div>
        <div class="podium-scene">
          <div class="press-fig">${bodySVG({ weight: js.weight, seed: "press", look: d.look, suit: true })}</div>
          <div class="podium" style="--w:${Math.max(0, 1 + (js.weight - 150) / 400)}"><span>THE WHITE HOUSE</span></div>
        </div>
        <div class="press-id"><b>${esc(d.name)}</b>, Press Secretary · ${lb(js.weight)} · ${stageName(js.weight)} · ${dressSize(js.weight)}</div>
        <p class="small muted">${esc(podiumNote)}</p>
      </section>
      <section class="card">
        ${briefing ? briefingView(st) : ready ? `<h2>Hold a press briefing</h2><p>Three questions from the press corps. Your answers shape the story: bold answers move hearts but rile the Lean Coalition.</p><button class="btn btn-gold btn-lg" data-brief>Open the floor</button>` : `<h2>Press briefing</h2><p class="muted">Next briefing in ${CD - (st.day - st.lastPress)} days. The press corps is at the snack table.</p>`}
      </section>
    </div>`;
  },
  bind(root, st, ctx) {
    root.onclick = (e) => {
      if (e.target.closest("[data-brief]")) {
        st.lastPress = st.day;
        briefing = { qs: sample(PRESS, 3), i: 0, answers: [], state: pick(US_STATES)[1] };
        ctx.rerender();
      }
      const a = e.target.closest("[data-ans]");
      if (a && briefing) {
        const q = briefing.qs[briefing.i];
        const ans = q.a[+a.dataset.ans];
        applyEffects(st, ans.effects, false);
        if (ans.cabinet) {
          const m = st.cabinet.find((c) => c.id === ans.cabinet.id);
          m.attitude = Math.min(4, m.attitude + ans.cabinet.attitude);
        }
        briefing.answers.push({ q: fill(q.q, { state: briefing.state }), a: ans.t, outlet: q.outlet });
        briefing.i++;
        if (briefing.i >= briefing.qs.length) {
          addNews(st, `Press briefing: ${briefing.answers[0].a.replace(/[“”]/g, "")}`, "press");
        }
        ctx.hud();
        ctx.rerender();
      }
      if (e.target.closest("[data-done]")) {
        briefing = null;
        ctx.rerender();
      }
    };
  },
};

function briefingView(st) {
  if (briefing.i >= briefing.qs.length) {
    return `<h2>Briefing wrap-up</h2>
      <ul class="qa">${briefing.answers.map((x) => `<li><small>${esc(x.outlet)}</small><div>Q: ${esc(x.q)}</div><div><b>A: ${esc(x.a)}</b></div></li>`).join("")}</ul>
      <p class="muted">${pick(["Jasmine closes her binder and heads straight for the pastry tray.", "The press corps files its stories. Most of them mention the cinnamon rolls.", "'That's all for today, folks.' Jasmine grins and grabs a donut on her way out."])}</p>
      <button class="btn btn-gold" data-done>Done</button>`;
  }
  const q = briefing.qs[briefing.i];
  return `<div class="card-kicker">Question ${briefing.i + 1} of ${briefing.qs.length} · ${esc(q.outlet)}</div>
    ${briefing.i === 0 ? `<p class="muted small">${esc(pick(PODIUM_LINES))}</p>` : ""}
    <h3 class="question">“${esc(fill(q.q, { state: briefing.state }))}”</h3>
    <div class="choices">${q.a.map((a, i) => `<button class="btn choice" data-ans="${i}">${esc(a.t)}<small>${effectChips(a.effects)}</small></button>`).join("")}</div>`;
}
