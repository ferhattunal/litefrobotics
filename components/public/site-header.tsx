"use client";

import { useState } from "react";

type Props = {
  html: string;
  css: string;
};

export function SiteHeader({ html, css }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-stone-200/70 bg-white/90 backdrop-blur">
      <style>{css}</style>
      <div className="hidden md:block" dangerouslySetInnerHTML={{ __html: html }} />

      <div className="flex h-14 items-center justify-between px-4 md:hidden">
        <a href="/" className="text-sm font-semibold tracking-wide uppercase">
          Litef Robotics
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
          <div className="lf-mobile-menu px-6 text-white [&_a]:block [&_a]:py-3 [&_a]:text-lg [&_a]:text-white [&_.lf-links]:flex [&_.lf-links]:flex-col [&_.lf-nav]:flex [&_.lf-nav]:flex-col [&_.lf-nav]:items-start">
            <div dangerouslySetInnerHTML={{ __html: html }} />
          </div>
        </div>
      ) : null}
    </header>
  );
}
