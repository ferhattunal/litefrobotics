import Link from "next/link";
import { DeleteButton } from "@/components/admin/delete-button";
import { deleteRental } from "@/lib/actions/content";
import { getRentals } from "@/lib/queries-content";

export default async function RentalsAdminPage() {
  const items = await getRentals();
  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Kiralama</h1>
        <Link href="/admin/kiralama/yeni" className="rounded-lg bg-stone-900 px-4 py-2 text-sm text-white">
          Yeni ilan
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
                  <Link href={`/admin/kiralama/${item.id}`} className="text-orange-700">
                    Düzenle
                  </Link>
                  <DeleteButton action={deleteRental} id={item.id} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!items.length ? <p className="px-4 py-6 text-stone-500">Henüz kiralama ilanı yok.</p> : null}
      </div>
    </div>
  );
}
