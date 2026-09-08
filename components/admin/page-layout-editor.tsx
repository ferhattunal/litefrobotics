"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { addSampleBlocks, savePageLayout } from "@/lib/actions/pages";
import type { ModuleRecord, PageModule, PageRecord } from "@/lib/types";

type Assigned = PageModule & { modules?: ModuleRecord | null };

type Props = {
  pages: PageRecord[];
  modules: ModuleRecord[];
  assigned: Assigned[];
  selectedPage: PageRecord;
};

export function PageLayoutEditor({ pages, modules, assigned, selectedPage }: Props) {
  const router = useRouter();
  const [selected, setSelected] = useState<string[]>(
    assigned
      .slice()
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((item) => item.module_id),
  );
  const [pick, setPick] = useState(modules[0]?.id ?? "");
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState("");

  const selectedModules = useMemo(
    () => selected.map((id) => modules.find((module) => module.id === id)).filter(Boolean) as ModuleRecord[],
    [selected, modules],
  );

  const livePath = selectedPage.is_homepage ? "/" : `/${selectedPage.slug}`;

  useEffect(() => {
    setSelected(
      assigned
        .slice()
        .sort((a, b) => a.sort_order - b.sort_order)
        .map((item) => item.module_id),
    );
  }, [assigned, selectedPage.id]);

  function move(index: number, direction: -1 | 1) {
    const next = [...selected];
    const target = index + direction;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    setSelected(next);
  }

  async function save() {
    setPending(true);
    setMessage("");
    const formData = new FormData();
    formData.set("page_id", selectedPage.id);
    formData.set("module_ids", selected.join(","));
    try {
      await savePageLayout(formData);
      setMessage("Düzen kaydedildi.");
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Kaydedilemedi.");
    } finally {
      setPending(false);
    }
  }

  async function samples() {
    setPending(true);
    setMessage("");
    const formData = new FormData();
    formData.set("page_id", selectedPage.id);
    try {
      await addSampleBlocks(formData);
      setMessage("Örnek bloklar eklendi.");
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Örnek bloklar eklenemedi.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Sayfa düzeni</h1>
          <p className="mt-1 text-sm text-stone-500">
            Blokları sıralayın, kalem ile içeriği düzenleyin, çöp kutusu ile sayfadan çıkarın.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={samples} disabled={pending} className="rounded-lg border border-stone-300 bg-white px-4 py-2 text-sm">
            Örnek blokları ekle
          </button>
          <button
            type="button"
            onClick={save}
            disabled={pending}
            className="rounded-lg bg-[#5e7a70] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
          >
            {pending ? "Kaydediliyor…" : "Düzeni kaydet"}
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-end gap-3">
        <label className="grid min-w-[220px] gap-1 text-sm">
          Sayfa
          <select
            className="admin-input"
            value={selectedPage.id}
            onChange={(event) => router.push(`/admin/landing?page=${event.target.value}`)}
          >
            {pages.map((page) => (
              <option key={page.id} value={page.id}>
                {page.title} /{page.is_homepage ? "" : page.slug}
              </option>
            ))}
          </select>
        </label>
        <Link href="/admin/landing/yeni" className="rounded-lg border border-stone-300 bg-white px-4 py-2 text-sm">
          Yeni sayfa
        </Link>
        <Link href={`/admin/landing/${selectedPage.id}`} className="text-sm text-orange-700 hover:underline">
          Sayfa ayarları
        </Link>
      </div>

      <div className="flex flex-wrap items-end gap-3">
        <label className="grid min-w-[240px] flex-1 gap-1 text-sm">
          Blok ekle
          <select className="admin-input" value={pick} onChange={(event) => setPick(event.target.value)}>
            {modules.map((module) => (
              <option key={module.id} value={module.id}>
                {module.name}
              </option>
            ))}
          </select>
        </label>
        <button
          type="button"
          disabled={!pick}
          onClick={() => setSelected((current) => [...current, pick])}
          className="inline-flex h-11 items-center rounded-full bg-[#5e7a70] px-4 text-sm font-semibold text-white disabled:opacity-40"
        >
          + Blok ekle
        </button>
      </div>

      <div className="grid gap-2">
        {selectedModules.map((module, index) => (
          <div key={`${module.id}-${index}`} className="flex items-center justify-between rounded-xl border border-stone-200 bg-white px-4 py-3">
            <p className="font-medium">{module.name}</p>
            <div className="flex items-center gap-1">
              <button type="button" aria-label="Yukarı" className="rounded-lg border px-2 py-1 text-sm text-stone-600" onClick={() => move(index, -1)}>
                ↑
              </button>
              <button type="button" aria-label="Aşağı" className="rounded-lg border px-2 py-1 text-sm text-stone-600" onClick={() => move(index, 1)}>
                ↓
              </button>
              <Link href={`/admin/moduller/${module.id}`} className="rounded-lg border px-2 py-1 text-sm text-sky-700" aria-label="Düzenle">
                ✎
              </Link>
              <button
                type="button"
                aria-label="Kaldır"
                className="rounded-lg border px-2 py-1 text-sm text-red-700"
                onClick={() => setSelected((current) => current.filter((_, i) => i !== index))}
              >
                ⌫
              </button>
            </div>
          </div>
        ))}
        {!selectedModules.length ? (
          <p className="rounded-xl border border-dashed border-stone-300 bg-white px-4 py-8 text-sm text-stone-500">
            Bu sayfada henüz blok yok. Yukarıdan bir modül seçip ekleyin.
          </p>
        ) : null}
      </div>

      {message ? <p className="text-sm text-stone-600">{message}</p> : null}
      <p className="text-sm text-stone-400">Canlı adres: {livePath}</p>
    </div>
  );
}
