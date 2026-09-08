"use client";

import { useState } from "react";
import { SaveBar } from "@/components/admin/admin-form";
import { saveSiteSettings } from "@/lib/actions/settings";
import type { NavLink, SiteConfig } from "@/lib/site-config";

type Props = { initial: SiteConfig };

function nid() {
  return crypto.randomUUID();
}

function move<T>(list: T[], index: number, dir: -1 | 1) {
  const next = index + dir;
  if (next < 0 || next >= list.length) return list;
  const copy = [...list];
  const [item] = copy.splice(index, 1);
  copy.splice(next, 0, item);
  return copy;
}

export function MenuForm({ initial }: Props) {
  const [config, setConfig] = useState(initial);
  const [device, setDevice] = useState<"desktop" | "mobile">("desktop");
  const [saved, setSaved] = useState(false);
  const links = device === "desktop" ? config.desktopLinks : config.mobileLinks;

  function patch(partial: Partial<SiteConfig>) {
    setConfig((current) => ({ ...current, ...partial }));
    setSaved(false);
  }

  function setLinks(next: NavLink[]) {
    patch(device === "desktop" ? { desktopLinks: next } : { mobileLinks: next });
  }

  function updateLink(id: string, partial: Partial<NavLink>) {
    setLinks(links.map((item) => (item.id === id ? { ...item, ...partial } : item)));
  }

  return (
    <form
      action={async (formData) => {
        formData.set("config", JSON.stringify(config));
        await saveSiteSettings(formData);
        setSaved(true);
      }}
      className="grid max-w-4xl gap-6"
    >
      <div>
        <h1 className="text-2xl font-semibold">Menüler</h1>
        <p className="mt-1 text-sm text-stone-500">Navbar masaüstü ve mobil bağlantılarını buradan yönetin.</p>
      </div>

      <div className="flex rounded-full bg-stone-100 p-1 w-fit">
        <button type="button" className={device === "desktop" ? "settings-pill-on" : "settings-pill"} onClick={() => setDevice("desktop")}>
          Masaüstü
        </button>
        <button type="button" className={device === "mobile" ? "settings-pill-on" : "settings-pill"} onClick={() => setDevice("mobile")}>
          Mobil
        </button>
      </div>

      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <p className="text-sm font-medium text-stone-500">{device === "desktop" ? "Masaüstü menü" : "Mobil menü"}</p>
        <div className="mt-4 space-y-2">
          {links.map((item, index) => (
            <div key={item.id} className="grid gap-2 md:grid-cols-[1fr_1fr_auto] md:items-center">
              <input className="admin-input" value={item.label} onChange={(event) => updateLink(item.id, { label: event.target.value })} />
              <input className="admin-input" value={item.href} onChange={(event) => updateLink(item.id, { href: event.target.value })} />
              <div className="flex items-center gap-1">
                <button type="button" className="rounded-lg border px-2 py-1 text-sm" onClick={() => setLinks(move(links, index, -1))}>
                  ↑
                </button>
                <button type="button" className="rounded-lg border px-2 py-1 text-sm" onClick={() => setLinks(move(links, index, 1))}>
                  ↓
                </button>
                <button
                  type="button"
                  className="rounded-lg border px-2 py-1 text-sm text-red-700"
                  onClick={() => setLinks(links.filter((row) => row.id !== item.id))}
                >
                  Sil
                </button>
              </div>
            </div>
          ))}
        </div>
        <button
          type="button"
          className="mt-4 text-sm text-orange-700"
          onClick={() => setLinks([...links, { id: nid(), label: "Yeni", href: "/", color: "" }])}
        >
          + Link ekle
        </button>
      </div>

      <SaveBar saved={saved} label="Menüyü kaydet" />
    </form>
  );
}
