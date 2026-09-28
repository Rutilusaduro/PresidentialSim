// Parametric cartoon woman. Everything scales off her weight, so the same
// function draws a slim newscaster on day one and a sprawling one in year four.

let seq = 0;

const SKINS = ["#f6d7c3", "#eec1a0", "#d9a07a", "#b97a56", "#8d5a3b", "#6a4029"];
const HAIRS = ["#2b1b12", "#5a3620", "#a0612d", "#d9a45b", "#1a1a1a", "#7b2d26", "#c9c2b8"];

export function looksFor(seed) {
  // Deterministic look from a string seed so a character keeps her face.
  let h = 0;
  for (const c of String(seed)) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  const r = (n) => {
    h = (h * 1103515245 + 12345) >>> 0;
    return h % n;
  };
  const tops = ["#e56b8f", "#7d5fff", "#2ec4b6", "#ff9f1c", "#3a86ff", "#ef476f", "#8338ec", "#06d6a0", "#f15bb5", "#118ab2"];
  const bottoms = ["#22223b", "#3d405b", "#264653", "#4a4e69", "#5e548e", "#1d3557", "#6d597a"];
  return {
    skin: SKINS[r(SKINS.length)],
    hair: HAIRS[r(HAIRS.length)],
    hairStyle: ["long", "bob", "bun", "curly", "pony"][r(5)],
    top: tops[r(tops.length)],
    bottom: bottoms[r(bottoms.length)],
  };
}

/**
 * @param {object} o
 * @param {number} o.weight
 * @param {string} [o.seed]   derive look from a seed
 * @param {object} [o.look]   explicit look overrides
 * @param {boolean} [o.suit]  blazer look (no belly peeking out until very large)
 * @param {string} [o.cls]
 */
