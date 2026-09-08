"use client";

import { useEffect, useState } from "react";
import { SiteSearch } from "@/components/public/site-search";

type Props = {
  html: string;
  css: string;
  js?: string;
  brandName?: string;
  logoUrl?: string;
};

export function SiteHeader({ html, css, js, brandName = "Litef Robotics", logoUrl }: Props) {
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  function openSearch() {
    setOpen(false);
    setSearchOpen(true);
  }

  useEffect(() => {
    if (!js?.trim()) return;
    const script = document.createElement("script");
    script.text = js;
    document.body.appendChild(script);
    return () => script.remove();
  }, [js]);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        openSearch();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  function onNavClick(event: React.MouseEvent<HTMLElement>) {
    const target = (event.target as HTMLElement).closest(".lf-search");
    if (!target) return;
    event.preventDefault();
    openSearch();
  }

  return (
    <>
      <header className="lf-site-header sticky top-0 z-40" onClick={onNavClick}>
        <style>{css}</style>
        <div className="hidden md:block" dangerouslySetInnerHTML={{ __html: html }} />

        <div className="lf-mobile-bar flex h-14 items-center justify-between gap-2 px-4 md:hidden">
          <a href="/" className="inline-flex min-w-0 items-center">
            {logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={logoUrl} alt={brandName} className="h-8 w-auto max-w-[140px] object-contain" />
            ) : (
              <span className="truncate text-sm font-semibold tracking-wide uppercase">{brandName}</span>
            )}
          </a>
          <div className="flex shrink-0 items-center gap-1.5">
            <button
              type="button"
              aria-label="Ara"
              onClick={openSearch}
              className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-stone-300"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3-3" />
              </svg>
            </button>
            <button
              type="button"
              aria-label="Menüyü aç"
              aria-expanded={open}
              onClick={() => setOpen(true)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-stone-300"
            >
              <span className="sr-only">Menü</span>
              <span className="flex flex-col gap-1.5">
                <span className="block h-0.5 w-5 bg-stone-800" />
                <span className="block h-0.5 w-5 bg-stone-800" />
                <span className="block h-0.5 w-5 bg-stone-800" />
              </span>
            </button>
          </div>
        </div>

        <div
          className={`fixed inset-0 z-50 overflow-hidden md:hidden ${open ? "pointer-events-auto" : "pointer-events-none"}`}
        >
          <button
            type="button"
            aria-label="Menüyü kapat"
            className={`absolute inset-0 bg-stone-900/20 transition-opacity duration-[280ms] ${open ? "opacity-100" : "opacity-0"}`}
            onClick={() => setOpen(false)}
          />
          <div
            className={`absolute inset-y-0 right-0 flex w-[min(100%,320px)] max-w-full flex-col overflow-hidden bg-white shadow-xl transition-transform duration-[280ms] ease-out ${
              open ? "translate-x-0" : "translate-x-full"
            }`}
          >
            <div className="flex justify-end p-4">
              <button
                type="button"
                aria-label="Menüyü kapat"
                onClick={() => setOpen(false)}
                className="h-10 w-10 rounded-full border border-stone-200 text-lg font-semibold text-stone-800"
              >
                ×
              </button>
            </div>
            <div className="lf-mobile-menu overflow-x-hidden overflow-y-auto px-6 text-stone-800 [&_a]:block [&_a]:py-3 [&_a]:text-lg [&_a]:text-stone-800 [&_button]:my-3 [&_button]:block [&_button]:w-full [&_button]:text-left [&_button]:text-lg [&_.lf-actions]:mt-4 [&_.lf-links]:flex [&_.lf-links]:flex-col [&_.lf-logo]:mb-4 [&_.lf-nav]:flex [&_.lf-nav]:flex-col [&_.lf-nav]:items-start">
              <div dangerouslySetInnerHTML={{ __html: html }} />
            </div>
          </div>
        </div>
      </header>
      <SiteSearch open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
