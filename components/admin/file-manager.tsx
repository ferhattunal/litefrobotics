"use client";

import { useCallback, useEffect, useState, type ChangeEvent } from "react";
import { FileUploader } from "@/components/admin/file-uploader";
import type { FileManagerBucket } from "@/lib/storage-path";

type Entry = { name: string; path: string; url: string; created_at?: string };

type Listing = {
  bucket: FileManagerBucket;
  prefix: string;
  folders: Entry[];
  files: Entry[];
  currentUrl: string;
};

const TABS: { id: FileManagerBucket; label: string; accept: string }[] = [
  { id: "media", label: "Görseller (media)", accept: "image/*" },
  { id: "documents", label: "Dökümanlar (documents)", accept: "application/pdf,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt" },
];

async function copyText(value: string) {
  await navigator.clipboard.writeText(value);
}

export function FileManager() {
  const [bucket, setBucket] = useState<FileManagerBucket>("media");
  const [prefix, setPrefix] = useState("");
  const [listing, setListing] = useState<Listing | null>(null);
  const [error, setError] = useState("");
  const [folderName, setFolderName] = useState("");
  const [copied, setCopied] = useState("");

  const load = useCallback(async (nextBucket = bucket, nextPrefix = prefix) => {
    setError("");
    const params = new URLSearchParams({ bucket: nextBucket, prefix: nextPrefix });
    const response = await fetch(`/api/files?${params.toString()}`);
    const data = (await response.json()) as Listing & { error?: string };
    if (!response.ok) {
      setError(data.error || "Liste alınamadı.");
      return;
    }
    setListing(data);
  }, [bucket, prefix]);

  useEffect(() => {
    let ignore = false;
    const params = new URLSearchParams({ bucket, prefix });
    fetch(`/api/files?${params.toString()}`)
      .then(async (response) => {
        const data = (await response.json()) as Listing & { error?: string };
        if (ignore) return;
        if (!response.ok) {
          setError(data.error || "Liste alınamadı.");
          return;
        }
        setListing(data);
      })
      .catch(() => {
        if (!ignore) setError("Liste alınamadı.");
      });
    return () => {
      ignore = true;
    };
  }, [bucket, prefix]);

  async function createFolder() {
    const name = folderName.trim();
    if (!name) return;
    const response = await fetch("/api/files/folder", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ bucket, prefix, name }),
    });
    const data = (await response.json()) as { error?: string };
    if (!response.ok) {
      setError(data.error || "Klasör oluşturulamadı.");
      return;
    }
    setFolderName("");
    await load();
  }

  async function remove(path: string, folder = false) {
    if (!confirm(folder ? "Klasör ve içindeki dosyalar silinsin mi?" : "Dosya silinsin mi?")) return;
    const response = await fetch("/api/files", {
      method: "DELETE",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ bucket, path, folder }),
    });
    const data = (await response.json()) as { error?: string };
    if (!response.ok) {
      setError(data.error || "Silinemedi.");
      return;
    }
    await load();
  }

  async function markCopied(url: string) {
    await copyText(url);
    setCopied(url);
    setTimeout(() => setCopied(""), 1600);
  }

  const crumbs = prefix ? prefix.split("/").filter(Boolean) : [];
  const tab = TABS.find((item) => item.id === bucket) ?? TABS[0];

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap gap-2">
        {TABS.map((item) => (
          <button
            key={item.id}
            type="button"
            className={bucket === item.id ? "settings-pill-on rounded-full" : "settings-pill rounded-full bg-white"}
            onClick={() => {
              setBucket(item.id);
              setPrefix("");
            }}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="rounded-2xl bg-white p-5">
        <div className="flex flex-wrap items-center gap-2 text-sm text-stone-500">
          <button type="button" className="text-orange-700" onClick={() => setPrefix("")}>
            {bucket}
          </button>
          {crumbs.map((part, index) => {
            const path = crumbs.slice(0, index + 1).join("/");
            return (
              <span key={path} className="flex items-center gap-2">
                <span>/</span>
                <button type="button" className="text-orange-700" onClick={() => setPrefix(path)}>
                  {part}
                </button>
              </span>
            );
          })}
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <input
            className="admin-input max-w-xs"
            placeholder="Yeni klasör adı"
            value={folderName}
            onChange={(event: ChangeEvent<HTMLInputElement>) => setFolderName(event.target.value)}
          />
          <button type="button" className="rounded-lg bg-stone-900 px-4 py-2 text-sm text-white" onClick={() => void createFolder()}>
            Klasör oluştur
          </button>
          {listing?.currentUrl ? (
            <button type="button" className="rounded-lg border px-4 py-2 text-sm" onClick={() => void markCopied(listing.currentUrl)}>
              Klasör linkini kopyala
            </button>
          ) : null}
        </div>

        <div className="mt-5">
          <FileUploader
            bucket={bucket}
            folder={prefix || "uploads"}
            accept={tab.accept}
            label={bucket === "media" ? "Görsel yükle" : "Döküman yükle"}
            onChange={() => void load()}
          />
        </div>
        {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}
        {copied ? <p className="mt-3 text-sm text-green-700">Link kopyalandı.</p> : null}
      </div>

      <div className="rounded-2xl bg-white p-5">
        <h2 className="font-medium">İçerik</h2>
        <ul className="mt-3 grid gap-2">
          {(listing?.folders ?? []).map((folder) => (
            <li key={folder.path} className="flex flex-wrap items-center gap-3 rounded-lg border border-stone-100 px-3 py-2 text-sm">
              <button type="button" className="font-medium text-stone-800" onClick={() => setPrefix(folder.path)}>
                📁 {folder.name}
              </button>
              <button type="button" className="ml-auto text-orange-700" onClick={() => void markCopied(folder.url)}>
                Linki kopyala
              </button>
              <button type="button" className="text-red-600" onClick={() => void remove(folder.path, true)}>
                Sil
              </button>
            </li>
          ))}
          {(listing?.files ?? []).map((file) => (
            <li key={file.path} className="flex flex-wrap items-center gap-3 rounded-lg border border-stone-100 px-3 py-2 text-sm">
              {bucket === "media" ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={file.url} alt="" className="h-10 w-10 rounded object-cover" />
              ) : null}
              <a href={file.url} target="_blank" rel="noreferrer" className="min-w-0 flex-1 truncate text-stone-700">
                {file.name}
              </a>
              <button type="button" className="text-orange-700" onClick={() => void markCopied(file.url)}>
                Linki kopyala
              </button>
              <button type="button" className="text-red-600" onClick={() => void remove(file.path)}>
                Sil
              </button>
            </li>
          ))}
          {!listing?.folders.length && !listing?.files.length ? (
            <li className="text-stone-400">Bu klasör boş.</li>
          ) : null}
        </ul>
      </div>
    </div>
  );
}
