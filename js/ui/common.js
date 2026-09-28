// Shared UI helpers.

const FX = {
  abundance: ["🍰", "Abundance"],
  leisure: ["🛋️", "Leisure"],
  culture: ["📣", "Culture"],
  opposition: ["🥗", "Opposition"],
  persuade: ["💗", "Persuasion"],
  gainMult: ["⚗️", "Gain"],
  infraCap: ["🚪", "Accommodation"],
  infraGrowth: ["🚪", "Accommodation/yr"],
  wardrobeCap: ["👗", "Wardrobe"],
  wardrobeGrowth: ["👗", "Wardrobe/yr"],
  income: ["💵", "Budget/yr"],
  approval: ["👍", "Approval"],
  pc: ["🎖️", "PC"],
  budget: ["💵", "Budget"],
  congress: ["🏛️", "Congress"],
  convert: ["💗", "Converts"],
  approvalDrift: ["👍", "Approval"],
};

export function effectChips(e, perm = false) {
  if (!e) return "";
  return Object.entries(e)
    .filter(([k]) => FX[k])
    .map(([k, v]) => {
      const [ico, name] = FX[k];
      let val;
      const good = k === "opposition" ? v < 0 : k === "budget" || k === "income" ? v > 0 : v > 0;
      if (k === "gainMult") val = `×${v}`;
      else if (k === "persuade") val = v > 0 ? "+".repeat(Math.min(3, Math.max(1, Math.round(v / (perm ? 0.0004 : 0.002))))) : "−";
      else if (k === "infraGrowth" || k === "wardrobeGrowth") val = `${v > 0 ? "+" : ""}${Math.round(v * 365)} lb`;
      else if (k === "income") val = `${v > 0 ? "+" : "−"}$${Math.abs(v * 365).toFixed(0)}B`;
      else if (k === "budget") val = `${v > 0 ? "+" : "−"}$${Math.abs(v)}B`;
      else if (k === "convert") val = `${(v * 100).toFixed(0)}%`;
      else if (k === "infraCap" || k === "wardrobeCap") val = `${v > 0 ? "+" : ""}${v} lb`;
      else val = `${v > 0 ? "+" : ""}${v}`;
      return `<span class="chip ${good ? "good" : "bad"}">${ico} ${name} ${val}</span>`;
    })
    .join("");
}


export function bar(label, value, max, color, note = "") {
  const w = Math.max(0, Math.min(100, (value / max) * 100));
  return `<div class="bar-row"><div class="bar-lbl"><span>${label}</span><b>${note || Math.round(value)}</b></div><div class="bar"><s style="width:${w}%;background:${color}"></s></div></div>`;
}

export const ATT_COLORS = ["#8a9a5b", "#b8a6c9", "#f2a7c3", "#ec5f99", "#c9184a"];
export const ATT_NAMES = ["Opposed", "Reluctant", "Curious", "Eager", "Devoted"];

export function attBadge(i) {
  return `<span class="att-badge" style="--c:${ATT_COLORS[i]}">${ATT_NAMES[i]}</span>`;
}
