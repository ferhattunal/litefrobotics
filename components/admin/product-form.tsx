"use client";

import { useMemo, useState } from "react";
import { AdminForm } from "@/components/admin/admin-form";
import { CardDesignEditor } from "@/components/admin/card-design-editor";
import { FileUploader } from "@/components/admin/file-uploader";
import { MultiImageUploader } from "@/components/admin/multi-image-uploader";
import { UrlPasteField } from "@/components/admin/url-paste-field";
import { saveProduct } from "@/lib/actions/products";
import { DEFAULT_CARD, resolveCardDesign } from "@/lib/card-design";
import { productPriceLabel, productStockBadge } from "@/lib/product-display";
import { parseSpecsXml } from "@/lib/specs-xml";
import { slugify } from "@/lib/utils";
import type { CardDesign, Category, PageRecord, PriceDisplay, ProductWithRelations } from "@/lib/types";

type Props = {
  product?: ProductWithRelations;
  categories: Category[];
  pages: PageRecord[];
  defaultCategoryId?: string;
};

export function ProductForm({ product, categories, pages, defaultCategoryId }: Props) {
  const [name, setName] = useState(product?.name ?? "");
  const [slug, setSlug] = useState(product?.slug ?? "");
  const [categoryId, setCategoryId] = useState(
    product?.category_id ?? defaultCategoryId ?? categories[0]?.id ?? "",
  );
  const [images, setImages] = useState(
    (product?.product_images ?? []).slice().sort((a, b) => a.sort_order - b.sort_order).map((image) => image.url),
  );
  const [pdf, setPdf] = useState(product?.pdf_url ?? "");
  const [aboutImage, setAboutImage] = useState(product?.about_image_url ?? "");
  const [design, setDesign] = useState<CardDesign | null>(product?.card_design ?? null);
  const [priceTry, setPriceTry] = useState(product?.price_try != null ? String(product.price_try) : "");
  const [priceUsd, setPriceUsd] = useState(product?.price_usd != null ? String(product.price_usd) : "");
  const [priceDisplay, setPriceDisplay] = useState<PriceDisplay>(product?.price_display ?? "try");
  const [showPrice, setShowPrice] = useState(product?.show_price_on_card ?? true);
  const [showStock, setShowStock] = useState(product?.show_stock_badge_on_card ?? true);
  const [showHome, setShowHome] = useState(product?.show_on_homepage ?? false);
  const [featured, setFeatured] = useState(product?.featured ?? false);
  const [inStock, setInStock] = useState(product?.in_stock ?? true);
  const [stockQty, setStockQty] = useState(String(product?.stock_qty ?? 0));
  const [metaTitle, setMetaTitle] = useState(product?.meta_title || product?.name || "");
  const [metaDescription, setMetaDescription] = useState(product?.meta_description || "");
  const [specsXml, setSpecsXml] = useState(product?.specs_xml ?? "");
  const [landingIds, setLandingIds] = useState<string[]>(
    (product?.product_landing_pages ?? []).map((row) => row.page_id),
  );

  const category = categories.find((item) => item.id === categoryId) ?? null;
  const fallback = resolveCardDesign(null, category) || DEFAULT_CARD;
  const specs = useMemo(() => (specsXml.trim() ? parseSpecsXml(specsXml) : null), [specsXml]);
  const previewPrice = productPriceLabel({
    price_try: priceTry ? Number(priceTry) : null,
    price_usd: priceUsd ? Number(priceUsd) : null,
    price_display: priceDisplay,
  });
  const previewStock = productStockBadge({ in_stock: inStock, stock_qty: Number(stockQty) || 0 });

  function toggleLanding(id: string) {
    setLandingIds((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));
  }

  return (
    <AdminForm action={saveProduct} className="grid max-w-5xl gap-6" label="Ürünü kaydet">
      {product ? <input type="hidden" name="id" value={product.id} /> : null}
      <input type="hidden" name="pdf_url" value={pdf} />
      <input type="hidden" name="about_image_url" value={aboutImage} />
      <input type="hidden" name="image_urls" value={images.join("\n")} />
      <input type="hidden" name="card_design" value={design ? JSON.stringify(design) : ""} />
      <input type="hidden" name="landing_page_ids" value={landingIds.join(",")} />

      <section className="grid gap-4 rounded-2xl bg-white p-5">
        <h2 className="text-lg font-semibold">Kimlik</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <label>
            <span className="admin-label">H1 Ürün adı</span>
            <input
              className="admin-input"
              name="name"
              value={name}
              onChange={(event) => {
                setName(event.target.value);
                if (!product) setSlug(slugify(event.target.value));
                if (!product) setMetaTitle(event.target.value);
              }}
              required
            />
          </label>
          <label>
            <span className="admin-label">SEO slug</span>
            <input className="admin-input" name="slug" value={slug} onChange={(event) => setSlug(event.target.value)} required />
          </label>
          <label>
            <span className="admin-label">Marka</span>
            <input className="admin-input" name="brand" defaultValue={product?.brand ?? ""} />
          </label>
          <label>
            <span className="admin-label">Ürün serisi</span>
            <input className="admin-input" name="series" defaultValue={product?.series ?? ""} />
          </label>
          <label>
            <span className="admin-label">Model</span>
            <input className="admin-input" name="model" defaultValue={product?.model ?? ""} />
          </label>
          <label>
            <span className="admin-label">Kategori</span>
            <select className="admin-input" name="category_id" value={categoryId} onChange={(event) => setCategoryId(event.target.value)} required>
              {categories.map((item) => (
                <option key={item.id} value={item.id}>{item.name}</option>
              ))}
            </select>
          </label>
        </div>
      </section>

      <section className="grid gap-4 rounded-2xl bg-white p-5">
        <h2 className="text-lg font-semibold">Fiyat ve stok</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <label>
            <span className="admin-label">Fiyat (TL)</span>
            <input className="admin-input" name="price_try" value={priceTry} onChange={(event) => setPriceTry(event.target.value)} />
          </label>
          <label>
            <span className="admin-label">Fiyat (USD)</span>
            <input className="admin-input" name="price_usd" value={priceUsd} onChange={(event) => setPriceUsd(event.target.value)} />
          </label>
          <label>
            <span className="admin-label">Kartta gösterilecek para birimi</span>
            <select className="admin-input" name="price_display" value={priceDisplay} onChange={(event) => setPriceDisplay(event.target.value as PriceDisplay)}>
              <option value="try">TL</option>
              <option value="usd">USD</option>
              <option value="both">TL ve USD</option>
            </select>
          </label>
          <label>
            <span className="admin-label">Stok adedi</span>
            <input className="admin-input" name="stock_qty" type="number" min={0} value={stockQty} onChange={(event) => setStockQty(event.target.value)} />
          </label>
          <label className="flex items-center gap-2 text-sm mt-6">
            <input type="checkbox" name="in_stock" value="1" checked={inStock} onChange={(event) => setInStock(event.target.checked)} />
            Stokta
          </label>
        </div>
      </section>

      <section className="grid gap-3 rounded-2xl bg-white p-5">
        <h2 className="text-lg font-semibold">Görünürlük</h2>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="show_on_homepage" value="1" checked={showHome} onChange={(event) => setShowHome(event.target.checked)} />
          Ana sayfa vitrininde göster
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="show_price_on_card" value="1" checked={showPrice} onChange={(event) => setShowPrice(event.target.checked)} />
          Fiyatı ürün kartında göster
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="show_stock_badge_on_card" value="1" checked={showStock} onChange={(event) => setShowStock(event.target.checked)} />
          Kartlarda stok rozeti göster
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="featured" value="1" checked={featured} onChange={(event) => setFeatured(event.target.checked)} />
          Ürünü öne çıkar
        </label>
      </section>

      <section className="grid gap-4 rounded-2xl bg-white p-5">
        <h2 className="text-lg font-semibold">Ürün görselleri</h2>
        <p className="text-sm text-stone-500">Doğrudan dosya yükleyin veya dosya yöneticisinden kopyaladığınız linki yapıştırın. İlk görsel ana görseldir.</p>
        <MultiImageUploader values={images} onChange={setImages} />
      </section>

      <section className="grid gap-4 rounded-2xl bg-white p-5">
        <h2 className="text-lg font-semibold">Hakkında</h2>
        <label>
          <span className="admin-label">H2 başlık</span>
          <input className="admin-input" name="about_heading" defaultValue={product?.about_heading ?? ""} />
        </label>
        <label>
          <span className="admin-label">Hakkında metni</span>
          <textarea className="admin-textarea min-h-32" name="about_html" defaultValue={product?.about_html ?? ""} />
        </label>
        <FileUploader bucket="product-images" folder="about" accept="image/*" label="Hakkında görseli yükle" value={aboutImage} onChange={setAboutImage} />
        <UrlPasteField label="veya görsel URL yapıştır" onApply={setAboutImage} />
      </section>

      <section className="grid gap-4 rounded-2xl bg-white p-5">
        <h2 className="text-lg font-semibold">Ürün açıklaması</h2>
        <textarea className="admin-textarea min-h-32" name="description" defaultValue={product?.description} />
      </section>

      <section className="grid gap-4 rounded-2xl bg-white p-5">
        <h2 className="text-lg font-semibold">Teknik belge</h2>
        <FileUploader bucket="product-pdfs" folder="pdfs" accept="application/pdf" label="Teknik belge (PDF)" value={pdf} onChange={setPdf} />
      </section>

      <section className="grid gap-4 rounded-2xl bg-white p-5">
        <h2 className="text-lg font-semibold">Teknik özellikler (XML)</h2>
        <textarea
          className="admin-textarea min-h-40 font-mono text-xs"
          name="specs_xml"
          value={specsXml}
          onChange={(event) => setSpecsXml(event.target.value)}
          placeholder={'<Item>\n  <NameEn>Manufacturer</NameEn>\n  <NameTr>Üretici</NameTr>\n  <Value>LiTEF</Value>\n</Item>'}
        />
        {specsXml.trim() && !specs ? <p className="text-sm text-red-600">XML okunamadı. NameTr/Value kayıtları veya yaprak etiketler kullanın.</p> : null}
        {specs ? (
          <ul className="text-sm text-stone-600">
            {specs.map((row) => (
              <li key={`${row.label}-${row.value}`}>
                <strong>{row.label}:</strong> {row.value}
              </li>
            ))}
          </ul>
        ) : null}
      </section>

      <section className="grid gap-3 rounded-2xl bg-white p-5">
        <h2 className="text-lg font-semibold">Gösterilecek landing sayfaları</h2>
        {!pages.length ? <p className="text-sm text-stone-500">Henüz landing sayfası yok.</p> : null}
        {pages.map((page) => (
          <label key={page.id} className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={landingIds.includes(page.id)} onChange={() => toggleLanding(page.id)} />
            {page.title} <span className="text-stone-400">/{page.is_homepage ? "" : page.slug}</span>
          </label>
        ))}
      </section>

      <section className="grid gap-4 rounded-2xl bg-white p-5">
        <h2 className="text-lg font-semibold">SEO</h2>
        <label>
          <span className="admin-label">Meta başlık</span>
          <input className="admin-input" name="meta_title" value={metaTitle} onChange={(event) => setMetaTitle(event.target.value)} />
        </label>
        <label>
          <span className="admin-label">Meta açıklaması</span>
          <textarea className="admin-textarea min-h-24" name="meta_description" value={metaDescription} onChange={(event) => setMetaDescription(event.target.value)} />
        </label>
        <div>
          <p className="admin-label">Google önizlemesi</p>
          <div className="mt-2 max-w-xl rounded-lg border border-stone-200 bg-white p-4">
            <p className="truncate text-xl text-[#1a0dab]">{(metaTitle || name || "Ürün başlığı").slice(0, 60)}</p>
            <p className="truncate text-sm text-[#006621]">litefrobotics.com/urunler/{slug || "urun-slug"}</p>
            <p className="mt-1 text-sm text-stone-600">{(metaDescription || "Meta açıklaması burada görünür.").slice(0, 160)}</p>
          </div>
        </div>
      </section>

      <CardDesignEditor
        value={design}
        fallback={fallback}
        onChange={setDesign}
        resetLabel="Kategori kart tasarımına sıfırla"
        allowCode
        preview={{
          name: name || "Örnek ürün",
          image: images[0],
          price: showPrice ? previewPrice : "",
          stock: showStock ? previewStock : "",
          featured,
        }}
      />
    </AdminForm>
  );
}
