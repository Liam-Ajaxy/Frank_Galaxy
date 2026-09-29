/* ============================================================
   LIVE PULSE — renders the auto-scrolling stocks + news card
   into the desktop and mobile mount points.
   ============================================================ */
import { PULSE_CONFIG as C } from "../data/feeds.js";
import { pulseMountD, pulseMountM } from "./dom.js";
import { fetchPulse } from "./feeds.js";

const SHELL = `
  <section class="glass glass-lg pulse-card" aria-label="Market and news updates">
    <header class="pulse-head">
      <span class="pulse-title"><span class="pulse-dot" data-pulse-dot></span>Live updates</span>
      <span class="pulse-time" data-pulse-time>Loading…</span>
    </header>
    <div class="pulse-viewport">
      <ul class="pulse-track" data-pulse-track></ul>
    </div>
  </section>`;

let views = [];
let timer = null;
let busy = false;
let lastOk = 0;

/* ---------- helpers ---------- */
const esc = s => String(s).replace(/[&<>"']/g, c =>
  ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

const fmtTime = t => new Date(t).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

function fmtPrice(v, currency){
  try{
    return new Intl.NumberFormat("en-US", currency
      ? { style: "currency", currency }
      : { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(v);
  }catch(e){ return String(v); }
}

function fmtChange(ch){
  if(typeof ch !== "number" || !isFinite(ch)) return { cls: "flat", text: "—" };
  const cls = ch > 0.005 ? "up" : ch < -0.005 ? "down" : "flat";
  const arrow = cls === "up" ? "▲" : cls === "down" ? "▼" : "•";
  return { cls, text: `${arrow} ${Math.abs(ch).toFixed(2)}%` };
}

/* ---------- markup ---------- */
function itemHTML(item, dupe){
  const li = `class="pulse-item${dupe ? " pulse-dupe" : ""}"${dupe ? ' aria-hidden="true"' : ""}`;
  const a = `class="pulse-link" href="${esc(item.url)}" target="_blank" rel="noopener noreferrer"${dupe ? ' tabindex="-1"' : ""}`;

  if(item.type === "quote"){
    const ch = fmtChange(item.change);
    return `<li ${li}><a ${a}>
      <span class="pulse-quote">
        <span class="pulse-sym">${esc(item.label)}</span>
        <span class="pulse-price">${esc(fmtPrice(item.price, item.currency))}</span>
        <span class="pulse-chg ${ch.cls}">${ch.text}</span>
      </span></a></li>`;
  }
  return `<li ${li}><a ${a}>
    <span class="pulse-src">${esc(item.source)}</span>
    <span class="pulse-headline">${esc(item.title)}</span>
  </a></li>`;
}

/* ---------- view updates ---------- */
function setStatus(state, label){
  views.forEach(v => {
    v.dot.className = `pulse-dot is-${state}`;
    v.time.textContent = label;
  });
}

function render(items){
  // list is rendered twice; the second copy makes the -50% loop seamless
  const html = items.map(i => itemHTML(i, false)).join("") + items.map(i => itemHTML(i, true)).join("");
  const dur = `${Math.max(40, items.length * 5)}s`;
  views.forEach(v => {
    v.track.classList.remove("is-empty");
    v.track.style.setProperty("--pulse-dur", dur);
    v.track.innerHTML = html;
  });
}

function renderEmpty(msg){
  views.forEach(v => {
    v.track.classList.add("is-empty");
    v.track.innerHTML = `<li class="pulse-empty">${esc(msg)}</li>`;
  });
}

/* ---------- cache ---------- */
function readCache(){
  try{
    const c = JSON.parse(localStorage.getItem(C.cacheKey));
    if(c && Array.isArray(c.items) && c.items.length && Date.now() - c.t < C.cacheMaxAgeMs) return c;
  }catch(e){ /* ignore */ }
  return null;
}
function writeCache(items){
  try{ localStorage.setItem(C.cacheKey, JSON.stringify({ t: Date.now(), items })); }catch(e){ /* ignore */ }
}

/* ---------- refresh loop ---------- */
async function refresh(){
  if(busy) return;
  busy = true;
  clearTimeout(timer);
  let next = C.refreshMs;
  try{
    const items = await fetchPulse();
    lastOk = Date.now();
    render(items);
    writeCache(items);
    setStatus("live", `Updated ${fmtTime(lastOk)}`);
  }catch(e){
    next = C.retryMs;
    if(lastOk || views[0].track.querySelector(".pulse-item")){
      setStatus("stale", "Offline · showing last data");
    } else {
      renderEmpty("Feeds unavailable — retrying soon.");
      setStatus("stale", "Offline");
    }
  }
  busy = false;
  timer = setTimeout(refresh, next);
}

export function initPulse(){
  views = [pulseMountD, pulseMountM].map(mount => {
    mount.innerHTML = SHELL;
    return {
      track: mount.querySelector("[data-pulse-track]"),
      dot: mount.querySelector("[data-pulse-dot]"),
      time: mount.querySelector("[data-pulse-time]")
    };
  });

  const cached = readCache();
  if(cached){
    render(cached.items);
    setStatus("stale", `Cached ${fmtTime(cached.t)}`);
  } else {
    renderEmpty("Loading updates…");
  }

  refresh();
  document.addEventListener("visibilitychange", () => {
    if(!document.hidden && Date.now() - lastOk > C.refreshMs) refresh();
  });
}