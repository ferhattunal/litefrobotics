import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductGallery } from "@/components/public/product-gallery";
import { getProductBySlug } from "@/lib/queries";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  return {
    title: product?.name ?? "Ürün",
    description: product?.description?.slice(0, 160) || undefined,
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const category = product.categories ?? null;

  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      {category ? (
        <Link href={`/kategoriler/${category.slug}`} className="text-sm text-orange-700 hover:underline">
          {category.name}
        </Link>
      ) : null}
      <div className="mt-6 grid gap-10 lg:grid-cols-2">
        <ProductGallery images={product.product_images ?? []} name={product.name} />
        <div>
          <h1 className="text-4xl font-semibold tracking-tight">{product.name}</h1>
          <div
            className="prose-litef mt-6 max-w-none space-y-4 text-stone-600 [&_p]:leading-7"
            dangerouslySetInnerHTML={{ __html: product.description }}
          />
          {product.pdf_url ? (
            <div className="mt-8 rounded-2xl border border-stone-200 bg-white p-5">
              <p className="font-medium">Teknik doküman</p>
              <div className="mt-4 overflow-hidden rounded-xl border">
                <iframe src={product.pdf_url} title={`${product.name} PDF`} className="h-[420px] w-full" />
              </div>
              <a
                href={product.pdf_url}
                download
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-flex rounded-lg bg-orange-700 px-4 py-2 text-sm font-medium text-white"
              >
                PDF indir
              </a>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
