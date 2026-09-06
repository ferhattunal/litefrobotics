import { notFound } from "next/navigation";
import { RentalForm } from "@/components/admin/rental-form";
import { getRental } from "@/lib/queries-content";

export default async function EditRentalPage({ params }: { params: Promise<{ id: string }> }) {
  const item = await getRental((await params).id);
  if (!item) notFound();
  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold">Kiralama düzenle</h1>
      <RentalForm item={item} />
    </div>
  );
}
