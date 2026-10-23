import { getDb } from "./db";
import { setting } from "./utils";
import type {
  Announcement,
  Article,
  Clergy,
  EventItem,
  GalleryItem,
  Mass,
  Page,
  Parish,
  SettingsMap,
} from "./types";

export function getSettings(): SettingsMap {
  const db = getDb();
  const rows = db.prepare("SELECT key, value FROM settings").all() as {
    key: string;
    value: string;
  }[];
  return Object.fromEntries(rows.map((row) => [row.key, row.value]));
}

export { setting };

export function getPublishedArticles(limit?: number): Article[] {
  const db = getDb();
  const sql = `
    SELECT articles.*, users.name AS author_name
    FROM articles LEFT JOIN users ON users.id = articles.author_id
    WHERE articles.status = 'published'
    ORDER BY COALESCE(articles.published_at, articles.created_at) DESC
    ${limit ? "LIMIT ?" : ""}
  `;
  return (limit
    ? db.prepare(sql).all(limit)
    : db.prepare(sql).all()) as Article[];
}

export function getFeaturedArticles(limit = 3): Article[] {
  const db = getDb();
  return db
    .prepare(
      `SELECT articles.*, users.name AS author_name
       FROM articles LEFT JOIN users ON users.id = articles.author_id
       WHERE articles.status = 'published' AND articles.featured = 1
       ORDER BY COALESCE(articles.published_at, articles.created_at) DESC
       LIMIT ?`,
    )
    .all(limit) as Article[];
}

export function getArticleBySlug(slug: string): Article | undefined {
  return getDb()
    .prepare(
      `SELECT articles.*, users.name AS author_name
       FROM articles LEFT JOIN users ON users.id = articles.author_id
       WHERE articles.slug = ? AND articles.status = 'published'`,
    )
    .get(slug) as Article | undefined;
}

export function getRelatedArticles(article: Article, limit = 3): Article[] {
  const db = getDb();
  const sameCategory = db
    .prepare(
      `SELECT articles.*, users.name AS author_name
       FROM articles LEFT JOIN users ON users.id = articles.author_id
       WHERE articles.status = 'published' AND articles.id != ? AND articles.category = ?
       ORDER BY COALESCE(articles.published_at, articles.created_at) DESC
       LIMIT ?`,
    )
    .all(article.id, article.category, limit) as Article[];
  if (sameCategory.length >= limit) return sameCategory;
  const ids = [article.id, ...sameCategory.map((item) => item.id)];
  const placeholders = ids.map(() => "?").join(",");
  const rest = db
    .prepare(
      `SELECT articles.*, users.name AS author_name
       FROM articles LEFT JOIN users ON users.id = articles.author_id
       WHERE articles.status = 'published' AND articles.id NOT IN (${placeholders})
       ORDER BY COALESCE(articles.published_at, articles.created_at) DESC
       LIMIT ?`,
    )
    .all(...ids, limit - sameCategory.length) as Article[];
  return [...sameCategory, ...rest];
}

export function getArticleCategories(): { category: string; total: number }[] {
  return getDb()
    .prepare(
      `SELECT category, COUNT(*) AS total FROM articles
       WHERE status = 'published' GROUP BY category ORDER BY total DESC`,
    )
    .all() as { category: string; total: number }[];
}

export function getUpcomingEvents(limit?: number): EventItem[] {
  const db = getDb();
  const sql = `SELECT * FROM events
    WHERE status IN ('upcoming', 'ongoing')
    ORDER BY start_at ASC ${limit ? "LIMIT ?" : ""}`;
  return (limit
    ? db.prepare(sql).all(limit)
    : db.prepare(sql).all()) as EventItem[];
}

export function getPastEvents(limit?: number): EventItem[] {
  const db = getDb();
  const sql = `SELECT * FROM events
    WHERE status = 'done'
    ORDER BY start_at DESC ${limit ? "LIMIT ?" : ""}`;
  return (limit
    ? db.prepare(sql).all(limit)
    : db.prepare(sql).all()) as EventItem[];
}

export function getEventBySlug(slug: string): EventItem | undefined {
  return getDb()
    .prepare("SELECT * FROM events WHERE slug = ?")
    .get(slug) as EventItem | undefined;
}

export function getParishes(): Parish[] {
  return getDb()
    .prepare(
      "SELECT * FROM parishes WHERE status = 'active' ORDER BY order_index, name",
    )
    .all() as Parish[];
}

export function getParishBySlug(slug: string): Parish | undefined {
  return getDb()
    .prepare("SELECT * FROM parishes WHERE slug = ? AND status = 'active'")
    .get(slug) as Parish | undefined;
}

