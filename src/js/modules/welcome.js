import { welcomeEyebrowD, welcomeLineD, welcomeEyebrowM, welcomeLineM } from "./dom.js";

/* ============================================================
   TIME MOODS
   `until` is exclusive (hour < until). Slots are checked in order.
   Add lines freely — one is picked per day+hour, so it stays
   stable between refreshes but varies across days.
   ============================================================ */
const MOODS = [
  { until: 5,  eyebrow: "Late orbit",     lines: [
    "Still up? The galaxy keeps watch.",
    "Quiet hours - the best time to build."
  ]},
  { until: 9,  eyebrow: "Early light",    lines: [
    "A fresh orbit begins.",
    "Easy start - welcome to Frank's galaxy."
  ]},
  { until: 12, eyebrow: "Good morning",   lines: [
    "Welcome to Frank's galaxy.",
    "Let's make today's orbit count."
  ]},
  { until: 14, eyebrow: "Midday",         lines: [
    "High sun over Frank's galaxy.",
    "Halfway through - keep the momentum."
  ]},
  { until: 17, eyebrow: "Good afternoon", lines: [
    "Welcome back to Frank's galaxy.",
    "Steady orbit - keep going."
  ]},
  { until: 20, eyebrow: "Good evening",   lines: [
    "Golden hour in the galaxy.",
    "Winding down? Take a look around."
  ]},
  { until: 24, eyebrow: "Night sky",      lines: [
    "The stars are out - welcome.",
    "Exploring tonight - welcome."
  ]}
];

function pickMood(now){
  const h = now.getHours();
  const mood = MOODS.find(m => h < m.until) || MOODS[MOODS.length - 1];
  const dayOfYear = Math.floor((now - new Date(now.getFullYear(), 0, 0)) / 86400000);
  const line = mood.lines[(dayOfYear + h) % mood.lines.length];
  return { eyebrow: mood.eyebrow, line };
}

export function renderWelcome(){
  const { eyebrow, line } = pickMood(new Date());

  welcomeEyebrowD.textContent = eyebrow;
  welcomeLineD.textContent = line;
  welcomeEyebrowM.textContent = eyebrow;
  welcomeLineM.textContent = line;
}