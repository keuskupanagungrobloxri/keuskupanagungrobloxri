import type { PermissionGroup, Role } from "./types";

export const ROLE_META: Record<
  Role,
  {
    label: string;
    short: string;
    description: string;
    level: number;
    tone: string;
    color: string;
  }
> = {
  owner: {
    label: "Holder Keuskupan",
    short: "Holder",
    description:
      "Pemegang mandat tertinggi. Akses penuh ke seluruh konten, pengguna, matriks peran, dan pengaturan situs.",
    level: 100,
    tone: "bg-wine-950 text-gold-200 border-wine-800",
    color: "#2e0b12",
  },
  pengurus: {
    label: "Pengurus Keuskupan",
    short: "Pengurus",
    description:
      "Mengelola operasional situs, publikasi, data pastoral, pengguna, dan pengaturan kecuali matriks peran inti.",
    level: 90,
    tone: "bg-wine-800 text-white border-wine-700",
    color: "#651e28",
  },
  kardinal: {
    label: "Kardinal",
    short: "Kardinal",
    description:
      "Pengawasan tertinggi dan akses baca menyeluruh terhadap konten, pengguna, serta jejak aktivitas.",
    level: 80,
    tone: "bg-[#7a1f2b] text-gold-100 border-[#9b313b]",
    color: "#7a1f2b",
  },
  nunsius: {
    label: "Nunsius",
    short: "Nunsius",
    description:
      "Perwakilan apostolik. Akses pengawasan, laporan, dan data pengguna tanpa kewenangan mengubah konten.",
    level: 75,
    tone: "bg-[#38485f] text-white border-[#50647f]",
    color: "#38485f",
  },
  uskup: {
    label: "Uskup",
    short: "Uskup",
    description:
      "Gembala keuskupan. Mengelola seluruh karya pastoral, konten, klerus, dan pengaturan situs.",
    level: 70,
    tone: "bg-[#7e5c22] text-gold-50 border-gold-700",
    color: "#7e5c22",
  },
  imam: {
    label: "Imam",
    short: "Imam",
    description:
      "Mengelola berita, agenda, liturgi, informasi paroki, dan pesan umat.",
    level: 60,
    tone: "bg-[#405b49] text-white border-[#5b7a65]",
    color: "#405b49",
  },
  diakon: {
    label: "Diakon",
    short: "Diakon",
    description:
      "Mengelola konten liturgi, jadwal misa, pengumuman, agenda, dan pesan umat.",
    level: 50,
    tone: "bg-[#54636e] text-white border-[#71818d]",
    color: "#54636e",
  },
  frater: {
    label: "Frater",
    short: "Frater",
    description:
      "Kontributor konten. Dapat menulis dan menyunting draf, namun publikasi tetap memerlukan persetujuan.",
    level: 40,
    tone: "bg-[#6f6757] text-white border-[#8a8070]",
    color: "#6f6757",
  },
  umat: {
    label: "Umat Awam",
    short: "Umat",
    description:
      "Anggota umat. Tidak memiliki akses ke panel administrasi; dapat mengakses situs publik.",
    level: 10,
    tone: "bg-stone-200 text-stone-700 border-stone-300",
    color: "#78716c",
  },
};

export const ROLES: Role[] = [
  "owner",
  "pengurus",
  "kardinal",
  "nunsius",
  "uskup",
  "imam",
  "diakon",
  "frater",
  "umat",
];

