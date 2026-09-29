import { DEFAULT_BACKGROUND_DATA_URL } from "../../assets/background.js";

export const WALLPAPERS = [
  { id: "default", name: "Frank Galaxy", url: null },
  { id: "milkyway-1", name: "Stars Space Galaxy", url: "https://wallpaperbat.com/img/66623243-stars-space-galaxy-4k-ultra-hd-wallpaper.jpg" },
  { id: "milkyway-2", name: "Space Nebula Planet", url: "https://images.hdqwalls.com/download/space-nebula-planet-4k-yl-2560x1440.jpg" },
  { id: "milkyway-3", name: "Universe Cosmic Concept", url: "https://www.pixsavor.com/uploads/large/universe/universe-cosmic-concept.jpg" },
  { id: "milkyway-4", name: "Celestial Symphony", url: "https://images.wallpapersden.com/image/download/celestial-symphony-digital-illustration_bmZmamiUmZqaraWkpJRobWllrWdma2U.jpg" },
  { id: "milkyway-5", name: "Nebula", url: "https://cdn.sanity.io/images/0vv8moc6/spectroscopy/6d6cb6b281399490e4de9e3ea0ae48ab4e2afd95-3840x2160.jpg/AdobeStock_1255129498.jpeg?w=3840&max-h=2160&fit=crop&auto=format" },
  { id: "milkyway-6", name: "Sunrise over Earth", url: "https://likeapic.com/files/1622/sunrise-over-earth-atmosphere_5120x2160.jpg" },
  { id: "milkyway-7", name: "Galactic Center", url: "https://likeapic.com/files/1134/powerful-radiation-from-galactic-center_5120x2160.jpg" },
  { id: "milkyway-8", name: "Pink Cosmic Dust", url: "https://likeapic.com/files/5293/distant-planet-with-glowing-pink-galaxy-dust_5120x2160.jpg" }
];

export function effectiveWallpaperUrl(entry){
  return entry.url || DEFAULT_BACKGROUND_DATA_URL;
}