# Keuskupan Agung ROBLOX

Situs resmi fiktif **Keuskupan Agung ROBLOX** beserta panel administrasi (CMS) lengkap. Tampilan memadukan nuansa editorial Katolik dengan sistem warna wine, emas, dan krem. Seluruh isi situs publik dikelola dari panel admin dan disimpan di SQLite lokal.

> Proyek ini adalah karya fiktif untuk demonstrasi. Tidak berafiliasi dengan, dan tidak disponsori oleh, Roblox Corporation maupun Keuskupan mana pun di dunia nyata.

## Teknologi

- **Next.js 15.5** (App Router) + React 19 + TypeScript
- **Tailwind CSS 3.4** dengan design system khusus (`wine`, `gold`, `cream`)
- **SQLite** melalui `node:sqlite` bawaan Node.js — tanpa Prisma atau basis data eksternal
- Sesi kustom dengan cookie HttpOnly, kata sandi di-hash memakai `scrypt`
- Unggahan gambar ke `public/uploads`
- Ikon `lucide-react` dan aset gambar/font yang di-host sendiri

## Prasyarat

- **Node.js 24** (disarankan) — modul `node:sqlite` masih bereksperimen
- npm

## Menjalankan

```bash
npm install
npm run dev
```

Buka:

- Situs publik: [http://localhost:3000](http://localhost:3000)
- Panel admin: [http://localhost:3000/admin](http://localhost:3000/admin)

Basis data `data/keuskupan.db` dibuat dan diisi konten contoh secara otomatis saat pertama kali dijalankan. Tidak ada variabel lingkungan yang wajib diisi.

## Akun Demo

| Peran | Email | Kata sandi |
| --- | --- | --- |
| Holder Keuskupan (Owner) | `owner@keuskupanroblox.org` | `Holder#2026` |

Akun peran lain mengikuti pola `Peran#2026`, misalnya `imam@keuskupanroblox.org` / `Imam#2026`. Ganti seluruh akun demo sebelum situs dipublikasikan.

## Peran & Hak Akses

Peran yang tersedia: Umat Awam, Frater, Diakon, Imam, Uskup, Kardinal, Nunsius, Pengurus Keuskupan, dan Holder Keuskupan.

- **Holder Keuskupan** selalu memiliki seluruh izin.
- **Pengurus Keuskupan** mengelola konten dan pengguna, tetapi tidak dapat mengubah matriks peran.
- **Uskup, Kardinal, dan Nunsius** memiliki akses baca.
- **Umat Awam** tidak memiliki akses panel.
- Matriks izin dapat diubah melalui **Admin → Peran**, dan diperiksa kembali di server pada setiap aksi.

## Modul Admin

Berita, agenda, paroki, klerus, liturgi, pengumuman, halaman statis, galeri, pesan masuk, pengguna, peran, pengaturan situs, akun, dan log aktivitas.

Media sosial yang dikelola: Instagram, TikTok, dan YouTube.

## Reset Basis Data

```bash
npm run db:reset
```

Perintah ini menghapus basis data beserta berkas WAL. Saat aplikasi dijalankan kembali, skema dan konten contoh akan dibuat ulang. Unggahan di `public/uploads` tidak dihapus.

## Deployment

Proyek ini memerlukan **Node.js 24** dan penyimpanan berkas yang persisten:

- Basis data SQLite ditulis ke `data/keuskupan.db`.
- Gambar unggahan disimpan di `public/uploads`.

Platform serverless tanpa disk persisten (misalnya Vercel) tidak cocok untuk data produksi karena basis data dan unggahan akan hilang setiap kali instance dibuat ulang. Gunakan VPS, Docker, atau platform dengan volume persisten, lalu:

```bash
npm ci
npm run build
npm start
```

Langkah pengamanan sebelum dipublikasikan:

1. Ganti seluruh akun demo dan kata sandinya melalui panel **Pengguna**.
2. Jalankan di belakang HTTPS agar cookie sesi dikirim dengan aman.
3. Cadangkan `data/keuskupan.db` dan `public/uploads` secara berkala — keduanya tidak disimpan di Git.
4. Atur `NODE_ENV=production`.

## Struktur Penting

```text
app/
  (site)/            Halaman publik
  admin/             Panel administrasi
  api/admin/upload/  Endpoint unggah gambar
components/
  site/              Header, footer, ikon, kartu, dsb.
  admin/             Form, tabel, navigasi panel
lib/
  db.ts              Koneksi & bootstrap SQLite
  seed.ts            Konten contoh
  auth.ts            Sesi & pemeriksaan izin
  actions/           Server Actions per modul
data/                Basis data lokal (tidak di-commit)
public/              Gambar, font, dan unggahan
scripts/             Utilitas basis data
```

## Kredit Aset

Sumber, pencipta, dan lisensi foto serta font tercantum di [CREDITS.md](CREDITS.md). Beberapa foto Wikimedia Commons berlisensi CC BY-SA sehingga atribusinya perlu ditampilkan jika situs dipublikasikan secara daring.
