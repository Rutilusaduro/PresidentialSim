// Small shared helpers: randomness, templating, formatting.

export const rnd = () => Math.random();
export const between = (a, b) => a + Math.random() * (b - a);
export const ibetween = (a, b) => Math.floor(between(a, b + 1));
export const chance = (p) => Math.random() < p;
export const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
export const lerp = (a, b, t) => a + (b - a) * t;

export function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

/** Pick n distinct items. */
export function sample(arr, n) {
  const copy = arr.slice();
  const out = [];
  while (copy.length && out.length < n) out.push(copy.splice(Math.floor(Math.random() * copy.length), 1)[0]);
  return out;
}

/** Weighted pick: items carry a numeric `w` (default 1). */
export function wpick(items) {
  const total = items.reduce((a, it) => a + (it.w ?? 1), 0);
  let r = Math.random() * total;
  for (const it of items) {
    r -= it.w ?? 1;
    if (r <= 0) return it;
  }
  return items[items.length - 1];
}

/**
 * Fill {tokens} in a template. Values may be strings, numbers, arrays (a random
 * element is chosen) or functions (called with no args).
 */
export function fill(tpl, ctx = {}) {
  return String(tpl).replace(/\{([\w.]+)\}/g, (m, key) => {
    let v = key.split(".").reduce((o, k) => (o == null ? undefined : o[k]), ctx);
    if (Array.isArray(v)) v = pick(v);
    if (typeof v === "function") v = v();
    return v == null ? m : String(v);
  });
}

export function esc(s) {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export const lb = (n) => `${Math.round(n).toLocaleString()} lb`;
export const lb1 = (n) => `${n.toFixed(1)} lb`;
export const pct = (n) => `${Math.round(n)}%`;
export const money = (n) => `${n < 0 ? "−" : ""}$${Math.abs(n).toFixed(1)}B`;
export const signed = (n, d = 1) => `${n >= 0 ? "+" : "−"}${Math.abs(n).toFixed(d)}`;

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** Day 0 = Inauguration, Jan 20. */
export function dateOf(day) {
  const d = new Date(Date.UTC(2029, 0, 20 + day));
  return `${MONTHS[d.getUTCMonth()]} ${d.getUTCDate()}, ${d.getUTCFullYear()}`;
}

export function shortDate(day) {
  const d = new Date(Date.UTC(2029, 0, 20 + day));
  return `${MONTHS[d.getUTCMonth()]} ${d.getUTCDate()}`;
}

export function uid() {
  return Math.random().toString(36).slice(2, 9);
}

export function $(sel, root = document) {
  return root.querySelector(sel);
}

export function $$(sel, root = document) {
  return Array.from(root.querySelectorAll(sel));
}
