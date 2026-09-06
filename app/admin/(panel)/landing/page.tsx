import Link from "next/link";
import { DeleteButton } from "@/components/admin/delete-button";
import { deletePage } from "@/lib/actions/pages";
import { getPages } from "@/lib/queries";

export default async function LandingListPage() {
  const pages = await getPages();

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Landing page</h1>
        <Link href="/admin/landing/yeni" className="rounded-lg bg-stone-900 px-4 py-2 text-sm text-white">
          Yeni landing
        </Link>
      </div>
      <div className="mt-6 overflow-hidden rounded-2xl bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-stone-50 text-stone-500">
            <tr>
              <th className="px-4 py-3">Başlık</th>
              <th className="px-4 py-3">Slug</th>
              <th className="px-4 py-3">Tür</th>
              <th className="px-4 py-3">Ana sayfa</th>
              <th className="px-4 py-3">İşlem</th>
            </tr>
          </thead>
          <tbody>
            {pages.map((page) => (
              <tr key={page.id} className="border-t">
                <td className="px-4 py-3">{page.title}</td>
                <td className="px-4 py-3">/{page.is_homepage ? "" : page.slug}</td>
                <td className="px-4 py-3">{page.render_mode === "modules" ? "Modül istif" : "Kod"}</td>
                <td className="px-4 py-3">{page.is_homepage ? "Evet" : "Hayır"}</td>
                <td className="flex gap-4 px-4 py-3">
                  <Link href={`/admin/landing/${page.id}`} className="text-orange-700">
                    Düzenle
                  </Link>
                  <DeleteButton action={deletePage} id={page.id} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
