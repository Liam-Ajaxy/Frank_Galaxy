import { APPS, CATEGORIES } from "../data/apps.js";
import { state, savePrefs } from "./state.js";
import {
  appGrid, drawerCount, appSearch, categoryTabs,
  sortField, sortBtn, sortMenu, sortLabel,
  drawerEl, drawerOpenerBtn, drawerScrim, drawerGridScroll, drawerBackBtn
} from "./dom.js";
import { iconInnerHTML, iconStyleAttr, iconClasses } from "./icons.js";

const SORTS = [
  { id: "name", label: "Name" },
  { id: "category", label: "Category" },
  { id: "status", label: "Live first" }
];

function escapeHtml(str){
  const d = document.createElement("div");
  d.textContent = str;
  return d.innerHTML;
}

function renderCategoryTabs(){
  categoryTabs.innerHTML = CATEGORIES.map(cat => `
    <button class="cat-tab ${state.category === cat ? "active" : ""}" data-cat="${cat}">${cat}</button>
  `).join("");
}

function renderSortMenu(){
  sortLabel.textContent = SORTS.find(s => s.id === state.sort).label;
  sortMenu.innerHTML = SORTS.map(s => `
    <button class="sort-opt ${state.sort === s.id ? "active" : ""}" data-sort="${s.id}" role="menuitemradio" aria-checked="${state.sort === s.id}">
      <span>${s.label}</span>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
    </button>
  `).join("");
}

function getFilteredApps(){
  let list = APPS.slice();

  if(state.category !== "All"){
    list = list.filter(a => a.category === state.category);
  }

  const q = state.query.trim().toLowerCase();
  if(q){
    list = list.filter(a =>
      a.name.toLowerCase().includes(q) ||
      a.kind.toLowerCase().includes(q) ||
      (a.sub && a.sub.toLowerCase().includes(q)) ||
      a.category.toLowerCase().includes(q)
    );
  }

  if(state.sort === "name"){
    list.sort((a,b) => a.name.localeCompare(b.name) || (a.sub||"").localeCompare(b.sub||""));
  } else if(state.sort === "category"){
    list.sort((a,b) => a.category.localeCompare(b.category) || a.name.localeCompare(b.name));
  } else if(state.sort === "status"){
    list.sort((a,b) => (a.pending === b.pending) ? a.name.localeCompare(b.name) : (a.pending ? 1 : -1));
  }

  return list;
}

function renderAppGrid(){
  const list = getFilteredApps();
  drawerCount.textContent = `${list.length} app${list.length === 1 ? "" : "s"}`;

  if(list.length === 0){
    appGrid.innerHTML = `
      <div class="empty-state">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>
        <span>No apps match "${escapeHtml(state.query)}"</span>
      </div>`;
    return;
  }

  appGrid.innerHTML = list.map(app => `
    <button class="app-icon-btn" data-app-id="${app.id}" aria-label="${app.name}${app.sub ? " " + app.sub : ""}">
      <span class="${iconClasses(app)}" ${iconStyleAttr(app)}>${iconInnerHTML(app)}</span>
      <span class="app-label">${app.name}</span>
      ${app.sub ? `<span class="app-sub">${app.sub}</span>` : ""}
    </button>
  `).join("");
}

export function refreshDrawer(){
  renderCategoryTabs();
  renderSortMenu();
  renderAppGrid();
}

export function openDrawer(){
  if(state.drawerOpen) return;
  state.drawerOpen = true;
  drawerEl.classList.add("open");
  drawerEl.setAttribute("aria-hidden", "false");
  drawerOpenerBtn.classList.add("is-open");
  drawerOpenerBtn.setAttribute("aria-expanded", "true");
  document.body.classList.add("drawer-open");
  refreshDrawer();
  setTimeout(() => appSearch && appSearch.blur(), 0);
}

export function closeDrawer(){
  if(!state.drawerOpen) return;
  state.drawerOpen = false;
  drawerEl.classList.remove("open");
  drawerEl.setAttribute("aria-hidden", "true");
  drawerOpenerBtn.classList.remove("is-open");
  drawerOpenerBtn.setAttribute("aria-expanded", "false");
  document.body.classList.remove("drawer-open");
}

export function toggleDrawer(){
  state.drawerOpen ? closeDrawer() : openDrawer();
}

export function initDrawerEvents(){
  appSearch.addEventListener("input", (e) => {
    state.query = e.target.value;
    renderAppGrid();
  });

  categoryTabs.addEventListener("click", (e) => {
    const btn = e.target.closest(".cat-tab");
    if(!btn) return;
    state.category = btn.dataset.cat;
    savePrefs();
    renderCategoryTabs();
    renderAppGrid();
  });

  sortBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    sortField.classList.toggle("open");
    sortBtn.classList.toggle("open");
    sortBtn.setAttribute("aria-expanded", sortField.classList.contains("open"));
  });

  sortMenu.addEventListener("click", (e) => {
    const btn = e.target.closest(".sort-opt");
    if(!btn) return;
    state.sort = btn.dataset.sort;
    savePrefs();
    sortField.classList.remove("open");
    sortBtn.classList.remove("open");
    renderSortMenu();
    renderAppGrid();
  });

  document.addEventListener("click", (e) => {
    if(!sortField.contains(e.target)){
      sortField.classList.remove("open");
      sortBtn.classList.remove("open");
    }
  });

  drawerOpenerBtn.addEventListener("click", toggleDrawer);
  drawerScrim.addEventListener("click", closeDrawer);
  drawerBackBtn.addEventListener("click", closeDrawer);
}