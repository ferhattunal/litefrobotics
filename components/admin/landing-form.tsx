"use client";

import { useMemo, useState } from "react";
import { AdminForm } from "@/components/admin/admin-form";
import { savePage } from "@/lib/actions/pages";
import { slugify } from "@/lib/utils";
import type { ModuleRecord, PageModule, PageRecord, RenderMode } from "@/lib/types";

type Props = {
  page?: PageRecord;
  modules: ModuleRecord[];
  assigned?: (PageModule & { modules?: ModuleRecord })[];
  defaultMode?: RenderMode;
};

export function LandingForm({ page, modules, assigned = [], defaultMode }: Props) {
  const [title, setTitle] = useState(page?.title ?? "");
  const [slug, setSlug] = useState(page?.slug ?? "");
  const [mode, setMode] = useState<RenderMode>(page?.render_mode ?? defaultMode ?? "code");
  const [selected, setSelected] = useState<string[]>(
    assigned
      .slice()
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((item) => item.module_id),
  );

  const selectedModules = useMemo(
    () => selected.map((id) => modules.find((module) => module.id === id)).filter(Boolean) as ModuleRecord[],
    [selected, modules],
  );

  function move(index: number, direction: -1 | 1) {
    const next = [...selected];
    const target = index + direction;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    setSelected(next);
  }

  return (
    <AdminForm action={savePage} className="grid max-w-5xl gap-5" label="Landing page kaydet">
      {page ? <input type="hidden" name="id" value={page.id} /> : null}
      <input type="hidden" name="render_mode" value={mode} />
      <input type="hidden" name="module_ids" value={selected.join(",")} />

      <div className="grid gap-4 md:grid-cols-2">
        <label>
          <span className="admin-label">Sayfa başlığı (title)</span>
          <input
            className="admin-input"
            name="title"
            value={title}
            onChange={(event) => {
              setTitle(event.target.value);
              if (!page) setSlug(slugify(event.target.value));
            }}
            required
          />
        </label>
        <label>
          <span className="admin-label">Slug</span>
          <input className="admin-input" name="slug" value={slug} onChange={(event) => setSlug(event.target.value)} required />
        </label>
      </div>

      <label>
        <span className="admin-label">Meta description</span>
        <textarea className="admin-textarea min-h-20" name="meta_description" defaultValue={page?.meta_description} />
      </label>
      <label>
        <span className="admin-label">Meta keywords</span>
        <input className="admin-input" name="meta_keywords" defaultValue={page?.meta_keywords} />
      </label>

      <fieldset className="grid gap-2">
        <legend className="admin-label">Bu sayfa ana sayfa olsun mu?</legend>
        <label className="flex items-center gap-2 text-sm">
          <input type="radio" name="is_homepage" value="yes" defaultChecked={page?.is_homepage} />
          Evet, ana sayfa olarak kullan
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="radio" name="is_homepage" value="no" defaultChecked={!page?.is_homepage} />
          Hayır, ayrı landing page olarak kalsın
        </label>
      </fieldset>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setMode("code")}
          className={`rounded-lg px-3 py-2 text-sm ${mode === "code" ? "bg-stone-900 text-white" : "border"}`}
        >
          Kod ile oluştur
        </button>
        <button
          type="button"
          onClick={() => setMode("modules")}
          className={`rounded-lg px-3 py-2 text-sm ${mode === "modules" ? "bg-stone-900 text-white" : "border"}`}
        >
          Modül istifle
        </button>
      </div>

      {mode === "code" ? (
        <div className="grid gap-4">
          <label>
            <span className="admin-label">HTML</span>
            <textarea className="admin-textarea min-h-48" name="html" defaultValue={page?.html} />
          </label>
          <label>
            <span className="admin-label">CSS</span>
            <textarea className="admin-textarea min-h-32" name="css" defaultValue={page?.css} />
          </label>
          <label>
            <span className="admin-label">JavaScript</span>
            <textarea className="admin-textarea min-h-32" name="js" defaultValue={page?.js} />
          </label>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-stone-200 bg-white p-4">
            <h3 className="mb-3 font-semibold">Kullanılabilir modüller</h3>
            <div className="grid gap-2">
              {modules.map((module) => (
                <button
                  key={module.id}
                  type="button"
                  onClick={() => setSelected((current) => [...current, module.id])}
                  className="rounded-lg border px-3 py-2 text-left text-sm hover:bg-stone-50"
                >
                  {module.name}
                </button>
              ))}
              {!modules.length ? <p className="text-sm text-stone-500">Önce modül oluşturun.</p> : null}
            </div>
          </div>
          <div className="rounded-2xl border border-stone-200 bg-white p-4">
            <h3 className="mb-3 font-semibold">Sayfa sırası</h3>
            <div className="grid gap-2">
              {selectedModules.map((module, index) => (
                <div key={`${module.id}-${index}`} className="flex items-center justify-between rounded-lg border px-3 py-2">
                  <span className="text-sm">{index + 1}. {module.name}</span>
                  <div className="flex gap-2">
                    <button type="button" onClick={() => move(index, -1)} className="text-xs">
                      Yukarı
                    </button>
                    <button type="button" onClick={() => move(index, 1)} className="text-xs">
                      Aşağı
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelected((current) => current.filter((_, i) => i !== index))}
                      className="text-xs text-red-700"
                    >
                      Kaldır
                    </button>
                  </div>
                </div>
              ))}
              {!selectedModules.length ? (
                <p className="text-sm text-stone-500">Soldan modül ekleyerek sayfayı kod yazmadan kurun.</p>
              ) : null}
            </div>
          </div>
          <input type="hidden" name="html" defaultValue={page?.html} />
          <input type="hidden" name="css" defaultValue={page?.css} />
          <input type="hidden" name="js" defaultValue={page?.js} />
        </div>
      )}

    </AdminForm>
  );
}
