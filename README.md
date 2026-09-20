# Curves in the Oval

A browser-based presidential simulator inspired by [Fantasy President Career](https://fantasypresidentcareer.com/), rebuilt for **GitHub Pages** with a total thematic overhaul:

- **Women-only polling** — 24 female voter personas with political lean (liberal / moderate / conservative) and weight attitude (pro-gain, neutral, opposed).
- **Visible body stats** — each poll card shows **weight**, **BMI**, and category; dialogue escalates as voters grow (chairs, floors, building codes, elevators).
- **National weight dashboard** — average women's BMI, obesity tiers, furniture stress index, plus-size retail index, infrastructure incidents.
- **Policy sandbox** — presets plus free-text policies (keyword matching) aimed at accelerating weight gain among women.

## Play locally

Static site — no build step:

```bash
python3 -m http.server 8080
```

Open `http://localhost:8080`.

## GitHub Pages

1. **Settings → Pages → Build and deployment**
2. Source: **Deploy from a branch**
3. Branch: **`gh-pages`** / **`/(root)`**
4. Save. After the next push to `main`, the workflow publishes the site to `gh-pages`.

Live URL: **https://rutilusaduro.github.io/PresidentialSim/**

The `index.html` base-url script fixes CSS/JS paths on project Pages URLs.

## Disclaimer

Fictional satire for adults (18+). Not affiliated with any real government, candidate, or the original Fantasy President Career product.
