/* ============================================================
   DOM REFERENCES
   Queried once, shared everywhere. Import only what you need.
   ============================================================ */
export const bootEl = document.getElementById("boot");
export const appEl = document.getElementById("app");
export const bgEl = document.getElementById("bg");

export const clockTimeD = document.getElementById("clock-time-d");
export const clockDateD = document.getElementById("clock-date-d");
export const clockTimeM = document.getElementById("clock-time-m");
export const clockDateM = document.getElementById("clock-date-m");

export const welcomeEyebrowD = document.getElementById("welcome-eyebrow");
export const welcomeLineD = document.getElementById("welcome-line");
export const welcomeEyebrowM = document.getElementById("welcome-eyebrow-m");
export const welcomeLineM = document.getElementById("welcome-line-m");

export const widgetStackD = document.getElementById("widget-stack-d");
export const widgetStackM = document.getElementById("widget-stack-m");

export const pulseMountD = document.getElementById("pulse-mount-d");
export const pulseMountM = document.getElementById("pulse-mount-m");

export const appGrid = document.getElementById("app-grid");
export const drawerCount = document.getElementById("drawer-count");
export const appSearch = document.getElementById("app-search");
export const categoryTabs = document.getElementById("category-tabs");
export const sortField = document.getElementById("sort-field");
export const sortBtn = document.getElementById("sort-btn");
export const sortMenu = document.getElementById("sort-menu");
export const sortLabel = document.getElementById("sort-label");

export const drawerEl = document.getElementById("drawer");
export const drawerOpenerBtn = document.getElementById("drawer-opener");
export const drawerScrim = document.getElementById("drawer-scrim");
export const drawerGridScroll = document.getElementById("drawer-grid-scroll");
export const drawerBackBtn = document.getElementById("drawer-back");

export const detailEl = document.getElementById("detail");
export const detailIcon = document.getElementById("detail-icon");
export const detailName = document.getElementById("detail-name");
export const detailKind = document.getElementById("detail-kind");
export const detailDesc = document.getElementById("detail-desc");
export const detailOpenBtn = document.getElementById("detail-open-btn");
export const detailBtnLabel = document.getElementById("detail-btn-label");
export const detailCloseBtn = document.getElementById("detail-close");
export const detailScrim = document.getElementById("detail-scrim");

export const settingsPanel = document.getElementById("settings-panel");
export const settingsScrim = document.getElementById("settings-scrim");
export const settingsOpenerBtn = document.getElementById("settings-opener");
export const settingsCloseBtn = document.getElementById("settings-close");
export const themeRow = document.getElementById("theme-row");
export const brightnessSlider = document.getElementById("brightness-slider");
export const brightnessFill = document.getElementById("brightness-fill");
export const brightnessOverlay = document.getElementById("brightness-overlay");
export const wallpaperGrid = document.getElementById("wallpaper-grid");

export const mobileTrack = document.getElementById("mobile-track");
export const panelWelcome = document.getElementById("panel-welcome");
export const panelClock = document.getElementById("panel-clock");
export const panelWidgets = document.getElementById("panel-widgets");
export const pagerEl = document.getElementById("pager");
export const pagerDots = Array.from(document.querySelectorAll(".pager-dot"));

export const stageEl = document.getElementById("stage");