import { APPS } from "../data/apps.js";
import {
  detailEl, detailIcon, detailName, detailKind, detailDesc,
  detailOpenBtn, detailBtnLabel, detailCloseBtn, detailScrim
} from "./dom.js";
import { iconInnerHTML, iconStyleValue, iconClasses } from "./icons.js";

export function openDetail(appId){
  const app = APPS.find(a => a.id === appId);
  if(!app) return;

  detailIcon.className = iconClasses(app);
  detailIcon.setAttribute("style", iconStyleValue(app));
  detailIcon.innerHTML = iconInnerHTML(app);
  detailName.textContent = app.name + (app.sub ? ` ${app.sub}` : "");
  detailKind.textContent = app.kind;

  const existingNote = detailDesc.parentElement.querySelector(".pending-note");
  if(existingNote) existingNote.remove();

  detailDesc.textContent = app.desc;

  if(app.pending){
    const note = document.createElement("p");
    note.className = "pending-note";
    note.textContent = "Link not added yet";
    detailDesc.insertAdjacentElement("afterend", note);
    detailOpenBtn.setAttribute("disabled", "disabled");
    detailOpenBtn.removeAttribute("href");
    detailOpenBtn.style.pointerEvents = "none";
    detailBtnLabel.textContent = "Coming soon";
  } else {
    detailOpenBtn.removeAttribute("disabled");
    detailOpenBtn.href = app.url;
    detailOpenBtn.style.pointerEvents = "";
    detailBtnLabel.textContent = app.kind === "Phone" ? "Call" : app.kind === "Direct chat" ? "Message" : "Open";
  }

  detailEl.classList.add("open");
  detailEl.setAttribute("aria-hidden", "false");
  document.body.classList.add("detail-open");
}

export function closeDetail(){
  detailEl.classList.remove("open");
  detailEl.setAttribute("aria-hidden", "true");
  document.body.classList.remove("detail-open");
}

export function isDetailOpen(){
  return detailEl.classList.contains("open");
}

export function initDetailEvents(){
  detailCloseBtn.addEventListener("click", closeDetail);
  detailScrim.addEventListener("click", closeDetail);

  document.addEventListener("click", (e) => {
    const trigger = e.target.closest("[data-app-id]");
    if(!trigger) return;
    openDetail(trigger.dataset.appId);
  });
}