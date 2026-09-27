import { esc, lb, lb1, money, shortDate } from "../util.js";
import { TERM_DAYS, WOMEN_MILLIONS, actionById, billOdds, gainFor, lobbyBill, persuasion, targets } from "../sim.js";
import { dressSize, stageName } from "../data/stages.js";
import { bodySVG } from "./body.js";
import { ATT_COLORS, ATT_NAMES, bar } from "./common.js";

export const oval = {
  title: "Oval Office",
  icon: "🏛️",
  auto: 900,
  hold: () => document.activeElement?.closest?.(".no-refresh"),
  render(st) {
    const g = st.gainToday;
    const natToday = (g * WOMEN_MILLIONS) / 1; // millions of lbs
    const t = targets(st);
    const P = persuasion(st);
    const week = st.history.length > 3 ? st.avg - st.history[Math.max(0, st.history.length - 3)].avg : 0;
    return `
    <div class="grid-oval">
      <section class="card hero-woman">
        <div class="card-kicker">The Average American Woman · live</div>
        <div class="hero-row">
          <div class="hero-fig">${bodySVG({ weight: st.avg, seed: "avgwoman", look: { top: "#e56b8f", bottom: "#3d405b", hairStyle: "long" } })}</div>
          <div class="hero-stats">
            <div class="big-weight">${lb1(st.avg)}</div>
            <div class="stage-tag">${stageName(st.avg)} · ${dressSize(st.avg)}</div>
            <ul class="kv">
              <li><span>Today</span><b class="up">+${g.toFixed(3)} lb</b></li>
              <li><span>This week</span><b class="up">+${week.toFixed(2)} lb</b></li>
              <li><span>Since inauguration</span><b class="up">+${(st.avg - st.startAvg).toFixed(1)} lb</b></li>
              <li><span>Nationally today</span><b>${natToday.toFixed(2)}M lb gained</b></li>
            </ul>
            <p class="hint">${esc(advice(st))}</p>
          </div>
        </div>
      </section>

      <section class="card">
        <div class="card-kicker">Hearts &amp; appetites</div>
        <h3>What women want <small>Desire ${st.desire.toFixed(1)}</small></h3>
        <div class="att-stack">${st.cohorts.map((c, i) => `<s style="width:${c.share * 100}%;background:${ATT_COLORS[i]}" title="${ATT_NAMES[i]} ${(c.share * 100).toFixed(1)}%"></s>`).join("")}</div>
        <table class="att-table">
          ${st.cohorts
            .map(
              (c, i) => `<tr><td><i class="dot" style="background:${ATT_COLORS[i]}"></i>${ATT_NAMES[i]}</td><td>${(c.share * 100).toFixed(1)}%</td><td>${lb(c.weight)}</td><td class="muted">+${gainFor(st, i, c.weight).toFixed(2)}/day</td></tr>`,
            )
            .join("")}
        </table>
        <p class="muted small">Persuasion pressure: <b class="${P >= 0 ? "up" : "down"}">${P >= 0 ? "+" : ""}${(P * 1000).toFixed(2)}‰/day</b>. Women drift up (or down) the ladder with culture, campaigns, comfort, and the Lean Coalition's pushback.</p>
      </section>

      <section class="card">
        <div class="card-kicker">National factors</div>
        <h3>What's driving the growth</h3>
        ${bar("🍰 Abundance", st.f.abundance, 130, "#ff9f1c", `${st.f.abundance.toFixed(0)} → ${t.abundance.toFixed(0)}`)}
        ${bar("🛋️ Leisure", st.f.leisure, 130, "#7d5fff", `${st.f.leisure.toFixed(0)} → ${t.leisure.toFixed(0)}`)}
        ${bar("📣 Culture", st.f.culture, 130, "#f15bb5", `${st.f.culture.toFixed(0)} → ${t.culture.toFixed(0)}`)}
        ${bar("🥗 Lean Coalition", st.f.opposition, 100, "#8a9a5b", `${st.f.opposition.toFixed(0)} → ${t.opposition.toFixed(0)}`)}
        ${bar("⚗️ Science multiplier", st.mods.gainMult, 3, "#2ec4b6", `×${st.mods.gainMult.toFixed(2)}`)}
        <div class="cap-row">
          ${capBox("🚪 Accommodation", st.infra.cap, st.avg, st.infraStrain, "Chairs, doors, seats and floors are rated for")}
          ${capBox("👗 Wardrobe", st.wardrobe.cap, st.avg, st.wardrobeStrain, "Stores stock clothing comfortably up to")}
        </div>
      </section>

      <section class="card">
        <div class="card-kicker">In progress</div>
        <h3>Your agenda</h3>
        ${agenda(st)}
      </section>

      <section class="card span2">
        <div class="card-kicker">Wire</div>
        <h3>Latest news</h3>
        <ul class="news-list">${st.news
          .slice(0, 8)
          .map((n) => `<li class="tag-${n.tag}"><time>${shortDate(n.day)}</time>${esc(n.text)}</li>`)
          .join("")}</ul>
      </section>
    </div>`;
  },
  bind(root, st, ctx) {
    root.onclick = (e) => {
      const l = e.target.closest("[data-lobby]");
      if (l) {
        if (lobbyBill(st, l.dataset.lobby)) ctx.toast("You twist some arms (and serve some pie). Odds improved.");
        else ctx.toast("Can't lobby further (need 8 PC, max 4 rounds).");
        ctx.rerender();
        ctx.hud();
      }
      const g = e.target.closest("[data-go]");
      if (g) ctx.go(g.dataset.go);
    };
  },
};

