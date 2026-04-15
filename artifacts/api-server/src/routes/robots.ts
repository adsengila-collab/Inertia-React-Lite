import { Router } from "express";

const router = Router();

router.get("/robots.txt", (req, res) => {
  const proto = (req.headers["x-forwarded-proto"] as string) || req.protocol || "https";
  const host = (req.headers["x-forwarded-host"] as string) || req.hostname;
  const base = `${proto}://${host}`;

  const content = [
    "User-agent: *",
    "Allow: /",
    "",
    `Sitemap: ${base}/sitemap/index.xml`,
    "",
  ].join("\n");

  res.set("Content-Type", "text/plain; charset=UTF-8");
  res.send(content);
});

export default router;
