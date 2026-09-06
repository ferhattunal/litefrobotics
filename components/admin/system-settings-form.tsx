"use client";

import { useMemo, useState } from "react";
import { saveSiteSettings } from "@/lib/actions/settings";
import { BrandAssetField } from "@/components/admin/brand-asset-field";
import {
  generateNavbarHtml,
  type FooterColumn,
  type FooterLink,
  type NavLink,
  type SiteConfig,
} from "@/lib/site-config";

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

export function SystemSettingsForm({ initial }: Props) {
  const [config, setConfig] = useState(initial);
  const [device, setDevice] = useState<"desktop" | "mobile">("desktop");
  const [advanced, setAdvanced] = useState(false);
  const [styleId, setStyleId] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const links = device === "desktop" ? config.desktopLinks : config.mobileLinks;
  const previewHtml = useMemo(() => generateNavbarHtml(config, device), [config, device]);

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
      className="settings-shell"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Sistem ayarları</h1>
          <p className="mt-1 text-sm text-white/50">Marka, logo, iletişim, navbar ve footer düzeni</p>
        </div>
        <button type="submit" className="settings-save">
          {saved ? "Kaydedildi" : "Kaydet"}
        </button>
      </div>

      <section className="settings-card">
        <h2>Marka ve iletişim</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <label>
            <span className="settings-kicker">Bayi adı</span>
            <input className="settings-input" value={config.brandName} onChange={(e) => patch({ brandName: e.target.value })} />
          </label>
          <label>
            <span className="settings-kicker">Telefon</span>
            <input className="settings-input" value={config.phone} onChange={(e) => patch({ phone: e.target.value })} />
          </label>
          <label>
            <span className="settings-kicker">WhatsApp numarası</span>
            <input className="settings-input" value={config.whatsapp} placeholder="9053xxxxxxxx" onChange={(e) => patch({ whatsapp: e.target.value })} />
            <span className="settings-help">Ürün teklif formundaki buton. Boşsa telefon kullanılır. Örn. 9053xxxxxxxx</span>
          </label>
          <label>
            <span className="settings-kicker">E-posta</span>
            <input className="settings-input" value={config.email} onChange={(e) => patch({ email: e.target.value })} />
          </label>
        </div>
        <label className="mt-4 block">
          <span className="settings-kicker">Teklif bildirim mailleri</span>
          <textarea className="settings-input min-h-24" value={config.quoteEmails} onChange={(e) => patch({ quoteEmails: e.target.value })} />
          <span className="settings-help">Yeni teklif hem panele düşer hem bu adreslere gider. Birden fazla adres için her satıra bir e-posta yazın.</span>
        </label>
        <label className="mt-4 block">
          <span className="settings-kicker">Adres</span>
          <input className="settings-input" value={config.address} onChange={(e) => patch({ address: e.target.value })} />
        </label>
        <label className="mt-4 block">
          <span className="settings-kicker">Google Maps yerleştirme URL / iframe src</span>
          <input className="settings-input" value={config.mapsEmbedUrl} onChange={(e) => patch({ mapsEmbedUrl: e.target.value })} />
          <span className="settings-help">Harita iframe src değerini yapıştırın</span>
        </label>
      </section>

      <section className="settings-card">
        <h2>Navbar</h2>
        <p className="mt-1 text-sm text-white/50">
          Kod yazmadan masaüstü ve mobil butonları, renkleri ve hover stillerini ayrı ayrı düzenleyin. Önizleme seçilen
          cihaza göre değişir.
        </p>
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <BrandAssetField label="Logo (WebP)" value={config.logoUrl} onChange={(logoUrl) => patch({ logoUrl })} />
          <BrandAssetField label="Favicon (WebP)" value={config.faviconUrl} onChange={(faviconUrl) => patch({ faviconUrl })} />
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
          <label>
            <span className="settings-kicker">Geçiş animasyonu</span>
            <select
              className="settings-input"
              value={config.hoverAnimation}
              onChange={(e) => patch({ hoverAnimation: e.target.value as SiteConfig["hoverAnimation"] })}
            >
              <option value="underline">Alt çizgi</option>
              <option value="color">Renk değişimi</option>
              <option value="background">Arka plan</option>
              <option value="none">Yok</option>
            </select>
            <span className="settings-help">Menü bağlantılarında hover efekti</span>
          </label>
          <div className="flex rounded-full bg-[#111318] p-1">
            <button type="button" className={device === "desktop" ? "settings-pill-on" : "settings-pill"} onClick={() => setDevice("desktop")}>
              Masaüstü
            </button>
            <button type="button" className={device === "mobile" ? "settings-pill-on" : "settings-pill"} onClick={() => setDevice("mobile")}>
              Mobil
            </button>
          </div>
        </div>

        <div className="mt-6">
          <p className="settings-kicker">{device === "desktop" ? "Masaüstü butonları" : "Mobil butonları"}</p>
          <div className="mt-3 space-y-2">
            {links.map((item, index) => (
              <div key={item.id} className="grid gap-2 md:grid-cols-[1fr_1fr_auto] md:items-center">
                <input className="settings-input" value={item.label} onChange={(e) => updateLink(item.id, { label: e.target.value })} />
                <input className="settings-input" value={item.href} onChange={(e) => updateLink(item.id, { href: e.target.value })} />
                <div className="flex items-center gap-1">
                  <button type="button" className="settings-mini" onClick={() => setStyleId(styleId === item.id ? null : item.id)}>
                    Stil
                  </button>
                  <button type="button" className="settings-icon" onClick={() => setLinks(move(links, index, -1))}>
                    ↑
                  </button>
                  <button type="button" className="settings-icon" onClick={() => setLinks(move(links, index, 1))}>
                    ↓
                  </button>
                  <button type="button" className="settings-icon text-red-400" onClick={() => setLinks(links.filter((row) => row.id !== item.id))}>
                    ⌫
                  </button>
                </div>
                {styleId === item.id ? (
                  <label className="md:col-span-3">
                    <span className="settings-kicker">Yazı rengi</span>
                    <input className="settings-input max-w-48" value={item.color} placeholder="#e5e7eb" onChange={(e) => updateLink(item.id, { color: e.target.value })} />
                  </label>
                ) : null}
              </div>
            ))}
          </div>
          <button
            type="button"
            className="mt-3 text-sm text-[#9fe870]"
            onClick={() => setLinks([...links, { id: nid(), label: "Yeni", href: "/", color: "" }])}
          >
            + Buton ekle
          </button>
        </div>

        <div className="mt-5 flex flex-wrap gap-6 text-sm">
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={config.showPhoneButton} onChange={(e) => patch({ showPhoneButton: e.target.checked })} />
            Telefon butonu
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={config.showWhatsappButton} onChange={(e) => patch({ showWhatsappButton: e.target.checked })} />
            WhatsApp / uzman butonu
          </label>
        </div>

        <div className="mt-8">
          <p className="settings-kicker">{device === "desktop" ? "Masaüstü önizleme" : "Mobil önizleme"}</p>
          <div className="mt-2 overflow-x-auto rounded-xl border border-white/10 bg-[#0b0d10] px-4 py-3">
            <style>{`.lf-preview-box .lf-nav{max-width:none;padding:8px 4px}.lf-preview-box .lf-links a{color:#d1d5db}.lf-preview-box .lf-logo{color:#9fe870}`}</style>
            <div className="lf-preview-box" dangerouslySetInnerHTML={{ __html: previewHtml }} />
          </div>
        </div>

        <button type="button" className="mt-6 text-sm text-white/50" onClick={() => setAdvanced((value) => !value)}>
          Gelişmiş (HTML / CSS / JS)
        </button>
        {advanced ? (
          <div className="mt-4 grid gap-4">
            <label>
              <span className="settings-kicker">Navbar HTML</span>
              <textarea className="settings-input min-h-28 font-mono text-xs" value={config.navbarHtml} onChange={(e) => patch({ navbarHtml: e.target.value })} />
            </label>
            <label>
              <span className="settings-kicker">Navbar CSS</span>
              <textarea className="settings-input min-h-24 font-mono text-xs" value={config.navbarCss} onChange={(e) => patch({ navbarCss: e.target.value })} />
            </label>
            <label>
              <span className="settings-kicker">Navbar JS</span>
              <textarea className="settings-input min-h-20 font-mono text-xs" value={config.navbarJs} onChange={(e) => patch({ navbarJs: e.target.value })} />
            </label>
          </div>
        ) : null}
      </section>

      <section className="settings-card">
        <h2>Footer</h2>
        <p className="mt-1 text-sm text-white/50">
          Sitedeki alt bilgi metinlerini, sütunları ve bağlantıları buradan ekleyip düzenleyebilirsiniz. Telefon, e-posta
          ve adres üstteki iletişim alanından gelir.
        </p>
        <label className="mt-5 block">
          <span className="settings-kicker">Tanıtım yazısı</span>
          <textarea className="settings-input min-h-24" value={config.footerIntro} onChange={(e) => patch({ footerIntro: e.target.value })} />
          <span className="settings-help">Logo altındaki kısa metin</span>
        </label>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <label>
            <span className="settings-kicker">LinkedIn adresi</span>
            <input className="settings-input" value={config.linkedinUrl} onChange={(e) => patch({ linkedinUrl: e.target.value })} />
          </label>
          <label>
            <span className="settings-kicker">Instagram adresi</span>
            <input className="settings-input" value={config.instagramUrl} onChange={(e) => patch({ instagramUrl: e.target.value })} />
          </label>
        </div>

        <div className="mt-8 flex items-center justify-between">
          <p className="settings-kicker mb-0">Sütunlar</p>
          <button
            type="button"
            className="text-sm text-[#9fe870]"
            onClick={() =>
              patch({
                footerColumns: [
                  ...config.footerColumns,
                  { id: nid(), type: "links", title: "Yeni sütun", links: [] },
                ],
              })
            }
          >
            + Sütun ekle
          </button>
        </div>
        <div className="mt-3 space-y-4">
          {config.footerColumns.map((column, index) => (
            <FooterColumnEditor
              key={column.id}
              column={column}
              onChange={(next) =>
                patch({ footerColumns: config.footerColumns.map((row) => (row.id === column.id ? next : row)) })
              }
              onMove={(dir) => patch({ footerColumns: move(config.footerColumns, index, dir) })}
              onRemove={() => patch({ footerColumns: config.footerColumns.filter((row) => row.id !== column.id) })}
            />
          ))}
        </div>

        <label className="mt-6 block">
          <span className="settings-kicker">Telif yazısı</span>
          <input className="settings-input" value={config.copyright} onChange={(e) => patch({ copyright: e.target.value })} />
          <span className="settings-help">Yıl için {"{year}"} yazın. Örn. © {"{year}"} Litef Robotics. Tüm hakları saklıdır.</span>
        </label>

        <div className="mt-6">
          <p className="settings-kicker">Alt bağlantılar</p>
          <div className="mt-3 space-y-2">
            {config.footerLinks.map((item, index) => (
              <div key={item.id} className="grid gap-2 md:grid-cols-[1fr_1fr_auto]">
                <input
                  className="settings-input"
                  value={item.label}
                  onChange={(e) =>
                    patch({
                      footerLinks: config.footerLinks.map((row) => (row.id === item.id ? { ...row, label: e.target.value } : row)),
                    })
                  }
                />
                <input
                  className="settings-input"
                  value={item.href}
                  onChange={(e) =>
                    patch({
                      footerLinks: config.footerLinks.map((row) => (row.id === item.id ? { ...row, href: e.target.value } : row)),
                    })
                  }
                />
                <div className="flex gap-1">
                  <button type="button" className="settings-icon" onClick={() => patch({ footerLinks: move(config.footerLinks, index, -1) })}>
                    ↑
                  </button>
                  <button type="button" className="settings-icon" onClick={() => patch({ footerLinks: move(config.footerLinks, index, 1) })}>
                    ↓
                  </button>
                  <button
                    type="button"
                    className="settings-icon text-red-400"
                    onClick={() => patch({ footerLinks: config.footerLinks.filter((row) => row.id !== item.id) })}
                  >
                    ⌫
                  </button>
                </div>
              </div>
            ))}
          </div>
          <button
            type="button"
            className="mt-3 text-sm text-[#9fe870]"
            onClick={() => patch({ footerLinks: [...config.footerLinks, { id: nid(), label: "Yeni", href: "/" }] })}
          >
            + Bağlantı ekle
          </button>
        </div>

        {advanced ? (
          <div className="mt-6 grid gap-4">
            <label>
              <span className="settings-kicker">Footer HTML</span>
              <textarea className="settings-input min-h-28 font-mono text-xs" value={config.footerHtml} onChange={(e) => patch({ footerHtml: e.target.value })} />
            </label>
            <label>
              <span className="settings-kicker">Footer CSS</span>
              <textarea className="settings-input min-h-24 font-mono text-xs" value={config.footerCss} onChange={(e) => patch({ footerCss: e.target.value })} />
            </label>
            <label>
              <span className="settings-kicker">Footer JS</span>
              <textarea className="settings-input min-h-20 font-mono text-xs" value={config.footerJs} onChange={(e) => patch({ footerJs: e.target.value })} />
            </label>
          </div>
        ) : null}
      </section>
    </form>
  );
}

