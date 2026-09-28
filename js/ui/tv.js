import { esc, fill, lb, pick, shortDate } from "../util.js";
import { ADS, CHANNELS, TICKER } from "../data/tv.js";
import { bandOf, dressSize, stageName } from "../data/stages.js";
import { US_STATES } from "../data/states.js";
import { WOMEN_MILLIONS, actionById, billOdds } from "../sim.js";
import { bodySVG } from "./body.js";

let ch = 0;
let seg = 0;
let rot = null;
let adBreak = false;
let caption = "";
let captionTag = "";
let tickerKey = "";
let stRef = null;

const ROTATE_MS = 9000;

function host(st) {
  const c = CHANNELS[ch];
  return { ...c.host, w: Math.max(110, c.host.weight(st)) };
}

function vars(st, h) {
  return {
    avgLb: lb(st.avg),
    avg: Math.round(st.avg),
    desire: Math.round(st.desire),
    state: US_STATES.map((s) => s[1]),
    size: dressSize(h.w),
    approval: Math.round(st.approval),
    pres: `${st.pres.address} ${st.pres.name}`,
  };
}

function nextCaption(st) {
  const c = CHANNELS[ch];
  const h = host(st);
  seg++;
  adBreak = seg % 5 === 4;
  if (adBreak) {
    caption = pick(ADS[bandOf(st.avg)]);
    captionTag = "COMMERCIAL";
    return;
  }
  const band = bandOf(h.w);
  if (c.id === "gnn") {
    const fresh = st.news.slice(0, 6);
    if (fresh.length && seg % 3 !== 0) {
      const n = fresh[(seg >> 0) % fresh.length];
      caption = n.text;
      captionTag = { milestone: "SPECIAL REPORT", opposition: "LEAN COALITION", incident: "INCIDENT", wardrobe: "WARDROBE WATCH", cabinet: "WEST WING", election: "ELECTION DESK", bill: "CAPITOL", eo: "WHITE HOUSE", research: "SCIENCE", campaign: "CULTURE" }[n.tag] || "BREAKING";
      return;
    }
  }
  if (c.id === "congress" && st.bills.length && seg % 2 === 0) {
    const b = pick(st.bills);
    const a = actionById(b.id);
    caption = `NOW DEBATING: ${a.name}. Floor vote ${shortDate(b.voteDay)}. Whip count: ${Math.round(billOdds(st, b) * 100)}% likely to pass. Sen. Pike is working the room with a pastry tray.`;
    captionTag = "LIVE FROM THE FLOOR";
    return;
  }
  caption = fill(pick(c.segments[band]), vars(st, h));
  captionTag = c.show.toUpperCase();
}

function tickerHtml(st) {
  const band = bandOf(st.avg);
  const items = [
    `AVG AMERICAN WOMAN ${st.avg.toFixed(1)} LB ${st.gainToday >= 0 ? "▲" : "▼"}${Math.abs(st.gainToday).toFixed(2)}`,
    `DESIRE INDEX ${st.desire.toFixed(0)}`,
    `APPROVAL ${st.approval.toFixed(0)}%`,
    `LEAN COALITION ${st.f.opposition.toFixed(0)}`,
    ...TICKER[band],
    ...st.news.slice(0, 4).map((n) => n.text.toUpperCase().slice(0, 90)),
  ];
  return items.map((t) => `<span>${esc(t)}</span>`).join("<i>◆</i>");
}

function screen(st) {
  const c = CHANNELS[ch];
  const h = host(st);
  return `
    <div class="tv-screen set-${c.set} ${adBreak ? "ad" : ""}" id="tv-screen">
      <div class="set-bg"></div>
      <div class="tv-bug"><b>${c.num}</b> ${esc(c.name)}</div>
      <div class="tv-live">● LIVE</div>
      <div class="tv-counter" id="tv-counter">${counter(st)}</div>
      <div class="tv-stage" id="tv-stage">${adBreak ? adCard() : bodySVG({ weight: h.w, seed: h.seed, look: h.look, suit: h.suit, cls: "tv-host" })}</div>
      <div class="set-front"></div>
      <div class="tv-lower" ${adBreak ? "hidden" : ""}><b>${esc(h.name)}</b><span id="tv-hostw">${hostLabel(h)}</span></div>
      <div class="tv-caption"><em>${esc(captionTag)}</em><span id="tv-cap">${esc(caption)}</span></div>
      <div class="tv-ticker"><div class="tv-ticker-inner" id="tv-ticker">${tickerHtml(st)}</div></div>
      <div class="tv-static" id="tv-static"></div>
    </div>`;
}

function adCard() {
  return `<div class="ad-card"><small>A word from our sponsors</small><div class="ad-copy">${esc(caption)}</div></div>`;
}

function hostLabel(h) {
  return `${Math.round(h.w)} lb · ${stageName(h.w)} · ${dressSize(h.w)}`;
}

function counter(st) {
  const today = st.gainToday * WOMEN_MILLIONS;
  return `<small>America's women gained today</small><b>${today.toFixed(2)}M lb</b>`;
}

