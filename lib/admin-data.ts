import { getDb } from "./db";
import type {
  ActivityLog,
  Announcement,
  Article,
  Clergy,
  ContactMessage,
  EventItem,
  GalleryItem,
  Mass,
  Page,
  Parish,
  SafeUser,
  User,
} from "./types";
import { permissionsForRole } from "./auth";
import { ROLES } from "./permissions";

export function getDashboardStats() {
  const db = getDb();
  const get = (sql: string) => (db.prepare(sql).get() as { total: number }).total;
  return {
    articles: get("SELECT COUNT(*) AS total FROM articles"),
    published: get(
      "SELECT COUNT(*) AS total FROM articles WHERE status = 'published'",
    ),
    drafts: get("SELECT COUNT(*) AS total FROM articles WHERE status = 'draft'"),
    events: get("SELECT COUNT(*) AS total FROM events"),
    parishes: get("SELECT COUNT(*) AS total FROM parishes"),
    clergy: get("SELECT COUNT(*) AS total FROM clergy"),
    users: get("SELECT COUNT(*) AS total FROM users"),
    newMessages: get(
      "SELECT COUNT(*) AS total FROM messages WHERE status = 'new'",
    ),
    gallery: get("SELECT COUNT(*) AS total FROM galleries"),
  };
}

export function getRecentLogs(limit = 8): ActivityLog[] {
  return getDb()
    .prepare("SELECT * FROM activity_logs ORDER BY created_at DESC LIMIT ?")
    .all(limit) as ActivityLog[];
}

export function getRecentArticles(limit = 5): Article[] {
  return getDb()
    .prepare(
      `SELECT articles.*, users.name AS author_name
       FROM articles LEFT JOIN users ON users.id = articles.author_id
       ORDER BY articles.updated_at DESC LIMIT ?`,
    )
    .all(limit) as Article[];
}

export function getDashboardChart() {
  const db = getDb();
  const rows = db
    .prepare(
      `SELECT substr(COALESCE(published_at, created_at), 1, 7) AS month,
       COUNT(*) AS total FROM articles WHERE status = 'published'
       GROUP BY month ORDER BY month DESC LIMIT 6`,
    )
    .all() as { month: string; total: number }[];
  return rows.reverse();
}

export function getAllArticles(query = ""): Article[] {
  const db = getDb();
  const search = `%${query.trim()}%`;
  if (query.trim()) {
    return db
      .prepare(
        `SELECT articles.*, users.name AS author_name
         FROM articles LEFT JOIN users ON users.id = articles.author_id
         WHERE articles.title LIKE ? OR articles.category LIKE ? OR articles.status LIKE ?
         ORDER BY articles.updated_at DESC`,
      )
      .all(search, search, search) as Article[];
  }
  return db
    .prepare(
      `SELECT articles.*, users.name AS author_name
       FROM articles LEFT JOIN users ON users.id = articles.author_id
       ORDER BY articles.updated_at DESC`,
    )
    .all() as Article[];
}

export function getArticleById(id: string): Article | undefined {
  return getDb()
    .prepare(
      `SELECT articles.*, users.name AS author_name
       FROM articles LEFT JOIN users ON users.id = articles.author_id
       WHERE articles.id = ?`,
    )
    .get(id) as Article | undefined;
}

export function getAllEvents(query = ""): EventItem[] {
  const db = getDb();
  if (query.trim()) {
    const search = `%${query.trim()}%`;
    return db
      .prepare(
        "SELECT * FROM events WHERE title LIKE ? OR location LIKE ? OR category LIKE ? ORDER BY start_at DESC",
      )
      .all(search, search, search) as EventItem[];
  }
  return db
    .prepare("SELECT * FROM events ORDER BY start_at DESC")
    .all() as EventItem[];
}

export function getEventById(id: string): EventItem | undefined {
  return getDb()
    .prepare("SELECT * FROM events WHERE id = ?")
    .get(id) as EventItem | undefined;
}

export function getAllParishes(query = ""): Parish[] {
  const db = getDb();
  if (query.trim()) {
    const search = `%${query.trim()}%`;
    return db
      .prepare(
        "SELECT * FROM parishes WHERE name LIKE ? OR vicariate LIKE ? OR city LIKE ? ORDER BY order_index, name",
      )
      .all(search, search, search) as Parish[];
  }
  return db
    .prepare("SELECT * FROM parishes ORDER BY order_index, name")
    .all() as Parish[];
}

