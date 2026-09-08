"use client";

import { useMemo, useState } from "react";
import { AdminForm } from "@/components/admin/admin-form";
import { saveModule } from "@/lib/actions/modules";
import {
  EMPTY_MODULE_FIELDS,
  MODULE_TYPES,
  buildModuleMarkup,
  type ModuleFields,
} from "@/lib/module-templates";
import type { ModuleRecord, ModuleType } from "@/lib/types";

type Props = { module?: ModuleRecord };

function asType(value: string | null | undefined): ModuleType {
  return MODULE_TYPES.some((item) => item.id === value) ? (value as ModuleType) : "custom";
}

export function ModuleForm({ module }: Props) {
  const [name, setName] = useState(module?.name ?? "");
  const [type, setType] = useState<ModuleType>(asType(module?.module_type));
  const [fields, setFields] = useState<ModuleFields>(EMPTY_MODULE_FIELDS);
  const [html, setHtml] = useState(module?.html ?? "");
  const [css, setCss] = useState(module?.css ?? "");
  const [js, setJs] = useState(module?.js ?? "");
  const [advanced, setAdvanced] = useState(type === "custom" || Boolean(module?.html));

  const preview = useMemo(() => {
    const doc = `<!doctype html><html><head><meta charset="utf-8"><style>html,body{margin:0;background:#f3f0e8;font-family:system-ui,sans-serif;} ${css}</style></head><body>${html}<script>${js}</script></body></html>`;
    return doc;
  }, [html, css, js]);

  function patchField<K extends keyof ModuleFields>(key: K, value: ModuleFields[K]) {
    setFields((current) => ({ ...current, [key]: value }));
  }

  function applyTemplate(nextType = type, nextFields = fields) {
    const markup = buildModuleMarkup(nextType, nextFields);
    if (nextType === "custom") return;
    setHtml(markup.html);
    setCss(markup.css);
    setAdvanced(true);
  }

  function changeType(next: ModuleType) {
    setType(next);
    if (next !== "custom" && !html.trim()) applyTemplate(next, fields);
  }

  return (
    <AdminForm action={saveModule} className="grid max-w-6xl gap-5">
      {module ? <input type="hidden" name="id" value={module.id} /> : null}
      <input type="hidden" name="module_type" value={type} />
      <input type="hidden" name="html" value={html} />
      <input type="hidden" name="css" value={css} />
      <input type="hidden" name="js" value={js} />

      <div className="grid gap-4 md:grid-cols-2">
        <label>
          <span className="admin-label">Modül adı</span>
          <input className="admin-input" name="name" value={name} onChange={(event) => setName(event.target.value)} required />
        </label>
        <label>
          <span className="admin-label">Modül tipi</span>
          <select className="admin-input" value={type} onChange={(event) => changeType(event.target.value as ModuleType)}>
            {MODULE_TYPES.map((item) => (
              <option key={item.id} value={item.id}>
                {item.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      {type !== "custom" ? (
        <div className="grid gap-4 rounded-2xl bg-white p-5">
          <p className="text-sm text-stone-500">Alanları doldurup şablonu uygulayın. İsterseniz gelişmiş kodu sonra düzenleyin.</p>
          {type === "hero" || type === "cta" || type === "richtext" ? (
            <>
              {type === "hero" ? (
                <label>
                  <span className="admin-label">Üst etiket</span>
                  <input className="admin-input" value={fields.eyebrow} onChange={(event) => patchField("eyebrow", event.target.value)} />
                </label>
              ) : null}
              <label>
                <span className="admin-label">Başlık</span>
                <input className="admin-input" value={fields.title} onChange={(event) => patchField("title", event.target.value)} />
              </label>
              <label>
                <span className="admin-label">Metin</span>
                <textarea className="admin-textarea min-h-24" value={fields.text} onChange={(event) => patchField("text", event.target.value)} />
              </label>
              {type !== "richtext" ? (
                <div className="grid gap-4 md:grid-cols-2">
                  <label>
                    <span className="admin-label">Buton yazısı</span>
                    <input className="admin-input" value={fields.buttonLabel} onChange={(event) => patchField("buttonLabel", event.target.value)} />
                  </label>
                  <label>
                    <span className="admin-label">Buton linki</span>
                    <input className="admin-input" value={fields.buttonHref} onChange={(event) => patchField("buttonHref", event.target.value)} />
                  </label>
                </div>
              ) : null}
            </>
          ) : null}
          {type === "features" ? (
            <div className="grid gap-4 md:grid-cols-3">
              {(
                [
                  ["feature1", "feature1Text", "1"],
                  ["feature2", "feature2Text", "2"],
                  ["feature3", "feature3Text", "3"],
                ] as const
              ).map(([titleKey, textKey, label]) => (
                <div key={titleKey} className="grid gap-2">
                  <label>
                    <span className="admin-label">Özellik {label}</span>
                    <input className="admin-input" value={fields[titleKey]} onChange={(event) => patchField(titleKey, event.target.value)} />
                  </label>
                  <textarea className="admin-textarea min-h-20" value={fields[textKey]} onChange={(event) => patchField(textKey, event.target.value)} />
                </div>
              ))}
            </div>
          ) : null}
          <button type="button" onClick={() => applyTemplate()} className="w-fit rounded-lg bg-stone-900 px-4 py-2 text-sm text-white">
            Şablonu uygula
          </button>
        </div>
      ) : null}

      <div className="grid gap-5 lg:grid-cols-2">
        <div>
          <button type="button" className="text-sm font-medium text-stone-600" onClick={() => setAdvanced((value) => !value)}>
            {advanced ? "Gelişmiş (HTML / CSS / JS) gizle" : "Gelişmiş (HTML / CSS / JS)"}
          </button>
          {advanced ? (
            <div className="mt-3 grid gap-4">
              <label>
                <span className="admin-label">HTML</span>
                <textarea className="admin-textarea min-h-40 font-mono text-xs" value={html} onChange={(event) => setHtml(event.target.value)} />
              </label>
              <label>
                <span className="admin-label">CSS</span>
                <textarea className="admin-textarea min-h-32 font-mono text-xs" value={css} onChange={(event) => setCss(event.target.value)} />
              </label>
              <label>
                <span className="admin-label">JavaScript</span>
                <textarea className="admin-textarea min-h-28 font-mono text-xs" value={js} onChange={(event) => setJs(event.target.value)} />
              </label>
            </div>
          ) : null}
        </div>
        <div>
          <p className="admin-label">Canlı önizleme</p>
          <iframe
            title="Modül önizleme"
            sandbox="allow-scripts"
            srcDoc={preview}
            className="mt-2 h-[420px] w-full rounded-2xl border border-stone-200 bg-[#f3f0e8]"
          />
        </div>
      </div>
    </AdminForm>
  );
}
