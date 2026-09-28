// End-of-presidency epilogues, chosen by outcome and how big America got.

const DEFEAT = [
  { max: 200, title: "One Term, Barely Softer", body: "The Lean Coalition sweeps you out of office. The country is only a little rounder than you found it, but the bakeries remember your name, and a lot of women quietly kept the elastic-waist habit." },
  { max: 300, title: "Defeated, But Not Forgotten", body: "You lose the election, but the women of America keep the pounds. Your successor tries to bring back the food pyramid. Nobody can find it. Most of them are still ordering dessert first." },
  { max: 99999, title: "Too Big to Undo", body: "You lose the election, but it hardly matters. The women of America are so big, so comfortable, and so fond of it that the new administration's first act is to keep the Bakery Corps. The Lean Coalition's leader was last seen at a buffet." },
];

const LEGACY = [
  { max: 250, title: "The Soft Revolution", body: "Eight years in, America is noticeably plusher. Historians call it a gentle beginning, and your presidential library has a very good café." },
  { max: 400, title: "The Great Softening", body: "You leave office with the average woman comfortably, cheerfully fat. Doorways are wider, chairs are sturdier, and 'have seconds' is practically the national motto." },
  { max: 600, title: "The Age of Abundance", body: "The average American woman is huge, happy, and proud of it. Your face is on a new commemorative pastry. The country moves slower now, and it seems to have learned to enjoy itself." },
  { max: 900, title: "The Enormous Republic", body: "Cities have been rebuilt around the new American woman: archways, conveyors, lounges on every corner. She is vast, content and adored. There's talk of carving you into a mountain, a very soft one." },
  { max: 99999, title: "Colossus", body: "History has no precedent for what you've done. The average woman is a monumental, blissful presence, fed around the clock and too content to hurry anywhere. Your farewell address was delivered at a banquet that lasted a week." },
];

export function endingFor(st) {
  const list = st.over?.kind === "defeat" ? DEFEAT : LEGACY;
  return list.find((e) => st.avg < e.max) || list[list.length - 1];
}
