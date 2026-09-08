import Link from "next/link";
import { DeleteButton } from "@/components/admin/delete-button";
import { deleteModule } from "@/lib/actions/modules";
import { getModules } from "@/lib/queries";

export default async function ModulesPage() {
  const modules = await getModules();

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Modüller</h1>
        <Link href="/admin/moduller/yeni" className="rounded-lg bg-stone-900 px-4 py-2 text-sm text-white">
          Yeni modül
        </Link>
      </div>
      <div className="mt-6 overflow-hidden rounded-2xl bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-stone-50 text-stone-500">
            <tr>
              <th className="px-4 py-3">Ad</th>
              <th className="px-4 py-3">Tip</th>
              <th className="px-4 py-3">İşlem</th>
            </tr>
          </thead>
          <tbody>
            {modules.map((module) => (
              <tr key={module.id} className="border-t">
                <td className="px-4 py-3">{module.name}</td>
                <td className="px-4 py-3 text-stone-500">{module.module_type || "custom"}</td>
                <td className="flex gap-4 px-4 py-3">
                  <Link href={`/admin/moduller/${module.id}`} className="text-orange-700">
                    Düzenle
                  </Link>
                  <DeleteButton action={deleteModule} id={module.id} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!modules.length ? <p className="px-4 py-6 text-stone-500">Henüz modül yok.</p> : null}
      </div>
    </div>
  );
}
