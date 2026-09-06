import { DeleteButton } from "@/components/admin/delete-button";
import { ReferenceCreateForm } from "@/components/admin/reference-create-form";
import { deleteReference } from "@/lib/actions/content";
import { getReferences } from "@/lib/queries-content";

export default async function ReferencesAdminPage() {
  const items = await getReferences();
  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold">Referanslar</h1>
      <ReferenceCreateForm />
      <div className="mt-8 overflow-hidden rounded-2xl bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-stone-50 text-stone-500">
            <tr>
              <th className="px-4 py-3">Ad</th>
              <th className="px-4 py-3">Sıra</th>
              <th className="px-4 py-3">İşlem</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-t">
                <td className="px-4 py-3">{item.name}</td>
                <td className="px-4 py-3">{item.sort_order}</td>
                <td className="px-4 py-3">
                  <DeleteButton action={deleteReference} id={item.id} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
