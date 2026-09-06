"use client";

import { useState } from "react";
import { AdminForm } from "@/components/admin/admin-form";
import { CardDesignEditor } from "@/components/admin/card-design-editor";
import { FileUploader } from "@/components/admin/file-uploader";
import { MultiImageUploader } from "@/components/admin/multi-image-uploader";
import { saveProduct } from "@/lib/actions/products";
import { DEFAULT_CARD, resolveCardDesign } from "@/lib/card-design";
import { slugify } from "@/lib/utils";
import type { CardDesign, Category, ProductWithRelations } from "@/lib/types";

type Props = {
  product?: ProductWithRelations;
  categories: Category[];
};

export function ProductForm({ product, categories }: Props) {
  const [name, setName] = useState(product?.name ?? "");
  const [slug, setSlug] = useState(product?.slug ?? "");
  const [categoryId, setCategoryId] = useState(product?.category_id ?? categories[0]?.id ?? "");
  const [images, setImages] = useState(
    (product?.product_images ?? []).slice().sort((a, b) => a.sort_order - b.sort_order).map((image) => image.url),
  );
  const [pdf, setPdf] = useState(product?.pdf_url ?? "");
  const [design, setDesign] = useState<CardDesign | null>(product?.card_design ?? null);

  const category = categories.find((item) => item.id === categoryId) ?? null;
  const fallback = resolveCardDesign(null, category) || DEFAULT_CARD;

  return (
    <AdminForm action={saveProduct} className="grid max-w-5xl gap-6" label="Ürünü kaydet">
      {product ? <input type="hidden" name="id" value={product.id} /> : null}
      <input type="hidden" name="pdf_url" value={pdf} />
      <input type="hidden" name="image_urls" value={images.join("\n")} />
      <input type="hidden" name="card_design" value={design ? JSON.stringify(design) : ""} />

      <div className="grid gap-4 md:grid-cols-2">
        <label>
          <span className="admin-label">Ürün adı</span>
          <input
            className="admin-input"
            name="name"
            value={name}
            onChange={(event) => {
              setName(event.target.value);
              if (!product) setSlug(slugify(event.target.value));
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
        <span className="admin-label">Kategori</span>
        <select
          className="admin-input"
          name="category_id"
          value={categoryId}
          onChange={(event) => setCategoryId(event.target.value)}
          required
        >
          {categories.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </select>
      </label>

      <label>
        <span className="admin-label">Açıklama</span>
        <textarea className="admin-textarea min-h-32" name="description" defaultValue={product?.description} />
      </label>

      <MultiImageUploader values={images} onChange={setImages} />
      <FileUploader
        bucket="product-pdfs"
        folder="pdfs"
        accept="application/pdf"
        label="Ürün PDF"
        value={pdf}
        onChange={setPdf}
      />

      <CardDesignEditor
        value={design}
        fallback={fallback}
        onChange={setDesign}
        resetLabel="Kategori kart tasarımına sıfırla"
        allowCode
      />

    </AdminForm>
  );
}
