import Link from "next/link";
import { DeleteButton } from "@/components/admin/delete-button";
import { deleteProduct } from "@/lib/actions/products";
import { getProducts } from "@/lib/queries";

export default async function ProductsAdminPage() {
  const products = await getProducts();

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Ürünler</h1>
        <Link href="/admin/urunler/yeni" className="rounded-lg bg-stone-900 px-4 py-2 text-sm text-white">
          Yeni ürün
        </Link>
      </div>
      <div className="mt-6 overflow-hidden rounded-2xl bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-stone-50 text-stone-500">
            <tr>
              <th className="px-4 py-3">Ad</th>
              <th className="px-4 py-3">Kategori</th>
              <th className="px-4 py-3">Kart</th>
              <th className="px-4 py-3">İşlem</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-t">
                <td className="px-4 py-3">{product.name}</td>
                <td className="px-4 py-3">{product.categories?.name ?? "-"}</td>
                <td className="px-4 py-3">{product.card_design ? "Ürün özel" : "Kategori / default"}</td>
                <td className="flex gap-4 px-4 py-3">
                  <Link href={`/admin/urunler/${product.id}`} className="text-orange-700">
                    Düzenle
                  </Link>
                  <DeleteButton action={deleteProduct} id={product.id} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!products.length ? <p className="px-4 py-6 text-stone-500">Henüz ürün yok.</p> : null}
      </div>
    </div>
  );
}
