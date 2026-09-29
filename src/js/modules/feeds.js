import { PULSE_CONFIG as C, STOCKS, CRYPTO, ENDPOINTS as E } from "../data/feeds.js";

async function getJSON(url){
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), C.timeoutMs);
  try{
    const res = await fetch(url, { signal: ctrl.signal });
    if(!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } finally { clearTimeout(t); }
}

async function getViaProxy(url){
  let lastErr = new Error("no proxy configured");
  for(const wrap of E.proxies){
    try{ return await getJSON(wrap(url)); }catch(e){ lastErr = e; }
  }
  throw lastErr;
}

const safeUrl = u => (typeof u === "string" && /^https?:\/\//i.test(u)) ? u : null;
const values = results => results.filter(r => r.status === "fulfilled").flatMap(r => r.value);

async function fetchStock({ symbol, label, index }){
  const data = await getViaProxy(E.yahooChart(symbol));
  const m = data?.chart?.result?.[0]?.meta;
  if(!m || typeof m.regularMarketPrice !== "number") throw new Error("no quote");
  const prev = m.chartPreviousClose ?? m.previousClose;
  return [{
    type: "quote",
    id: symbol,
    label,
    price: m.regularMarketPrice,
    currency: index ? null : (m.currency || "USD"),
    change: prev ? ((m.regularMarketPrice - prev) / prev) * 100 : null,
    url: `https://finance.yahoo.com/quote/${encodeURIComponent(symbol)}`
  }];
}

async function fetchCrypto(){
  const data = await getJSON(E.coingecko(CRYPTO.map(c => c.id).join(",")));
  return CRYPTO.filter(c => data[c.id]).map(c => ({
    type: "quote",
    id: c.id,
    label: c.label,
    price: data[c.id].usd,
    currency: "USD",
    change: data[c.id].usd_24h_change ?? null,
    url: `https://www.coingecko.com/en/coins/${c.id}`
  }));
}

async function fetchHackerNews(){
  const ids = await getJSON(E.hnTop);
  const items = await Promise.all(
    ids.slice(0, C.newsPerSource).map(id => getJSON(E.hnItem(id)).catch(() => null))
  );
  return items
    .filter(i => i && i.title && !i.dead && !i.deleted)
    .map(i => ({
      type: "news",
      id: `hn-${i.id}`,
      source: "Hacker News",
      title: i.title,
      url: safeUrl(i.url) || `https://news.ycombinator.com/item?id=${i.id}`
    }));
}

async function fetchSpaceNews(){
  const data = await getJSON(E.spaceflight(C.newsPerSource));
  return (data.results || [])
    .filter(a => a.title && safeUrl(a.url))
    .map(a => ({
      type: "news",
      id: `sf-${a.id}`,
      source: a.news_site || "Spaceflight News",
      title: a.title,
      url: a.url
    }));
}

function interleave(a, b){
  const out = [];
  for(let i = 0; i < Math.max(a.length, b.length); i++){
    if(a[i]) out.push(a[i]);
    if(b[i]) out.push(b[i]);
  }
  return out;
}

function weave(quotes, news){
  const out = [];
  let q = 0;
  for(let n = 0; n < news.length || q < quotes.length; n++){
    if(n % C.quotesPerNews === 0 && q < quotes.length) out.push(quotes[q++]);
    if(n < news.length) out.push(news[n]);
  }
  return out;
}

export async function fetchPulse(){
  const [stocks, crypto, hn, space] = await Promise.all([
    Promise.allSettled(STOCKS.map(fetchStock)).then(values),
    fetchCrypto().catch(() => []),
    fetchHackerNews().catch(() => []),
    fetchSpaceNews().catch(() => [])
  ]);
  const items = weave([...stocks, ...crypto], interleave(hn, space));
  if(!items.length) throw new Error("all feeds failed");
  return items;
}