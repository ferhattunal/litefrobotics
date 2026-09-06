import type { Metadata } from "next";
import { getGallery } from "@/lib/queries-content";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Galeri" };

export default async function GalleryPage() {
  const items = await getGallery();
  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <h1 className="text-4xl font-semibold">Galeri</h1>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <figure key={item.id} className="overflow-hidden rounded-2xl bg-white">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={item.image_url} alt={item.title} className="h-56 w-full object-cover" />
            {item.title ? <figcaption className="p-3 text-sm">{item.title}</figcaption> : null}
          </figure>
        ))}
      </div>
    </section>
  );
}
