import { formatDate } from "@/lib/utils";
import { getLeads } from "@/lib/queries-content";

export default async function LeadsAdminPage() {
  const leads = await getLeads();

  return (
    <div>
      <h1 className="text-2xl font-semibold">Leads</h1>
      <p className="mt-2 text-sm text-stone-500">Public teklif / iletişim formundan gelen kayıtlar.</p>
      <div className="mt-6 overflow-hidden rounded-2xl bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-stone-50 text-stone-500">
            <tr>
              <th className="px-4 py-3">Tarih</th>
              <th className="px-4 py-3">Ad</th>
              <th className="px-4 py-3">Telefon</th>
              <th className="px-4 py-3">Firma</th>
              <th className="px-4 py-3">Ürün</th>
              <th className="px-4 py-3">Dil</th>
              <th className="px-4 py-3">UTM</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((item) => (
              <tr key={item.id} className="border-t align-top">
                <td className="px-4 py-3 whitespace-nowrap">{formatDate(item.created_at)}</td>
                <td className="px-4 py-3">{item.full_name}</td>
                <td className="px-4 py-3">{item.phone}</td>
                <td className="px-4 py-3">{item.company}</td>
                <td className="px-4 py-3">{item.interested_product}</td>
                <td className="px-4 py-3 uppercase">{item.language}</td>
                <td className="px-4 py-3 text-stone-500">{item.utm_source || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {!leads.length ? <p className="px-4 py-6 text-stone-500">Henüz lead yok.</p> : null}
      </div>
    </div>
  );
}