export function bodySVG(o) {
  const look = { ...looksFor(o.seed || "x"), ...(o.look || {}) };
  const w = Math.max(100, o.weight || 150);
  const s = Math.max(0, (w - 110) / 100);
  const p = (e) => Math.pow(s, e);
  const id = `b${++seq}`;

  const headR = 16 + 2.6 * p(0.6);
  const headY = 34 + Math.min(12, s * 1.4);
  const shoulder = 24 + 5.5 * p(0.8);
  const armR = 7 + 3.4 * p(0.82);
  const bustR = 11 + 3.8 * p(0.82);
  const bustX = 9 + 3.6 * p(0.8);
  const bustY = 88 + 1.8 * p(0.7);
  const bellyRx = 20 + 11.5 * p(0.86);
  const bellyRy = 17 + 8.5 * p(0.86);
  const bellyY = 121 + 4 * p(0.8);
  const hipRx = 30 + 10.5 * p(0.86);
  const hipRy = 20 + 5 * p(0.8);
  const hipY = 150 + 1.2 * s;
  const thighX = 13 + 5.8 * p(0.8);
  const thighRx = 13 + 6.2 * p(0.86);
  const thighY = 186;
  const calfX = 12 + 3.8 * p(0.7);
  const calfRx = 7 + 2.6 * p(0.8);
  // The hem rides up as her belly grows; suits hold out longer.
  const hem = o.suit ? 150 - Math.max(0, s - 3) * 3 : 130 - Math.min(14, s * 1.8);

  const armX = shoulder + armR * 0.35 + Math.max(0, bellyRx - shoulder) * 0.55;
  const maxX = Math.max(hipRx, armX + armR, thighX + thighRx, bellyRx, bustX + bustR) + 8;
  const vbW = Math.max(150, maxX * 2);

  const skin = look.skin;
  const shade = "rgba(0,0,0,0.12)";
  const ol = `stroke="rgba(0,0,0,0.22)" stroke-width="1.3"`;
  const top = look.top;
  const bottom = look.bottom;

  const hair = hairBack(look, headR, headY);
  const hairF = hairFront(look, headR, headY);

  const cheek = s > 0.7 ? Math.min(1, (s - 0.7) / 3) : 0;
  const chin = s > 2 ? Math.min(1, (s - 2) / 4) : 0;
  const strain = s > 2.2;

  const belly = `<ellipse cx="0" cy="${bellyY}" rx="${bellyRx}" ry="${bellyRy}"`;
  const navelY = bellyY + bellyRy * 0.22;

  return `<svg class="body-svg ${o.cls || ""}" viewBox="${-vbW / 2} 0 ${vbW} 262" preserveAspectRatio="xMidYMax meet" aria-hidden="true">
  <defs>
    <clipPath id="${id}c"><rect x="-500" y="-50" width="1000" height="${hem + 50}"/></clipPath>
    <clipPath id="${id}b"><ellipse cx="0" cy="${bellyY}" rx="${bellyRx}" ry="${bellyRy}"/></clipPath>
    <radialGradient id="${id}g" cx="0.35" cy="0.3" r="0.8"><stop offset="0" stop-color="#fff" stop-opacity="0.18"/><stop offset="1" stop-color="#000" stop-opacity="0.1"/></radialGradient>
  </defs>
  ${hair}
  <g class="legs">
    <ellipse cx="${-calfX}" cy="224" rx="${calfRx}" ry="22" fill="${bottom}"/>
    <ellipse cx="${calfX}" cy="224" rx="${calfRx}" ry="22" fill="${bottom}"/>
    <ellipse cx="${-calfX - 2}" cy="252" rx="${calfRx + 4}" ry="6" fill="#2a2a2a"/>
    <ellipse cx="${calfX + 2}" cy="252" rx="${calfRx + 4}" ry="6" fill="#2a2a2a"/>
    <ellipse cx="${-thighX}" cy="${thighY}" rx="${thighRx}" ry="${31 + 1.5 * p(0.5)}" fill="${bottom}" ${ol}/>
    <ellipse cx="${thighX}" cy="${thighY}" rx="${thighRx}" ry="${31 + 1.5 * p(0.5)}" fill="${bottom}" ${ol}/>
    <ellipse cx="0" cy="${hipY}" rx="${hipRx}" ry="${hipRy}" fill="${bottom}" ${ol}/>
    <ellipse cx="0" cy="${hipY}" rx="${hipRx}" ry="${hipRy}" fill="url(#${id}g)"/>
  </g>
  <g class="arms">
    <ellipse cx="${-armX}" cy="${104 + s}" rx="${armR}" ry="${34 + 2 * p(0.5)}" fill="${o.suit ? top : skin}" ${ol}/>
    <ellipse cx="${armX}" cy="${104 + s}" rx="${armR}" ry="${34 + 2 * p(0.5)}" fill="${o.suit ? top : skin}" ${ol}/>
    <circle cx="${-armX}" cy="${142 + s}" r="${5 + armR * 0.35}" fill="${skin}"/>
    <circle cx="${armX}" cy="${142 + s}" r="${5 + armR * 0.35}" fill="${skin}"/>
  </g>
  <rect x="${-6 - s * 1.5}" y="${headY + 10}" width="${12 + 3 * s}" height="${Math.max(6, 64 - headY - 10)}" fill="${skin}"/>
  <ellipse cx="0" cy="88" rx="${shoulder}" ry="30" fill="${top}" ${ol}/>
  <g class="belly">
    ${belly} fill="${skin}" ${ol}/>
    <ellipse cx="0" cy="${navelY}" rx="${1.6 + s * 0.25}" ry="${2.4 + s * 0.35}" fill="${shade}"/>
    ${belly} fill="${top}" clip-path="url(#${id}c)" ${ol}/>
    <line x1="${-bellyRx}" x2="${bellyRx}" y1="${hem}" y2="${hem}" stroke="rgba(0,0,0,0.25)" stroke-width="1.3" clip-path="url(#${id}b)"/>
    ${belly} fill="url(#${id}g)"/>
    ${strain ? `<path d="M${-bellyRx * 0.5} ${hem - 4} q${bellyRx * 0.25} -5 ${bellyRx * 0.5} 0 M${bellyRx * 0.05} ${hem - 6} q${bellyRx * 0.2} -4 ${bellyRx * 0.4} 0" stroke="rgba(0,0,0,0.18)" stroke-width="1.2" fill="none"/>` : ""}
  </g>
  <g class="bust">
    <circle cx="${-bustX}" cy="${bustY}" r="${bustR}" fill="${top}" ${ol}/>
    <circle cx="${bustX}" cy="${bustY}" r="${bustR}" fill="${top}" ${ol}/>
    <circle cx="${-bustX}" cy="${bustY}" r="${bustR}" fill="url(#${id}g)"/>
    <circle cx="${bustX}" cy="${bustY}" r="${bustR}" fill="url(#${id}g)"/>
    <path d="M0 ${bustY - bustR * 0.45} Q${bustR * 0.08} ${bustY} 0 ${bustY + bustR * 0.35}" stroke="rgba(0,0,0,0.3)" stroke-width="1.4" fill="none"/>
    ${o.suit ? `<path d="M${-shoulder * 0.4} 62 L0 ${bustY + bustR * 0.6} L${shoulder * 0.4} 62" stroke="#f4f4f4" stroke-width="4" fill="none" opacity="0.8"/>` : ""}
  </g>
  ${chin ? `<ellipse cx="0" cy="${headY + headR * 0.86}" rx="${headR * (0.55 + 0.2 * chin)}" ry="${headR * (0.2 + 0.12 * chin)}" fill="${skin}"/><path d="M${-headR * 0.4} ${headY + headR * 0.86} q${headR * 0.4} ${headR * 0.18} ${headR * 0.8} 0" stroke="${shade}" fill="none"/>` : ""}
  <circle cx="0" cy="${headY}" r="${headR}" fill="${skin}" ${ol}/>
  ${cheek ? `<circle cx="${-headR * 0.55}" cy="${headY + headR * 0.3}" r="${headR * 0.36 * cheek}" fill="${skin}"/><circle cx="${headR * 0.55}" cy="${headY + headR * 0.3}" r="${headR * 0.36 * cheek}" fill="${skin}"/>` : ""}
  <ellipse cx="${-headR * 0.36}" cy="${headY - 2}" rx="1.9" ry="2.4" fill="#222"/>
  <ellipse cx="${headR * 0.36}" cy="${headY - 2}" rx="1.9" ry="2.4" fill="#222"/>
  <circle cx="${-headR * 0.55}" cy="${headY + headR * 0.28}" r="${3 + cheek * 2}" fill="#ff6f91" opacity="0.28"/>
  <circle cx="${headR * 0.55}" cy="${headY + headR * 0.28}" r="${3 + cheek * 2}" fill="#ff6f91" opacity="0.28"/>
  <path d="M${-headR * 0.28} ${headY + headR * 0.38} q${headR * 0.28} ${headR * 0.24} ${headR * 0.56} 0" stroke="#7a3b3b" stroke-width="1.8" fill="none" stroke-linecap="round"/>
  ${hairF}
</svg>`;
}

