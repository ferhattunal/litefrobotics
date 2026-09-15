import type { Metadata } from "next";
import Link from "next/link";
import { PublicImage } from "@/components/public/public-image";
import { getDictionary } from "@/lib/i18n/dictionary";
import { localePath } from "@/lib/i18n/href";
import { pageMetadata } from "@/lib/i18n/metadata";
import { parseLang } from "@/lib/i18n/params";
import { getCategories } from "@/lib/queries";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const lang = await parseLang(params);
  const copy = getDictionary(lang);
  return pageMetadata({ locale: lang, route: "categories", title: copy.categories.title, description: copy.categories.lead });
}

export default async function CategoriesPage({ params }: Props) {
  const lang = await parseLang(params);
  const copy = getDictionary(lang);
  const categories = await getCategories();

  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <h1 className="text-4xl font-semibold tracking-tight">{copy.categories.title}</h1>
      <p className="mt-3 max-w-2xl text-stone-600">{copy.categories.lead}</p>
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <Link
            key={category.id}
            href={localePath(lang, "categories", category.slug)}
            className="overflow-hidden rounded-2xl bg-white shadow-sm transition hover:-translate-y-0.5"
          >
            <div className="relative h-44 bg-stone-200">
              {category.hero_image_url ? (
                <PublicImage src={category.hero_image_url} alt={category.name} fill className="object-cover" sizes="(max-width: 1024px) 50vw, 33vw" />
              ) : null}
            </div>
            <div className="p-5">
              <h2 className="text-xl font-semibold">{category.name}</h2>
              <p className="mt-2 line-clamp-2 text-sm text-stone-500">{category.hero_text}</p>
            </div>
          </Link>
        ))}
        {!categories.length ? <p className="text-stone-500">{copy.categories.empty}</p> : null}
      </div>
    </section>
  );
}
