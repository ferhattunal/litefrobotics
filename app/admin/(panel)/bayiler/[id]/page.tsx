import { notFound } from "next/navigation";
import { DealerForm } from "@/components/admin/dealer-form";
import { getDealer } from "@/lib/queries-content";

export default async function EditDealerPage({ params }: { params: Promise<{ id: string }> }) {
  const dealer = await getDealer((await params).id);
  if (!dealer) notFound();
  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold">Bayi düzenle</h1>
      <DealerForm dealer={dealer} />
    </div>
  );
}
