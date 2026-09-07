"use client";

import { useEffect, useState } from "react";

type Props = {
  html: string;
  css: string;
  js?: string;
  brandName?: string;
  logoUrl?: string;
};

export function SiteHeader({ html, css, js, brandName = "Litef Robotics", logoUrl }: Props) {
  const [open, setOpen] = useState(false);

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

  return (
    <header className="lf-site-header sticky top-0 z-40">
      <style>{css}</style>
      <div className="hidden md:block" dangerouslySetInnerHTML={{ __html: html }} />

      <div className="lf-mobile-bar flex h-16 items-center justify-between gap-3 px-4 md:hidden">
        <a href="/" className="min-w-0 inline-flex items-center">
          {logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logoUrl} alt={brandName} className="h-10 w-auto max-w-[58vw] object-contain" />
          ) : (
            <span className="truncate text-sm font-semibold tracking-wide uppercase">{brandName}</span>
          )}
        </a>
        <button
          type="button"
          aria-label="Menüyü aç"
          aria-expanded={open}
          onClick={() => setOpen(true)}
          className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-stone-300"
        >
          <span className="sr-only">Menü</span>
          <span className="flex flex-col gap-1.5">
            <span className="block h-0.5 w-5 bg-stone-800" />
            <span className="block h-0.5 w-5 bg-stone-800" />
            <span className="block h-0.5 w-5 bg-stone-800" />
          </span>
        </button>
      </div>

      <div className={`fixed inset-0 z-50 md:hidden ${open ? "pointer-events-auto" : "pointer-events-none"}`}>
        <button
          type="button"
          aria-label="Menüyü kapat"
          className={`absolute inset-0 bg-stone-900/20 transition-opacity duration-[280ms] ${open ? "opacity-100" : "opacity-0"}`}
          onClick={() => setOpen(false)}
        />
        <div
          className={`absolute inset-y-0 right-0 flex w-[min(100%,320px)] flex-col bg-white shadow-xl transition-transform duration-[280ms] ease-out ${
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
          <div className="lf-mobile-menu overflow-y-auto px-6 text-stone-800 [&_a]:block [&_a]:py-3 [&_a]:text-lg [&_a]:text-stone-800 [&_.lf-actions]:mt-4 [&_.lf-links]:flex [&_.lf-links]:flex-col [&_.lf-logo]:mb-4 [&_.lf-nav]:flex [&_.lf-nav]:flex-col [&_.lf-nav]:items-start">
            <div dangerouslySetInnerHTML={{ __html: html }} />
          </div>
        </div>
      </div>
    </header>
  );
}
