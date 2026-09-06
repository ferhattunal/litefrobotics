"use client";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="rounded-2xl bg-white p-6">
      <h1 className="text-xl font-semibold">Bu sayfa yüklenemedi</h1>
      <p className="mt-2 text-sm text-stone-600">
        {error.message || "Supabase tabloları veya yetki ayarı eksik olabilir."}
      </p>
      <p className="mt-2 text-sm text-stone-500">
        Şema daha önce kurulduysa Supabase SQL Editor’de <code>schema-addon.sql</code> dosyasını
        çalıştırın.
      </p>
      <button type="button" onClick={reset} className="mt-4 rounded-lg bg-stone-900 px-4 py-2 text-white">
        Tekrar dene
      </button>
    </div>
  );
}
