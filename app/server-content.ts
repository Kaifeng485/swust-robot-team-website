import { defaultContent, type SiteContent } from "./site-content";
import { getRuntimeEnv } from "./runtime-env";

export async function readContent(): Promise<SiteContent> {
  const env = getRuntimeEnv();
  await env.DB.prepare(
    "CREATE TABLE IF NOT EXISTS site_content (id INTEGER PRIMARY KEY, content TEXT NOT NULL, updated_at TEXT NOT NULL)"
  ).run();
  const row = await env.DB.prepare("SELECT content FROM site_content WHERE id = 1").first<{ content: string }>();
  if (!row) return defaultContent;
  try {
    const saved = JSON.parse(row.content) as Partial<SiteContent>;
    return {
      ...defaultContent,
      ...saved,
      aboutStats: Array.isArray(saved.aboutStats) && saved.aboutStats.length
        ? saved.aboutStats
        : defaultContent.aboutStats,
      seasons: Array.isArray(saved.seasons) ? saved.seasons : defaultContent.seasons,
      galleryPhotos: Array.isArray(saved.galleryPhotos) && saved.galleryPhotos.length
        ? saved.galleryPhotos
        : (Array.isArray(saved.seasons) && saved.seasons.length
          ? saved.seasons.map((season) => ({
              id: `gallery-${season.id}`,
              title: season.title,
              caption: `${season.year} · ${season.kind}`,
              image: season.image,
            }))
          : defaultContent.galleryPhotos),
      pages: Array.isArray(saved.pages) ? saved.pages : defaultContent.pages,
    };
  } catch {
    return defaultContent;
  }
}

export async function writeContent(content: SiteContent) {
  const env = getRuntimeEnv();
  await env.DB.prepare(
    "CREATE TABLE IF NOT EXISTS site_content (id INTEGER PRIMARY KEY, content TEXT NOT NULL, updated_at TEXT NOT NULL)"
  ).run();
  await env.DB.prepare(
    "INSERT INTO site_content (id, content, updated_at) VALUES (1, ?, ?) ON CONFLICT(id) DO UPDATE SET content = excluded.content, updated_at = excluded.updated_at"
  ).bind(JSON.stringify(content), new Date().toISOString()).run();
}
