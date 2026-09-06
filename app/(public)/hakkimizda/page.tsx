import type { Metadata } from "next";
import { getAboutPage } from "@/lib/queries";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getAboutPage();
  return {
    title: page?.title ?? "Hakkımızda",
    description: page?.meta_description || undefined,
    keywords: page?.meta_keywords || undefined,
  };
}

export default async function AboutPage() {
  const page = await getAboutPage();

  return (
    <section className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-4xl font-semibold tracking-tight">{page?.title ?? "Hakkımızda"}</h1>
      <div
        className="prose-litef mt-8 space-y-4 text-stone-700 [&_p]:leading-7"
        dangerouslySetInnerHTML={{ __html: page?.content ?? "" }}
      />
    </section>
  );
}
