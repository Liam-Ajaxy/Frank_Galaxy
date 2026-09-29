export const PULSE_CONFIG = {
  refreshMs: 5 * 60 * 1000,
  retryMs: 60 * 1000,
  timeoutMs: 8000,
  newsPerSource: 6,
  quotesPerNews: 2,
  cacheKey: "frankgalaxy.pulse",
  cacheMaxAgeMs: 30 * 60 * 1000
};

export const STOCKS = [
  { symbol: "AAPL",  label: "AAPL" },
  { symbol: "MSFT",  label: "MSFT" },
  { symbol: "NVDA",  label: "NVDA" },
  { symbol: "TSLA",  label: "TSLA" },
  { symbol: "^GSPC", label: "S&P 500", index: true },
  { symbol: "^IXIC", label: "Nasdaq",  index: true }
];

export const CRYPTO = [
  { id: "bitcoin",  label: "BTC" },
  { id: "ethereum", label: "ETH" }
];

export const ENDPOINTS = {
  yahooChart: s =>
    `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(s)}?range=1d&interval=1d`,
  proxies: [
    u => `https://api.allorigins.win/raw?url=${encodeURIComponent(u)}`,
    u => `https://corsproxy.io/?url=${encodeURIComponent(u)}`
  ],
  coingecko: ids =>
    `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true`,
  hnTop: "https://hacker-news.firebaseio.com/v0/topstories.json",
  hnItem: id => `https://hacker-news.firebaseio.com/v0/item/${id}.json`,
  spaceflight: n => `https://api.spaceflightnewsapi.net/v4/articles/?limit=${n}`
};