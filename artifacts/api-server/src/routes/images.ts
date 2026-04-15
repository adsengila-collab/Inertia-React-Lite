import { Router } from "express";
import { SearchImagesQueryParams } from "@workspace/api-zod";
import { scrapeImages } from "../lib/scraper.js";

const router = Router();

router.get("/images/search", async (req, res) => {
  const parsed = SearchImagesQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid query parameters" });
    return;
  }

  const { q, count = 20 } = parsed.data;

  try {
    const images = await scrapeImages(q, count);
    res.json({ images, query: q });
  } catch (err) {
    req.log.error({ err }, "Image scraping failed");
    res.status(500).json({ error: "Failed to scrape images. DuckDuckGo may be unavailable." });
  }
});

export default router;
