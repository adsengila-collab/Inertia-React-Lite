import { Router } from "express";
import { SearchImagesQueryParams } from "@workspace/api-zod";
import { scrapeImages, type ScrapedImage } from "../lib/scraper.js";

const router = Router();

function generateFallbackImages(query: string, count: number): ScrapedImage[] {
  const seed = encodeURIComponent(query.toLowerCase().replace(/\s+/g, "-"));
  return Array.from({ length: count }, (_, i) => ({
    title: `${query} - Image ${i + 1}`,
    image: `https://picsum.photos/seed/${seed}-${i}/800/600`,
    thumbnail: `https://picsum.photos/seed/${seed}-${i}/400/300`,
    source: "https://picsum.photos",
  }));
}

router.get("/images/search", async (req, res) => {
  const parsed = SearchImagesQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid query parameters" });
    return;
  }

  const { q, count = 20 } = parsed.data;

  try {
    const images = await scrapeImages(q, count);

    if (images.length === 0) {
      req.log.warn({ q }, "DuckDuckGo returned 0 results, using fallback");
      const fallback = generateFallbackImages(q, count);
      res.json({ images: fallback, query: q, source: "fallback" });
      return;
    }

    res.json({ images, query: q, source: "duckduckgo" });
  } catch (err) {
    req.log.error({ err }, "Image scraping failed, using Picsum fallback");
    const fallback = generateFallbackImages(q, count);
    res.json({ images: fallback, query: q, source: "fallback" });
  }
});

export default router;
