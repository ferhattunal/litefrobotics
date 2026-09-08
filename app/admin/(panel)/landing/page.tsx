import Link from "next/link";
import { PageLayoutEditor } from "@/components/admin/page-layout-editor";
import { getModules, getPageModules, getPages } from "@/lib/queries";

export const dynamic = "force-dynamic";

type Props = { searchParams: Promise<{ page?: string }> };

export default async function LandingListPage({ searchParams }: Props) {
  const { page: pageId } = await searchParams;
  const [pages, modules] = await Promise.all([getPages(), getModules()]);
  const selected = pages.find((item) => item.id === pageId) ?? pages.find((item) => item.is_homepage) ?? pages[0];

  if (!selected) {
    return (
      <div>
        <h1 className="text-2xl font-semibold">Sayfa düzeni</h1>
        <p className="mt-3 text-sm text-stone-500">Önce bir landing page oluşturun.</p>
        <Link href="/admin/landing/yeni" className="mt-4 inline-flex rounded-lg bg-stone-900 px-4 py-2 text-sm text-white">
          Yeni sayfa
        </Link>
      </div>
    );
  }

  const assigned = await getPageModules(selected.id);

  return <PageLayoutEditor pages={pages} modules={modules} assigned={assigned} selectedPage={selected} />;
}
