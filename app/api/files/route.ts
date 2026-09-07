import { NextResponse } from "next/server";
import { requireStaff } from "@/lib/auth";
import { FOLDER_PLACEHOLDER } from "@/lib/constants";
import { isFileManagerBucket, isPlaceholder, joinStoragePath, publicObjectUrl, sanitizeStoragePath } from "@/lib/storage-path";
import { getSupabaseUrl } from "@/lib/supabase/env";

export const runtime = "nodejs";

type Listed = {
  name: string;
  id: string | null;
  created_at?: string;
  metadata?: { mimetype?: string; size?: number } | null;
};

function folderUrl(bucket: string, prefix: string) {
  const path = prefix ? `${prefix}/` : "";
  return publicObjectUrl(getSupabaseUrl() || "", bucket as "media", path);
}

export async function GET(request: Request) {
  try {
    const { admin } = await requireStaff();
    const url = new URL(request.url);
    const bucket = url.searchParams.get("bucket") ?? "media";
    const prefix = sanitizeStoragePath(url.searchParams.get("prefix") ?? "");
    if (!isFileManagerBucket(bucket)) {
      return NextResponse.json({ error: "Geçersiz bucket." }, { status: 400 });
    }

    const { data, error } = await admin.storage.from(bucket).list(prefix || undefined, {
      limit: 200,
      sortBy: { column: "name", order: "asc" },
    });
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const folders: { name: string; path: string; url: string }[] = [];
    const files: { name: string; path: string; url: string; created_at?: string }[] = [];
    const supabaseUrl = getSupabaseUrl() || "";

    for (const item of (data ?? []) as Listed[]) {
      if (!item.name || item.name === ".emptyFolderPlaceholder") continue;
      const path = joinStoragePath(prefix, item.name);
      const isFolder = item.id === null || (!item.metadata && !item.id);
      if (isFolder) {
        folders.push({ name: item.name, path, url: folderUrl(bucket, path) });
        continue;
      }
      if (isPlaceholder(item.name)) continue;
      files.push({
        name: item.name,
        path,
        url: publicObjectUrl(supabaseUrl, bucket, path),
        created_at: item.created_at,
      });
    }

    return NextResponse.json({
      bucket,
      prefix,
      folders,
      files,
      currentUrl: folderUrl(bucket, prefix),
    });
  } catch {
    return NextResponse.json({ error: "Yetkisiz." }, { status: 401 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { admin } = await requireStaff();
    const body = (await request.json()) as { bucket?: string; path?: string; folder?: boolean };
    const bucket = body.bucket ?? "";
    const path = sanitizeStoragePath(body.path ?? "");
    if (!isFileManagerBucket(bucket) || !path) {
      return NextResponse.json({ error: "Geçersiz istek." }, { status: 400 });
    }

    if (body.folder) {
      const paths = await listAllPaths(admin, bucket, path);
      paths.push(joinStoragePath(path, FOLDER_PLACEHOLDER));
      if (paths.length) {
        const { error } = await admin.storage.from(bucket).remove(paths);
        if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      }
    } else {
      const { error } = await admin.storage.from(bucket).remove([path]);
      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Yetkisiz." }, { status: 401 });
  }
}

async function listAllPaths(
  admin: Awaited<ReturnType<typeof requireStaff>>["admin"],
  bucket: string,
  prefix: string,
): Promise<string[]> {
  const { data } = await admin.storage.from(bucket).list(prefix || undefined, { limit: 200 });
  const paths: string[] = [];
  for (const item of (data ?? []) as Listed[]) {
    const next = joinStoragePath(prefix, item.name);
    const isFolder = item.id === null;
    if (isFolder) {
      paths.push(...(await listAllPaths(admin, bucket, next)));
    } else {
      paths.push(next);
    }
  }
  return paths;
}
