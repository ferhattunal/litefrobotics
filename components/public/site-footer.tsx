"use client";

import { useEffect } from "react";

type Props = {
  html: string;
  css: string;
  js?: string;
};

export function SiteFooter({ html, css, js }: Props) {
  useEffect(() => {
    if (!js?.trim()) return;
    const script = document.createElement("script");
    script.text = js;
    document.body.appendChild(script);
    return () => script.remove();
  }, [js]);

  return (
    <div className="mt-auto">
      <style>{css}</style>
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}
