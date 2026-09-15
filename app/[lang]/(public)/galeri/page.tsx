import type { Metadata } from "next";
import { PublicImage } from "@/components/public/public-image";
import { getDictionary } from "@/lib/i18n/dictionary";
import { pageMetadata } from "@/lib/i18n/metadata";
import { parseLang } from "@/lib/i18n/params";
import { getGallery } from "@/lib/queries-content";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const lang = await parseLang(params);
  return pageMetadata({ locale: lang, route: "gallery", title: getDictionary(lang).gallery.title });
}

export default async function GalleryPage({ params }: Props) {
  const lang = await parseLang(params);
  const copy = getDictionary(lang);
  const items = await getGallery();
  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <h1 className="text-4xl font-semibold">{copy.gallery.title}</h1>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <figure key={item.id} className="overflow-hidden rounded-2xl bg-white">
            <div className="relative h-56 w-full">
              <PublicImage src={item.image_url} alt={item.title || copy.gallery.title} fill className="object-cover" sizes="(max-width: 1024px) 50vw, 33vw" />
            </div>
            {item.title ? <figcaption className="p-3 text-sm">{item.title}</figcaption> : null}
          </figure>
        ))}
      </div>
    </section>
  );
}
