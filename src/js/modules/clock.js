import { clockTimeD, clockDateD, clockTimeM, clockDateM } from "./dom.js";

function pad(n){ return n < 10 ? "0" + n : "" + n; }

function renderClock(){
  const now = new Date();
  let h = now.getHours();
  const m = pad(now.getMinutes());
  const meridiem = h >= 12 ? "PM" : "AM";
  h = h % 12; if(h === 0) h = 12;

  const timeHtml = `${h}<span class="colon">:</span>${m}<span class="clock-meridiem">${meridiem}</span>`;
  clockTimeD.innerHTML = timeHtml;
  clockTimeM.innerHTML = timeHtml;

  const dateStr = now.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });
  clockDateD.textContent = dateStr;
  clockDateM.textContent = dateStr;
}

export function tickClock(){
  renderClock();
  const now = new Date();
  const msToNextMinute = (60 - now.getSeconds()) * 1000 - now.getMilliseconds();
  setTimeout(tickClock, Math.max(250, msToNextMinute));
}

export { renderClock };