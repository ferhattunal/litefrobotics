import { notFound } from "next/navigation";
import { PriceListForm } from "@/components/admin/price-list-form";
import { getPriceList } from "@/lib/queries-content";

export default async function EditPriceListPage({ params }: { params: Promise<{ id: string }> }) {
  const item = await getPriceList((await params).id);
  if (!item) notFound();
  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold">Fiyat listesi düzenle</h1>
      <PriceListForm item={item} />
    </div>
  );
}
