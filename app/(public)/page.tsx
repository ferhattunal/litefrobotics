import type { Metadata } from "next";
import { PageRenderer } from "@/components/public/page-renderer";
import { getHomepage, getPageModules } from "@/lib/queries";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getHomepage();
  return {
    title: page?.title ?? "Litef Robotics",
    description: page?.meta_description || undefined,
    keywords: page?.meta_keywords || undefined,
  };
}

export default async function HomePage() {
  const page = await getHomepage();

  if (!page) {
    return (
      <section className="mx-auto max-w-3xl px-6 py-24 text-center">
        <h1 className="text-4xl font-semibold">Litef Robotics</h1>
        <p className="mt-4 text-stone-600">
          Ana sayfa henüz tanımlanmadı. Supabase şemasını çalıştırdıktan sonra admin panelden bir landing
          page&apos;i ana sayfa olarak işaretleyin.
        </p>
      </section>
    );
  }

  const assigned = page.render_mode === "modules" ? await getPageModules(page.id) : [];
  const modules = assigned.map((item) => item.modules).filter(Boolean);

  return <PageRenderer page={page} modules={modules} />;
}
