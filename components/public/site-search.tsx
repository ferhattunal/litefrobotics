"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { SearchCatalogResult, SearchCategoryHit, SearchProductHit } from "@/lib/queries";

type Props = {
  open: boolean;
  onClose: () => void;
};

const EMPTY: SearchCatalogResult = { products: [], categories: [] };

function brandLine(product: SearchProductHit) {
  return [product.brand, product.series || product.model].filter(Boolean).join(" · ");
}

export function SiteSearch({ open, onClose }: Props) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<SearchCatalogResult>(EMPTY);

  useEffect(() => {
    if (open) return;
    setQuery("");
    setResults(EMPTY);
    setLoading(false);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const timer = window.setTimeout(() => inputRef.current?.focus(), 40);
    return () => {
      document.body.style.overflow = previous;
      window.clearTimeout(timer);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(query.trim())}`, {
          signal: controller.signal,
        });
        if (!response.ok) throw new Error("search failed");
        const data = (await response.json()) as SearchCatalogResult;
        setResults({
          products: data.products ?? [],
          categories: data.categories ?? [],
        });
      } catch (error) {
        if ((error as { name?: string }).name !== "AbortError") setResults(EMPTY);
      } finally {
        setLoading(false);
      }
    }, query.trim() ? 180 : 0);
    return () => {
      controller.abort();
      window.clearTimeout(timer);
    };
  }, [open, query]);

  if (!open) return null;

  const hasQuery = Boolean(query.trim());
  const empty = !results.categories.length && !results.products.length;

  return (
    <div className="fixed inset-0 z-[80] flex items-start justify-center px-3 pt-[max(0.75rem,env(safe-area-inset-top))] pb-6 sm:px-6 sm:pt-[12vh]">
      <button
        type="button"
        aria-label="Aramayı kapat"
        className="absolute inset-0 bg-stone-900/45 backdrop-blur-md"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={inputId}
        className="relative flex max-h-[min(88dvh,720px)] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-white/50 bg-white/80 shadow-[0_24px_80px_rgba(15,23,42,0.28)] backdrop-blur-xl sm:rounded-3xl"
      >
        <form
          className="flex items-center gap-2 border-b border-stone-200/80 px-3 py-3 sm:gap-3 sm:px-5 sm:py-4"
          onSubmit={(event) => event.preventDefault()}
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0 text-[var(--lf-625)]" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3-3" />
          </svg>
          <input
            ref={inputRef}
            id={inputId}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Ürün, kategori, marka veya model ara…"
            autoComplete="off"
            enterKeyHint="search"
            className="min-w-0 flex-1 bg-transparent text-base text-stone-900 outline-none placeholder:text-stone-400 sm:text-[17px]"
          />
          {query ? (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="rounded-full px-2 py-1 text-xs font-medium text-stone-500 hover:bg-white/70"
            >
              Temizle
            </button>
          ) : null}
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-stone-200 bg-white/70 text-lg text-stone-700"
            aria-label="Kapat"
          >
            ×
          </button>
        </form>

        <div className="min-h-0 flex-1 overflow-y-auto px-3 py-4 sm:px-5">
          {loading ? <p className="px-2 py-6 text-sm text-stone-500">Aranıyor…</p> : null}
          {!loading && empty ? (
            <p className="px-2 py-6 text-sm text-stone-500">
              {hasQuery ? "Eşleşen ürün veya kategori bulunamadı." : "Aramaya başlamak için yazın."}
            </p>
          ) : null}
          {!loading && results.categories.length ? (
            <section className="mb-5">
              <h2 className="px-2 text-[11px] font-semibold tracking-[0.14em] text-[var(--lf-625)] uppercase">
                Kategoriler
              </h2>
              <ul className="mt-2 grid gap-1">
                {results.categories.map((category) => (
                  <CategoryRow key={category.id} category={category} />
                ))}
              </ul>
            </section>
          ) : null}
          {!loading && results.products.length ? (
            <section>
              <h2 className="px-2 text-[11px] font-semibold tracking-[0.14em] text-[var(--lf-625)] uppercase">
                {hasQuery ? "Ürünler" : "Vitrin"}
              </h2>
              <ul className="mt-2 grid gap-1">
                {results.products.map((product) => (
                  <ProductRow key={product.id} product={product} />
                ))}
              </ul>
            </section>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function CategoryRow({ category }: { category: SearchCategoryHit }) {
  return (
    <li>
      <a
        href={category.href}
        className="flex items-center gap-3 rounded-2xl px-2 py-2 transition hover:bg-white/80"
      >
        <span className="h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-[#eef1f4]">
          {category.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={category.image} alt="" className="h-full w-full object-cover" />
          ) : null}
        </span>
        <span className="min-w-0">
          <span className="block truncate font-medium text-stone-900">{category.name}</span>
          <span className="text-xs text-stone-500">Kategori</span>
        </span>
      </a>
    </li>
  );
}

function ProductRow({ product }: { product: SearchProductHit }) {
  const meta = [product.category, brandLine(product)].filter(Boolean).join(" · ");
  return (
    <li>
      <a
        href={product.href}
        className="flex items-center gap-3 rounded-2xl px-2 py-2 transition hover:bg-white/80"
      >
        <span className="h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-[#eef1f4]">
          {product.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={product.image} alt="" className="h-full w-full object-contain p-1" />
          ) : null}
        </span>
        <span className="min-w-0">
          <span className="block truncate font-medium text-stone-900">{product.name}</span>
          {meta ? <span className="block truncate text-xs text-stone-500">{meta}</span> : null}
        </span>
      </a>
    </li>
  );
}