export const tv = {
  title: "Television",
  icon: "📺",
  render(st) {
    if (!caption) nextCaption(st);
    st.stats.channelsSeen[CHANNELS[ch].id] = 1;
    return `
    <div class="tv-layout">
      <div class="tv-cabinet">
        <div class="tv-bezel">${screen(st)}</div>
        <div class="tv-brand">PRESIDENTIAL · VISION</div>
      </div>
      <aside class="remote card">
        <div class="card-kicker">Remote</div>
        <div class="remote-grid">${CHANNELS.map((c, i) => `<button class="rbtn ${i === ch ? "on" : ""}" data-ch="${i}"><b>${c.num}</b><span>${esc(c.show)}</span></button>`).join("")}</div>
        <div class="remote-row"><button class="btn btn-sm" data-ch="prev">◀ CH</button><button class="btn btn-sm" data-skip>Next segment ▶</button><button class="btn btn-sm" data-ch="next">CH ▶</button></div>
        <p class="muted small">Hosts are tied to the live numbers: they grow in real time as the days tick by. GNN reads your actual news wire. Leave it on at high speed and watch.</p>
        <div class="card-kicker" style="margin-top:1rem">Tonight's lineup</div>
        <ul class="guide">${CHANNELS.map((c) => { const w = Math.max(110, c.host.weight(st)); return `<li><b>${c.num}</b> ${esc(c.show)} <small>${esc(c.host.name)} · ${Math.round(w)} lb</small></li>`; }).join("")}</ul>
      </aside>
    </div>`;
  },
  bind(root, st, ctx) {
    stRef = st;
    root.onclick = (e) => {
      const b = e.target.closest("[data-ch]");
      if (b) {
        const v = b.dataset.ch;
        ch = v === "prev" ? (ch + CHANNELS.length - 1) % CHANNELS.length : v === "next" ? (ch + 1) % CHANNELS.length : +v;
        seg = 0;
        adBreak = false;
        caption = "";
        flip(root, st, ctx);
      }
      if (e.target.closest("[data-skip]")) {
        nextCaption(st);
        paint(root, st);
      }
    };
  },
  after(root, st, ctx) {
    clearInterval(rot);
    rot = setInterval(() => {
      if (!document.body.contains(root.querySelector("#tv-screen"))) return;
      nextCaption(stRef);
      paint(root, stRef);
    }, ROTATE_MS);
  },
  live(root, st) {
    // Per-tick: refresh the host's body and the live numbers without resetting the segment.
    const stage = root.querySelector("#tv-stage");
    if (!stage) return;
    const h = host(st);
    if (!adBreak) {
      stage.innerHTML = bodySVG({ weight: h.w, seed: h.seed, look: h.look, suit: h.suit, cls: "tv-host" });
      const hw = root.querySelector("#tv-hostw");
      if (hw) hw.textContent = hostLabel(h);
    }
    root.querySelector("#tv-counter").innerHTML = counter(st);
    const key = `${Math.round(st.avg)}|${st.news[0]?.id}`;
    if (key !== tickerKey) {
      tickerKey = key;
      // Only swap ticker text at the end of a scroll cycle to avoid jumps.
      const tk = root.querySelector("#tv-ticker");
      tk.dataset.next = "1";
    }
  },
  leave() {
    clearInterval(rot);
    rot = null;
  },
};

function paint(root, st) {
  const scr = root.querySelector("#tv-screen");
  if (!scr) return;
  const c = CHANNELS[ch];
  const h = host(st);
  st.stats.channelsSeen[c.id] = 1;
  scr.className = `tv-screen set-${c.set} ${adBreak ? "ad" : ""}`;
  scr.querySelector(".tv-bug").innerHTML = `<b>${c.num}</b> ${esc(c.name)}`;
  scr.querySelector("#tv-stage").innerHTML = adBreak ? adCard() : bodySVG({ weight: h.w, seed: h.seed, look: h.look, suit: h.suit, cls: "tv-host" });
  const lower = scr.querySelector(".tv-lower");
  lower.hidden = adBreak;
  lower.innerHTML = `<b>${esc(h.name)}</b><span id="tv-hostw">${hostLabel(h)}</span>`;
  scr.querySelector(".tv-caption").innerHTML = `<em>${esc(captionTag)}</em><span id="tv-cap">${esc(caption)}</span>`;
  root.querySelectorAll(".rbtn").forEach((b, i) => b.classList.toggle("on", i === ch));
}

function flip(root, st, ctx) {
  nextCaption(st);
  seg = 0;
  paint(root, st);
  const s = root.querySelector("#tv-static");
  if (s) {
    s.classList.add("on");
    setTimeout(() => s.classList.remove("on"), 350);
  }
}

// Swap ticker content when an animation cycle completes.
document.addEventListener(
  "animationiteration",
  (e) => {
    if (e.target.id === "tv-ticker" && e.target.dataset.next && stRef) {
      e.target.innerHTML = tickerHtml(stRef);
      delete e.target.dataset.next;
    }
  },
  true,
);
