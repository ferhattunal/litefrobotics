import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PublicImage } from "@/components/public/public-image";
import { getDictionary } from "@/lib/i18n/dictionary";
import { pageMetadata } from "@/lib/i18n/metadata";
import { parseLang } from "@/lib/i18n/params";
import { getRentalBySlug } from "@/lib/queries-content";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ lang: string; slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const lang = await parseLang(params);
  const item = await getRentalBySlug(slug);
  return pageMetadata({
    locale: lang,
    route: "rental",
    slug,
    title: item?.title ?? getDictionary(lang).rental.title,
  });
}

export default async function RentalDetailPage({ params }: Props) {
  const { slug } = await params;
  await parseLang(params);
  const item = await getRentalBySlug(slug);
  if (!item || !item.published) notFound();
  return (
    <section className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-4xl font-semibold">{item.title}</h1>
      {item.image_url ? (
        <div className="relative mt-8 aspect-[16/9] w-full overflow-hidden rounded-2xl">
          <PublicImage src={item.image_url} alt="" fill className="object-cover" sizes="768px" />
        </div>
      ) : null}
      <div className="mt-6 text-stone-700" dangerouslySetInnerHTML={{ __html: item.description }} />
    </section>
  );
}
