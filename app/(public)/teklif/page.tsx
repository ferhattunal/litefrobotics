import type { Metadata } from "next";
import { submitQuote } from "@/lib/actions/content";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Teklif Talebi" };

export default async function QuotePage({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string }>;
}) {
  const { ok } = await searchParams;
  return (
    <section className="mx-auto max-w-xl px-6 py-16">
      <h1 className="text-4xl font-semibold">Teklif Talebi</h1>
      {ok ? <p className="mt-4 text-emerald-700">Talebiniz alındı. En kısa sürede dönüş yapacağız.</p> : null}
      <form action={submitQuote} className="mt-8 grid gap-4">
        <input className="admin-input" name="name" placeholder="Ad Soyad" required />
        <input className="admin-input" name="company" placeholder="Firma" />
        <input className="admin-input" name="email" type="email" placeholder="E-posta" />
        <input className="admin-input" name="phone" placeholder="Telefon" />
        <input className="admin-input" name="product_name" placeholder="İlgilendiğiniz ürün" />
        <textarea className="admin-textarea" name="message" placeholder="Mesajınız" />
        <button className="w-fit rounded-lg bg-orange-700 px-4 py-2 text-white">Gönder</button>
      </form>
    </section>
  );
}