export function getParishById(id: string): Parish | undefined {
  return getDb()
    .prepare("SELECT * FROM parishes WHERE id = ?")
    .get(id) as Parish | undefined;
}

export function getAllMasses(): Mass[] {
  return getDb()
    .prepare(
      `SELECT masses.*, parishes.name AS parish_name
       FROM masses JOIN parishes ON parishes.id = masses.parish_id
       ORDER BY parishes.order_index, masses.order_index`,
    )
    .all() as Mass[];
}

export function getMassById(id: string): Mass | undefined {
  return getDb()
    .prepare("SELECT * FROM masses WHERE id = ?")
    .get(id) as Mass | undefined;
}

export function getAllClergy(): Clergy[] {
  return getDb()
    .prepare("SELECT * FROM clergy ORDER BY order_index, name")
    .all() as Clergy[];
}

export function getClergyById(id: string): Clergy | undefined {
  return getDb()
    .prepare("SELECT * FROM clergy WHERE id = ?")
    .get(id) as Clergy | undefined;
}

export function getAllPages(): Page[] {
  return getDb()
    .prepare("SELECT * FROM pages ORDER BY updated_at DESC")
    .all() as Page[];
}

export function getPageById(id: string): Page | undefined {
  return getDb()
    .prepare("SELECT * FROM pages WHERE id = ?")
    .get(id) as Page | undefined;
}

export function getAllGalleries(): GalleryItem[] {
  return getDb()
    .prepare("SELECT * FROM galleries ORDER BY created_at DESC")
    .all() as GalleryItem[];
}

export function getGalleryById(id: string): GalleryItem | undefined {
  return getDb()
    .prepare("SELECT * FROM galleries WHERE id = ?")
    .get(id) as GalleryItem | undefined;
}

export function getAllAnnouncements(): Announcement[] {
  return getDb()
    .prepare("SELECT * FROM announcements ORDER BY created_at DESC")
    .all() as Announcement[];
}

export function getAnnouncementById(id: string): Announcement | undefined {
  return getDb()
    .prepare("SELECT * FROM announcements WHERE id = ?")
    .get(id) as Announcement | undefined;
}

export function getAllUsers(): (User & { permissions: string[] })[] {
  return (
    getDb()
      .prepare("SELECT * FROM users ORDER BY created_at ASC")
      .all() as User[]
  ).map((user) => ({
    ...user,
    permissions: permissionsForRole(user.role),
  }));
}

export function getUserById(id: string): User | undefined {
  return getDb()
    .prepare("SELECT * FROM users WHERE id = ?")
    .get(id) as User | undefined;
}

export function getRoleMatrix(): Record<string, string[]> {
  const db = getDb();
  const rows = db
    .prepare("SELECT role, permission FROM role_permissions")
    .all() as { role: string; permission: string }[];
  const matrix: Record<string, string[]> = Object.fromEntries(
    ROLES.map((role) => [role, []]),
  );
  for (const row of rows) {
    matrix[row.role] ??= [];
    matrix[row.role].push(row.permission);
  }
  return matrix;
}

export function getMessages(): ContactMessage[] {
  return getDb()
    .prepare("SELECT * FROM messages ORDER BY created_at DESC")
    .all() as ContactMessage[];
}

export function getMessageById(id: string): ContactMessage | undefined {
  return getDb()
    .prepare("SELECT * FROM messages WHERE id = ?")
    .get(id) as ContactMessage | undefined;
}

export function getAllLogs(limit = 100): ActivityLog[] {
  return getDb()
    .prepare("SELECT * FROM activity_logs ORDER BY created_at DESC LIMIT ?")
    .all(limit) as ActivityLog[];
}

export function getAdminUsersForSelect(): Pick<SafeUser, "id" | "name" | "role">[] {
  return getDb()
    .prepare("SELECT id, name, role FROM users WHERE active = 1 ORDER BY name")
    .all() as Pick<SafeUser, "id" | "name" | "role">[];
}
