import { esc, lb, shortDate } from "../util.js";
import { ACHIEVEMENTS } from "../data/states.js";
import { MILESTONES, STAGES } from "../data/stages.js";
import { persuasion } from "../sim.js";
import { ATT_COLORS, ATT_NAMES } from "./common.js";

const W = 640;
const H = 200;
const PAD = { l: 44, r: 10, t: 10, b: 22 };

function lineChart(hist, series, { min, max, unit = "" } = {}) {
  if (hist.length < 2) return `<p class="muted">Not enough history yet. Let some time pass.</p>`;
  const xs = hist.map((h) => h.d);
  const x0 = xs[0];
  const x1 = xs[xs.length - 1] || 1;
  const all = series.flatMap((s) => hist.map(s.get));
  const lo = min ?? Math.floor(Math.min(...all) / 10) * 10;
  const hi = max ?? Math.ceil(Math.max(...all) / 10) * 10 + 10;
  const X = (d) => PAD.l + ((d - x0) / Math.max(1, x1 - x0)) * (W - PAD.l - PAD.r);
  const Y = (v) => H - PAD.b - ((v - lo) / Math.max(1, hi - lo)) * (H - PAD.t - PAD.b);
  const ticks = 4;
  const grid = Array.from({ length: ticks + 1 }, (_, i) => lo + ((hi - lo) * i) / ticks)
    .map((v) => `<line x1="${PAD.l}" x2="${W - PAD.r}" y1="${Y(v)}" y2="${Y(v)}" class="grid"/><text x="${PAD.l - 6}" y="${Y(v) + 4}" text-anchor="end">${Math.round(v)}${unit}</text>`)
    .join("");
  const paths = series
    .map((s) => `<polyline fill="none" stroke="${s.color}" stroke-width="${s.w || 2}" ${s.dash ? `stroke-dasharray="${s.dash}"` : ""} points="${hist.map((h) => `${X(h.d).toFixed(1)},${Y(s.get(h)).toFixed(1)}`).join(" ")}"/>`)
    .join("");
  const xl = `<text x="${PAD.l}" y="${H - 4}">${shortDate(x0)}</text><text x="${W - PAD.r}" y="${H - 4}" text-anchor="end">${shortDate(x1)}</text>`;
  const legend = series.map((s) => `<span><i style="background:${s.color}"></i>${esc(s.label)}</span>`).join("");
  return `<svg class="chart" viewBox="0 0 ${W} ${H}">${grid}${paths}${xl}</svg><div class="chart-legend">${legend}</div>`;
}

function stackChart(hist) {
  if (hist.length < 2) return "";
  const x0 = hist[0].d;
  const x1 = hist[hist.length - 1].d || 1;
  const X = (d) => PAD.l + ((d - x0) / Math.max(1, x1 - x0)) * (W - PAD.l - PAD.r);
  const Y = (v) => H - PAD.b - v * (H - PAD.t - PAD.b);
  let areas = "";
  for (let i = 0; i < 5; i++) {
    const top = hist.map((h) => [X(h.d), Y(h.sh.slice(0, i + 1).reduce((a, b) => a + b, 0))]);
    const bot = hist.map((h) => [X(h.d), Y(h.sh.slice(0, i).reduce((a, b) => a + b, 0))]).reverse();
    areas += `<polygon fill="${ATT_COLORS[i]}" points="${[...top, ...bot].map((p) => p.map((n) => n.toFixed(1)).join(",")).join(" ")}"/>`;
  }
  const legend = ATT_NAMES.map((n, i) => `<span><i style="background:${ATT_COLORS[i]}"></i>${n}</span>`).join("");
  return `<svg class="chart" viewBox="0 0 ${W} ${H}">${areas}<text x="${PAD.l - 6}" y="${Y(1) + 4}" text-anchor="end">100%</text><text x="${PAD.l - 6}" y="${Y(0)}" text-anchor="end">0%</text></svg><div class="chart-legend">${legend}</div>`;
}

function histogram(st) {
  // Approximate the national size distribution from the cohorts.
  const bins = [];
  const maxW = Math.max(...st.cohorts.map((c) => c.weight)) * 1.5;
  const step = maxW > 900 ? 100 : maxW > 450 ? 50 : 25;
  for (let b = 100; b < maxW; b += step) {
    let v = 0;
    for (const c of st.cohorts) {
      const sd = c.weight * 0.16;
      const mid = b + step / 2;
      v += c.share * Math.exp(-((mid - c.weight) ** 2) / (2 * sd * sd)) / sd;
    }
    bins.push([b, v * step]);
  }
  const top = Math.max(...bins.map((x) => x[1]));
  return `<div class="histo">${bins
    .map(([b, v]) => `<div class="hb" title="${b}–${b + step} lb: ${(v * 100).toFixed(1)}%"><s style="height:${(v / top) * 100}%"></s><small>${b}</small></div>`)
    .join("")}</div>`;
}

