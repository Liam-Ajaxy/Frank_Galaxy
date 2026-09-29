export const state = {
  sort: "name",
  category: "All",
  query: "",
  drawerOpen: false,

  detailOpen: false,

  mobilePanel: "clock",

  theme: "system",
  brightness: 100,
  wallpaperId: null,
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
  }catch(e){  }
}

export function savePrefs(){
  try{
    localStorage.setItem(PREFS_KEY, JSON.stringify({ sort: state.sort, category: state.category }));
  }catch(e){  }
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
  }catch(e){  }
}

export function saveSettings(){
  try{
    localStorage.setItem(SETTINGS_KEY, JSON.stringify({
      theme: state.theme, brightness: state.brightness, wallpaperId: state.wallpaperId
    }));
  }catch(e){  }
}