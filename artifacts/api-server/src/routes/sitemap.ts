import { Router } from "express";
import { listKeywords, getTotalCount } from "../lib/keywords.js";

const router = Router();

const URLS_PER_SITEMAP = 10000;

function xmlEscape(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function getBaseUrl(req: { headers: Record<string, string | string[] | undefined>; hostname: string; protocol: string }): string {
  const proto = (req.headers["x-forwarded-proto"] as string) || req.protocol || "https";
  const host = (req.headers["x-forwarded-host"] as string) || req.hostname;
  return `${proto}://${host}`;
}

router.get("/sitemap/index.xml", async (req, res) => {
  const base = getBaseUrl(req as Parameters<typeof getBaseUrl>[0]);
  const total = await getTotalCount();
  const numPostSitemaps = Math.ceil(total / URLS_PER_SITEMAP) || 1;
  const today = new Date().toISOString().split("T")[0];

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

  xml += `  <sitemap>\n`;
  xml += `    <loc>${xmlEscape(base)}/sitemap/pages.xml</loc>\n`;
  xml += `    <lastmod>${today}</lastmod>\n`;
  xml += `  </sitemap>\n`;

  for (let i = 1; i <= numPostSitemaps; i++) {
    xml += `  <sitemap>\n`;
    xml += `    <loc>${xmlEscape(base)}/sitemap/posts-${i}.xml</loc>\n`;
    xml += `    <lastmod>${today}</lastmod>\n`;
    xml += `  </sitemap>\n`;
  }

  xml += `</sitemapindex>`;

  res.set("Content-Type", "application/xml; charset=UTF-8");
  res.set("Cache-Control", "public, max-age=3600");
  res.send(xml);
});

router.get("/sitemap/pages.xml", (req, res) => {
  const base = getBaseUrl(req as Parameters<typeof getBaseUrl>[0]);
  const today = new Date().toISOString().split("T")[0];

  const staticPages = [
    { loc: "/", priority: "1.0", changefreq: "daily" },
    { loc: "/p/contact", priority: "0.3", changefreq: "monthly" },
    { loc: "/p/privacy-policy", priority: "0.3", changefreq: "monthly" },
    { loc: "/p/dmca", priority: "0.3", changefreq: "monthly" },
    { loc: "/p/copyright", priority: "0.3", changefreq: "monthly" },
  ];

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

  for (const page of staticPages) {
    xml += `  <url>\n`;
    xml += `    <loc>${xmlEscape(base + page.loc)}</loc>\n`;
    xml += `    <lastmod>${today}</lastmod>\n`;
    xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
    xml += `    <priority>${page.priority}</priority>\n`;
    xml += `  </url>\n`;
  }

  xml += `</urlset>`;
  res.set("Content-Type", "application/xml; charset=UTF-8");
  res.set("Cache-Control", "public, max-age=3600");
  res.send(xml);
});

router.get("/sitemap/posts-:page.xml", async (req, res) => {
  const base = getBaseUrl(req as Parameters<typeof getBaseUrl>[0]);
  const today = new Date().toISOString().split("T")[0];
  const pageNum = parseInt(req.params.page, 10);

  if (isNaN(pageNum) || pageNum < 1) {
    res.status(404).send("Not found");
    return;
  }

  const result = await listKeywords(pageNum, URLS_PER_SITEMAP, "");

  if (result.keywords.length === 0 && pageNum > 1) {
    res.status(404).send("Not found");
    return;
  }

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

  for (const kw of result.keywords) {
    const loc = `${base}/${xmlEscape(kw.slug)}`;
    xml += `  <url>\n`;
    xml += `    <loc>${loc}</loc>\n`;
    xml += `    <lastmod>${today}</lastmod>\n`;
    xml += `    <changefreq>weekly</changefreq>\n`;
    xml += `    <priority>0.8</priority>\n`;
    xml += `  </url>\n`;
  }

  xml += `</urlset>`;
  res.set("Content-Type", "application/xml; charset=UTF-8");
  res.set("Cache-Control", "public, max-age=3600");
  res.send(xml);
});

export default router;
