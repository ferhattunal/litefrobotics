import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getRentalBySlug } from "@/lib/queries-content";

export const dynamic = "force-dynamic";
type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const item = await getRentalBySlug((await params).slug);
  return { title: item?.title ?? "Kiralama" };
}

export default async function RentalDetailPage({ params }: Props) {
  const item = await getRentalBySlug((await params).slug);
  if (!item || !item.published) notFound();
  return (
    <section className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-4xl font-semibold">{item.title}</h1>
      {item.image_url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={item.image_url} alt="" className="mt-8 w-full rounded-2xl" />
      ) : null}
      <div className="mt-6 text-stone-700" dangerouslySetInnerHTML={{ __html: item.description }} />
    </section>
  );
}
