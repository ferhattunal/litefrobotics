import { NextResponse } from "next/server";
import { requireStaff } from "@/lib/auth";
import { FOLDER_PLACEHOLDER } from "@/lib/constants";
import { isFileManagerBucket, joinStoragePath, sanitizeStoragePath } from "@/lib/storage-path";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const { admin } = await requireStaff();
    const body = (await request.json()) as { bucket?: string; prefix?: string; name?: string };
    const bucket = body.bucket ?? "";
    const name = sanitizeStoragePath(body.name ?? "");
    if (!isFileManagerBucket(bucket) || !name || name.includes("/")) {
      return NextResponse.json({ error: "Geçersiz klasör adı." }, { status: 400 });
    }
    const prefix = sanitizeStoragePath(body.prefix ?? "");
    const path = joinStoragePath(prefix, name, FOLDER_PLACEHOLDER);
    const { error } = await admin.storage.from(bucket).upload(path, new Uint8Array(), {
      contentType: "application/octet-stream",
      upsert: false,
    });
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ ok: true, path: joinStoragePath(prefix, name) });
  } catch {
    return NextResponse.json({ error: "Yetkisiz." }, { status: 401 });
  }
}