function capBox(label, cap, avg, strain, blurb) {
  const state = strain <= 0 ? "ok" : strain < 0.5 ? "warn" : "bad";
  const msg = strain <= 0 ? `${Math.round(cap - avg)} lb of headroom` : strain < 0.5 ? "Straining: incidents rising" : "Overwhelmed: growth slowed, approval hit";
  return `<div class="cap ${state}"><b>${label}</b><div class="cap-num">${lb(cap)}</div><small>${blurb} ${lb(cap)}.</small><em>${msg}</em></div>`;
}

function agenda(st) {
  const rows = [];
  for (const b of st.bills) {
    const a = actionById(b.id);
    rows.push(`<div class="ag-row"><span>📜 <b>${esc(a.name)}</b><br><small>Vote ${shortDate(b.voteDay)} · pass odds ${Math.round(billOdds(st, b) * 100)}% · lobbied ${b.lobby}/4</small></span><button class="btn btn-sm" data-lobby="${b.id}">Lobby (8 PC)</button></div>`);
  }
  for (const c of st.campaigns) {
    const a = actionById(c.id);
    rows.push(`<div class="ag-row"><span>📣 <b>${esc(a.name)}</b><br><small>${c.endDay - st.day} days left</small></span></div>`);
  }
  if (st.research) {
    const a = actionById(st.research.id);
    const pct = ((st.day - st.research.start) / (st.research.doneDay - st.research.start)) * 100;
    rows.push(`<div class="ag-row"><span>⚗️ <b>${esc(a.name)}</b><br><small>${st.research.doneDay - st.day} days left</small><i class="mini-meter pink wide"><s style="width:${pct}%"></s></i></span></div>`);
  }
  if (!rows.length) rows.push(`<p class="muted">Nothing in motion. <a href="#" data-go="policy">Open the Policy desk →</a></p>`);
  return rows.join("");
}

function advice(st) {
  if (st.day < 5) return "Tip: open the Policy desk and sign your first executive order. Then turn on the TV.";
  if (st.budget < 0) return "Chief of Staff: 'We're in deficit, and it's costing approval. Trim a department in the Budget tab.'";
  if (st.infraStrain > 0.5) return "Secretary Okafor: 'Our chairs and doorways can't keep up. Fund the Dept. of Accommodation!'";
  if (st.wardrobeStrain > 0.5) return "Secretary Lamont: 'Women are bursting out of everything. The Bureau of Textiles needs money, sweetie.'";
  if (st.f.opposition > 55) return "Advisor: 'The Lean Coalition is strong. Truth in Dieting or a 'Just One Bite' campaign would help.'";
  if (st.desire < 35) return "Advisor: 'Women still don't WANT this. Culture and campaigns change hearts; town halls help too.'";
  if (st.pc > 150) return "Advisor: 'You're sitting on political capital. Spend it: sign something!'";
  if (!st.research) return "Institute of Abundance: 'The lab is idle, {address}. Fund a research project.'".replace("{address}", st.pres.address);
  if (st.f.abundance < 50) return "Secretary Buttersworth: 'There's not enough butter in this country. Not nearly enough.'";
  const termDay = st.day - (st.term - 1) * TERM_DAYS;
  if (TERM_DAYS - termDay < 120 && st.approval < 52) return "Campaign chief: 'Election's close and approval's soft. Speeches and rallies, now.'";
  return "Everything's moving. Maybe check in on your Cabinet; some of them have grown quite a bit.";
}
