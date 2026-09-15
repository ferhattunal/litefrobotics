import type { Metadata } from "next";
import Link from "next/link";
import { LeadForm } from "@/components/public/lead-form";
import { JsonLd } from "@/components/public/json-ld";
import { ProductGallery } from "@/components/public/product-gallery";
import { SpecsTable } from "@/components/public/specs-table";
import { getDictionary } from "@/lib/i18n/dictionary";
import { localePath } from "@/lib/i18n/href";
import { absoluteUrl, pageMetadata } from "@/lib/i18n/metadata";
import { parseLang } from "@/lib/i18n/params";
import { productPriceLabel } from "@/lib/product-display";
import { getProductBySlug } from "@/lib/queries";
import { parseSpecsXml } from "@/lib/specs-xml";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ lang: string; slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const lang = await parseLang(params);
  const product = await getProductBySlug(slug);
  return pageMetadata({
    locale: lang,
    route: "products",
    slug,
    title: product?.meta_title || product?.name || getDictionary(lang).products.view,
    description: product?.meta_description || product?.description?.slice(0, 160),
  });
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const lang = await parseLang(params);
  const copy = getDictionary(lang);
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const category = product.categories ?? null;
  const specs = parseSpecsXml(product.specs_xml || "");
  const price = productPriceLabel(product);
  const stock = product.in_stock && product.stock_qty > 0
    ? `${copy.products.stockIn} ${product.stock_qty}`
    : copy.products.stockOut;
  const details = [product.brand, product.series, product.model].filter(Boolean);
  const image = product.product_images?.slice().sort((a, b) => a.sort_order - b.sort_order)[0]?.url;
  const productJson = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.meta_description || product.description || undefined,
    sku: product.model || product.slug,
    brand: product.brand ? { "@type": "Brand", name: product.brand } : undefined,
    image: image || undefined,
    url: absoluteUrl(localePath(lang, "products", product.slug)),
    offers: price
      ? {
          "@type": "Offer",
          url: absoluteUrl(localePath(lang, "products", product.slug)),
          priceCurrency: product.price_display === "usd" ? "USD" : "TRY",
          price: product.price_display === "usd" ? product.price_usd : product.price_try,
          availability: product.in_stock && product.stock_qty > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
        }
      : undefined,
  };

  return (
    <div>
      <JsonLd data={productJson} />
      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-16">
        {category ? (
          <Link href={localePath(lang, "categories", category.slug)} className="text-sm font-medium hover:underline" style={{ color: "var(--lf-625)" }}>
            {category.name}
          </Link>
        ) : null}
        <div className="mt-6 grid gap-10 lg:grid-cols-2">
          <ProductGallery images={product.product_images ?? []} name={product.name} locale={lang} />
          <div>
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{product.name}</h1>
            {details.length ? <p className="mt-3 text-sm text-stone-500">{details.join(" · ")}</p> : null}
            {price ? <p className="mt-4 text-2xl font-semibold">{price}</p> : null}
            <p className="mt-2 text-sm text-stone-500">{stock}</p>
            {product.description ? (
              <div
                className="prose-litef mt-6 max-w-none space-y-4 text-stone-600 [&_p]:leading-7"
                dangerouslySetInnerHTML={{ __html: product.description }}
              />
            ) : null}
            {product.pdf_url ? (
              <a
                href={product.pdf_url}
                target="_blank"
                rel="noreferrer"
                download
                className="mt-8 inline-flex w-full items-center justify-center rounded-full px-6 py-3 text-sm font-semibold tracking-wide text-white sm:w-auto"
                style={{ background: "var(--lf-625)" }}
              >
                {copy.products.pdf}
              </a>
            ) : null}
          </div>
        </div>
      </section>

      {product.about_heading || product.about_html ? (
        <section
          className="relative overflow-hidden py-16"
          style={
            product.about_image_url
              ? { backgroundImage: `url(${product.about_image_url})`, backgroundSize: "cover", backgroundPosition: "center" }
              : undefined
          }
        >
          <div className={product.about_image_url ? "bg-stone-950/55" : ""}>
            <div className={`mx-auto max-w-6xl px-4 sm:px-6 ${product.about_image_url ? "text-white" : "text-stone-800"}`}>
              {product.about_heading ? <h2 className="text-3xl font-semibold tracking-tight">{product.about_heading}</h2> : null}
              {product.about_html ? (
                <div
                  className="prose-litef mt-6 max-w-3xl space-y-4 [&_p]:leading-7"
                  dangerouslySetInnerHTML={{ __html: product.about_html }}
                />
              ) : null}
            </div>
          </div>
        </section>
      ) : null}

      {specs?.length ? <SpecsTable rows={specs} locale={lang} /> : null}

      <section className="mx-auto max-w-xl px-4 py-12 sm:px-6">
        <h2 className="text-2xl font-semibold tracking-tight">{copy.quote.title}</h2>
        <div className="mt-6">
          <LeadForm locale={lang} interestedProduct={product.name} />
        </div>
      </section>
    </div>
  );
}
