import { randomUUID } from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { getCurrentUser, hasPermission } from "@/lib/auth";

export const runtime = "nodejs";

const ALLOWED = new Map([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
  ["image/gif", "gif"],
]);

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Sesi tidak valid." }, { status: 401 });
  }
  const permitted =
    hasPermission(user, "media.manage") ||
    hasPermission(user, "articles.create") ||
    hasPermission(user, "settings.manage") ||
    hasPermission(user, "parishes.manage") ||
    hasPermission(user, "clergy.manage");
  if (!permitted) {
    return NextResponse.json({ error: "Anda tidak memiliki izin mengunggah." }, { status: 403 });
  }

  const formData = await request.formData();
  const file = formData.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Berkas tidak ditemukan." }, { status: 400 });
  }
  const extension = ALLOWED.get(file.type);
  if (!extension) {
    return NextResponse.json(
      { error: "Format harus JPG, PNG, WEBP, atau GIF." },
      { status: 400 },
    );
  }
  if (file.size > 8 * 1024 * 1024) {
    return NextResponse.json(
      { error: "Ukuran gambar maksimal 8 MB." },
      { status: 400 },
    );
  }

  const uploadDirectory = path.join(process.cwd(), "public", "uploads");
  await fs.mkdir(uploadDirectory, { recursive: true });
  const fileName = `${Date.now()}-${randomUUID().slice(0, 8)}.${extension}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(path.join(uploadDirectory, fileName), buffer);
  return NextResponse.json({ url: `/uploads/${fileName}` });
}
