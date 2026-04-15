import { Router } from "express";
import { ListKeywordsQueryParams, AddKeywordsBody, DeleteKeywordsBody, GetRandomKeywordsQueryParams } from "@workspace/api-zod";
import { listKeywords, addKeywords, deleteKeywords, getRandomKeywords, getStats } from "../lib/keywords.js";

const router = Router();

router.get("/keywords", async (req, res) => {
  const parsed = ListKeywordsQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid query" });
    return;
  }
  const { page = 1, limit = 50, search = "" } = parsed.data;
  const result = await listKeywords(page, limit, search ?? "");
  res.json(result);
});

router.post("/keywords", async (req, res) => {
  const parsed = AddKeywordsBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid body" });
    return;
  }
  const result = await addKeywords(parsed.data.text);
  res.json(result);
});

router.get("/keywords/random", async (req, res) => {
  const parsed = GetRandomKeywordsQueryParams.safeParse(req.query);
  const count = parsed.success ? (parsed.data.count ?? 20) : 20;
  const keywords = await getRandomKeywords(count);
  res.json({ keywords });
});

router.post("/keywords/delete", async (req, res) => {
  const parsed = DeleteKeywordsBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid body" });
    return;
  }
  const result = await deleteKeywords(parsed.data.keywords);
  res.json(result);
});

router.get("/keywords/stats", async (_req, res) => {
  const stats = await getStats();
  res.json(stats);
});

export default router;