function hairBack(l, r, y) {
  const c = l.hair;
  switch (l.hairStyle) {
    case "long":
      return `<path d="M${-r * 1.1} ${y} Q${-r * 1.3} ${y + r * 3.4} ${-r * 0.2} ${y + r * 3} L${r * 0.2} ${y + r * 3} Q${r * 1.3} ${y + r * 3.4} ${r * 1.1} ${y} Z" fill="${c}"/>`;
    case "curly":
      return [[-1, 0.2], [1, 0.2], [-1.05, 1], [1.05, 1], [-0.7, 1.6], [0.7, 1.6]]
        .map(([dx, dy]) => `<circle cx="${dx * r}" cy="${y + dy * r}" r="${r * 0.62}" fill="${c}"/>`)
        .join("");
    case "pony":
      return `<ellipse cx="${r * 0.9}" cy="${y + r * 1.2}" rx="${r * 0.35}" ry="${r * 1.2}" fill="${c}"/>`;
    case "bob":
      return `<ellipse cx="0" cy="${y + r * 0.35}" rx="${r * 1.2}" ry="${r * 1.12}" fill="${c}"/>`;
    default:
      return "";
  }
}

function hairFront(l, r, y) {
  const c = l.hair;
  const cap = `<path d="M${-r * 1.02} ${y + 1} A${r * 1.02} ${r * 1.02} 0 0 1 ${r * 1.02} ${y + 1} Q${r * 0.3} ${y - r * 0.55} ${-r * 1.02} ${y + 1} Z" fill="${c}"/>`;
  if (l.hairStyle === "bun") return cap + `<circle cx="0" cy="${y - r * 1.05}" r="${r * 0.5}" fill="${c}"/>`;
  if (l.hairStyle === "curly") return cap + `<circle cx="${-r * 0.5}" cy="${y - r * 0.75}" r="${r * 0.45}" fill="${c}"/><circle cx="${r * 0.5}" cy="${y - r * 0.75}" r="${r * 0.45}" fill="${c}"/>`;
  return cap;
}

/** Tiny avatar head only — for feed posts and lists. */
export function headSVG(seed, weight) {
  const look = looksFor(seed);
  const s = Math.max(0, (weight - 110) / 100);
  const r = 16 + 1.7 * Math.pow(s, 0.6);
  const cheek = s > 0.7 ? Math.min(1, (s - 0.7) / 3) : 0;
  const vb = r * 3;
  return `<svg class="head-svg" viewBox="${-vb / 2} ${34 - vb / 2} ${vb} ${vb}" aria-hidden="true">
    <circle cx="0" cy="${34 + r * 1.9}" r="${r * 1.35}" fill="${look.top}"/>
    ${hairBack(look, r, 34)}
    <circle cx="0" cy="34" r="${r}" fill="${look.skin}"/>
    ${cheek ? `<circle cx="${-r * 0.55}" cy="${34 + r * 0.3}" r="${r * 0.36 * cheek}" fill="${look.skin}"/><circle cx="${r * 0.55}" cy="${34 + r * 0.3}" r="${r * 0.36 * cheek}" fill="${look.skin}"/>` : ""}
    <ellipse cx="${-r * 0.36}" cy="32" rx="1.9" ry="2.4" fill="#222"/>
    <ellipse cx="${r * 0.36}" cy="32" rx="1.9" ry="2.4" fill="#222"/>
    <path d="M${-r * 0.28} ${34 + r * 0.38} q${r * 0.28} ${r * 0.24} ${r * 0.56} 0" stroke="#7a3b3b" stroke-width="1.8" fill="none" stroke-linecap="round"/>
    ${hairFront(look, r, 34)}
  </svg>`;
}
