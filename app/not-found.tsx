import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <h1 className="text-3xl font-semibold">Sayfa bulunamadı</h1>
      <p className="mt-3 text-stone-500">Aradığınız içerik mevcut değil.</p>
      <Link href="/" className="mt-6 text-orange-700 hover:underline">
        Ana sayfaya dön
      </Link>
    </div>
  );
}
