import Link from "next/link";
import { DeleteButton } from "@/components/admin/delete-button";
import { deleteProduct, moveProduct } from "@/lib/actions/products";
import { productPriceLabel, productStockLabel } from "@/lib/product-display";
import { getCategories, getProducts } from "@/lib/queries";

export default async function ProductsAdminPage() {
  const [categories, products] = await Promise.all([getCategories(), getProducts()]);

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Ürünler</h1>
          <p className="mt-1 text-sm text-stone-500">Ürünler kategorilere bağlıdır. Vitrin ana sayfada öne çıkar.</p>
        </div>
        <Link
          href="/admin/urunler/yeni"
          className="rounded-full bg-[#6b7c59] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#5c6c4c]"
        >
          Ürün ekle
        </Link>
      </div>

      <div className="mt-8 grid gap-6">
        {categories.map((category) => {
          const items = products
            .filter((product) => product.category_id === category.id)
            .slice()
            .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0) || a.name.localeCompare(b.name, "tr"));
          return (
            <section key={category.id} className="overflow-hidden rounded-2xl border border-stone-200 bg-white">
              <div className="flex flex-wrap items-start justify-between gap-3 border-b border-stone-100 px-5 py-4">
                <div>
                  <h2 className="text-lg font-semibold">{category.name}</h2>
                  <p className="text-sm text-stone-500">{items.length} ürün</p>
                </div>
                <div className="flex flex-wrap gap-4 text-sm">
                  <Link href={`/kategoriler/${category.slug}`} className="text-stone-500 hover:text-stone-800" target="_blank">
                    Site
                  </Link>
                  <Link href={`/admin/kategoriler/${category.id}`} className="text-stone-500 hover:text-stone-800">
                    Kategoriyi düzenle
                  </Link>
                  <Link href={`/admin/urunler/yeni?kategori=${category.id}`} className="text-orange-700">
                    Ürün ekle
                  </Link>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[860px] text-left text-sm">
                  <thead>
                    <tr className="text-[11px] font-semibold tracking-[0.12em] text-stone-400">
                      <th className="px-4 py-3">GÖRSEL</th>
                      <th className="px-4 py-3">ÜRÜN ADI</th>
                      <th className="px-4 py-3">MARKA / MODEL</th>
                      <th className="px-4 py-3">STOK</th>
                      <th className="px-4 py-3">FİYAT</th>
                      <th className="px-4 py-3">VİTRİN</th>
                      <th className="px-4 py-3">SIRA</th>
                      <th className="px-4 py-3">AKSİYON</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((product, index) => {
                      const image = product.product_images?.slice().sort((a, b) => a.sort_order - b.sort_order)[0];
                      const brandModel = [product.brand, product.model].filter(Boolean).join(" / ") || "—";
                      return (
                        <tr key={product.id} className="border-t border-stone-100">
                          <td className="px-4 py-3">
                            {image ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={image.url} alt="" className="h-12 w-12 rounded-lg object-cover" />
                            ) : (
                              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-stone-100 text-[10px] text-stone-400">
                                Yok
                              </div>
                            )}
                          </td>
                          <td className="px-4 py-3 font-medium">{product.name}</td>
                          <td className="px-4 py-3 text-stone-500">{brandModel}</td>
                          <td className="px-4 py-3 text-stone-500">{productStockLabel(product)}</td>
                          <td className="px-4 py-3 text-stone-500">{productPriceLabel(product) || "—"}</td>
                          <td className="px-4 py-3">{product.show_on_homepage ? "Açık" : "Kapalı"}</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-1">
                              <form action={moveProduct}>
                                <input type="hidden" name="id" value={product.id} />
                                <input type="hidden" name="direction" value="-1" />
                                <button type="submit" className="rounded border px-2 py-1 text-xs" disabled={index === 0}>
                                  ↑
                                </button>
                              </form>
                              <form action={moveProduct}>
                                <input type="hidden" name="id" value={product.id} />
                                <input type="hidden" name="direction" value="1" />
                                <button
                                  type="submit"
                                  className="rounded border px-2 py-1 text-xs"
                                  disabled={index === items.length - 1}
                                >
                                  ↓
                                </button>
                              </form>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex gap-3">
                              <Link href={`/admin/urunler/${product.id}`} className="text-orange-700">
                                Düzenle
                              </Link>
                              <DeleteButton action={deleteProduct} id={product.id} />
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                {!items.length ? (
                  <p className="px-4 py-8 text-sm text-stone-400">Bu kategoride henüz ürün yok.</p>
                ) : null}
              </div>
            </section>
          );
        })}
        {!categories.length ? (
          <p className="rounded-2xl bg-white px-5 py-8 text-stone-500">
            Önce bir kategori oluşturun.{" "}
            <Link href="/admin/kategoriler/yeni" className="text-orange-700">
              Kategori ekle
            </Link>
          </p>
        ) : null}
      </div>
    </div>
  );
}
