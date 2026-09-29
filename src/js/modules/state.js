/* ============================================================
   APP STATE
   A single mutable object shared across modules via import.
   No module reaches into another module's local variables —
   everything goes through here or through DOM refs (dom.js).
   ============================================================ */
export const state = {
  // drawer
  sort: "name",       // name | recent | category  (recent unused currently, kept for parity)
  category: "All",
  query: "",
  drawerOpen: false,

  // detail sheet
  detailOpen: false,

  // mobile panel track
  mobilePanel: "clock", // welcome | clock | widgets

  // settings
  theme: "system",      // dark | light | system
  brightness: 100,
  wallpaperId: null,     // null = not yet chosen -> randomize on first load
  settingsOpen: false
};

const PREFS_KEY = "frankgalaxy.prefs";
const SETTINGS_KEY = "frankgalaxy.settings";

export function loadPrefs(){
  try{
    const raw = localStorage.getItem(PREFS_KEY);
    if(raw){
      const p = JSON.parse(raw);
      if(p && typeof p === "object"){
        if(p.sort) state.sort = p.sort;
        if(p.category) state.category = p.category;
      }
    }
  }catch(e){ /* storage unavailable — defaults hold */ }
}

export function savePrefs(){
  try{
    localStorage.setItem(PREFS_KEY, JSON.stringify({ sort: state.sort, category: state.category }));
  }catch(e){ /* ignore */ }
}

export function loadSettings(){
  try{
    const raw = localStorage.getItem(SETTINGS_KEY);
    if(raw){
      const s = JSON.parse(raw);
      if(s.theme) state.theme = s.theme;
      if(typeof s.brightness === "number") state.brightness = s.brightness;
      if(s.wallpaperId) state.wallpaperId = s.wallpaperId;
    }
  }catch(e){ /* defaults hold */ }
}

export function saveSettings(){
  try{
    localStorage.setItem(SETTINGS_KEY, JSON.stringify({
      theme: state.theme, brightness: state.brightness, wallpaperId: state.wallpaperId
    }));
  }catch(e){ /* ignore */ }
}