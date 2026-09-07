import { ProductForm } from "@/components/admin/product-form";
import { getCategories, getPages } from "@/lib/queries";

export default async function NewProductPage() {
  const [categories, pages] = await Promise.all([getCategories(), getPages()]);

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold">Yeni ürün</h1>
      {categories.length ? (
        <ProductForm categories={categories} pages={pages} />
      ) : (
        <p className="text-stone-500">Önce bir kategori oluşturun.</p>
      )}
    </div>
  );
}
