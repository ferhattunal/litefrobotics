import { notFound } from "next/navigation";
import { CategoryForm } from "@/components/admin/category-form";
import { getCategory } from "@/lib/queries";

export default async function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const category = await getCategory(id);
  if (!category) notFound();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold">Kategori düzenle</h1>
      <CategoryForm category={category} />
    </div>
  );
}
