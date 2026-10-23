import fs from "node:fs";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";
import { seedDatabase } from "./seed";

const dataDirectory = path.join(process.cwd(), "data");
const databasePath = path.join(dataDirectory, "keuskupan.db");

const globalForDb = globalThis as unknown as {
  __keuskupanDb?: DatabaseSync;
};

function createDatabase(): DatabaseSync {
  fs.mkdirSync(dataDirectory, { recursive: true });
  const db = new DatabaseSync(databasePath);
  db.exec(`
    PRAGMA journal_mode = WAL;
    PRAGMA foreign_keys = ON;
    PRAGMA busy_timeout = 5000;
  `);
  createSchema(db);
  seedDatabase(db);
  return db;
}

function createSchema(db: DatabaseSync) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL,
      title TEXT,
      bio TEXT,
      avatar TEXT,
      phone TEXT,
      active INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL,
      last_login TEXT
    );

    CREATE TABLE IF NOT EXISTS sessions (
      token TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      expires_at TEXT NOT NULL,
      created_at TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS role_permissions (
      role TEXT NOT NULL,
      permission TEXT NOT NULL,
      PRIMARY KEY (role, permission)
    );

    CREATE TABLE IF NOT EXISTS articles (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      excerpt TEXT NOT NULL,
      content TEXT NOT NULL,
      category TEXT NOT NULL,
      cover_image TEXT,
      author_id TEXT,
      status TEXT NOT NULL DEFAULT 'draft',
      featured INTEGER NOT NULL DEFAULT 0,
      published_at TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      views INTEGER NOT NULL DEFAULT 0,
      FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE SET NULL
    );

    CREATE TABLE IF NOT EXISTS events (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      description TEXT NOT NULL,
      location TEXT NOT NULL,
      start_at TEXT NOT NULL,
      end_at TEXT,
      category TEXT NOT NULL,
      image TEXT,
      status TEXT NOT NULL DEFAULT 'upcoming',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS parishes (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      patron TEXT NOT NULL,
      vicariate TEXT NOT NULL,
      address TEXT NOT NULL,
      city TEXT NOT NULL,
      phone TEXT,
      email TEXT,
      pastor_name TEXT,
      image TEXT,
      description TEXT NOT NULL,
      mass_note TEXT,
      status TEXT NOT NULL DEFAULT 'active',
      order_index INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS clergy (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      title TEXT NOT NULL,
      rank TEXT NOT NULL,
      assignment TEXT,
      bio TEXT,
      image TEXT,
      email TEXT,
      status TEXT NOT NULL DEFAULT 'active',
      order_index INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS masses (
      id TEXT PRIMARY KEY,
      parish_id TEXT NOT NULL,
      day TEXT NOT NULL,
      time TEXT NOT NULL,
      type TEXT NOT NULL,
      location TEXT,
      note TEXT,
      status TEXT NOT NULL DEFAULT 'active',
      order_index INTEGER NOT NULL DEFAULT 0,
      FOREIGN KEY (parish_id) REFERENCES parishes(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS announcements (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      message TEXT NOT NULL,
      tone TEXT NOT NULL DEFAULT 'info',
      active INTEGER NOT NULL DEFAULT 1,
      starts_at TEXT,
      ends_at TEXT,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS pages (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      subtitle TEXT NOT NULL,
      content TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'published',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS galleries (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      image TEXT NOT NULL,
      caption TEXT,
      album TEXT NOT NULL DEFAULT 'Umum',
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS activity_logs (
      id TEXT PRIMARY KEY,
      user_id TEXT,
      user_name TEXT NOT NULL,
      action TEXT NOT NULL,
      entity TEXT NOT NULL,
      entity_id TEXT,
      details TEXT,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS messages (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      subject TEXT NOT NULL,
      message TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'new',
      created_at TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_articles_status ON articles(status, published_at);
    CREATE INDEX IF NOT EXISTS idx_articles_slug ON articles(slug);
    CREATE INDEX IF NOT EXISTS idx_events_start ON events(start_at);
    CREATE INDEX IF NOT EXISTS idx_masses_parish ON masses(parish_id);
    CREATE INDEX IF NOT EXISTS idx_logs_created ON activity_logs(created_at);
    CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id);
  `);
}

export function getDb(): DatabaseSync {
  if (!globalForDb.__keuskupanDb) {
    globalForDb.__keuskupanDb = createDatabase();
  }
  return globalForDb.__keuskupanDb;
}

export function resetDatabase() {
  if (globalForDb.__keuskupanDb) {
    globalForDb.__keuskupanDb.close();
    globalForDb.__keuskupanDb = undefined;
  }
  for (const suffix of ["", "-shm", "-wal"]) {
    const target = databasePath + suffix;
    if (fs.existsSync(target)) fs.unlinkSync(target);
  }
}
