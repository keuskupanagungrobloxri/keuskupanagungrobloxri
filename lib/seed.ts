import type { DatabaseSync } from "node:sqlite";
import { hashPassword } from "./password";
import {
  ALL_PERMISSIONS,
  DEFAULT_ROLE_PERMISSIONS,
  ROLES,
} from "./permissions";
import type { Role } from "./types";

const now = "2026-10-22T08:00:00+07:00";

function insertRows(
  db: DatabaseSync,
  table: string,
  rows: Record<string, string | number | null>[],
) {
  for (const row of rows) {
    const keys = Object.keys(row);
    const sql = `INSERT INTO ${table} (${keys.join(", ")}) VALUES (${keys
      .map(() => "?")
      .join(", ")})`;
    db.prepare(sql).run(...keys.map((key) => row[key] as string | number | null));
  }
}

const users = [
  {
    id: "usr_owner",
    name: "Andreas Hartono",
    email: "owner@keuskupanroblox.org",
    password: "Holder#2026",
    role: "owner" as Role,
    title: "Holder Keuskupan",
    bio: "Pemegang mandat tertinggi Keuskupan Agung ROBLOX untuk tata kelola situs dan pelayanan digital.",
    phone: "0812-3456-7890",
  },
  {
    id: "usr_pengurus",
    name: "Maria Theresia Lestari",
    email: "pengurus@keuskupanroblox.org",
    password: "Pengurus#2026",
    role: "pengurus" as Role,
    title: "Ketua Pengurus Keuskupan",
    bio: "Koordinator tim pengurus untuk komunikasi sosial, publikasi, dan administrasi pelayanan.",
    phone: "0812-3456-7891",
  },
  {
    id: "usr_kardinal",
    name: "Yohanes Kardinal Pratama",
    email: "kardinal@keuskupanroblox.org",
    password: "Kardinal#2026",
    role: "kardinal" as Role,
    title: "Kardinal Imam",
    bio: "Anggota Kolegium Kardinal yang mendampingi karya evangelisasi dan pengawasan pelayanan.",
    phone: null,
  },
  {
    id: "usr_nunsius",
    name: "Mgr. Benediktus Salvatori",
    email: "nunsius@keuskupanroblox.org",
    password: "Nunsius#2026",
    role: "nunsius" as Role,
    title: "Nunsius Apostolik",
    bio: "Perwakilan Takhta Suci untuk pengawasan apostolik dan relasi gerejawi.",
    phone: null,
  },
  {
    id: "usr_uskup",
    name: "Mgr. Rafael Yohanes Adiwinata",
    email: "uskup@keuskupanroblox.org",
    password: "Uskup#2026",
    role: "uskup" as Role,
    title: "Uskup Agung ROBLOX",
    bio: "Gembala Keuskupan Agung ROBLOX, pelayan persaudaraan dan misi Injil di tengah umat.",
    phone: null,
  },
  {
    id: "usr_imam",
    name: "RD. Ignatius Bramantyo",
    email: "imam@keuskupanroblox.org",
    password: "Imam#2026",
    role: "imam" as Role,
    title: "Vikaris Jenderal",
    bio: "Vikaris Jenderal dan Pastor Paroki Katedral Santa Maria Diangkat ke Surga.",
    phone: "0812-3456-7892",
  },
  {
    id: "usr_diakon",
    name: "Dn. Stefanus Arya",
    email: "diakon@keuskupanroblox.org",
    password: "Diakon#2026",
    role: "diakon" as Role,
    title: "Diakon Katedral",
    bio: "Diakon yang mendampingi pelayanan liturgi dan karya diakonia Katedral.",
    phone: null,
  },
  {
    id: "usr_frater",
    name: "Fr. Gabriel Aditya",
    email: "frater@keuskupanroblox.org",
    password: "Frater#2026",
    role: "frater" as Role,
    title: "Frater Seminari Tinggi",
    bio: "Frater yang membantu karya komunikasi sosial dan dokumentasi pastoral.",
    phone: null,
  },
  {
    id: "usr_umat",
    name: "Clara Ayu",
    email: "umat@keuskupanroblox.org",
    password: "Umat#2026",
    role: "umat" as Role,
    title: "Umat Awam",
    bio: "Anggota umat Paroki Santo Petrus.",
    phone: null,
  },
];

const settings: Record<string, string> = {
  seed_version: "1",
  site_name: "Keuskupan Agung ROBLOX",
  site_short: "KAR",
  site_latin: "Archidioecesis Robloxiana",
  tagline: "Ut Unum Sint · Agar mereka semua menjadi satu",
  meta_description:
    "Situs resmi Keuskupan Agung ROBLOX: berita, jadwal misa, profil gembala, direktori paroki, agenda pastoral, dan pelayanan umat.",
  hero_eyebrow: "Keuskupan Agung ROBLOX",
  hero_title:
    "Menjadi Gereja yang hidup, berjalan bersama, dan berbuah dalam kasih.",
  hero_description:
    "Di tengah dunia yang terus berubah, kita dipanggil untuk menghadirkan wajah Kristus melalui persaudaraan, pelayanan, dan kesaksian iman yang berakar pada Injil.",
  hero_image: "/images/hero-church.jpg",
  hero_stat_label: "Bersama Membangun Gereja",
  motto_latin: "Ut Unum Sint",
  motto_id: "Agar mereka semua menjadi satu",
  motto_reference: "Yohanes 17:21",
  welcome_title: "Sapaan Gembala",
  welcome_lead:
    "Rahmat dan damai Kristus menyertai Anda sekalian.",
  welcome_message:
    "Saudara-saudari yang terkasih, dengan sukacita saya menyambut Anda di rumah digital Keuskupan Agung ROBLOX. Situs ini adalah ruang untuk saling mengenal, bertumbuh dalam iman, dan menemukan pelayanan yang mempersatukan kita sebagai satu keluarga Allah.\n\nDi era yang serba cepat ini, kita diajak untuk tidak kehilangan arah. Injil mengingatkan kita bahwa persekutuan sejati lahir dari hati yang mau mendengarkan, tangan yang siap melayani, dan kaki yang berani berjalan bersama mereka yang kecil dan terpinggirkan.\n\nMarilah kita menjadikan setiap ruang hidup kita sebagai tempat kehadiran Kristus. Terima kasih atas doa, dukungan, dan keterlibatan Anda dalam karya pastoral keuskupan. Semoga Bunda Maria, Bunda Gereja, senantiasa menuntun langkah kita.",
  bishop_name: "Mgr. Rafael Yohanes Adiwinata",
  bishop_title: "Uskup Agung ROBLOX",
  stat_parishes: "8",
  stat_priests: "24",
  stat_faithful: "7.480",
  stat_works: "18",
  stat_parishes_label: "Paroki",
  stat_priests_label: "Klerus",
  stat_faithful_label: "Umat",
  stat_works_label: "Karya Pastoral",
  address: "Jl. Lumen Christi No. 7, Kawasan Katedral",
  city: "Kota Vianney",
  province: "Daerah Khusus Roblox",
  postal_code: "10110",
  phone: "(021) 555-0147",
  whatsapp: "0812-3456-7890",
  email: "sekretariat@keuskupanroblox.org",
  office_hours: "Senin–Jumat, 08.00–16.00 WIB",
  instagram: "https://instagram.com/keuskupanroblox",
  tiktok: "https://tiktok.com/@keuskupanroblox",
  youtube: "https://youtube.com/@keuskupanroblox",
  footer_text:
    "Keuskupan Agung ROBLOX adalah komunitas iman Katolik yang berakar dalam tradisi Gereja universal dan hidup dalam semangat persaudaraan, pelayanan, serta misi di dunia digital.",
  mass_notes:
    "Jadwal dapat berubah pada hari raya dan masa liturgi khusus. Mohon periksa pengumuman terbaru atau hubungi sekretariat paroki.",
  donation_title: "Bersama Menghidupi Karya Pelayanan",
  donation_description:
    "Dukungan Anda membantu karya pastoral, pendidikan iman, pendampingan keluarga, dan pelayanan kasih bagi mereka yang membutuhkan.",
  bank_name: "Bank Pelayanan Nusantara",
  bank_account: "123-456-7890",
  bank_holder: "Keuskupan Agung ROBLOX",
  liturgy_verse:
    "Sebab di mana dua atau tiga orang berkumpul dalam nama-Ku, di situ Aku ada di tengah-tengah mereka.",
  liturgy_verse_ref: "Matius 18:20",
  campaign_label: "Pekan Kitab Suci Nasional 2026",
  campaign_title: "Firman-Mu adalah pelita bagi kakiku.",
  campaign_text:
    "Mari menghidupkan Sabda dalam keluarga, lingkungan, dan komunitas karya. Unduh bahan pendalaman iman dan ikuti rangkaian kegiatan keuskupan.",
  campaign_link: "/berita/pekan-kitab-suci-nasional-membaca-firman-di-rumah-dan-lingkungan",
  campaign_image: "/images/bible.jpg",
  newsletter_title: "Tetap terhubung dengan hidup keuskupan",
  newsletter_text:
    "Terima kasih telah menjadi bagian dari keluarga Keuskupan Agung ROBLOX. Sampaikan pesan, doa, atau kebutuhan pelayanan Anda kepada kami.",
};

