#!/usr/bin/env node
/* eslint-disable no-console */
const fs = require("node:fs");
const path = require("node:path");

const dataDirectory = path.join(process.cwd(), "data");
const databasePath = path.join(dataDirectory, "keuskupan.db");

let removed = 0;
for (const suffix of ["", "-shm", "-wal"]) {
  const target = databasePath + suffix;
  if (fs.existsSync(target)) {
    fs.unlinkSync(target);
    removed += 1;
    console.log(`Dihapus: ${path.relative(process.cwd(), target)}`);
  }
}

if (removed === 0) {
  console.log("Tidak ada berkas basis data yang perlu dihapus.");
} else {
  console.log("");
  console.log("Basis data direset. Basis data baru beserta konten contoh akan");
  console.log("dibuat otomatis saat aplikasi dijalankan kembali:");
  console.log("  npm run dev");
}
