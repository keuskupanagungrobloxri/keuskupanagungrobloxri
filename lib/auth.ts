import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getDb } from "./db";
import { newId, newToken } from "./password";
import { ALL_PERMISSIONS } from "./permissions";
import type { Role, SafeUser, User } from "./types";

const COOKIE_NAME = "kar_session";
const SESSION_DAYS = 7;

type SessionRow = User & { expires_at: string };

export function permissionsForRole(role: Role): string[] {
  if (role === "owner") return [...ALL_PERMISSIONS];
  const db = getDb();
  return (
    db
      .prepare("SELECT permission FROM role_permissions WHERE role = ?")
      .all(role) as { permission: string }[]
  ).map((row) => row.permission);
}

export async function getCurrentUser(): Promise<SafeUser | null> {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  if (!token) return null;

  const db = getDb();
  const session = db
    .prepare(
      `SELECT users.*, sessions.expires_at
       FROM sessions JOIN users ON users.id = sessions.user_id
       WHERE sessions.token = ?`,
    )
    .get(token) as SessionRow | undefined;

  if (!session) return null;
  if (new Date(session.expires_at).getTime() < Date.now()) {
    db.prepare("DELETE FROM sessions WHERE token = ?").run(token);
    return null;
  }
  if (!session.active) return null;

  const { expires_at, password_hash, ...safe } = session;
  void expires_at;
  void password_hash;
  return {
    ...safe,
    role: session.role,
    permissions: permissionsForRole(session.role),
  };
}

export async function createSession(userId: string) {
  const db = getDb();
  const token = newToken();
  const now = new Date();
  const expires = new Date(now.getTime() + SESSION_DAYS * 24 * 60 * 60 * 1000);
  db.prepare(
    "INSERT INTO sessions (token, user_id, expires_at, created_at) VALUES (?, ?, ?, ?)",
  ).run(token, userId, expires.toISOString(), now.toISOString());
  db.prepare("DELETE FROM sessions WHERE expires_at < ?").run(now.toISOString());

  const store = await cookies();
  store.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires,
  });
}

export async function destroySession() {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  if (token) {
    getDb().prepare("DELETE FROM sessions WHERE token = ?").run(token);
  }
  store.delete(COOKIE_NAME);
}

export function hasPermission(
  user: Pick<SafeUser, "role" | "permissions"> | null,
  permission: string,
) {
  if (!user) return false;
  if (user.role === "owner") return true;
  return user.permissions.includes(permission);
}

export async function requireAdmin(permission?: string): Promise<SafeUser> {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");
  if (!hasPermission(user, "dashboard.view")) {
    redirect("/admin/akses-terbatas");
  }
  if (permission && !hasPermission(user, permission)) {
    redirect(`/admin/akses-terbatas?izin=${encodeURIComponent(permission)}`);
  }
  return user;
}

export function assertPermission(user: SafeUser, permission: string) {
  if (!hasPermission(user, permission)) {
    throw new Error("Anda tidak memiliki izin untuk tindakan ini.");
  }
}

export function logActivity(
  user: Pick<SafeUser, "id" | "name">,
  action: string,
  entity: string,
  entityId: string | null,
  details: string | null,
) {
  getDb()
    .prepare(
      `INSERT INTO activity_logs
       (id, user_id, user_name, action, entity, entity_id, details, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    )
    .run(
      newId("log"),
      user.id,
      user.name,
      action,
      entity,
      entityId,
      details,
      new Date().toISOString(),
    );
}

export const authConfig = {
  cookieName: COOKIE_NAME,
  sessionDays: SESSION_DAYS,
};