export const data = {
  title: "Situation Room",
  icon: "📊",
  auto: 2500,
  render(st) {
    const h = st.history;
    return `
    <div class="grid-2">
      <section class="card span2">
        <div class="card-kicker">The only chart that matters</div>
        <h3>Average American woman vs. what the country can hold</h3>
        ${lineChart(h, [
          { label: "Avg woman (lb)", color: "#ec5f99", w: 3, get: (x) => x.avg },
          { label: "Accommodation capacity", color: "#2ec4b6", dash: "5 4", get: (x) => x.ic },
          { label: "Wardrobe capacity", color: "#3a86ff", dash: "2 4", get: (x) => x.wc },
        ])}
      </section>
      <section class="card">
        <div class="card-kicker">Hearts &amp; minds</div>
        <h3>Desire and approval</h3>
        ${lineChart(h, [
          { label: "Desire", color: "#f15bb5", get: (x) => x.des },
          { label: "Approval", color: "#d4af37", get: (x) => x.app },
        ], { min: 0, max: 100 })}
      </section>
      <section class="card">
        <div class="card-kicker">Attitude over time</div>
        <h3>Who wants it</h3>
        ${stackChart(h)}
      </section>
      <section class="card">
        <div class="card-kicker">Distribution</div>
        <h3>How big are America's women?</h3>
        ${histogram(st)}
        <p class="small muted">Estimated share of women by weight band.</p>
      </section>
      <section class="card">
        <div class="card-kicker">Engine room</div>
        <h3>Growth drivers</h3>
        <table class="kv-table">
          <tr><td>🍰 Abundance multiplier</td><td>×${(0.4 + 2.6 * (1 - Math.exp(-st.f.abundance / 55))).toFixed(2)}</td></tr>
          <tr><td>🛋️ Leisure multiplier</td><td>×${(0.55 + 1.9 * (1 - Math.exp(-st.f.leisure / 60))).toFixed(2)}</td></tr>
          <tr><td>⚗️ Science multiplier</td><td>×${(1 + (st.mods.gainMult - 1) * 0.6).toFixed(2)}</td></tr>
          <tr><td>🥗 Lean Coalition drag</td><td>×${(1 - st.f.opposition / 220).toFixed(2)}</td></tr>
          <tr><td>🚪 Strain penalty</td><td>×${(1 - 0.35 * Math.min(1, st.strain)).toFixed(2)}</td></tr>
          <tr><td>💗 Persuasion / day</td><td>${(persuasion(st) * 1000).toFixed(2)}‰</td></tr>
          <tr><td>📈 Record single-day gain</td><td>${st.stats.peakGain.toFixed(3)} lb</td></tr>
          <tr><td>💥 Incidents to date</td><td>${st.stats.incidents}</td></tr>
          <tr><td>📜 Bills passed / failed</td><td>${st.stats.billsPassed} / ${st.stats.billsFailed}</td></tr>
        </table>
      </section>
    </div>`;
  },
};

export const awards = {
  title: "Trophies",
  icon: "🏆",
  render(st) {
    return `
    <div class="grid-2">
      <section class="card">
        <div class="card-kicker">Achievements · ${Object.keys(st.achievements).length}/${ACHIEVEMENTS.length}</div>
        <ul class="ach">${ACHIEVEMENTS.map((a) => `<li class="${st.achievements[a.id] != null ? "got" : ""}"><b>${st.achievements[a.id] != null ? "🏆" : "🔒"} ${esc(a.name)}</b><small>${esc(a.desc)}${st.achievements[a.id] != null ? ` · ${shortDate(st.achievements[a.id])}` : ""}</small></li>`).join("")}</ul>
      </section>
      <section class="card">
        <div class="card-kicker">National milestones</div>
        <ul class="ach">${MILESTONES.map((m) => `<li class="${st.milestones[m.at] != null ? "got" : ""}"><b>${m.at.toLocaleString()} lb · ${esc(m.title)}</b><small>${st.milestones[m.at] != null ? `Reached ${shortDate(st.milestones[m.at])}` : "Not yet…"}</small></li>`).join("")}</ul>
        <div class="card-kicker" style="margin-top:1rem">The size ladder</div>
        <ul class="ladder">${STAGES.map((s, i) => `<li class="${st.avg >= s.min ? "got" : ""}"><b>${esc(s.name)}</b> <small>${s.min ? `${s.min}+ lb` : "under 150 lb"} · ${esc(s.size)}</small></li>`).join("")}</ul>
      </section>
    </div>`;
  },
};
