import fs from "fs";
import path from "path";
import readline from "readline";

const DATA_DIR = path.resolve(process.cwd(), "../../data");
const KEYWORDS_FILE = path.join(DATA_DIR, "keywords.txt");

function ensureFile() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(KEYWORDS_FILE)) fs.writeFileSync(KEYWORDS_FILE, "");
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function getTotalCount(): Promise<number> {
  ensureFile();
  return new Promise((resolve) => {
    let count = 0;
    const rl = readline.createInterface({ input: fs.createReadStream(KEYWORDS_FILE), crlfDelay: Infinity });
    rl.on("line", (line) => { if (line.trim()) count++; });
    rl.on("close", () => resolve(count));
    rl.on("error", () => resolve(0));
  });
}

export async function listKeywords(
  page: number = 1,
  limit: number = 50,
  search: string = ""
): Promise<{ keywords: Array<{ name: string; slug: string }>; total: number; page: number; limit: number; totalPages: number }> {
  ensureFile();
  const lowerSearch = search.toLowerCase();

  return new Promise((resolve) => {
    const all: string[] = [];
    const rl = readline.createInterface({ input: fs.createReadStream(KEYWORDS_FILE), crlfDelay: Infinity });

    rl.on("line", (line) => {
      const kw = line.trim();
      if (!kw) return;
      if (search && !kw.toLowerCase().includes(lowerSearch)) return;
      all.push(kw);
    });

    rl.on("close", () => {
      const total = all.length;
      const totalPages = Math.ceil(total / limit) || 1;
      const safePageNum = Math.max(1, Math.min(page, totalPages));
      const start = (safePageNum - 1) * limit;
      const slice = all.slice(start, start + limit);

      resolve({
        keywords: slice.map(name => ({ name, slug: slugify(name) })),
        total,
        page: safePageNum,
        limit,
        totalPages,
      });
    });

    rl.on("error", () => resolve({ keywords: [], total: 0, page: 1, limit, totalPages: 1 }));
  });
}

export async function addKeywords(text: string): Promise<{ added: number; duplicates: number; total: number }> {
  ensureFile();

  const incoming = text
    .split(/\r?\n/)
    .map(l => l.trim())
    .filter(Boolean);

  if (incoming.length === 0) return { added: 0, duplicates: 0, total: await getTotalCount() };

  const existingSet = await new Promise<Set<string>>((resolve) => {
    const set = new Set<string>();
    const rl = readline.createInterface({ input: fs.createReadStream(KEYWORDS_FILE), crlfDelay: Infinity });
    rl.on("line", (line) => { if (line.trim()) set.add(line.trim().toLowerCase()); });
    rl.on("close", () => resolve(set));
    rl.on("error", () => resolve(set));
  });

  let added = 0;
  let duplicates = 0;
  const newLines: string[] = [];

  for (const kw of incoming) {
    if (existingSet.has(kw.toLowerCase())) {
      duplicates++;
    } else {
      newLines.push(kw);
      existingSet.add(kw.toLowerCase());
      added++;
    }
  }

  if (newLines.length > 0) {
    const appendStr = "\n" + newLines.join("\n");
    fs.appendFileSync(KEYWORDS_FILE, appendStr, "utf8");
  }

  const total = existingSet.size;
  return { added, duplicates, total };
}

export async function deleteKeywords(toDelete: string[]): Promise<{ deleted: number }> {
  ensureFile();
  if (toDelete.length === 0) return { deleted: 0 };

  const deleteSet = new Set(toDelete.map(k => k.toLowerCase()));

  const allLines: string[] = await new Promise((resolve) => {
    const lines: string[] = [];
    const rl = readline.createInterface({ input: fs.createReadStream(KEYWORDS_FILE), crlfDelay: Infinity });
    rl.on("line", (line) => lines.push(line));
    rl.on("close", () => resolve(lines));
    rl.on("error", () => resolve(lines));
  });

  let deleted = 0;
  const kept: string[] = [];
  for (const line of allLines) {
    const kw = line.trim();
    if (kw && deleteSet.has(kw.toLowerCase())) {
      deleted++;
    } else {
      kept.push(line);
    }
  }

  fs.writeFileSync(KEYWORDS_FILE, kept.join("\n"), "utf8");
  return { deleted };
}

export async function getRandomKeywords(count: number = 20): Promise<Array<{ name: string; slug: string }>> {
  ensureFile();

  return new Promise((resolve) => {
    const all: string[] = [];
    const rl = readline.createInterface({ input: fs.createReadStream(KEYWORDS_FILE), crlfDelay: Infinity });
    rl.on("line", (line) => { if (line.trim()) all.push(line.trim()); });
    rl.on("close", () => {
      if (all.length === 0) { resolve([]); return; }
      const shuffled = all.sort(() => Math.random() - 0.5).slice(0, count);
      resolve(shuffled.map(name => ({ name, slug: slugify(name) })));
    });
    rl.on("error", () => resolve([]));
  });
}

export async function getStats(): Promise<{ total: number; lastUpdated: string }> {
  ensureFile();
  const total = await getTotalCount();
  let lastUpdated = new Date().toISOString();
  try {
    const stat = fs.statSync(KEYWORDS_FILE);
    lastUpdated = stat.mtime.toISOString();
  } catch {}
  return { total, lastUpdated };
}
