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

  return (
    <header className="sticky top-0 z-40 border-b border-stone-200/70 bg-white/90 backdrop-blur">
      <style>{css}</style>
      <div className="hidden md:block" dangerouslySetInnerHTML={{ __html: html }} />

      <div className="flex h-14 items-center justify-between px-4 md:hidden">
        <a href="/" className="inline-flex items-center gap-2 text-sm font-semibold tracking-wide uppercase">
          {logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logoUrl} alt={brandName} className="h-8 w-auto" />
          ) : (
            brandName
          )}
        </a>
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

      {open ? (
        <div className="fixed inset-0 z-50 md:hidden" style={{ background: "rgba(17, 24, 39, 0.7)" }}>
          <div className="flex justify-end p-4">
            <button
              type="button"
              aria-label="Menüyü kapat"
              onClick={() => setOpen(false)}
              className="h-10 w-10 rounded-full bg-white text-lg font-semibold text-stone-800"
            >
              ×
            </button>
          </div>
          <div className="lf-mobile-menu px-6 text-white [&_a]:block [&_a]:py-3 [&_a]:text-lg [&_a]:text-white [&_.lf-actions]:mt-4 [&_.lf-links]:flex [&_.lf-links]:flex-col [&_.lf-logo]:mb-4 [&_.lf-nav]:flex [&_.lf-nav]:flex-col [&_.lf-nav]:items-start">
            <div dangerouslySetInnerHTML={{ __html: html }} />
          </div>
        </div>
      ) : null}
    </header>
  );
}
