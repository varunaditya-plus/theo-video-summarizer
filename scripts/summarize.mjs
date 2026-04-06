import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { fetchTranscript } from "youtube-transcript/dist/youtube-transcript.esm.js";
import { XMLParser } from "fast-xml-parser";

const pub = join(dirname(fileURLToPath(import.meta.url)), "..", "public");
const videosJson = join(pub, "videos.json");
const syncState = join(pub, "sync_state.json");
const videosDir = join(pub, "videos");
const feed = "https://www.youtube.com/feeds/videos.xml?channel_id=UCbRP3c757lWg9M-U7TyEkXA";

const SYSTEM_PROMPT = `You will be provided a youtube transcript. From it, extract the most important points and write a detailed summary of the points he makes opinions, explanations, experiences, reasoning, and conclusions that the reader grasps his ideas without watching the video.

Structure:
- Respond in markdown with title (a title will be added).
- Use a warm, clear tone. Be precise and include what points he makes in the video.
- Do not use emojis.

Formatting:
- Prefer the minimum markdown needed for clarity: avoid stacking many bold labels, excessive subheadings, or dense one-line bullet farms.
- When the content is narrative or linear, use short paragraphs. When it is multifaceted (distinct claims, steps, or themes), use bullet points-and make each bullet a full thought (about one to two sentences), not a bare keyword.
- Use subheadings sparingly-only when they genuinely separate major sections of the summary.
- Use Mermaid diagrams when they clarify relationships, flows, or structure that prose might obscure, or to show something he definitely showed in the video.
- Refer to the speaker as "Theo." Where he takes a position on debated topics, show his arguments and counterarguments and his points.
- If the transcript is thin or ambiguous on a point, don't invent detail.`;

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

function parseVideoArg() {
  const raw = process.argv.find((a) => a.startsWith("--video="))?.slice(8)?.trim();
  if (!raw) return null;
  const fromUrl = raw.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/)?.[1];
  return (fromUrl || raw).slice(0, 11);
}

async function fetchShortDescription(id) {
  const res = await fetch(`https://www.youtube.com/watch?v=${id}`, { headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" } });
  if (!res.ok) return "";
  const html = await res.text();
  const m = html.match(/"shortDescription":"((?:[^"\\]|\\.)*)"/);
  if (!m) return "";
  try {
    return JSON.parse('"' + m[1] + '"').trim();
  } catch {
    return "";
  }
}

async function oembedMeta(id) {
  const u = `https://www.youtube.com/oembed?url=${encodeURIComponent(`https://www.youtube.com/watch?v=${id}`)}&format=json`;
  const r = await fetch(u);
  if (!r.ok) throw new Error(`oEmbed ${r.status}`);
  const j = await r.json();
  const description = await fetchShortDescription(id);
  return {
    id,
    title: String(j.title ?? "").trim(),
    description,
    thumbnailUrl: String(j.thumbnail_url ?? "").trim() || `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
    publishedAt: new Date().toISOString(),
  };
}

function isTranscriptUnavailableError(e) {
  const msg = String(e?.message ?? e ?? "");
  return (
    /transcript is disabled/i.test(msg) ||
    msg === "Empty transcript" ||
    /could not retrieve.*transcript/i.test(msg) ||
    /no transcript available/i.test(msg)
  );
}

async function summarizeAndWrite(c, list) {
  const transcript = (await fetchTranscript(c.id)).map((x) => x.text).join(" ");
  if (!transcript.trim()) throw new Error("Empty transcript");

  const key = process.env.OPENROUTER_KEY;
  if (!key) throw new Error("OPENROUTER_KEY is not set");

  console.error(`${c.id}: ${transcript.length} chars transcript -> OpenRouter`);

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

  writeFileSync(join(videosDir, `${c.id}.md`), summary + "\n", "utf8");

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

async function run() {
  mkdirSync(videosDir, { recursive: true });
  const list = read(videosJson, []);
  const forcedId = parseVideoArg();
  const feedAll = process.argv.includes("--feed-all");
  const forceFeed = process.argv.includes("--force");

  console.error("fetching rss");
  const r = await fetch(feed);
  if (!r.ok) throw new Error(`RSS ${r.status}`);
  const entries = entriesFromXml(await r.text());
  console.error(`feed parsed: ${entries.length} video(s)`);

  if (feedAll) {
    let done = 0;
    let skipped = 0;
    let failed = 0;
    for (let i = 0; i < entries.length; i++) {
      const c = entries[i];
      const out = join(videosDir, `${c.id}.md`);
      if (existsSync(out) && !forceFeed) {
        skipped++;
        console.error(`[${i + 1}/${entries.length}] skip (already have ${c.id})`);
        continue;
      }
      console.error(`[${i + 1}/${entries.length}] summarizing ${c.id}…`);
      try {
        await summarizeAndWrite(c, read(videosJson, []));
        done++;
      } catch (e) {
        failed++;
        console.error("fail", c.id, e?.message || e);
      }
      await new Promise((res) => setTimeout(res, 1500));
    }
    console.log(JSON.stringify({ feed: entries.length, done, skipped, failed }));
    return;
  }

  if (forcedId) {
    const c = entries.find((e) => e.id === forcedId) ?? (await oembedMeta(forcedId));
    try {
      await summarizeAndWrite(c, list);
    } catch (e) {
      if (isTranscriptUnavailableError(e)) {
        console.error(`skip (no transcript): ${c.id}`, e?.message || e);
        return;
      }
      throw e;
    }
    return;
  }

  const skipped = new Set(read(syncState, {})?.skippedVideoIds ?? []);
  const have = new Set(list.map((v) => v.id));

  if (list.length === 0 && !existsSync(syncState)) {
    write(syncState, { skippedVideoIds: entries.map((e) => e.id) });
    return console.log("Bootstrap", entries.length);
  }

  function persistSkipped(id) {
    skipped.add(id);
    const state = read(syncState, {});
    const merged = [...new Set([...(state.skippedVideoIds ?? []), id])];
    write(syncState, { ...state, skippedVideoIds: merged });
  }

  for (;;) {
    const c = entries.find((e) => !have.has(e.id) && !skipped.has(e.id));
    if (!c) return console.log("No new video.");
    try {
      await summarizeAndWrite(c, list);
      return;
    } catch (e) {
      if (isTranscriptUnavailableError(e)) {
        console.error(`skip (no transcript): ${c.id}`, e?.message || e);
        persistSkipped(c.id);
        continue;
      }
      throw e;
    }
  }
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
