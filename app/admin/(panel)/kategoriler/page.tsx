import Link from "next/link";
import { DeleteButton } from "@/components/admin/delete-button";
import { deleteCategory } from "@/lib/actions/categories";
import { getCategories } from "@/lib/queries";

export default async function CategoriesAdminPage() {
  const categories = await getCategories();

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Kategoriler</h1>
        <Link href="/admin/kategoriler/yeni" className="rounded-lg bg-stone-900 px-4 py-2 text-sm text-white">
          Yeni kategori
        </Link>
      </div>
      <div className="mt-6 overflow-hidden rounded-2xl bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-stone-50 text-stone-500">
            <tr>
              <th className="px-4 py-3">Ad</th>
              <th className="px-4 py-3">Slug</th>
              <th className="px-4 py-3">Kart</th>
              <th className="px-4 py-3">İşlem</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category.id} className="border-t">
                <td className="px-4 py-3">{category.name}</td>
                <td className="px-4 py-3">{category.slug}</td>
                <td className="px-4 py-3">{category.card_design ? "Özel" : "Default"}</td>
                <td className="flex gap-4 px-4 py-3">
                  <Link href={`/admin/kategoriler/${category.id}`} className="text-orange-700">
                    Düzenle
                  </Link>
                  <DeleteButton action={deleteCategory} id={category.id} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!categories.length ? <p className="px-4 py-6 text-stone-500">Henüz kategori yok.</p> : null}
      </div>
    </div>
  );
}
