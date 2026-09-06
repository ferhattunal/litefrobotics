import Link from "next/link";
import { DeleteButton } from "@/components/admin/delete-button";
import { deleteDealer } from "@/lib/actions/content";
import { getDealers } from "@/lib/queries-content";

export default async function DealersAdminPage() {
  const dealers = await getDealers();
  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Bayiler</h1>
        <Link href="/admin/bayiler/yeni" className="rounded-lg bg-stone-900 px-4 py-2 text-sm text-white">
          Yeni bayi
        </Link>
      </div>
      <div className="mt-6 overflow-hidden rounded-2xl bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-stone-50 text-stone-500">
            <tr>
              <th className="px-4 py-3">Ad</th>
              <th className="px-4 py-3">Şehir</th>
              <th className="px-4 py-3">Telefon</th>
              <th className="px-4 py-3">Yayın</th>
              <th className="px-4 py-3">İşlem</th>
            </tr>
          </thead>
          <tbody>
            {dealers.map((item) => (
              <tr key={item.id} className="border-t">
                <td className="px-4 py-3">{item.name}</td>
                <td className="px-4 py-3">{item.city}</td>
                <td className="px-4 py-3">{item.phone}</td>
                <td className="px-4 py-3">{item.published ? "Evet" : "Hayır"}</td>
                <td className="flex gap-4 px-4 py-3">
                  <Link href={`/admin/bayiler/${item.id}`} className="text-orange-700">
                    Düzenle
                  </Link>
                  <DeleteButton action={deleteDealer} id={item.id} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!dealers.length ? <p className="px-4 py-6 text-stone-500">Henüz bayi yok.</p> : null}
      </div>
    </div>
  );
}
