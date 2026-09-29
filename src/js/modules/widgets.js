import { APPS } from "../data/apps.js";
import { widgetStackD, widgetStackM } from "./dom.js";
import { iconInnerHTML, iconStyleAttr } from "./icons.js";

function widgetOrder(){
  const live = APPS.filter(a => !a.pending);
  const rest = APPS.filter(a => a.pending);
  return [...live, ...rest].slice(0, 4);
}

function renderWidgetCard(app){
  return `
    <button class="widget-card glass glass-md" data-app-id="${app.id}" aria-label="Open ${app.name}">
      <span class="widget-icon" ${iconStyleAttr(app)}>${iconInnerHTML(app)}</span>
      <span class="widget-text">
        <span class="widget-name">${app.name}</span>
        <span class="widget-kind">${app.pending ? "Coming soon" : app.kind}</span>
      </span>
    </button>
  `;
}

export function renderWidgets(){
  const html = widgetOrder().map(renderWidgetCard).join("");
  widgetStackD.innerHTML = html;
  widgetStackM.innerHTML = html;
}