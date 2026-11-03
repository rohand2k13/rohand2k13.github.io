// Builds the site into _site/:
//   1. turns every Markdown file in posts/ into data/posts.json
//   2. fetches the news feeds listed in scripts/feeds.json into data/news.json
//   3. copies the static files
// Run locally with:  npm run build
import fs from "node:fs/promises";
import path from "node:path";
import { marked } from "marked";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const OUT = path.join(ROOT, "_site");
const STATIC = ["index.html", "styles.css", "app.js", "config.js", "favicon.svg", "images", "CNAME"];

// ── posts ────────────────────────────────────────────────────
function parseFrontMatter(src) {
  const m = src.match(/^---\s*\n([\s\S]*?)\n---\s*\n?([\s\S]*)$/);
  if (!m) return { meta: {}, body: src };
  const meta = {};
  for (const line of m[1].split("\n")) {
    const i = line.indexOf(":");
    if (i < 0) continue;
    const k = line.slice(0, i).trim();
    let v = line.slice(i + 1).trim().replace(/^["']|["']$/g, "");
    if (k === "tags") v = v.replace(/^\[|\]$/g, "").split(",").map(s => s.trim().replace(/^["']|["']$/g, "")).filter(Boolean);
    meta[k] = v;
  }
  return { meta, body: m[2] };
}

async function buildPosts() {
  const dir = path.join(ROOT, "posts");
  const files = (await fs.readdir(dir)).filter(f => f.endsWith(".md") && !f.startsWith("_"));
  const posts = [];
  for (const f of files) {
    const { meta, body } = parseFrontMatter(await fs.readFile(path.join(dir, f), "utf8"));
    if (String(meta.draft) === "true") continue;
    const slug = f.replace(/\.md$/, "").replace(/^\d{4}-\d{2}-\d{2}-/, "");
    const words = body.split(/\s+/).filter(Boolean).length;
    const type = meta.type === "short" ? "short" : "long";
    const plain = body.replace(/[#>*_`\[\]()!-]/g, "").replace(/\s+/g, " ").trim();
    posts.push({
      slug,
      title: meta.title || slug.replace(/-/g, " "),
      date: meta.date || f.slice(0, 10),
      type,
      tags: Array.isArray(meta.tags) ? meta.tags : [],
      cover: meta.cover || "",
      summary: meta.summary || plain.slice(0, 180) + (plain.length > 180 ? "…" : ""),
      minutes: Math.max(1, Math.round(words / 220)),
      html: marked.parse(body)
    });
  }
  posts.sort((a, b) => (a.date < b.date ? 1 : -1));
  return posts;
}

// ── news ─────────────────────────────────────────────────────
const decode = s => s
  .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
  .replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"')
  .replace(/&#39;|&apos;/g, "'").replace(/&#(\d+);/g, (_, n) => String.fromCharCode(n))
  .replace(/&amp;/g, "&").trim();
const tag = (block, name) => {
  const m = block.match(new RegExp(`<${name}[^>]*>([\\s\\S]*?)</${name}>`));
  return m ? decode(m[1]) : "";
};

const feedUrl = t => t.url || `https://news.google.com/rss/search?q=${encodeURIComponent(t.query)}&hl=en-IN&gl=IN&ceid=IN:en`;

async function fetchTab(t, perTab) {
  const url = feedUrl(t);
  const res = await fetch(url, { headers: { "user-agent": "Mozilla/5.0 (personal-site news briefing)" } });
  if (!res.ok) throw new Error(`${t.id}: HTTP ${res.status}`);
  const xml = await res.text();
  const items = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].map(m => m[1]);
  const seen = new Set();
  const out = [];
  for (const it of items) {
    let title = tag(it, "title");
    let source = tag(it, "source");
    if (source && title.endsWith(` - ${source}`)) title = title.slice(0, -(source.length + 3));
    const key = title.toLowerCase().slice(0, 60);
    if (!title || seen.has(key)) continue;
    seen.add(key);
    const d = new Date(tag(it, "pubDate"));
    out.push({ title, link: tag(it, "link"), source, published: isNaN(d) ? null : d.toISOString() });
    if (out.length >= perTab) break;
  }
  return out;
}

async function buildNews(previous) {
  const cfg = JSON.parse(await fs.readFile(path.join(ROOT, "scripts/feeds.json"), "utf8"));
  const tabs = [];
  for (const t of cfg.tabs) {
    let items = [];
    try { items = await fetchTab(t, cfg.perTab || 8); }
    catch (e) {
      console.warn("news:", e.message);
      items = previous?.tabs?.find(p => p.id === t.id)?.items || []; // keep last good copy
    }
    tabs.push({ id: t.id, label: t.label, url: feedUrl(t), items });
  }
  const got = tabs.some(t => t.items.length);
  return { updated: got ? new Date().toISOString() : previous?.updated || null, perTab: cfg.perTab || 8, tabs };
}

// ── GitHub followers (public) ───────────────────────────────
async function buildFollowers(previous) {
  const cfgSrc = await fs.readFile(path.join(ROOT, "config.js"), "utf8").catch(() => "");
  const user = (cfgSrc.match(/githubUser:\s*"([^"]+)"/) || [])[1] || process.env.GITHUB_REPOSITORY_OWNER;
  if (!user) return previous || null;
  const headers = { "user-agent": "personal-site-build", accept: "application/vnd.github+json" };
  if (process.env.GITHUB_TOKEN) headers.authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  try {
    const [u, list] = await Promise.all([
      fetch(`https://api.github.com/users/${user}`, { headers }).then(r => { if (!r.ok) throw new Error(r.status); return r.json(); }),
      fetch(`https://api.github.com/users/${user}/followers?per_page=60`, { headers }).then(r => { if (!r.ok) throw new Error(r.status); return r.json(); })
    ]);
    return {
      user, count: u.followers ?? list.length, updated: new Date().toISOString(),
      people: list.map(f => ({ login: f.login, avatar: f.avatar_url, url: f.html_url }))
    };
  } catch (e) { console.warn("followers:", e.message); return previous || null; }
}

// ── copy + write ─────────────────────────────────────────────
async function copy(src, dst) {
  const st = await fs.stat(src).catch(() => null);
  if (!st) return;
  if (st.isDirectory()) {
    await fs.mkdir(dst, { recursive: true });
    for (const f of await fs.readdir(src)) await copy(path.join(src, f), path.join(dst, f));
  } else await fs.copyFile(src, dst);
}

await fs.rm(OUT, { recursive: true, force: true });
await fs.mkdir(path.join(OUT, "data"), { recursive: true });
for (const f of STATIC) await copy(path.join(ROOT, f), path.join(OUT, f));

const posts = await buildPosts();
const previous = JSON.parse(await fs.readFile(path.join(ROOT, "data/news.json"), "utf8").catch(() => "null"));
const news = process.env.SKIP_NEWS ? (previous || { updated: null, tabs: [] }) : await buildNews(previous);

await fs.writeFile(path.join(OUT, "data/posts.json"), JSON.stringify(posts));
await fs.writeFile(path.join(OUT, "data/news.json"), JSON.stringify(news));
const prevFollowers = JSON.parse(await fs.readFile(path.join(ROOT, "data/followers.json"), "utf8").catch(() => "null"));
const followers = process.env.SKIP_NEWS ? prevFollowers : await buildFollowers(prevFollowers);
if (followers) await fs.writeFile(path.join(OUT, "data/followers.json"), JSON.stringify(followers));
await fs.writeFile(path.join(OUT, ".nojekyll"), "");
console.log(`Built ${posts.length} posts, ${news.tabs.reduce((n, t) => n + t.items.length, 0)} headlines → _site/`);
