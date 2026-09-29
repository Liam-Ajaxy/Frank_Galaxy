import { WALLPAPERS, effectiveWallpaperUrl } from "../data/wallpapers.js";
import { DEFAULT_BACKGROUND_DATA_URL } from "../../assets/background.js";
import { state, saveSettings } from "./state.js";
import {
  bgEl, settingsPanel, settingsScrim, settingsOpenerBtn, settingsCloseBtn,
  themeRow, brightnessSlider, brightnessFill, brightnessOverlay, wallpaperGrid
} from "./dom.js";

const systemDarkQuery = window.matchMedia("(prefers-color-scheme: dark)");

export function openSettings(){
  state.settingsOpen = true;
  settingsPanel.classList.add("open");
  settingsPanel.setAttribute("aria-hidden", "false");
  settingsScrim.classList.add("open");
  settingsOpenerBtn.classList.add("is-open");
  settingsOpenerBtn.setAttribute("aria-expanded", "true");
}

export function closeSettings(){
  state.settingsOpen = false;
  settingsPanel.classList.remove("open");
  settingsPanel.setAttribute("aria-hidden", "true");
  settingsScrim.classList.remove("open");
  settingsOpenerBtn.classList.remove("is-open");
  settingsOpenerBtn.setAttribute("aria-expanded", "false");
}

function effectiveGlassMode(){
  if(state.theme === "system") return systemDarkQuery.matches ? "dark" : "light";
  return state.theme;
}

function applyTheme(){
  document.querySelectorAll(".theme-opt").forEach(el => {
    el.classList.toggle("active", el.dataset.theme === state.theme);
  });
  const mode = effectiveGlassMode();
  if(mode === "light"){
    document.documentElement.setAttribute("data-glass", "light");
  } else {
    document.documentElement.removeAttribute("data-glass");
  }
}

function applyBrightness(){
  const pct = state.brightness;
  brightnessSlider.value = pct;

  const fillPct = ((pct - 35) / (100 - 35)) * 100;
  brightnessFill.style.width = fillPct + "%";

  const dim = (100 - pct) / 100 * 0.72;
  brightnessOverlay.style.opacity = dim.toFixed(3);
}

function pickRandomWallpaperId(){
  const usable = WALLPAPERS.filter(w => w.id === "default" || w.url);
  const pick = usable[Math.floor(Math.random() * usable.length)];
  return pick ? pick.id : "default";
}

function setWallpaper(id, persist){
  const entry = WALLPAPERS.find(w => w.id === id) || WALLPAPERS[0];
  const url = effectiveWallpaperUrl(entry);
  const testImg = new Image();
  testImg.onload = () => {
    bgEl.style.setProperty("--bg-image", `url("${url}")`);
  };
  testImg.onerror = () => {
    bgEl.style.setProperty("--bg-image", `url("${DEFAULT_BACKGROUND_DATA_URL}")`);
  };
  testImg.src = url;

  state.wallpaperId = id;
  if(persist) saveSettings();
  renderWallpaperGrid();
}

function renderWallpaperGrid(){
  const usable = WALLPAPERS.filter(w => w.id === "default" || w.url);
  wallpaperGrid.innerHTML = usable.map(w => `
    <button class="wallpaper-opt ${state.wallpaperId === w.id ? "active" : ""}" data-wallpaper-id="${w.id}"
      style="background-image:url('${effectiveWallpaperUrl(w)}')" aria-label="Use ${w.name} wallpaper">
      <span class="wallpaper-check"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg></span>
      <span class="wallpaper-name">${w.name}</span>
    </button>
  `).join("");
}

export function initSettingsEvents(){
  settingsOpenerBtn.addEventListener("click", () => state.settingsOpen ? closeSettings() : openSettings());
  settingsScrim.addEventListener("click", closeSettings);
  settingsCloseBtn.addEventListener("click", closeSettings);

  themeRow.addEventListener("click", (e) => {
    const btn = e.target.closest(".theme-opt");
    if(!btn) return;
    state.theme = btn.dataset.theme;
    applyTheme();
    saveSettings();
  });
  systemDarkQuery.addEventListener("change", () => {
    if(state.theme === "system") applyTheme();
  });

  brightnessSlider.addEventListener("input", (e) => {
    state.brightness = Number(e.target.value);
    applyBrightness();
  });
  brightnessSlider.addEventListener("change", saveSettings);

  wallpaperGrid.addEventListener("click", (e) => {
    const btn = e.target.closest(".wallpaper-opt");
    if(!btn) return;
    setWallpaper(btn.dataset.wallpaperId, true);
  });
}

export function initSettingsUI(){
  applyTheme();
  applyBrightness();
  renderWallpaperGrid();
  setWallpaper(state.wallpaperId || pickRandomWallpaperId(), false);
}