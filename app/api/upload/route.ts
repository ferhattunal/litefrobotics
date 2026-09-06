import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { STORAGE_BUCKETS, type StorageBucket } from "@/lib/constants";

export const runtime = "nodejs";

const IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
  "image/tiff",
  "image/bmp",
]);

export async function POST(request: Request) {
  try {
    const { admin } = await requireAdmin();
    const form = await request.formData();
    const file = form.get("file");
    const bucket = String(form.get("bucket") ?? "") as StorageBucket;

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Dosya bulunamadı." }, { status: 400 });
    }
    if (!STORAGE_BUCKETS.includes(bucket)) {
      return NextResponse.json({ error: "Geçersiz bucket." }, { status: 400 });
    }

    const folder = String(form.get("folder") ?? "uploads").replace(/[^a-z0-9-_/]/gi, "");
    const isPdf = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");

    let buffer: Buffer;
    let contentType: string;
    let ext: string;

    if (isPdf) {
      buffer = Buffer.from(await file.arrayBuffer());
      contentType = "application/pdf";
      ext = "pdf";
    } else if (IMAGE_TYPES.has(file.type) || file.type.startsWith("image/")) {
      const sharp = (await import("sharp")).default;
      buffer = await sharp(Buffer.from(await file.arrayBuffer())).webp({ quality: 82 }).toBuffer();
      contentType = "image/webp";
      ext = "webp";
    } else {
      return NextResponse.json({ error: "Yalnızca görsel veya PDF yüklenebilir." }, { status: 400 });
    }

    const path = `${folder}/${crypto.randomUUID()}.${ext}`;
    const { error } = await admin.storage.from(bucket).upload(path, buffer, {
      contentType,
      upsert: false,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const { data } = admin.storage.from(bucket).getPublicUrl(path);
    return NextResponse.json({ url: data.publicUrl });
  } catch {
    return NextResponse.json({ error: "Yükleme yetkisiz veya başarısız." }, { status: 401 });
  }
}
