/* ============================================================
   ICON RENDERING
   Shared by widgets, drawer grid, and the detail sheet. Real
   marks render via <symbol> or <img>; anything without a real
   icon yet shows the explicit placeholder glyph.
   ============================================================ */
export function iconInnerHTML(app){
  if(app.iconType === "img" && app.icon){
    return `<img src="${app.icon}" alt="" loading="eager">`;
  }
  const symbolId = app.pending && !app.icon ? "icon-placeholder" : app.icon;
  return `<svg viewBox="0 0 24 24" aria-hidden="true"><use href="#${symbolId}"></use></svg>`;
}

export function iconStyleAttr(app){
  return `style="--icon-bg:${app.iconBg || "rgba(255,255,255,0.06)"}"`;
}

export function iconStyleValue(app){
  return `--icon-bg:${app.iconBg || "rgba(255,255,255,0.06)"}`;
}

export function iconClasses(app){
  return app.pending ? "app-icon placeholder" : "app-icon";
}