import { esc, shortDate } from "../util.js";
import { HASHTAGS } from "../data/social.js";
import { bandOf } from "../data/stages.js";
import { addNews, applyEffects, makePost } from "../sim.js";
import { headSVG } from "./body.js";
import { ATT_COLORS, ATT_NAMES } from "./common.js";

const POST_CD = 5;
let filter = -1;

const PRES_POSTS = [
  { text: "Had the Cheesecake Files torte for breakfast. Highly recommend. 🍰", effects: { culture: 3, persuade: 0.002 } },
  { text: "Reminder: you are allowed seconds. That's not a suggestion, it's a right. 🇺🇸", effects: { persuade: 0.003, opposition: 1 } },
  { text: "Every doorway in this country will fit every woman in this country. That's a promise.", effects: { approval: 2, persuade: 0.001 } },
  { text: "To the women of America: you've never looked better. Keep going. 💗", effects: { persuade: 0.004, culture: 2, opposition: 2 } },
  { text: "Brunch at the White House today. Bottomless mimosas and bottomless pancakes. Who's in?", effects: { culture: 4, approval: 1 } },
  { text: "Sen. Whitlock, the salad bar is lonely. Come join us at the buffet.", effects: { opposition: -3, approval: -1, culture: 2 } },
];

export const feed = {
  title: "Chirper",
  icon: "📱",
  render(st) {
    const posts = st.feed.filter((p) => filter < 0 || p.att === filter).slice(0, 30);
    const ready = st.day - (st.lastChirp ?? -99) >= POST_CD;
    return `
    <div class="feed-layout">
      <section>
        <div class="card compose">
          <div class="card-kicker">Post as @POTUS</div>
          ${ready ? `<div class="pres-posts">${PRES_POSTS.map((p, i) => `<button class="btn btn-sm post-opt" data-post="${i}">${esc(p.text)}</button>`).join("")}</div>` : `<p class="muted">Your comms team says wait ${POST_CD - (st.day - st.lastChirp)} more days before posting again.</p>`}
        </div>
        <div class="filters">
          <button class="chip-btn ${filter < 0 ? "on" : ""}" data-f="-1">All</button>
          ${ATT_NAMES.map((n, i) => `<button class="chip-btn ${filter === i ? "on" : ""}" data-f="${i}" style="--c:${ATT_COLORS[i]}">${n}</button>`).join("")}
        </div>
        <div id="feed-list">${posts.map(postHtml).join("") || "<p class='muted'>The timeline is quiet. Unpause the game.</p>"}</div>
      </section>
      <aside class="card trends">
        <div class="card-kicker">Trending in the USA</div>
        <ol>${HASHTAGS[bandOf(st.avg)].map((h, i) => `<li><b>${h}</b><small>${Math.round((5 - i) * (40 + st.f.culture * 4))}K chirps</small></li>`).join("")}</ol>
        <div class="card-kicker" style="margin-top:1rem">Sentiment</div>
        <p class="small">${sentiment(st)}</p>
      </aside>
    </div>`;
  },
  bind(root, st, ctx) {
    root.onclick = (e) => {
      const f = e.target.closest("[data-f]");
      if (f) {
        filter = +f.dataset.f;
        ctx.rerender();
      }
      const p = e.target.closest("[data-post]");
      if (p) {
        const post = PRES_POSTS[+p.dataset.post];
        st.lastChirp = st.day;
        applyEffects(st, post.effects, false);
        st.feed.unshift({ id: "p" + st.day, day: st.day, handle: "@POTUS", seed: "potus", weight: 170, att: -1, text: post.text, likes: Math.round(200000 + st.approval * 20000), pres: true });
        // The replies roll in.
        for (let i = 0; i < 3; i++) st.feed.splice(1, 0, makePost(st));
        addNews(st, `@POTUS: '${post.text}'`, "social");
        ctx.hud();
        ctx.rerender();
      }
    };
  },
  live(root, st) {
    const list = root.querySelector("#feed-list");
    if (!list) return;
    const top = st.feed[0];
    if (top && list.dataset.top !== top.id && (filter < 0 || top.att === filter)) {
      list.dataset.top = top.id;
      if (!list.querySelector(`[data-id="${top.id}"]`)) {
        list.insertAdjacentHTML("afterbegin", postHtml(top));
        list.firstElementChild.classList.add("fresh");
        while (list.children.length > 30) list.lastElementChild.remove();
      }
    }
  },
};

function postHtml(p) {
  const badge = p.pres ? `<span class="att-badge" style="--c:#d4af37">President</span>` : `<span class="att-badge" style="--c:${ATT_COLORS[p.att]}">${ATT_NAMES[p.att]}</span>`;
  return `<article class="post ${p.pres ? "pres" : ""}" data-id="${p.id}">
    <div class="post-av">${p.pres ? "🦅" : headSVG(p.seed, p.weight)}</div>
    <div class="post-body">
      <div class="post-head"><b>${esc(p.handle)}</b> ${badge} <small class="muted">${shortDate(p.day)}</small></div>
      <p>${esc(p.text)}</p>
      <div class="post-foot muted small">♥ ${p.likes.toLocaleString()} · ↻ ${Math.round(p.likes / 7).toLocaleString()}${p.pres ? "" : ` · ${Math.round(p.weight)} lb`}</div>
    </div>
  </article>`;
}

function sentiment(st) {
  const d = st.desire;
  if (d < 25) return "Mostly skeptical. Lots of 'my jeans are fine' energy.";
  if (d < 40) return "Curious and conflicted. The dessert posts are getting a lot of likes.";
  if (d < 55) return "The mood is warming. #OneMorePlate is everywhere.";
  if (d < 70) return "Overwhelmingly positive. Women are posting their new sizes proudly.";
  if (d < 85) return "Euphoric. Gain milestones are the most-liked posts on the platform.";
  return "Total devotion. The platform has added a 'weigh-in' post type by popular demand.";
}
