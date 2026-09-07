import type { Metadata } from "next";
import Link from "next/link";
import { getCategories } from "@/lib/queries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Kategoriler",
  description: "Litef Robotics ürün kategorileri",
};

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <h1 className="text-4xl font-semibold tracking-tight">Ürün kategorileri</h1>
      <p className="mt-3 max-w-2xl text-stone-600">İhtiyacınıza uygun ürün grubunu seçin.</p>
      <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/kategoriler/${category.slug}`}
            className="overflow-hidden rounded-2xl bg-white shadow-sm transition hover:-translate-y-0.5"
          >
            <div className="h-44 bg-stone-200">
              {category.hero_image_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={category.hero_image_url} alt={category.name} className="h-full w-full object-cover" />
              ) : null}
            </div>
            <div className="p-5">
              <h2 className="text-xl font-semibold">{category.name}</h2>
              <p className="mt-2 line-clamp-2 text-sm text-stone-500">{category.hero_text}</p>
            </div>
          </Link>
        ))}
        {!categories.length ? <p className="text-stone-500">Henüz kategori eklenmedi.</p> : null}
      </div>
    </section>
  );
}
