import type { Metadata } from "next";
import { PublicImage } from "@/components/public/public-image";
import { getDictionary } from "@/lib/i18n/dictionary";
import { pageMetadata } from "@/lib/i18n/metadata";
import { parseLang } from "@/lib/i18n/params";
import { getReferences } from "@/lib/queries-content";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const lang = await parseLang(params);
  return pageMetadata({ locale: lang, route: "references", title: getDictionary(lang).references.title });
}

export default async function ReferencesPage({ params }: Props) {
  const lang = await parseLang(params);
  const copy = getDictionary(lang);
  const items = await getReferences();
  return (
    <section className="mx-auto max-w-5xl px-6 py-16">
      <h1 className="text-4xl font-semibold">{copy.references.title}</h1>
      <div className="mt-8 grid gap-6 sm:grid-cols-3">
        {items.map((item) => {
          const inner = (
            <>
              {item.logo_url ? (
                <div className="relative mx-auto h-16 w-32">
                  <PublicImage src={item.logo_url} alt={item.name} fill className="object-contain" sizes="128px" />
                </div>
              ) : null}
              <p className="mt-3 font-medium">{item.name}</p>
            </>
          );
          return item.url ? (
            <a key={item.id} href={item.url} target="_blank" rel="noreferrer" className="rounded-2xl bg-white p-6 text-center">
              {inner}
            </a>
          ) : (
            <div key={item.id} className="rounded-2xl bg-white p-6 text-center">
              {inner}
            </div>
          );
        })}
      </div>
    </section>
  );
}
