"use client";

import { useFormStatus } from "react-dom";
import { useState, type ReactNode } from "react";

type FormProps = {
  action: (formData: FormData) => Promise<void> | void;
  className?: string;
  label?: string;
  children: ReactNode;
};

function isRedirectError(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "digest" in error &&
    typeof (error as { digest?: unknown }).digest === "string" &&
    String((error as { digest: string }).digest).includes("NEXT_REDIRECT")
  );
}

export function AdminForm({ action, className, label = "Kaydet", children }: FormProps) {
  const [saved, setSaved] = useState(false);

  return (
    <form
      className={className}
      action={async (formData) => {
        setSaved(false);
        try {
          await action(formData);
          setSaved(true);
        } catch (error) {
          if (isRedirectError(error)) {
            setSaved(true);
            await new Promise((resolve) => setTimeout(resolve, 1100));
          }
          throw error;
        }
      }}
    >
      {children}
      <SaveBar saved={saved} label={label} />
    </form>
  );
}

export function SaveBar({ saved = false, label = "Kaydet" }: { saved?: boolean; label?: string }) {
  const { pending } = useFormStatus();
  const showSaved = saved && !pending;

  return (
    <div className="mt-10 flex flex-wrap items-center gap-4 border-t border-stone-200 pt-6">
      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-stone-900 px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
      >
        {pending ? "Kaydediliyor…" : label}
      </button>
      <span className={`save-toast${showSaved ? " save-toast-on" : ""}`} aria-live="polite">
        <span className="save-check" aria-hidden>
          <span className="save-check-ring" />
          <svg viewBox="0 0 16 16">
            <path d="M3.2 8.3 6.1 11.2 12.8 4.4" />
          </svg>
        </span>
        Kaydedildi
      </span>
    </div>
  );
}
