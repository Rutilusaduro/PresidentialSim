import { esc, fill, lb, pick } from "../util.js";
import { STATE_VIGNETTES, US_STATES } from "../data/states.js";
import { bandOf, dressSize, stageName } from "../data/stages.js";
import { addNews, applyEffects, stateAvg } from "../sim.js";
import { bodySVG } from "./body.js";

const RALLY_CD = 20;
let sel = "WI";
const vignette = {};

function color(w, lo, hi) {
  const t = Math.max(0, Math.min(1, (w - lo) / Math.max(1, hi - lo)));
  // cream → pink → deep magenta
  const a = [255, 236, 214];
  const b = [236, 95, 153];
  const c = [110, 16, 72];
  const mix = (x, y, k) => x.map((v, i) => Math.round(v + (y[i] - v) * k));
  const rgb = t < 0.5 ? mix(a, b, t * 2) : mix(b, c, (t - 0.5) * 2);
  return `rgb(${rgb.join(",")})`;
}

export const map = {
  title: "Map",
  icon: "🗺️",
  auto: 1500,
  render(st) {
    const ws = US_STATES.map((s) => stateAvg(st, s[0]));
    const lo = Math.min(...ws);
    const hi = Math.max(...ws);
    const row = US_STATES.find((s) => s[0] === sel);
    const w = stateAvg(st, sel);
    const band = bandOf(w);
    if (!vignette[sel] || vignette[sel].band !== band) vignette[sel] = { band, text: fill(pick(STATE_VIGNETTES[band]), { name: row[1], food: row[4] }) };
    const ready = st.day - (st.rallyDay?.[sel] ?? -99) >= RALLY_CD;
    const ranked = US_STATES.map((s, i) => [s, ws[i]]).sort((a, b) => b[1] - a[1]);
    return `
    <div class="map-layout">
      <section class="card">
        <div class="card-kicker">Average woman by state · live</div>
        <div class="tilemap">${US_STATES.map((s, i) => `<button class="tile ${s[0] === sel ? "sel" : ""}" data-st="${s[0]}" style="grid-column:${s[2] + 1};grid-row:${s[3] + 1};background:${color(ws[i], lo, hi)};color:${ws[i] - lo > (hi - lo) * 0.55 ? "#fff" : "#3a1a2a"}" title="${esc(s[1])}: ${Math.round(ws[i])} lb"><b>${s[0]}</b><small>${Math.round(ws[i])}</small></button>`).join("")}</div>
        <div class="legend"><span>${Math.round(lo)} lb</span><i style="background:linear-gradient(90deg,${color(lo, lo, hi)},${color((lo + hi) / 2, lo, hi)},${color(hi, lo, hi)})"></i><span>${Math.round(hi)} lb</span></div>
      </section>
      <aside class="card state-panel">
        <div class="card-kicker">${esc(row[1])}</div>
        <div class="state-fig">${bodySVG({ weight: w, seed: "state" + sel })}</div>
        <h3>${lb(w)} <small>${stageName(w)} · ${dressSize(w)}</small></h3>
        <p>${esc(vignette[sel].text)}</p>
        <p class="small muted">Local specialty: ${esc(row[4])} · Rallies held: ${st.rallies[sel] || 0}</p>
        ${ready ? `<button class="btn btn-gold" data-rally>Hold an “All You Can Eat” rally here (6 PC, $2B)</button>` : `<button class="btn" disabled>Rally again in ${RALLY_CD - (st.day - st.rallyDay[sel])} days</button>`}
        <div class="card-kicker" style="margin-top:1rem">Heaviest states</div>
        <ol class="rank">${ranked.slice(0, 5).map(([s, v]) => `<li>${esc(s[1])} <b>${Math.round(v)} lb</b></li>`).join("")}</ol>
        <div class="card-kicker">Lightest states</div>
        <ol class="rank">${ranked.slice(-3).reverse().map(([s, v]) => `<li>${esc(s[1])} <b>${Math.round(v)} lb</b></li>`).join("")}</ol>
      </aside>
    </div>`;
  },
  bind(root, st, ctx) {
    root.onclick = (e) => {
      const t = e.target.closest("[data-st]");
      if (t) {
        sel = t.dataset.st;
        ctx.rerender();
      }
      if (e.target.closest("[data-rally]")) {
        if (st.pc < 6 || st.budget < 2) return ctx.toast("Need 6 PC and $2B.");
        st.pc -= 6;
        st.budget -= 2;
        st.rallyDay = st.rallyDay || {};
        st.rallyDay[sel] = st.day;
        st.rallies[sel] = (st.rallies[sel] || 0) + 1;
        const row = US_STATES.find((s) => s[0] === sel);
        applyEffects(st, { convert: 0.004, culture: 2, approval: 1 }, false);
        addNews(st, `${st.pres.address} ${st.pres.name} rallies in ${row[1]}; crowd devours a record ${Math.round(20 + st.avg / 10)} tons of ${row[4]}.`, "rally");
        ctx.toast(`<b>Rally in ${esc(row[1])}!</b><br>The buffet line stretched for a mile.`, "good");
        ctx.hud();
        ctx.rerender();
      }
    };
  },
};
