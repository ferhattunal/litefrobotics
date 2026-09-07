import { NextResponse } from "next/server";
import { requireStaff } from "@/lib/auth";
import { STORAGE_BUCKETS, type StorageBucket } from "@/lib/constants";
import { sanitizeStoragePath } from "@/lib/storage-path";

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

const DOCUMENT_TYPES = new Map([
  ["application/pdf", "pdf"],
  ["application/msword", "doc"],
  ["application/vnd.openxmlformats-officedocument.wordprocessingml.document", "docx"],
  ["application/vnd.ms-excel", "xls"],
  ["application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "xlsx"],
  ["application/vnd.ms-powerpoint", "ppt"],
  ["application/vnd.openxmlformats-officedocument.presentationml.presentation", "pptx"],
  ["text/plain", "txt"],
]);

const DOCUMENT_EXT = new Set(["pdf", "doc", "docx", "xls", "xlsx", "ppt", "pptx", "txt"]);

function extOf(name: string) {
  return name.split(".").pop()?.toLowerCase() ?? "";
}

export async function POST(request: Request) {
  try {
    const { admin } = await requireStaff();
    const form = await request.formData();
    const file = form.get("file");
    const bucket = String(form.get("bucket") ?? "") as StorageBucket;

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Dosya bulunamadı." }, { status: 400 });
    }
    if (!STORAGE_BUCKETS.includes(bucket)) {
      return NextResponse.json({ error: "Geçersiz bucket." }, { status: 400 });
    }

    const folder = sanitizeStoragePath(String(form.get("folder") ?? "uploads")) || "uploads";
    const extName = extOf(file.name);
    const isDocument = DOCUMENT_TYPES.has(file.type) || DOCUMENT_EXT.has(extName);
    const isImage = IMAGE_TYPES.has(file.type) || file.type.startsWith("image/");

    if (bucket === "media" && !isImage) {
      return NextResponse.json({ error: "Medya klasörüne yalnızca görsel yüklenebilir." }, { status: 400 });
    }
    if (bucket === "documents" && !isDocument) {
      return NextResponse.json({ error: "Belgeler klasörüne PDF veya döküman yükleyin." }, { status: 400 });
    }

    let buffer: Buffer;
    let contentType: string;
    let ext: string;

    if (isDocument) {
      buffer = Buffer.from(await file.arrayBuffer());
      contentType = DOCUMENT_TYPES.get(file.type) ? file.type : "application/octet-stream";
      ext = DOCUMENT_TYPES.get(file.type) || extName || "bin";
    } else if (isImage) {
      const sharp = (await import("sharp")).default;
      buffer = await sharp(Buffer.from(await file.arrayBuffer())).webp({ quality: 82 }).toBuffer();
      contentType = "image/webp";
      ext = "webp";
    } else {
      return NextResponse.json({ error: "Yalnızca görsel veya döküman yüklenebilir." }, { status: 400 });
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
    return NextResponse.json({ url: data.publicUrl, path });
  } catch {
    return NextResponse.json({ error: "Yükleme yetkisiz veya başarısız." }, { status: 401 });
  }
}
