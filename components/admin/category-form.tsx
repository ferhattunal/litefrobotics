"use client";

import { useState } from "react";
import { CardDesignEditor } from "@/components/admin/card-design-editor";
import { FileUploader } from "@/components/admin/file-uploader";
import { saveCategory } from "@/lib/actions/categories";
import { DEFAULT_CARD } from "@/lib/card-design";
import { slugify } from "@/lib/utils";
import type { CardDesign, Category } from "@/lib/types";

export function CategoryForm({ category }: { category?: Category }) {
  const [name, setName] = useState(category?.name ?? "");
  const [slug, setSlug] = useState(category?.slug ?? "");
  const [hero, setHero] = useState(category?.hero_image_url ?? "");
  const [design, setDesign] = useState<CardDesign | null>(category?.card_design ?? null);

  return (
    <form action={saveCategory} className="grid max-w-5xl gap-6">
      {category ? <input type="hidden" name="id" value={category.id} /> : null}
      <input type="hidden" name="hero_image_url" value={hero} />
      <input type="hidden" name="card_design" value={design ? JSON.stringify(design) : ""} />

      <div className="grid gap-4 md:grid-cols-2">
        <label>
          <span className="admin-label">Kategori adı</span>
          <input
            className="admin-input"
            name="name"
            value={name}
            onChange={(event) => {
              setName(event.target.value);
              if (!category) setSlug(slugify(event.target.value));
            }}
            required
          />
        </label>
        <label>
          <span className="admin-label">Slug</span>
          <input className="admin-input" name="slug" value={slug} onChange={(event) => setSlug(event.target.value)} required />
        </label>
      </div>

      <FileUploader
        bucket="category-heroes"
        folder="heroes"
        value={hero}
        label="Hero görseli"
        onChange={setHero}
      />

      <label>
        <span className="admin-label">Hero başlığı</span>
        <input className="admin-input" name="hero_title" defaultValue={category?.hero_title} />
      </label>
      <label>
        <span className="admin-label">Hero metni</span>
        <textarea className="admin-textarea min-h-24" name="hero_text" defaultValue={category?.hero_text} />
      </label>

      <CardDesignEditor
        value={design}
        fallback={DEFAULT_CARD}
        onChange={setDesign}
        resetLabel="Varsayılan karta sıfırla"
        allowCode
      />

      <button type="submit" className="w-fit rounded-lg bg-stone-900 px-4 py-2 text-white">
        Kategoriyi kaydet
      </button>
    </form>
  );
}