export const PERMISSION_GROUPS: PermissionGroup[] = [
  {
    label: "Dasbor & Pengawasan",
    permissions: [
      {
        key: "dashboard.view",
        label: "Melihat dasbor",
        description: "Membuka ringkasan statistik dan aktivitas panel.",
      },
      {
        key: "logs.view",
        label: "Melihat log aktivitas",
        description: "Melihat catatan perubahan dan audit panel.",
      },
    ],
  },
  {
    label: "Konten & Publikasi",
    permissions: [
      {
        key: "articles.view",
        label: "Melihat berita",
        description: "Melihat daftar dan detail berita di panel.",
      },
      {
        key: "articles.create",
        label: "Membuat berita",
        description: "Membuat berita atau renungan baru sebagai draf.",
      },
      {
        key: "articles.edit",
        label: "Menyunting berita",
        description: "Mengubah berita yang sudah ada.",
      },
      {
        key: "articles.publish",
        label: "Menerbitkan berita",
        description: "Mengubah status berita menjadi terbit.",
      },
      {
        key: "articles.delete",
        label: "Menghapus berita",
        description: "Menghapus berita secara permanen.",
      },
      {
        key: "pages.manage",
        label: "Mengelola halaman",
        description: "Menyunting halaman profil, sejarah, dan dokumen.",
      },
      {
        key: "media.manage",
        label: "Mengelola media",
        description: "Mengunggah foto dan mengelola galeri.",
      },
    ],
  },
  {
    label: "Pelayanan & Data",
    permissions: [
      {
        key: "events.manage",
        label: "Mengelola agenda",
        description: "Membuat dan mengubah agenda kegiatan keuskupan.",
      },
      {
        key: "liturgy.manage",
        label: "Mengelola liturgi",
        description: "Mengatur jadwal misa dan informasi liturgi.",
      },
      {
        key: "parishes.manage",
        label: "Mengelola paroki",
        description: "Mengubah data paroki, alamat, dan jadwalnya.",
      },
      {
        key: "clergy.manage",
        label: "Mengelola klerus",
        description: "Mengubah direktori klerus dan profil gembala.",
      },
      {
        key: "announcements.manage",
        label: "Mengelola pengumuman",
        description: "Menayangkan pengumuman penting di situs.",
      },
      {
        key: "messages.view",
        label: "Melihat pesan",
        description: "Membaca pesan yang dikirim melalui formulir kontak.",
      },
      {
        key: "messages.manage",
        label: "Menindaklanjuti pesan",
        description: "Mengubah status dan menindaklanjuti pesan umat.",
      },
    ],
  },
  {
    label: "Administrasi Situs",
    permissions: [
      {
        key: "users.view",
        label: "Melihat pengguna",
        description: "Melihat daftar akun dan perannya.",
      },
      {
        key: "users.manage",
        label: "Mengelola pengguna",
        description: "Membuat, menyunting, menonaktifkan, dan mengatur akun.",
      },
      {
        key: "roles.manage",
        label: "Mengatur matriks peran",
        description: "Mengubah izin setiap peran pengguna.",
      },
      {
        key: "settings.manage",
        label: "Mengatur situs",
        description: "Mengubah identitas, kontak, sosial media, dan tampilan situs.",
      },
    ],
  },
];

export const ALL_PERMISSIONS = PERMISSION_GROUPS.flatMap((group) =>
  group.permissions.map((permission) => permission.key),
);

export const DEFAULT_ROLE_PERMISSIONS: Record<Role, string[]> = {
  owner: ALL_PERMISSIONS,
  pengurus: ALL_PERMISSIONS.filter((permission) => permission !== "roles.manage"),
  kardinal: [
    "dashboard.view",
    "logs.view",
    "articles.view",
    "messages.view",
    "users.view",
  ],
  nunsius: [
    "dashboard.view",
    "logs.view",
    "articles.view",
    "messages.view",
    "users.view",
  ],
  uskup: ALL_PERMISSIONS.filter(
    (permission) => permission !== "roles.manage",
  ),
  imam: [
    "dashboard.view",
    "articles.view",
    "articles.create",
    "articles.edit",
    "articles.publish",
    "articles.delete",
    "events.manage",
    "liturgy.manage",
    "parishes.manage",
    "announcements.manage",
    "messages.view",
    "messages.manage",
    "media.manage",
  ],
  diakon: [
    "dashboard.view",
    "articles.view",
    "articles.create",
    "articles.edit",
    "articles.publish",
    "events.manage",
    "liturgy.manage",
    "announcements.manage",
    "messages.view",
    "messages.manage",
    "media.manage",
  ],
  frater: [
    "dashboard.view",
    "articles.view",
    "articles.create",
    "articles.edit",
  ],
  umat: [],
};

export function roleAtLeast(actor: Role, target: Role): boolean {
  return ROLE_META[actor].level > ROLE_META[target].level;
}

export function canManageUserRole(actor: Role, target: Role): boolean {
  if (actor === "owner") return true;
  if (actor === "pengurus") {
    return !["owner", "pengurus"].includes(target);
  }
  return false;
}
