import { notFound } from "next/navigation";
import { ProductForm } from "@/components/admin/product-form";
import { getCategories, getProduct } from "@/lib/queries";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [product, categories] = await Promise.all([getProduct(id), getCategories()]);
  if (!product) notFound();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold">Ürün düzenle</h1>
      <ProductForm product={product} categories={categories} />
    </div>
  );
}
