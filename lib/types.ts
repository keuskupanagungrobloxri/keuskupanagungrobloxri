export type Role =
  | "umat"
  | "frater"
  | "diakon"
  | "imam"
  | "uskup"
  | "kardinal"
  | "nunsius"
  | "pengurus"
  | "owner";

export type User = {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  role: Role;
  title: string | null;
  bio: string | null;
  avatar: string | null;
  phone: string | null;
  active: number;
  created_at: string;
  last_login: string | null;
};

export type SafeUser = Omit<User, "password_hash"> & {
  permissions: string[];
};

export type Article = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  cover_image: string | null;
  author_id: string | null;
  author_name?: string;
  status: "draft" | "published" | "archived";
  featured: number;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  views: number;
};

export type EventItem = {
  id: string;
  title: string;
  slug: string;
  description: string;
  location: string;
  start_at: string;
  end_at: string | null;
  category: string;
  image: string | null;
  status: "upcoming" | "ongoing" | "done" | "draft";
  created_at: string;
  updated_at: string;
};

export type Parish = {
  id: string;
  name: string;
  slug: string;
  patron: string;
  vicariate: string;
  address: string;
  city: string;
  phone: string | null;
  email: string | null;
  pastor_name: string | null;
  image: string | null;
  description: string;
  mass_note: string | null;
  status: "active" | "inactive";
  order_index: number;
  created_at: string;
  updated_at: string;
};

export type Clergy = {
  id: string;
  name: string;
  slug: string;
  title: string;
  rank: string;
  assignment: string | null;
  bio: string | null;
  image: string | null;
  email: string | null;
  status: "active" | "emeritus" | "inactive";
  order_index: number;
};

export type Mass = {
  id: string;
  parish_id: string;
  day: string;
  time: string;
  type: string;
  location: string | null;
  note: string | null;
  status: "active" | "inactive";
  order_index: number;
  parish_name?: string;
};

export type Announcement = {
  id: string;
  title: string;
  message: string;
  tone: "info" | "important" | "liturgy";
  active: number;
  starts_at: string | null;
  ends_at: string | null;
  created_at: string;
};

export type Page = {
  id: string;
  title: string;
  slug: string;
  subtitle: string;
  content: string;
  status: "draft" | "published";
  created_at: string;
  updated_at: string;
};

export type GalleryItem = {
  id: string;
  title: string;
  image: string;
  caption: string | null;
  album: string;
  created_at: string;
};

export type ActivityLog = {
  id: string;
  user_id: string | null;
  user_name: string;
  action: string;
  entity: string;
  entity_id: string | null;
  details: string | null;
  created_at: string;
};

export type ContactMessage = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  status: "new" | "read" | "replied";
  created_at: string;
};

export type SettingsMap = Record<string, string>;

export type PermissionGroup = {
  label: string;
  permissions: {
    key: string;
    label: string;
    description: string;
  }[];
};