export function getMassesByParish(parishId: string): Mass[] {
  return getDb()
    .prepare(
      `SELECT masses.*, parishes.name AS parish_name
       FROM masses JOIN parishes ON parishes.id = masses.parish_id
       WHERE masses.parish_id = ? AND masses.status = 'active'
       ORDER BY masses.order_index, masses.time`,
    )
    .all(parishId) as Mass[];
}

const WEEKDAY_ORDER: Record<string, number> = {
  Minggu: 1,
  Sabtu: 2,
  "Jumat Pertama": 3,
  Jumat: 4,
  Kamis: 5,
  Rabu: 6,
  Selasa: 7,
  Senin: 8,
  "Senin–Jumat": 9,
  "Setiap Hari": 10,
};

export function getMassesWithParish(limit?: number): Mass[] {
  const db = getDb();
  const rows = db
    .prepare(
      `SELECT masses.*, parishes.name AS parish_name
       FROM masses JOIN parishes ON parishes.id = masses.parish_id
       WHERE masses.status = 'active' AND parishes.status = 'active'
       ORDER BY masses.order_index, masses.time`,
    )
    .all() as Mass[];
  const sorted = rows.sort(
    (a, b) =>
      (WEEKDAY_ORDER[a.day] ?? 99) - (WEEKDAY_ORDER[b.day] ?? 99) ||
      a.time.localeCompare(b.time),
  );
  return limit ? sorted.slice(0, limit) : sorted;
}

export function getKatedralMasses(): Mass[] {
  return getMassesWithParish().filter((mass) =>
    mass.parish_name?.includes("Katedral"),
  );
}

export function getClergy(): Clergy[] {
  return getDb()
    .prepare(
      "SELECT * FROM clergy WHERE status != 'inactive' ORDER BY order_index, name",
    )
    .all() as Clergy[];
}

export function getClergyByRank(rank: string): Clergy[] {
  return getDb()
    .prepare(
      "SELECT * FROM clergy WHERE rank = ? AND status != 'inactive' ORDER BY order_index",
    )
    .all(rank) as Clergy[];
}

export function getBishop(settings: SettingsMap): Clergy | undefined {
  const bishopName = settings.bishop_name;
  const db = getDb();
  return (
    (db
      .prepare("SELECT * FROM clergy WHERE name = ?")
      .get(bishopName) as Clergy | undefined) ??
    (db
      .prepare(
        "SELECT * FROM clergy WHERE rank = 'Uskup Agung' ORDER BY order_index LIMIT 1",
      )
      .get() as Clergy | undefined)
  );
}

export function getActiveAnnouncements(): Announcement[] {
  const now = Date.now();
  return (
    getDb()
      .prepare(
        "SELECT * FROM announcements WHERE active = 1 ORDER BY created_at DESC",
      )
      .all() as Announcement[]
  ).filter((item) => {
    if (item.starts_at && new Date(item.starts_at).getTime() > now) return false;
    if (item.ends_at && new Date(item.ends_at).getTime() < now) return false;
    return true;
  });
}

export function getPages(): Page[] {
  return getDb()
    .prepare("SELECT * FROM pages WHERE status = 'published' ORDER BY title")
    .all() as Page[];
}

export function getPageBySlug(slug: string): Page | undefined {
  return getDb()
    .prepare("SELECT * FROM pages WHERE slug = ? AND status = 'published'")
    .get(slug) as Page | undefined;
}

export function getGallery(limit?: number): GalleryItem[] {
  const db = getDb();
  const sql = "SELECT * FROM galleries ORDER BY created_at DESC";
  return (
    limit ? db.prepare(`${sql} LIMIT ?`).all(limit) : db.prepare(sql).all()
  ) as GalleryItem[];
}

export function getGalleryAlbums(): { album: string; total: number }[] {
  return getDb()
    .prepare(
      "SELECT album, COUNT(*) AS total FROM galleries GROUP BY album ORDER BY album",
    )
    .all() as { album: string; total: number }[];
}

export function getPublicStats() {
  const db = getDb();
  const parishes = db
    .prepare("SELECT COUNT(*) AS total FROM parishes WHERE status = 'active'")
    .get() as { total: number };
  const clergy = db
    .prepare("SELECT COUNT(*) AS total FROM clergy WHERE status = 'active'")
    .get() as { total: number };
  const articles = db
    .prepare("SELECT COUNT(*) AS total FROM articles WHERE status = 'published'")
    .get() as { total: number };
  return { parishes: parishes.total, clergy: clergy.total, articles: articles.total };
}
