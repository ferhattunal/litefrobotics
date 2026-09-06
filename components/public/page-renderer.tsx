"use client";

import { useEffect } from "react";
import type { ModuleRecord, PageRecord } from "@/lib/types";

type Props = {
  page: PageRecord;
  modules?: ModuleRecord[];
};

export function PageRenderer({ page, modules = [] }: Props) {
  const html =
    page.render_mode === "modules"
      ? modules.map((module) => module.html).join("\n")
      : page.html;
  const css =
    page.render_mode === "modules"
      ? modules.map((module) => module.css).join("\n")
      : page.css;
  const js =
    page.render_mode === "modules"
      ? modules.map((module) => `(function(){\n${module.js}\n})();`).join("\n")
      : page.js;

  useEffect(() => {
    if (!js.trim()) return;
    const script = document.createElement("script");
    script.text = js;
    document.body.appendChild(script);
    return () => {
      script.remove();
    };
  }, [js]);

  return (
    <div>
      {css.trim() ? <style>{css}</style> : null}
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}
