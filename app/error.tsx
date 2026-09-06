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
      <button type="button" onClick={reset} className="mt-4 rounded-lg bg-stone-900 px-4 py-2 text-white">
        Tekrar dene
      </button>
    </div>
  );
}