export function seedDatabase(db: DatabaseSync) {
  const existing = db
    .prepare("SELECT value FROM settings WHERE key = 'seed_version'")
    .get() as { value?: string } | undefined;
  if (existing?.value === "1") return;

  db.exec("BEGIN");
  try {
    db.exec(`
      DELETE FROM role_permissions;
      DELETE FROM sessions;
      DELETE FROM activity_logs;
      DELETE FROM messages;
      DELETE FROM galleries;
      DELETE FROM pages;
      DELETE FROM announcements;
      DELETE FROM masses;
      DELETE FROM clergy;
      DELETE FROM parishes;
      DELETE FROM events;
      DELETE FROM articles;
      DELETE FROM users;
      DELETE FROM settings;
    `);

    insertRows(
      db,
      "users",
      users.map((user) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        password_hash: hashPassword(user.password),
        role: user.role,
        title: user.title,
        bio: user.bio,
        avatar: null,
        phone: user.phone,
        active: 1,
        created_at: now,
        last_login: null,
      })),
    );

    const permissionRows = ROLES.flatMap((role) =>
      (role === "owner" ? ALL_PERMISSIONS : DEFAULT_ROLE_PERMISSIONS[role]).map(
        (permission) => ({ role, permission }),
      ),
    );
    insertRows(db, "role_permissions", permissionRows);
    insertRows(
      db,
      "settings",
      Object.entries(settings).map(([key, value]) => ({ key, value })),
    );

    insertRows(db, "articles", [
      {
        id: "art_01",
        title: "Uskup Agung: Jadilah Gereja yang Keluar dan Merangkul",
        slug: "uskup-agung-jadilah-gereja-yang-keluar-dan-merangkul",
        excerpt:
          "Dalam homili Misa Minggu Biasa XXIX, Mgr. Rafael mengajak umat keluar dari zona nyaman dan menjumpai mereka yang terlupakan.",
        content:
          "## Gereja yang tidak tinggal diam\n\nKota Vianney — Dalam perayaan Ekaristi Minggu Biasa XXIX di Katedral Santa Maria Diangkat ke Surga, Uskup Agung ROBLOX, Mgr. Rafael Yohanes Adiwinata, mengajak seluruh umat untuk menjadi Gereja yang berani keluar dan merangkul.\n\n\"Gereja tidak pernah menjadi besar karena temboknya, tetapi karena kasihnya. Kita dipanggil untuk keluar dari zona nyaman dan menjumpai mereka yang terlupakan,\" tegas Uskup Agung dalam homilinya, Minggu (18/10).\n\n## Tiga langkah konkret\n\nDalam homili tersebut, Bapa Uskup menawarkan tiga langkah sederhana untuk menghidupi panggilan ini: mendengarkan dengan hati, melayani tanpa memilih, dan berjalan bersama mereka yang rapuh.\n\nIa juga mengingatkan bahwa pelayanan bukanlah proyek sesaat, melainkan gaya hidup yang lahir dari perjumpaan dengan Kristus dalam Ekaristi.\n\n> Injil tidak meminta kita menjadi sempurna terlebih dahulu. Injil meminta kita berani melangkah, lalu bertumbuh bersama.\n\n## Undangan bagi seluruh umat\n\nPerayaan dihadiri sekitar 900 umat dari berbagai paroki. Setelah Misa, umat diajak mengikuti ramah tamah dan penyerahan simbolis bahan pendalaman iman bagi lingkungan-lingkungan.\n\nUskup Agung menutup homilinya dengan mengajak umat mendoakan panggilan imam, hidup bakti, dan pelayanan awam di keuskupan. \"Kita semua adalah misionaris. Pertanyaannya bukan apakah kita dipanggil, tetapi apakah kita mau menjawab,\" pungkasnya.",
        category: "Warta Keuskupan",
        cover_image: "/images/mass-congregation.jpg",
        author_id: "usr_pengurus",
        status: "published",
        featured: 1,
        published_at: "2026-10-21T09:30:00+07:00",
        created_at: "2026-10-21T08:00:00+07:00",
        updated_at: "2026-10-21T09:30:00+07:00",
        views: 428,
      },
      {
        id: "art_02",
        title: "Misa Krisma 2026: 184 Umat Menerima Sakramen Penguatan",
        slug: "misa-krisma-2026-184-umat-menerima-sakramen-penguatan",
        excerpt:
          "Dengan penuh sukacita, 184 krismawan dari delapan paroki menerima Sakramen Penguatan dalam Misa Krisma di Katedral.",
        content:
          "## Sakramen yang menguatkan\n\nKatedral Santa Maria Diangkat ke Surga dipenuhi sukacita pada Sabtu (17/10) ketika 184 umat dari delapan paroki menerima Sakramen Penguatan. Perayaan dipimpin oleh Uskup Agung ROBLOX dan didampingi para imam keuskupan.\n\nDalam homilinya, Bapa Uskup mengingatkan bahwa Roh Kudus tidak menjadikan kita pasif, tetapi menggerakkan kita untuk berani bersaksi di tengah keluarga, sekolah, dan dunia kerja.\n\n## Buah-buah Roh\n\n\"Jangan takut menjadi berbeda karena iman. Justru di situlah terang Kristus terlihat,\" pesannya kepada para krismawan.\n\nPerayaan berlangsung khidmat dengan iringan paduan suara gabungan paroki. Seusai Misa, para krismawan menerima kaos dan buku pendampingan sebagai bekal untuk terus bertumbuh dalam iman.\n\nPara katekis mendampingi calon krismawan selama enam bulan melalui pertemuan rutin, retret, dan aksi pelayanan sederhana di lingkungan masing-masing.",
        category: "Liturgi",
        cover_image: "/images/liturgy-communion.jpg",
        author_id: "usr_uskup",
        status: "published",
        featured: 1,
        published_at: "2026-10-19T14:00:00+07:00",
        created_at: "2026-10-19T11:00:00+07:00",
        updated_at: "2026-10-19T14:00:00+07:00",
        views: 311,
      },
      {
        id: "art_03",
        title: "Temu Raya Misdinar Kembali Digelar, 320 Muda-Mudi Berkumpul",
        slug: "temu-raya-misdinar-kembali-digelar-320-muda-mudi-berkumpul",
        excerpt:
          "Bertema 'Melayani di Altar, Menjadi Saksi di Dunia', temu raya misdinar menghadirkan permainan, katekese, dan Misa bersama.",
        content:
          "## Melayani dengan sukacita\n\nSebanyak 320 misdinar dari delapan paroki berkumpul di Aula Karya Pastoral Keuskupan pada Sabtu (17/10). Temu raya tahunan ini menjadi kesempatan untuk berjumpa, belajar, dan merayakan panggilan pelayanan di sekitar altar.\n\nKegiatan diawali dengan katekese interaktif tentang makna pelayanan liturgi, dilanjutkan dengan permainan kerja sama dan lokakarya tata perayaan.\n\n## Bukan sekadar bertugas\n\nKetua Komisi Liturgi Keuskupan menegaskan bahwa menjadi misdinar bukan hanya soal jadwal bertugas, tetapi soal belajar setia dan berdisiplin dalam hal-hal kecil.\n\n\"Di altar, kita belajar bahwa pelayanan yang indah lahir dari hati yang rendah hati,\" ujarnya.\n\nTemu raya ditutup dengan Misa bersama di Katedral dan penyerahan piagam penghargaan bagi misdinar yang telah setia melayani lebih dari lima tahun.",
        category: "Karya Pastoral",
        cover_image: "/images/mass-servers.jpg",
        author_id: "usr_diakon",
        status: "published",
        featured: 0,
        published_at: "2026-10-17T16:30:00+07:00",
        created_at: "2026-10-17T12:00:00+07:00",
        updated_at: "2026-10-17T16:30:00+07:00",
        views: 207,
      },
      {
        id: "art_04",
        title: "Pekan Kitab Suci Nasional: Membaca Firman di Rumah dan Lingkungan",
        slug: "pekan-kitab-suci-nasional-membaca-firman-di-rumah-dan-lingkungan",
        excerpt:
          "Keuskupan Agung ROBLOX merilis bahan pendalaman iman untuk keluarga, OMK, dan anak-anak menyambut Pekan Kitab Suci Nasional.",
        content:
          "## Firman yang hidup\n\nMenjelang Pekan Kitab Suci Nasional 2026, Komisi Kitab Suci Keuskupan Agung ROBLOX merilis bahan pendalaman iman untuk berbagai kelompok usia. Bahan ini dapat digunakan di rumah, lingkungan, sekolah minggu, dan komunitas orang muda.\n\nTema tahun ini, \"Firman-Mu adalah pelita bagi kakiku\", mengajak umat untuk membaca Kitab Suci bukan sebagai kewajiban, tetapi sebagai perjumpaan yang menuntun hidup sehari-hari.\n\n## Tiga kebiasaan sederhana\n\nKomisi mengajak setiap keluarga membangun tiga kebiasaan: membaca satu perikop setiap hari, berbagi pengalaman setelah membacanya, dan mendoakan satu niat bersama.\n\nBahan dapat diunduh di ruang dokumen situs keuskupan. Paroki juga akan mengadakan ibadat pembukaan dan pendalaman bersama pada minggu pertama November.\n\n> Sabda Allah tidak jauh dari kita. Ia dekat, hadir dalam percakapan keluarga dan dalam keputusan-keputusan kecil yang kita ambil setiap hari.",
        category: "Pendidikan Iman",
        cover_image: "/images/bible.jpg",
        author_id: "usr_imam",
        status: "published",
        featured: 0,
        published_at: "2026-10-14T10:00:00+07:00",
        created_at: "2026-10-14T09:00:00+07:00",
        updated_at: "2026-10-14T10:00:00+07:00",
        views: 188,
      },
      {
        id: "art_05",
        title: "Aksi Peduli Sesama: 500 Paket Sembako untuk Keluarga Prasejahtera",
        slug: "aksi-peduli-sesama-500-paket-sembako",
        excerpt:
          "Kolaborasi Karina Keuskupan dan relawan paroki menyalurkan bantuan bagi keluarga prasejahtera di tiga kecamatan.",
        content:
          "## Belas kasih yang nyata\n\nKomisi Karya Sosial Keuskupan bersama relawan dari berbagai paroki menyalurkan 500 paket sembako kepada keluarga prasejahtera di Kota Vianney, Kota Maranatha, dan Distrik Assisi pada akhir pekan lalu.\n\nBantuan ini merupakan buah dari gerakan solidaritas umat selama bulan September. Selain sembako, panitia menyalurkan bantuan pendidikan bagi 60 anak.\n\n## Bukan hanya bantuan\n\n\"Kami ingin bantuan ini menjadi pintu untuk saling mengenal. Setiap paket diantar oleh relawan yang juga berdoa bersama keluarga penerima,\" ujar koordinator aksi.\n\nSalah satu penerima, Ibu Sinta, mengungkapkan rasa syukurnya. Ia berharap kegiatan seperti ini terus berlanjut dan melibatkan lebih banyak orang muda.\n\nKomisi Karya Sosial mengajak umat untuk terlibat dalam pendampingan jangka panjang, bukan hanya bantuan sesaat. Data relawan dapat disampaikan melalui sekretariat paroki.",
        category: "Karya Sosial",
        cover_image: "/images/community.jpg",
        author_id: "usr_pengurus",
        status: "published",
        featured: 0,
        published_at: "2026-10-11T15:00:00+07:00",
        created_at: "2026-10-11T13:00:00+07:00",
        updated_at: "2026-10-11T15:00:00+07:00",
        views: 342,
      },
      {
        id: "art_06",
        title: "Retret Panggilan: Frater dan Seminaris Belajar Mendengarkan Hati",
        slug: "retret-panggilan-frater-dan-seminaris",
        excerpt:
          "Selama tiga hari, para frater dan seminaris mengikuti retret panggilan di Griya Lumen Christi dengan tema 'Tinggal dalam Kristus'.",
        content:
          "## Ruang untuk mendengar\n\nDi tengah kesibukan studi dan pelayanan, para frater dan seminaris Keuskupan Agung ROBLOX mengikuti retret panggilan di Griya Lumen Christi pada 9–11 Oktober. Retret dipandu oleh seorang pembimbing rohani dari luar keuskupan.\n\nTema \"Tinggal dalam Kristus\" menjadi ajakan untuk kembali ke akar panggilan: persahabatan dengan Yesus yang tumbuh melalui doa dan kesetiaan.\n\n## Dimensi persaudaraan\n\nSelain sesi refleksi dan adorasi, para peserta melakukan kerja bakti bersama, sharing panggilan, dan rekreasi di alam terbuka. Momen ini menjadi sarana untuk saling mengenal dan saling menguatkan sebagai saudara seperjalanan.\n\n\"Panggilan bukan proyek pribadi. Panggilan selalu lahir dan bertumbuh di dalam komunitas,\" ujar pembimbing retret.\n\nRetret ditutup dengan perayaan Ekaristi dan doa penyerahan diri kepada Bunda Maria.",
        category: "Panggilan",
        cover_image: "/images/prayer.jpg",
        author_id: "usr_frater",
        status: "published",
        featured: 0,
        published_at: "2026-10-08T09:00:00+07:00",
        created_at: "2026-10-08T08:00:00+07:00",
        updated_at: "2026-10-08T09:00:00+07:00",
        views: 156,
      },
      {
        id: "art_07",
        title: "Sekolah Minggu Kreatif: Anak-Anak Belajar Melalui Cerita Injil",
        slug: "sekolah-minggu-kreatif-anak-belajar-cerita-injil",
        excerpt:
          "Komisi Anak menghadirkan metode belajar yang menyenangkan melalui drama, mewarnai, dan lagu untuk anak-anak paroki.",
        content:
          "## Iman yang bertumbuh sejak kecil\n\nKomisi Anak Keuskupan Agung ROBLOX menggelar pelatihan bagi 45 guru sekolah minggu dari delapan paroki. Pelatihan berfokus pada cara menyampaikan cerita Injil secara kreatif dan ramah anak.\n\nPeserta belajar menggunakan drama, boneka tangan, musik, dan permainan untuk membantu anak memahami pesan kasih Allah.\n\n## Anak sebagai bagian Gereja\n\n\"Anak-anak bukan hanya penerima, tetapi juga anggota Gereja yang aktif. Kita perlu mendengarkan mereka,\" kata koordinator Komisi Anak.\n\nPelatihan menghasilkan modul sederhana yang akan digunakan pada semester berikutnya. Setiap paroki juga didorong membentuk tim pendamping anak yang melibatkan orang tua.",
        category: "Pendidikan Iman",
        cover_image: "/images/notebooks.jpg",
        author_id: "usr_frater",
        status: "published",
        featured: 0,
        published_at: "2026-10-04T11:00:00+07:00",
        created_at: "2026-10-04T10:00:00+07:00",
        updated_at: "2026-10-04T11:00:00+07:00",
        views: 121,
      },
      {
        id: "art_08",
        title: "Konser Doa Orang Muda Katolik: Merayakan Iman dengan Kreativitas",
        slug: "konser-doa-orang-muda-katolik",
        excerpt:
          "OMK dari berbagai paroki memadukan musik, doa, dan kesaksian dalam konser doa bertema 'Berakar dalam Kristus'.",
        content:
          "## Iman yang bernyanyi\n\nAula Katedral dipenuhi sekitar 600 orang muda pada Sabtu (26/9) dalam konser doa Orang Muda Katolik (OMK) Keuskupan Agung ROBLOX. Acara mengangkat tema \"Berakar dalam Kristus\".\n\nBerbagai komunitas musik paroki tampil membawakan lagu-lagu rohani, diiringi refleksi singkat dan kesaksian dari orang muda yang terlibat dalam pelayanan sosial.\n\n## Ruang bagi orang muda\n\nKetua Komisi OMK berharap konser doa menjadi titik awal bagi keterlibatan orang muda dalam kehidupan paroki. \"Kami tidak ingin orang muda hanya datang, tetapi terlibat dan menjadi penggerak,\" ujarnya.\n\nAcara ditutup dengan adorasi dan doa bersama untuk panggilan Gereja.",
        category: "Orang Muda",
        cover_image: "/images/worship.jpg",
        author_id: "usr_diakon",
        status: "published",
        featured: 0,
        published_at: "2026-09-28T20:00:00+07:00",
        created_at: "2026-09-28T18:00:00+07:00",
        updated_at: "2026-09-28T20:00:00+07:00",
        views: 276,
      },
      {
        id: "art_09",
        title: "Menjadi Murid yang Berbelarasa di Ruang Digital",
        slug: "menjadi-murid-yang-berbelarasa-di-ruang-digital",
        excerpt:
          "Renungan mingguan: bagaimana iman Katolik memandu cara kita hadir, berbicara, dan mendengarkan di dunia digital.",
        content:
          "## Ruang digital sebagai ladang misi\n\nDunia digital sering disebut sebagai ruang tanpa batas. Namun di balik layar, ada manusia nyata dengan luka, harapan, dan kerinduan untuk didengar. Di sinilah kita dipanggil menjadi murid yang berbelarasa.\n\nMenjadi murid bukan berarti selalu memiliki jawaban. Kadang, menjadi murid berarti berani diam, mendengarkan, dan memberi ruang bagi orang lain untuk bercerita.\n\n## Tiga disiplin kecil\n\nPertama, periksa hati sebelum mengetik. Kedua, pilih kata yang membangun, bukan melukai. Ketiga, sisihkan waktu untuk berjumpa secara nyata, bukan hanya melalui layar.\n\n> Kata-kata kita dapat menjadi jendela yang membiarkan terang masuk, atau dinding yang mengurung orang dalam kesepian.\n\nSemoga setiap unggahan, komentar, dan pesan yang kita kirim menjadi tanda kasih Kristus yang hidup.",
        category: "Renungan",
        cover_image: "/images/sunset.jpg",
        author_id: "usr_uskup",
        status: "published",
        featured: 0,
        published_at: "2026-09-25T06:00:00+07:00",
        created_at: "2026-09-24T20:00:00+07:00",
        updated_at: "2026-09-25T06:00:00+07:00",
        views: 194,
      },
    ]);

    insertRows(db, "events", [
      {
        id: "evt_01",
        title: "Misa Peringatan 100 Tahun Karya Misi",
        slug: "misa-peringatan-100-tahun-karya-misi",
        description:
          "Perayaan Ekaristi syukur atas seabad karya misi di tanah ROBLOX, dilanjutkan dengan ramah tamah dan pameran dokumentasi sejarah.",
        location: "Katedral Santa Maria Diangkat ke Surga",
        start_at: "2026-10-25T09:00:00+07:00",
        end_at: "2026-10-25T11:30:00+07:00",
        category: "Liturgi",
        image: "/images/cathedral-altar.jpg",
        status: "upcoming",
        created_at: now,
        updated_at: now,
      },
      {
        id: "evt_02",
        title: "Bulan Rosario Keluarga",
        slug: "bulan-rosario-keluarga",
        description:
          "Doa rosario bersama keluarga-keluarga keuskupan di halaman Katedral. Membawa lilin dan rosario pribadi.",
        location: "Halaman Katedral",
        start_at: "2026-10-27T19:00:00+07:00",
        end_at: "2026-10-27T20:30:00+07:00",
        category: "Devosi",
        image: "/images/candles.jpg",
        status: "upcoming",
        created_at: now,
        updated_at: now,
      },
      {
        id: "evt_03",
        title: "Temu Pastoral Kevikepan Vianney",
        slug: "temu-pastoral-kevikepan-vianney",
        description:
          "Pertemuan para pengurus paroki dan komisi kevikepan untuk evaluasi pelayanan dan perencanaan tahun 2027.",
        location: "Aula Karya Pastoral",
        start_at: "2026-11-07T08:00:00+07:00",
        end_at: "2026-11-07T15:00:00+07:00",
        category: "Pastoral",
        image: "/images/notebooks.jpg",
        status: "upcoming",
        created_at: now,
        updated_at: now,
      },
      {
        id: "evt_04",
        title: "Retreat OMK: Berakar dalam Kristus",
        slug: "retreat-omk-berakar-dalam-kristus",
        description:
          "Retreat akhir pekan bagi orang muda katolik dengan sesi refleksi, adorasi, dan aksi pelayanan sosial.",
        location: "Griya Lumen Christi",
        start_at: "2026-11-14T08:00:00+07:00",
        end_at: "2026-11-15T15:00:00+07:00",
        category: "Orang Muda",
        image: "/images/prayer.jpg",
        status: "upcoming",
        created_at: now,
        updated_at: now,
      },
      {
        id: "evt_05",
        title: "Pekan Orang Muda Katolik 2026",
        slug: "pekan-orang-muda-katolik-2026",
        description:
          "Rangkaian lomba, lokakarya kreatif, dan Misa kaum muda yang melibatkan komunitas OMK dari seluruh paroki.",
        location: "Kompleks Karya Pastoral",
        start_at: "2026-11-21T07:30:00+07:00",
        end_at: "2026-11-22T20:00:00+07:00",
        category: "Orang Muda",
        image: "/images/community.jpg",
        status: "upcoming",
        created_at: now,
        updated_at: now,
      },
      {
        id: "evt_06",
        title: "Misa Malam Natal",
        slug: "misa-malam-natal",
        description:
          "Perayaan Ekaristi Malam Natal di Katedral. Umat diimbau hadir lebih awal dan menggunakan pakaian sopan.",
        location: "Katedral Santa Maria Diangkat ke Surga",
        start_at: "2026-12-24T20:00:00+07:00",
        end_at: "2026-12-24T22:00:00+07:00",
        category: "Liturgi",
        image: "/images/hero-church.jpg",
        status: "upcoming",
        created_at: now,
        updated_at: now,
      },
    ]);

    const parishSeed = [
      {
        id: "par_01",
        name: "Paroki Katedral Santa Maria Diangkat ke Surga",
        slug: "katedral-santa-maria",
        patron: "Santa Maria Diangkat ke Surga",
        vicariate: "Kevikepan Vianney",
        address: "Jl. Lumen Christi No. 7",
        city: "Kota Vianney",
        phone: "(021) 555-0147",
        email: "katedral@keuskupanroblox.org",
        pastor_name: "RD. Ignatius Bramantyo",
        image: "/images/parish-01.jpg",
        description:
          "Gereja induk keuskupan dan pusat kehidupan liturgi, pelayanan, serta kesaksian iman umat Keuskupan Agung ROBLOX.",
        mass_note:
          "Misa Minggu tersedia dalam tiga sesi. Pelayanan sakramen tobat setiap Sabtu pukul 15.30.",
        order_index: 1,
      },
      {
        id: "par_02",
        name: "Paroki Santo Petrus",
        slug: "santo-petrus",
        patron: "Santo Petrus",
        vicariate: "Kevikepan Vianney",
        address: "Jl. Batu Karang No. 12",
        city: "Kota Vianney",
        phone: "(021) 555-0211",
        email: "stpetrus@keuskupanroblox.org",
        pastor_name: "RD. Andreas Wicaksono",
        image: "/images/parish-02.jpg",
        description:
          "Komunitas umat yang bertumbuh dalam semangat kesetiaan dan keberanian bersaksi, dengan pelayanan aktif bagi keluarga muda.",
        mass_note: "Misa harian Senin–Jumat pukul 06.00. Adorasi setiap Kamis pertama.",
        order_index: 2,
      },
      {
        id: "par_03",
        name: "Paroki Santo Paulus",
        slug: "santo-paulus",
        patron: "Santo Paulus",
        vicariate: "Kevikepan Maranatha",
        address: "Jl. Misi Agung No. 3",
        city: "Kota Maranatha",
        phone: "(021) 555-0325",
        email: "stpaulus@keuskupanroblox.org",
        pastor_name: "RD. Yohanes Krisna",
        image: "/images/parish-03.jpg",
        description:
          "Paroki dengan karya katekese dan pendampingan orang muda yang hidup, terbuka bagi mahasiswa dan pekerja muda.",
        mass_note: "Misa kaum muda setiap Minggu pukul 17.00. Persekutuan doa Rabu pukul 19.00.",
        order_index: 3,
      },
      {
        id: "par_04",
        name: "Paroki Santo Yusuf",
        slug: "santo-yusuf",
        patron: "Santo Yusuf",
        vicariate: "Kevikepan Maranatha",
        address: "Jl. Pekerja No. 8",
        city: "Distrik Nazareth",
        phone: "(021) 555-0408",
        email: "styusuf@keuskupanroblox.org",
        pastor_name: "RD. Yusuf Mahendra",
        image: "/images/parish-04.jpg",
        description:
          "Komunitas yang menghidupi semangat kerja, kesetiaan keluarga, dan pelayanan senyap bagi sesama.",
        mass_note: "Misa pagi pukul 05.30. Pendampingan keluarga setiap Sabtu pukul 10.00.",
        order_index: 4,
      },
      {
        id: "par_05",
        name: "Paroki Santa Theresia",
        slug: "santa-theresia",
        patron: "Santa Theresia dari Kanak-Kanak Yesus",
        vicariate: "Kevikepan Laudato Si'",
        address: "Jl. Mawar Kecil No. 5",
        city: "Kota Betania",
        phone: "(021) 555-0515",
        email: "sttheresia@keuskupanroblox.org",
        pastor_name: "RD. Fransiskus Xaverius Dwi",
        image: "/images/parish-05.jpg",
        description:
          "Paroki yang menekankan kesederhanaan, doa kecil yang setia, dan perhatian kepada anak-anak serta lansia.",
        mass_note: "Misa Minggu pukul 07.00 dan 17.00. Bina iman anak setiap Minggu pukul 08.30.",
        order_index: 5,
      },
      {
        id: "par_06",
        name: "Paroki Santo Fransiskus Asisi",
        slug: "santo-fransiskus-asisi",
        patron: "Santo Fransiskus Asisi",
        vicariate: "Kevikepan Laudato Si'",
        address: "Jl. Saudara Matahari No. 21",
        city: "Distrik Assisi",
        phone: "(021) 555-0621",
        email: "stfransiskus@keuskupanroblox.org",
        pastor_name: "RD. Paulus Bagaskara",
        image: "/images/parish-06.jpg",
        description:
          "Paroki ekologis yang aktif merawat ciptaan, melayani kaum miskin, dan membangun solidaritas antarumat.",
        mass_note: "Misa Minggu pukul 08.00. Kerja bakti lingkungan setiap Sabtu ketiga.",
        order_index: 6,
      },
      {
        id: "par_07",
        name: "Paroki Santo Ignatius Loyola",
        slug: "santo-ignatius-loyola",
        patron: "Santo Ignatius Loyola",
        vicariate: "Kevikepan Vianney",
        address: "Jl. Kampus Utama No. 1",
        city: "Kota Vianney",
        phone: "(021) 555-0733",
        email: "stignatius@keuskupanroblox.org",
        pastor_name: "RD. Mikael Septian",
        image: "/images/parish-07.jpg",
        description:
          "Paroki yang mendampingi mahasiswa dan kaum intelektual untuk menemukan Allah dalam segala hal.",
        mass_note: "Misa kampus Selasa dan Kamis pukul 12.10. Konsultasi rohani dengan perjanjian.",
        order_index: 7,
      },
      {
        id: "par_08",
        name: "Paroki Santa Maria Fatima",
        slug: "santa-maria-fatima",
        patron: "Santa Maria Fatima",
        vicariate: "Kevikepan Maranatha",
        address: "Jl. Ziarah No. 9",
        city: "Kota Fatima",
        phone: "(021) 555-0840",
        email: "stfatima@keuskupanroblox.org",
        pastor_name: "RD. Benediktus Arya",
        image: "/images/parish-08.jpg",
        description:
          "Paroki ziarah yang menjadi tempat banyak umat menemukan ketenangan, pertobatan, dan pengharapan.",
        mass_note: "Misa Minggu pukul 06.30 dan 16.30. Doa rosario bersama setiap tanggal 13.",
        order_index: 8,
      },
    ];

    insertRows(
      db,
      "parishes",
      parishSeed.map((parish) => ({
        ...parish,
        status: "active",
        created_at: now,
        updated_at: now,
      })),
    );

    const masses: Record<string, string | number | null>[] = [];
    const dailyTimes = ["05.30", "06.00"];
    parishSeed.forEach((parish, index) => {
      const sundayBase = index === 0 ? ["06.00", "08.30", "17.00"] : ["07.00", "17.00"];
      masses.push({
        id: `mas_${String(index + 1).padStart(2, "0")}_1`,
        parish_id: parish.id,
        day: "Minggu",
        time: sundayBase[0],
        type: "Misa Minggu",
        location: "Gereja Utama",
        note: null,
        status: "active",
        order_index: 1,
      });
      masses.push({
        id: `mas_${String(index + 1).padStart(2, "0")}_2`,
        parish_id: parish.id,
        day: "Minggu",
        time: sundayBase[1],
        type: "Misa Minggu",
        location: "Gereja Utama",
        note: null,
        status: "active",
        order_index: 2,
      });
      if (index === 0) {
        masses.push({
          id: "mas_01_sore",
          parish_id: parish.id,
          day: "Minggu",
          time: "17.00",
          type: "Misa Minggu",
          location: "Gereja Utama",
          note: "Misa sore",
          status: "active",
          order_index: 3,
        });
      }
      masses.push({
        id: `mas_${String(index + 1).padStart(2, "0")}_3`,
        parish_id: parish.id,
        day: "Sabtu",
        time: "17.00",
        type: "Misa Antisipasi",
        location: "Gereja Utama",
        note: null,
        status: "active",
        order_index: 4,
      });
      masses.push({
        id: `mas_${String(index + 1).padStart(2, "0")}_4`,
        parish_id: parish.id,
        day: "Senin–Jumat",
        time: dailyTimes[index % 2],
        type: "Misa Harian",
        location: "Kapel Harian",
        note: null,
        status: "active",
        order_index: 5,
      });
      if (index === 0 || index === 3) {
        masses.push({
          id: `mas_${String(index + 1).padStart(2, "0")}_5`,
          parish_id: parish.id,
          day: "Jumat Pertama",
          time: "19.00",
          type: "Misa & Adorasi",
          location: "Gereja Utama",
          note: "Diiringi doa rosario",
          status: "active",
          order_index: 6,
        });
      }
    });
    insertRows(db, "masses", masses);

    insertRows(db, "clergy", [
      {
        id: "clr_01",
        name: "Mgr. Rafael Yohanes Adiwinata",
        slug: "rafael-yohanes-adiwinata",
        title: "Uskup Agung ROBLOX",
        rank: "Uskup Agung",
        assignment: "Keuskupan Agung ROBLOX",
        bio: "Ditahbiskan sebagai Uskup Agung ROBLOX pada 2021. Menggembalakan keuskupan dengan penekanan pada persaudaraan, dialog, dan pelayanan kepada kaum muda.",
        image: null,
        email: "uskup@keuskupanroblox.org",
        status: "active",
        order_index: 1,
      },
      {
        id: "clr_02",
        name: "Yohanes Kardinal Pratama",
        slug: "yohanes-kardinal-pratama",
        title: "Kardinal Imam",
        rank: "Kardinal",
        assignment: "Dikasteri untuk Evangelisasi",
        bio: "Kardinal asal Keuskupan Agung ROBLOX yang mendampingi karya evangelisasi dan komunikasi iman di tingkat universal.",
        image: null,
        email: null,
        status: "active",
        order_index: 2,
      },
      {
        id: "clr_03",
        name: "Mgr. Benediktus Salvatori",
        slug: "benediktus-salvatori",
        title: "Nunsius Apostolik",
        rank: "Nunsius",
        assignment: "Perwakilan Takhta Suci",
        bio: "Menjalankan tugas perwakilan apostolik dan menjadi jembatan komunikasi antara Keuskupan Agung ROBLOX dan Takhta Suci.",
        image: null,
        email: null,
        status: "active",
        order_index: 3,
      },
      {
        id: "clr_04",
        name: "RD. Ignatius Bramantyo",
        slug: "ignatius-bramantyo",
        title: "Vikaris Jenderal",
        rank: "Imam",
        assignment: "Katedral Santa Maria Diangkat ke Surga",
        bio: "Vikaris Jenderal yang mengoordinasikan pelayanan pastoral harian dan administrasi keuskupan.",
        image: null,
        email: "imam@keuskupanroblox.org",
        status: "active",
        order_index: 4,
      },
      {
        id: "clr_05",
        name: "RD. Andreas Wicaksono",
        slug: "andreas-wicaksono",
        title: "Pastor Paroki",
        rank: "Imam",
        assignment: "Paroki Santo Petrus",
        bio: "Melayani umat Paroki Santo Petrus dengan perhatian khusus pada keluarga muda dan katekese dewasa.",
        image: null,
        email: null,
        status: "active",
        order_index: 5,
      },
      {
        id: "clr_06",
        name: "RD. Yohanes Krisna",
        slug: "yohanes-krisna",
        title: "Pastor Paroki",
        rank: "Imam",
        assignment: "Paroki Santo Paulus",
        bio: "Mendampingi orang muda, mahasiswa, dan komunitas pekerja di Kevikepan Maranatha.",
        image: null,
        email: null,
        status: "active",
        order_index: 6,
      },
      {
        id: "clr_07",
        name: "RD. Yusuf Mahendra",
        slug: "yusuf-mahendra",
        title: "Pastor Paroki",
        rank: "Imam",
        assignment: "Paroki Santo Yusuf",
        bio: "Melayani keluarga pekerja dan mengembangkan karya diakonia paroki.",
        image: null,
        email: null,
        status: "active",
        order_index: 7,
      },
      {
        id: "clr_08",
        name: "RD. Fransiskus Xaverius Dwi",
        slug: "fransiskus-xaverius-dwi",
        title: "Pastor Paroki",
        rank: "Imam",
        assignment: "Paroki Santa Theresia",
        bio: "Mendampingi anak-anak, lansia, dan karya doa di Paroki Santa Theresia.",
        image: null,
        email: null,
        status: "active",
        order_index: 8,
      },
      {
        id: "clr_09",
        name: "Dn. Stefanus Arya",
        slug: "stefanus-arya",
        title: "Diakon Katedral",
        rank: "Diakon",
        assignment: "Katedral Santa Maria Diangkat ke Surga",
        bio: "Diakon yang mendampingi pelayanan liturgi, diakonia, dan pendampingan sosial Katedral.",
        image: null,
        email: "diakon@keuskupanroblox.org",
        status: "active",
        order_index: 9,
      },
      {
        id: "clr_10",
        name: "Dn. Laurentius Bima",
        slug: "laurentius-bima",
        title: "Diakon",
        rank: "Diakon",
        assignment: "Paroki Santo Fransiskus Asisi",
        bio: "Melayani karya sosial dan pendampingan lingkungan di Distrik Assisi.",
        image: null,
        email: null,
        status: "active",
        order_index: 10,
      },
      {
        id: "clr_11",
        name: "Fr. Gabriel Aditya",
        slug: "gabriel-aditya",
        title: "Frater Seminari Tinggi",
        rank: "Frater",
        assignment: "Seminari Tinggi Lumen Christi",
        bio: "Frater yang sedang menjalani formasi imam dan terlibat dalam karya komunikasi sosial.",
        image: null,
        email: "frater@keuskupanroblox.org",
        status: "active",
        order_index: 11,
      },
      {
        id: "clr_12",
        name: "Fr. Markus Devan",
        slug: "markus-devan",
        title: "Frater",
        rank: "Frater",
        assignment: "Seminari Tinggi Lumen Christi",
        bio: "Frater yang mendalami studi teologi dan membantu pendampingan orang muda.",
        image: null,
        email: null,
        status: "active",
        order_index: 12,
      },
    ]);

    insertRows(db, "announcements", [
      {
        id: "ann_01",
        title: "Pendaftaran Calon Krisma 2026 dibuka",
        message:
          "Pendaftaran calon penerima Sakramen Penguatan dibuka hingga 30 November 2026 melalui sekretariat masing-masing paroki.",
        tone: "important",
        active: 1,
        starts_at: "2026-10-01T00:00:00+07:00",
        ends_at: "2026-11-30T23:59:00+07:00",
        created_at: now,
      },
      {
        id: "ann_02",
        title: "Jadwal Misa Malam Natal telah tersedia",
        message:
          "Silakan periksa jadwal Misa Malam Natal dan Hari Raya Natal di halaman Liturgi. Umat diimbau hadir lebih awal.",
        tone: "liturgy",
        active: 1,
        starts_at: "2026-10-10T00:00:00+07:00",
        ends_at: "2026-12-26T23:59:00+07:00",
        created_at: now,
      },
      {
        id: "ann_03",
        title: "Layanan Sekretariat selama bulan Oktober",
        message:
          "Sekretariat keuskupan melayani Senin–Jumat pukul 08.00–16.00 WIB. Layanan konsultasi dapat dilakukan dengan perjanjian.",
        tone: "info",
        active: 1,
        starts_at: "2026-10-01T00:00:00+07:00",
        ends_at: null,
        created_at: now,
      },
    ]);

    insertRows(db, "pages", [
      {
        id: "pg_profil",
        title: "Profil Keuskupan Agung ROBLOX",
        slug: "profil",
        subtitle: "Satu keluarga iman, satu perjalanan misi.",
        content:
          "## Siapa kami\n\nKeuskupan Agung ROBLOX adalah komunitas gerejawi Katolik yang dipimpin oleh seorang Uskup Agung. Kami berakar dalam tradisi Gereja universal, hidup dalam persekutuan dengan Paus dan para uskup, serta hadir melayani umat di wilayah keuskupan.\n\nSebagai Gereja lokal, keuskupan menghimpun paroki-paroki, komunitas hidup bakti, lembaga pendidikan, karya sosial, dan umat awam dalam satu perjalanan iman. Kami percaya bahwa setiap orang dipanggil untuk mengambil bagian dalam misi Kristus sesuai karunia dan panggilannya.\n\n## Identitas kami\n\nNama \"ROBLOX\" dalam keuskupan ini menjadi tanda panggilan untuk membangun ruang perjumpaan yang kreatif, inklusif, dan penuh harapan. Dunia digital bukan sekadar tempat berkumpul, tetapi juga ladang misi tempat Injil dapat diwartakan dengan bahasa dan cara yang baru.\n\n## Panggilan bersama\n\nKami mengundang setiap umat untuk bertumbuh dalam empat dimensi hidup beriman: persekutuan (koinonia), pewartaan (kerygma), perayaan (leiturgia), dan pelayanan (diakonia). Semua dimensi ini menemukan puncaknya dalam perayaan Ekaristi dan diwujudkan dalam kesaksian hidup sehari-hari.\n\n> Gereja yang hidup adalah Gereja yang berjalan bersama, saling mendengarkan, dan keluar untuk melayani.",
        status: "published",
        created_at: now,
        updated_at: now,
      },
      {
        id: "pg_sejarah",
        title: "Sejarah Keuskupan",
        slug: "sejarah",
        subtitle: "Dari komunitas kecil menuju keluarga iman yang berbuah.",
        content:
          "## Awal mula\n\nKarya misi di wilayah ROBLOX dimulai pada awal abad ke-20 melalui kunjungan para misionaris dan komunitas kecil umat yang berkumpul di rumah-rumah. Perayaan Ekaristi pertama tercatat dilaksanakan pada 1926 di sebuah kapel sederhana yang kemudian menjadi cikal bakal Katedral.\n\n## Bertumbuh dalam pelayanan\n\nSeiring bertambahnya umat, karya pastoral berkembang melalui sekolah, rumah sakit, dan pendampingan keluarga. Pada 1978, wilayah ini ditetapkan sebagai keuskupan tersendiri dan pada 2004 ditingkatkan menjadi keuskupan agung.\n\n## Menuju masa depan\n\nHari ini Keuskupan Agung ROBLOX terus berbenah. Bersama umat, para imam, diakon, frater, dan komunitas hidup bakti, kami berkomitmen menghadirkan Gereja yang dekat, terbuka, dan berbelarasa, terutama bagi mereka yang berada di pinggiran.\n\n## Warisan yang hidup\n\nSejarah kami bukan sekadar bangunan dan dokumen. Sejarah kami adalah kisah orang-orang beriman yang setia merawat harapan dari generasi ke generasi.",
        status: "published",
        created_at: now,
        updated_at: now,
      },
      {
        id: "pg_visi",
        title: "Visi dan Misi",
        slug: "visi-misi",
        subtitle: "Arah dasar pelayanan 2026–2030.",
        content:
          "## Visi\n\nMenjadi Gereja lokal yang hidup, misioner, dan berbelarasa, yang menghadirkan Kerajaan Allah melalui persekutuan yang inklusif, pelayanan yang membebaskan, dan kesaksian iman di dunia nyata maupun digital.\n\n## Misi\n\n- Menghidupkan perayaan liturgi yang penuh makna dan melibatkan umat.\n- Menumbuhkan budaya mendengarkan dan berjalan bersama dalam keluarga, lingkungan, dan paroki.\n- Memperkuat katekese yang kontekstual bagi anak, remaja, orang muda, dan orang dewasa.\n- Mengembangkan karya diakonia yang berpihak kepada kaum kecil dan terpinggirkan.\n- Merawat persaudaraan lintas budaya, agama, dan generasi.\n- Menghadirkan Injil secara kreatif di ruang digital dengan semangat etika dan belas kasih.\n\n## Nilai dasar\n\nKami menghidupi nilai persaudaraan, pelayanan, kesederhanaan, keterbukaan, dan tanggung jawab bersama. Nilai-nilai ini menjadi kompas dalam setiap keputusan pastoral dan pelayanan publik keuskupan.",
        status: "published",
        created_at: now,
        updated_at: now,
      },
      {
        id: "pg_arah",
        title: "Arah Dasar Pastoral 2026–2030",
        slug: "arah-dasar",
        subtitle: "Berjalan bersama menuju Gereja yang berbelarasa.",
        content:
          "## Tema dasar\n\n\"Berjalan Bersama dalam Kasih: Menjadi Gereja yang Mendengarkan dan Melayani\" menjadi arah dasar Keuskupan Agung ROBLOX untuk periode 2026–2030.\n\n## Empat fokus\n\n- **Persekutuan:** memperkuat relasi antarumat, paroki, dan komunitas.\n- **Pewartaan:** menghadirkan Kabar Baik dengan bahasa yang mudah dipahami.\n- **Pelayanan:** menguatkan karya diakonia dan kepedulian kepada yang lemah.\n- **Perayaan:** menghidupkan liturgi sebagai sumber dan puncak hidup Gereja.\n\n## Indikator buah\n\nArah dasar ini akan diukur melalui keterlibatan umat, kualitas pendampingan, tumbuhnya panggilan, dan dampak pelayanan di masyarakat. Setiap paroki diajak menyusun rencana pastoral tahunan yang selaras dengan arah dasar keuskupan.",
        status: "published",
        created_at: now,
        updated_at: now,
      },
    ]);

    insertRows(db, "galleries", [
      {
        id: "gal_01",
        title: "Perayaan Ekaristi di Katedral",
        image: "/images/cathedral-altar.jpg",
        caption: "Umat memenuhi Katedral dalam perayaan Ekaristi Minggu.",
        album: "Liturgi",
        created_at: "2026-10-20T10:00:00+07:00",
      },
      {
        id: "gal_02",
        title: "Persiapan Misa Malam Natal",
        image: "/images/hero-church.jpg",
        caption: "Suasana tenang Katedral menjelang perayaan Natal.",
        album: "Katedral",
        created_at: "2026-10-18T10:00:00+07:00",
      },
      {
        id: "gal_03",
        title: "Temu Raya Misdinar",
        image: "/images/mass-servers.jpg",
        caption: "Misdinar dari delapan paroki berkumpul dalam temu raya.",
        album: "Karya Pastoral",
        created_at: "2026-10-17T10:00:00+07:00",
      },
      {
        id: "gal_04",
        title: "Aksi Peduli Sesama",
        image: "/images/community.jpg",
        caption: "Relawan paroki membersamai keluarga penerima bantuan.",
        album: "Karya Sosial",
        created_at: "2026-10-12T10:00:00+07:00",
      },
      {
        id: "gal_05",
        title: "Retret Panggilan",
        image: "/images/prayer.jpg",
        caption: "Para frater dalam sesi doa dan pendampingan rohani.",
        album: "Panggilan",
        created_at: "2026-10-10T10:00:00+07:00",
      },
      {
        id: "gal_06",
        title: "Katedral dari Kejauhan",
        image: "/images/cathedral-exterior.jpg",
        caption: "Wajah Katedral Santa Maria Diangkat ke Surga.",
        album: "Katedral",
        created_at: "2026-10-08T10:00:00+07:00",
      },
      {
        id: "gal_07",
        title: "Pekan Kitab Suci",
        image: "/images/bible.jpg",
        caption: "Membaca dan merenungkan Sabda dalam komunitas.",
        album: "Pendidikan Iman",
        created_at: "2026-10-05T10:00:00+07:00",
      },
      {
        id: "gal_08",
        title: "Pembinaan Guru Sekolah Minggu",
        image: "/images/notebooks.jpg",
        caption: "Para katekis belajar metode kreatif untuk anak-anak.",
        album: "Pendidikan Iman",
        created_at: "2026-10-04T10:00:00+07:00",
      },
      {
        id: "gal_09",
        title: "Doa Rosario Keluarga",
        image: "/images/candles.jpg",
        caption: "Lilin-lilin doa menyertai perayaan bulan Rosario.",
        album: "Devosi",
        created_at: "2026-10-02T10:00:00+07:00",
      },
      {
        id: "gal_10",
        title: "Pelayanan Altar",
        image: "/images/liturgy-communion.jpg",
        caption: "Salah satu momen perayaan Ekaristi di Katedral.",
        album: "Liturgi",
        created_at: "2026-09-28T10:00:00+07:00",
      },
    ]);

    insertRows(db, "messages", [
      {
        id: "msg_01",
        name: "Rina Kusuma",
        email: "rina.kusuma@example.com",
        phone: "0812-0000-1122",
        subject: "Informasi baptis dewasa",
        message:
          "Selamat pagi, saya ingin bertanya mengenai proses baptis dewasa di Paroki Santo Petrus. Apakah ada jadwal pendampingan yang bisa saya ikuti? Terima kasih.",
        status: "new",
        created_at: "2026-10-21T09:12:00+07:00",
      },
      {
        id: "msg_02",
        name: "Benediktus Ari",
        email: "benediktus.ari@example.com",
        phone: null,
        subject: "Permohonan doa untuk keluarga",
        message:
          "Mohon didoakan keluarga kami yang sedang mendampingi ayah sakit. Terima kasih atas pelayanan keuskupan.",
        status: "read",
        created_at: "2026-10-20T19:45:00+07:00",
      },
    ]);

    insertRows(db, "activity_logs", [
      {
        id: "log_01",
        user_id: "usr_pengurus",
        user_name: "Maria Theresia Lestari",
        action: "Menerbitkan berita",
        entity: "articles",
        entity_id: "art_01",
        details: "Uskup Agung: Jadilah Gereja yang Keluar dan Merangkul",
        created_at: "2026-10-21T09:30:00+07:00",
      },
      {
        id: "log_02",
        user_id: "usr_uskup",
        user_name: "Mgr. Rafael Yohanes Adiwinata",
        action: "Menerbitkan berita",
        entity: "articles",
        entity_id: "art_02",
        details: "Misa Krisma 2026: 184 Umat Menerima Sakramen Penguatan",
        created_at: "2026-10-19T14:00:00+07:00",
      },
      {
        id: "log_03",
        user_id: "usr_diakon",
        user_name: "Dn. Stefanus Arya",
        action: "Memperbarui agenda",
        entity: "events",
        entity_id: "evt_02",
        details: "Bulan Rosario Keluarga",
        created_at: "2026-10-18T11:20:00+07:00",
      },
      {
        id: "log_04",
        user_id: "usr_owner",
        user_name: "Andreas Hartono",
        action: "Memperbarui pengaturan situs",
        entity: "settings",
        entity_id: null,
        details: "Jadwal dan kontak sekretariat",
        created_at: "2026-10-16T08:40:00+07:00",
      },
    ]);

    db.exec("COMMIT");
  } catch (error) {
    db.exec("ROLLBACK");
    throw error;
  }
}
