import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { fetchTranscript } from "youtube-transcript/dist/youtube-transcript.esm.js";
import { XMLParser } from "fast-xml-parser";

const pub = join(dirname(fileURLToPath(import.meta.url)), "..", "public");
const videosJson = join(pub, "videos.json");
const syncState = join(pub, "sync_state.json");
const videosDir = join(pub, "videos");
const feed = "https://www.youtube.com/feeds/videos.xml?channel_id=UCtuO2h6OwDueF7h3p8DYYjQ";

const SYSTEM_PROMPT = `You will be provided a youtube transcript. From it, extract the most important points and write a detailed summary of the points he makes, his explanation/experiences, etc. I want to understand all of his opinions, experiences, thoughts, conclusions, etc. Make your response brief while keeping all key points so I just understand his ideas, reasoning and conclusion. Respond in markdown with no title (title will be added). Use bullet points, and mermaid.js if needed for diagrams.`;

const xml = new XMLParser({ ignoreAttributes: false, removeNSPrefix: true, trimValues: true });

const read = (p, fb) => (existsSync(p) ? JSON.parse(readFileSync(p, "utf8")) : fb);
const write = (p, d) => writeFileSync(p, JSON.stringify(d, null, 2) + "\n");

function entriesFromXml(s) {
  const raw = xml.parse(s)?.feed?.entry;
  if (!raw) return [];
  return (Array.isArray(raw) ? raw : [raw])
    .filter((e) => e.videoId)
    .map((e) => ({
      id: e.videoId,
      title: String(e.title ?? "").trim(),
      description: String(e.group?.description ?? "").trim(),
      thumbnailUrl: (Array.isArray(e.group?.thumbnail) ? e.group.thumbnail[0] : e.group?.thumbnail)?.["@_url"] ?? "",
      publishedAt: String(e.published ?? e.updated ?? "").trim(),
    }));
}

async function run() {
  mkdirSync(videosDir, { recursive: true });

  const r = await fetch(feed);
  if (!r.ok) throw new Error(`RSS ${r.status}`);
  const entries = entriesFromXml(await r.text());

  const list = read(videosJson, []);
  const skipped = new Set(read(syncState, {})?.skippedVideoIds ?? []);
  const have = new Set(list.map((v) => v.id));

  if (list.length === 0 && !existsSync(syncState)) {
    write(syncState, { skippedVideoIds: entries.map((e) => e.id) });
    return console.log("Bootstrap", entries.length);
  }

  const c = entries.find((e) => !have.has(e.id) && !skipped.has(e.id));
  if (!c) return console.log("No new video.");

  const transcript = (await fetchTranscript(c.id)).map((x) => x.text).join(" ");
  if (!transcript.trim()) throw new Error("Empty transcript");

  const key = process.env.OPENROUTER_KEY;
  if (!key) throw new Error("OPENROUTER_KEY is not set");

  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "google/gemini-3.1-pro-preview",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: `Transcript:\n\n${transcript.slice(0, 450_000)}` },
      ],
    }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.error?.message || `OpenRouter ${res.status}`);
  const summary = data?.choices?.[0]?.message?.content?.trim();
  if (!summary) throw new Error("No summary in response");

  write(join(videosDir, `${c.id}.json`), {
    videoId: c.id,
    summary,
    generatedAt: new Date().toISOString(),
  });

  const row = {
    id: c.id,
    title: c.title,
    description: c.description,
    thumbnailUrl: c.thumbnailUrl || `https://i.ytimg.com/vi/${c.id}/hqdefault.jpg`,
    publishedAt: c.publishedAt,
  };
  const next = [row, ...list.filter((v) => v.id !== c.id)];
  next.sort((a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt));
  write(videosJson, next);
  console.log(c.id);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
