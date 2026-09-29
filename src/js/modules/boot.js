import { DEFAULT_BACKGROUND_DATA_URL } from "../../assets/background.js";
import { bootEl, appEl, bgEl } from "./dom.js";

function revealApp(onReady){
  bgEl.style.setProperty("--bg-image", `url("${DEFAULT_BACKGROUND_DATA_URL}")`);
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      bootEl.classList.add("hidden");
      appEl.classList.add("ready");
      onReady();
    });
  });
}

export function preloadBackground(onReady){
  const img = new Image();
  img.decoding = "sync";
  const finish = () => revealApp(onReady);

  if("decode" in img){
    img.src = DEFAULT_BACKGROUND_DATA_URL;
    img.decode().then(finish).catch(finish);
  } else {
    img.onload = finish;
    img.onerror = finish;
    img.src = DEFAULT_BACKGROUND_DATA_URL;
  }
}