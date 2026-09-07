import { FILE_MANAGER_BUCKETS, FOLDER_PLACEHOLDER, type StorageBucket } from "./constants";

export type FileManagerBucket = (typeof FILE_MANAGER_BUCKETS)[number];

export function sanitizeStoragePath(value: string) {
  return value
    .replaceAll("\\", "/")
    .split("/")
    .map((part) => part.replace(/[^a-z0-9._-]/gi, "").replace(/^\.+/, ""))
    .filter(Boolean)
    .join("/");
}

export function joinStoragePath(...parts: string[]) {
  return parts.map((part) => sanitizeStoragePath(part)).filter(Boolean).join("/");
}

export function isFileManagerBucket(value: string): value is FileManagerBucket {
  return FILE_MANAGER_BUCKETS.includes(value as FileManagerBucket);
}

export function isPlaceholder(name: string) {
  return name === FOLDER_PLACEHOLDER || name.endsWith(`/${FOLDER_PLACEHOLDER}`);
}

export function publicObjectUrl(supabaseUrl: string, bucket: StorageBucket, path: string) {
  const clean = path.replace(/^\/+/, "");
  return `${supabaseUrl.replace(/\/$/, "")}/storage/v1/object/public/${bucket}/${clean}`;
}