function FooterColumnEditor({
  column,
  onChange,
  onMove,
  onRemove,
}: {
  column: FooterColumn;
  onChange: (column: FooterColumn) => void;
  onMove: (dir: -1 | 1) => void;
  onRemove: () => void;
}) {
  return (
    <div className="rounded-xl border border-white/10 p-4">
      <div className="grid gap-3 md:grid-cols-[1fr_180px_auto] md:items-end">
        <label>
          <span className="settings-kicker">Sütun başlığı</span>
          <input className="settings-input" value={column.title} onChange={(e) => onChange({ ...column, title: e.target.value })} />
        </label>
        <label>
          <span className="settings-kicker">Tür</span>
          <select
            className="settings-input"
            value={column.type}
            onChange={(e) => {
              const type = e.target.value;
              if (type === "contact") {
                onChange({ id: column.id, type: "contact", title: column.title, locations: [], hours: "" });
              } else {
                onChange({ id: column.id, type: "links", title: column.title, links: [] });
              }
            }}
          >
            <option value="links">Bağlantı listesi</option>
            <option value="contact">İletişim</option>
          </select>
        </label>
        <div className="flex gap-1">
          <button type="button" className="settings-icon" onClick={() => onMove(-1)}>
            ↑
          </button>
          <button type="button" className="settings-icon" onClick={() => onMove(1)}>
            ↓
          </button>
          <button type="button" className="settings-icon text-red-400" onClick={onRemove}>
            ⌫
          </button>
        </div>
      </div>

      {column.type === "contact" ? (
        <div className="mt-4">
          <p className="settings-help">Telefon, e-posta ve adres &quot;Marka ve iletişim&quot; bölümünden gelir.</p>
          <p className="settings-kicker mt-4">Lokasyon satırları</p>
          <div className="mt-2 space-y-2">
            {column.locations.map((line, index) => (
              <div key={`${column.id}-loc-${index}`} className="flex gap-2">
                <input
                  className="settings-input"
                  value={line}
                  onChange={(e) =>
                    onChange({
                      ...column,
                      locations: column.locations.map((current, i) => (i === index ? e.target.value : current)),
                    })
                  }
                />
                <button
                  type="button"
                  className="settings-icon text-red-400"
                  onClick={() => onChange({ ...column, locations: column.locations.filter((_, i) => i !== index) })}
                >
                  ⌫
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            className="mt-2 text-sm text-[#9fe870]"
            onClick={() => onChange({ ...column, locations: [...column.locations, ""] })}
          >
            + Lokasyon ekle
          </button>
          <label className="mt-4 block">
            <span className="settings-kicker">Çalışma saatleri</span>
            <input className="settings-input" value={column.hours} onChange={(e) => onChange({ ...column, hours: e.target.value })} />
          </label>
        </div>
      ) : (
        <div className="mt-4 space-y-2">
          {column.links.map((item, index) => (
            <LinkRow
              key={item.id}
              item={item}
              onChange={(next) =>
                onChange({ ...column, links: column.links.map((row) => (row.id === item.id ? next : row)) })
              }
              onMove={(dir) => onChange({ ...column, links: move(column.links, index, dir) })}
              onRemove={() => onChange({ ...column, links: column.links.filter((row) => row.id !== item.id) })}
            />
          ))}
          <button
            type="button"
            className="text-sm text-[#9fe870]"
            onClick={() => onChange({ ...column, links: [...column.links, { id: nid(), label: "Yeni", href: "/" }] })}
          >
            + Bağlantı ekle
          </button>
        </div>
      )}
    </div>
  );
}

function LinkRow({
  item,
  onChange,
  onMove,
  onRemove,
}: {
  item: FooterLink;
  onChange: (item: FooterLink) => void;
  onMove: (dir: -1 | 1) => void;
  onRemove: () => void;
}) {
  return (
    <div className="grid gap-2 md:grid-cols-[1fr_1fr_auto]">
      <input className="settings-input" value={item.label} onChange={(e) => onChange({ ...item, label: e.target.value })} />
      <input className="settings-input" value={item.href} onChange={(e) => onChange({ ...item, href: e.target.value })} />
      <div className="flex gap-1">
        <button type="button" className="settings-icon" onClick={() => onMove(-1)}>
          ↑
        </button>
        <button type="button" className="settings-icon" onClick={() => onMove(1)}>
          ↓
        </button>
        <button type="button" className="settings-icon text-red-400" onClick={onRemove}>
          ⌫
        </button>
      </div>
    </div>
  );
}
