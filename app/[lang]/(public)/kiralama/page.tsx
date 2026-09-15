import type { Metadata } from "next";
import Link from "next/link";
import { PublicImage } from "@/components/public/public-image";
import { getDictionary } from "@/lib/i18n/dictionary";
import { localePath } from "@/lib/i18n/href";
import { pageMetadata } from "@/lib/i18n/metadata";
import { parseLang } from "@/lib/i18n/params";
import { getRentals } from "@/lib/queries-content";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const lang = await parseLang(params);
  return pageMetadata({ locale: lang, route: "rental", title: getDictionary(lang).rental.title });
}

export default async function RentalsPage({ params }: Props) {
  const lang = await parseLang(params);
  const copy = getDictionary(lang);
  const items = (await getRentals()).filter((item) => item.published);
  return (
    <section className="mx-auto max-w-5xl px-6 py-16">
      <h1 className="text-4xl font-semibold">{copy.rental.title}</h1>
      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        {items.map((item) => (
          <Link key={item.id} href={localePath(lang, "rental", item.slug)} className="overflow-hidden rounded-2xl bg-white">
            <div className="relative h-44 bg-stone-200">
              {item.image_url ? <PublicImage src={item.image_url} alt="" fill className="object-cover" sizes="50vw" /> : null}
            </div>
            <div className="p-5">
              <h2 className="text-xl font-semibold">{item.title}</h2>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
