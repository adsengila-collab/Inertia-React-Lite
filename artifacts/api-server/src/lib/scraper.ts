export interface ScrapedImage {
  title: string;
  image: string;
  thumbnail: string;
  source: string;
}

const DDG_URL = "https://duckduckgo.com";
const DDG_IMAGES_URL = "https://duckduckgo.com/i.js";

async function getVqd(query: string): Promise<string> {
  const url = `${DDG_URL}/?q=${encodeURIComponent(query)}&iax=images&ia=images`;
  const res = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      "Referer": "https://duckduckgo.com/",
    },
    signal: AbortSignal.timeout(15000),
  });

  if (!res.ok) throw new Error(`DDG VQD fetch failed: ${res.status}`);
  const html = await res.text();

  const match =
    html.match(/vqd=['"]([^'"]+)['"]/) ||
    html.match(/vqd=([0-9-]+)/) ||
    html.match(/data-vqd="([^"]+)"/);

  if (!match) throw new Error("Could not extract VQD token from DuckDuckGo");
  return match[1];
}

export async function scrapeImages(query: string, count: number = 20): Promise<ScrapedImage[]> {
  const vqd = await getVqd(query);

  const params = new URLSearchParams({
    l: "us-en",
    o: "json",
    q: query,
    vqd,
    f: ",,,,,",
    p: "1",
    s: "0",
  });

  const url = `${DDG_IMAGES_URL}?${params.toString()}`;
  const res = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      "Referer": `https://duckduckgo.com/?q=${encodeURIComponent(query)}&iax=images&ia=images`,
      "Accept": "application/json, text/javascript, */*; q=0.01",
      "X-Requested-With": "XMLHttpRequest",
    },
    signal: AbortSignal.timeout(15000),
  });

  if (!res.ok) throw new Error(`DDG images fetch failed: ${res.status}`);

  const data = await res.json() as { results?: Array<{ title?: string; image?: string; thumbnail?: string; url?: string }> };
  const results = data.results ?? [];

  const images: ScrapedImage[] = results
    .filter(r => r.image && r.thumbnail)
    .slice(0, count)
    .map(r => ({
      title: r.title ?? query,
      image: r.image ?? "",
      thumbnail: r.thumbnail ?? "",
      source: r.url ?? "",
    }));

  return images;
}
