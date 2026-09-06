"use client";

import { saveModule } from "@/lib/actions/modules";
import type { ModuleRecord } from "@/lib/types";

export function ModuleForm({ module }: { module?: ModuleRecord }) {
  return (
    <form action={saveModule} className="grid max-w-4xl gap-5">
      {module ? <input type="hidden" name="id" value={module.id} /> : null}
      <label>
        <span className="admin-label">Modül adı</span>
        <input className="admin-input" name="name" defaultValue={module?.name} required />
      </label>
      <label>
        <span className="admin-label">HTML</span>
        <textarea className="admin-textarea min-h-40" name="html" defaultValue={module?.html} />
      </label>
      <label>
        <span className="admin-label">CSS</span>
        <textarea className="admin-textarea min-h-32" name="css" defaultValue={module?.css} />
      </label>
      <label>
        <span className="admin-label">JavaScript</span>
        <textarea className="admin-textarea min-h-32" name="js" defaultValue={module?.js} />
      </label>
      <button type="submit" className="w-fit rounded-lg bg-stone-900 px-4 py-2 text-white">
        Kaydet
      </button>
    </form>
  );
}
