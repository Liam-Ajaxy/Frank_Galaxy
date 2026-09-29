import { state } from "./state.js";
import { drawerGridScroll, stageEl } from "./dom.js";
import { openDrawer, closeDrawer } from "./drawer.js";
import { openSettings, closeSettings } from "./settings.js";
import { isDetailOpen, closeDetail } from "./detail.js";
import { mobilePanelStep } from "./mobilePanels.js";

const STAGE_THRESHOLD = 46;   // wheel delta to trigger
const SWIPE_THRESHOLD = 58;   // px touch delta to trigger
let wheelLock = false;

function isMobileLayout(){
  return window.matchMedia("(max-width: 860px)").matches;
}

/* ---- shared gesture arbiter: one step closes, the NEXT step opens ---- */
function handleHomeGesture(direction){
  if(direction === "up"){
    if(state.settingsOpen){ closeSettings(); return; }
    if(!state.drawerOpen){ openDrawer(); }
    else if(drawerGridScroll.scrollTop <= 0){ closeDrawer(); }
  } else {
    if(state.drawerOpen && drawerGridScroll.scrollTop <= 0){ closeDrawer(); return; }
    if(!state.settingsOpen){ openSettings(); }
    else { closeSettings(); }
  }
}

/* ---- touch state (module-local, not global) ---- */
let touchStartX = 0, touchStartY = 0, touchActive = false, touchIntent = null;

function onTouchStart(e){
  if(e.touches.length !== 1) return;
  touchStartX = e.touches[0].clientX;
  touchStartY = e.touches[0].clientY;
  touchActive = true;
  touchIntent = null;
}

function onTouchMove(e){
  if(!touchActive) return;
  const dx = e.touches[0].clientX - touchStartX;
  const dy = e.touches[0].clientY - touchStartY;

  if(touchIntent === null && (Math.abs(dx) > 12 || Math.abs(dy) > 12)){
    touchIntent = Math.abs(dx) > Math.abs(dy) ? "h" : "v";
  }
}

function onTouchEnd(e){
  if(!touchActive) return;
  touchActive = false;
  const dx = (e.changedTouches[0].clientX - touchStartX);
  const dy = (e.changedTouches[0].clientY - touchStartY);

  if(isDetailOpen()) return;

  if(touchIntent === "v"){
    if(dy < -SWIPE_THRESHOLD){ handleHomeGesture("up"); }
    else if(dy > SWIPE_THRESHOLD){ handleHomeGesture("down"); }
  } else if(touchIntent === "h" && isMobileLayout() && !state.drawerOpen && !state.settingsOpen){
    if(dx < -SWIPE_THRESHOLD) mobilePanelStep(1);
    else if(dx > SWIPE_THRESHOLD) mobilePanelStep(-1);
  }
  touchIntent = null;
}

export function initGestures(){
  /* ---- wheel (desktop / trackpad) ---- */
  window.addEventListener("wheel", (e) => {
    if(isDetailOpen()) return;
    if(wheelLock) return;

    const scrollingUp = e.deltaY > STAGE_THRESHOLD;
    const scrollingDown = e.deltaY < -STAGE_THRESHOLD;
    if(!scrollingDown && !scrollingUp) return;

    wheelLock = true;
    handleHomeGesture(scrollingUp ? "up" : "down");
    setTimeout(() => wheelLock = false, 650);
  }, { passive: true });

  /* ---- keyboard ---- */
  document.addEventListener("keydown", (e) => {
    if(e.key === "Escape"){
      if(state.detailOpen || isDetailOpen()) closeDetail();
      else if(state.drawerOpen) closeDrawer();
    }
  });

  /* ---- touch: home stage handles vertical (drawer/settings) + horizontal (panels) ---- */
  const settingsPanelEl = document.getElementById("settings-panel");
  const drawerEl = document.getElementById("drawer");

  [stageEl, settingsPanelEl, drawerEl].forEach(el => {
    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchmove", onTouchMove, { passive: true });
    el.addEventListener("touchend", onTouchEnd, { passive: true });
  });
  settingsPanelEl.addEventListener("touchcancel", onTouchEnd, { passive: true });
}