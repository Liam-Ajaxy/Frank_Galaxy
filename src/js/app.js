import { loadPrefs, loadSettings } from "./modules/state.js";
import { tickClock } from "./modules/clock.js";
import { renderWelcome } from "./modules/welcome.js";
import { renderWidgets } from "./modules/widgets.js";
import { initPulse } from "./modules/pulse.js";
import { refreshDrawer, initDrawerEvents } from "./modules/drawer.js";
import { initDetailEvents } from "./modules/detail.js";
import { initSettingsEvents, initSettingsUI } from "./modules/settings.js";
import { initGestures } from "./modules/gestures.js";
import { layoutMobilePanels, initMobilePanelEvents } from "./modules/mobilePanels.js";
import { preloadBackground } from "./modules/boot.js";

function initApp(){
  loadPrefs();
  loadSettings();

  initSettingsUI();
  initSettingsEvents();
  initDrawerEvents();
  initDetailEvents();
  initGestures();
  initMobilePanelEvents();

  tickClock();
  renderWelcome();
  renderWidgets();
  initPulse();
  refreshDrawer();
  layoutMobilePanels(true);

  setInterval(renderWelcome, 5 * 60 * 1000);
}

preloadBackground(initApp);