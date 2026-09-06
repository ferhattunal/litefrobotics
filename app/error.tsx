"use client";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <h1 className="text-2xl font-semibold">Sayfa yüklenemedi</h1>
      <p className="mt-2 max-w-md text-sm text-stone-500">
        Menüden Ana Sayfa&apos;ya dönüp tekrar deneyin. Sorun sürerse Supabase şemasının çalıştığından emin olun.
      </p>
      <div className="mt-4 flex gap-3">
        <button type="button" onClick={reset} className="rounded-lg bg-stone-900 px-4 py-2 text-white">
          Tekrar dene
        </button>
        <a href="/" className="rounded-lg border px-4 py-2">
          Ana sayfa
        </a>
      </div>
    </div>
  );
}
