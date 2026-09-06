import type { Metadata } from "next";
import { getContactPage } from "@/lib/queries";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getContactPage();
  return {
    title: page?.title ?? "İletişim",
    description: page?.meta_description || undefined,
    keywords: page?.meta_keywords || undefined,
  };
}

export default async function ContactPage() {
  const page = await getContactPage();

  return (
    <section className="mx-auto max-w-5xl px-6 py-16">
      <h1 className="text-4xl font-semibold tracking-tight">{page?.title ?? "İletişim"}</h1>
      <div className="mt-8 grid gap-10 lg:grid-cols-2">
        <div>
          <div
            className="prose-litef space-y-4 text-stone-700"
            dangerouslySetInnerHTML={{ __html: page?.content ?? "" }}
          />
          <dl className="mt-8 grid gap-3 text-sm">
            {page?.address ? (
              <div>
                <dt className="font-semibold">Adres</dt>
                <dd className="text-stone-600">{page.address}</dd>
              </div>
            ) : null}
            {page?.phone ? (
              <div>
                <dt className="font-semibold">Telefon</dt>
                <dd className="text-stone-600">{page.phone}</dd>
              </div>
            ) : null}
            {page?.email ? (
              <div>
                <dt className="font-semibold">E-posta</dt>
                <dd className="text-stone-600">{page.email}</dd>
              </div>
            ) : null}
          </dl>
        </div>
        {page?.maps_embed_url ? (
          <iframe
            src={page.maps_embed_url}
            title="Google Haritalar"
            className="min-h-[360px] w-full rounded-2xl border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        ) : (
          <div className="flex min-h-[240px] items-center justify-center rounded-2xl bg-stone-200 text-stone-500">
            Harita henüz eklenmedi.
          </div>
        )}
      </div>
    </section>
  );
}
