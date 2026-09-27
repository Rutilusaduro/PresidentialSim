# Curves in the Oval

A real-time presidential simulator for GitHub Pages. You're the President, and your one great project is a softer, rounder, happier America: pull every lever of government to fatten up the nation's women and convince them that they *want* it. Then turn on the TV and watch it happen live.

Fictional satire for adults (18+). Every character is a fictional adult.

## How it plays

The clock runs in real time (pause or play at 1×, 2×, 4× or 11× with the HUD buttons, `Space`, or keys `1`–`4`). One tick is one day. You have a four-year term, midterms, a re-election fight, and a second term, followed by an endless sandbox.

### The simulation

America's women are modelled as five attitude cohorts: **Opposed → Reluctant → Curious → Eager → Devoted**. Each cohort has its own share of the population and its own average weight. Eager and devoted women gain much faster, so winning hearts matters as much as filling plates.

Factors that drive everything:

| Factor | What it does |
|---|---|
| 🍰 **Abundance** | How rich, cheap and plentiful food is. Big gain multiplier. |
| 🛋️ **Leisure** | How little anyone has to move. Big gain multiplier. |
| 📣 **Culture** | Media and social pressure. Drives persuasion. |
| 🥗 **Lean Coalition** | The diet-lobby opposition. Drags on gain and persuasion, and runs counter-campaigns. |
| 💗 **Desire** | How much women *want* to gain. Drives approval and gain. |
| 🚪 **Accommodation** / 👗 **Wardrobe** | Capacity (in lb) of chairs, doors, seats and clothing. When women outgrow them you get incidents, strain, slower growth and approval hits. |
| ⚗️ **Science** | Research multipliers, up to a frankly magical growth serum. |
| 👍 Approval · 💵 Budget · 🎖️ Political Capital · 🏛️ Congress | The politics that pay for all of it. |

### Your tools

- **21 Executive Orders**: Dessert First Directive, Retire Public Scales, Recliner Rebate, Lounge-Cart Permits…
- **14 Bills** that Congress votes on (lobby them from the Oval Office): the Abundant America Act, the Great Couch Initiative, the Wide Nation Infrastructure Act, the 28th Amendment…
- **12 Propaganda campaigns**, some aimed at specific attitudes: Delilah Honey's "Second Helping" album, "Wider Than Life", "Just One Bite" outreach…
- **12 Research projects** in a tech tree, ending in Project Bloom.
- **Department budget sliders** for five agencies.
- **Addresses to the Nation**, **rallies** in any state (or DC), and **@POTUS posts**.

### Check-ins

1. 📺 **Television**: seven live channels (GNN news reading your real news wire, the Butter Channel cooking show, the *Wider Than Life* reality show, Runway XL, women's softball, Congress Cam and Doppler Dessert Weather), plus commercials and a live ticker. Every host's body is tied to the live numbers and grows as you watch.
2. 🗣️ **Town Hall**: meet random American women, hear how their lives and waistlines are changing, and try six approaches to win them over.
3. 👔 **Cabinet**: nine fictional cabinet members who eat at the White House mess and grow faster than the country. Chat, share lunch, convene meetings, and watch them get too big for chairs, doorways, motorcades and podiums.
4. 📱 **Chirper**: a live social feed of women reacting in real time, with trending hashtags.
5. 🗺️ **Map**: a live tile map of every state's average woman, with local specialties and rallies.
6. 🎤 **Press Room**: field questions from the press corps while your Press Secretary slowly outgrows the podium.
7. 📊 **Situation Room**: charts of weight against capacity, desire and approval, attitude over time, and the national size distribution.

There are also 24 random events with choices, 11 national milestones with GNN special reports, 24 achievements, and multiple endings.

## Play locally

Static site with no build step. ES modules need a server:

```bash
python3 -m http.server 8080
```

Then open `http://localhost:8080`.

## GitHub Pages

Pushing to `main` runs `.github/workflows/pages.yml`, which publishes the site to the `gh-pages` branch. In **Settings → Pages**, set the source to **Deploy from a branch → `gh-pages` / root**.

Live URL: **https://rutilusaduro.github.io/PresidentialSim/**

## Code map

```
index.html          page shell
css/main.css        all styles
js/main.js          boot, game loop, HUD, modals, save/load (localStorage)
js/sim.js           the simulation: cohorts, factors, persuasion, elections, events
js/util.js          helpers
js/data/            content: actions, cabinet, voters, tv, events, social, states, stages
js/ui/body.js       parametric SVG body renderer (every figure in the game)
js/ui/*.js          one module per screen
```
