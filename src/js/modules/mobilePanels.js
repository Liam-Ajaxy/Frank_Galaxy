import { state } from "./state.js";
import { mobileTrack, panelWelcome, panelClock, panelWidgets, pagerEl, pagerDots } from "./dom.js";

export const PANEL_ORDER = ["welcome", "clock", "widgets"];

function syncPager(){
  pagerDots.forEach(dot => {
    const on = dot.dataset.panel === state.mobilePanel;
    dot.classList.toggle("active", on);
    dot.setAttribute("aria-selected", String(on));
  });
}

export function layoutMobilePanels(instant){
  const idx = PANEL_ORDER.indexOf(state.mobilePanel);
  const w = mobileTrack.clientWidth;
  [panelWelcome, panelClock, panelWidgets].forEach((el, i) => {
    const offset = (i - idx) * w;
    if(instant) el.style.transition = "none";
    el.style.transform = `translateX(${offset}px)`;
    el.style.opacity = i === idx ? "1" : "0.001";
    if(instant) requestAnimationFrame(() => { el.style.transition = ""; });
  });
  syncPager();
}

export function mobilePanelGo(name){
  if(!PANEL_ORDER.includes(name) || name === state.mobilePanel) return;
  state.mobilePanel = name;
  layoutMobilePanels(false);
}

export function mobilePanelStep(dir){
  const idx = PANEL_ORDER.indexOf(state.mobilePanel);
  const next = Math.min(PANEL_ORDER.length - 1, Math.max(0, idx + dir));
  mobilePanelGo(PANEL_ORDER[next]);
}

export function initMobilePanelEvents(){
  window.addEventListener("resize", () => layoutMobilePanels(true));
  pagerEl.addEventListener("click", (e) => {
    const dot = e.target.closest(".pager-dot");
    if(dot) mobilePanelGo(dot.dataset.panel);
  });
}