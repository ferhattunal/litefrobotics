import Link from "next/link";
import { DeleteButton } from "@/components/admin/delete-button";
import { deletePriceList } from "@/lib/actions/content";
import { getPriceLists } from "@/lib/queries-content";

export default async function PriceListsAdminPage() {
  const items = await getPriceLists();
  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Fiyat Listesi</h1>
        <Link href="/admin/fiyat-listesi/yeni" className="rounded-lg bg-stone-900 px-4 py-2 text-sm text-white">
          Yeni liste
        </Link>
      </div>
      <div className="mt-6 overflow-hidden rounded-2xl bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-stone-50 text-stone-500">
            <tr>
              <th className="px-4 py-3">Başlık</th>
              <th className="px-4 py-3">Yayın</th>
              <th className="px-4 py-3">İşlem</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-t">
                <td className="px-4 py-3">{item.title}</td>
                <td className="px-4 py-3">{item.published ? "Evet" : "Hayır"}</td>
                <td className="flex gap-4 px-4 py-3">
                  <Link href={`/admin/fiyat-listesi/${item.id}`} className="text-orange-700">
                    Düzenle
                  </Link>
                  <DeleteButton action={deletePriceList} id={item.id} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!items.length ? <p className="px-4 py-6 text-stone-500">Henüz fiyat listesi yok.</p> : null}
      </div>
    </div>
  );
}
