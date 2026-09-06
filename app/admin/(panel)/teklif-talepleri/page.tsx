import { DeleteButton } from "@/components/admin/delete-button";
import { deleteQuote, updateQuoteStatus } from "@/lib/actions/content";
import { getQuotes } from "@/lib/queries-content";
import { formatDate } from "@/lib/utils";

export default async function QuotesAdminPage() {
  const quotes = await getQuotes();

  return (
    <div>
      <h1 className="text-2xl font-semibold">Teklif Talepleri</h1>
      <div className="mt-6 overflow-hidden rounded-2xl bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-stone-50 text-stone-500">
            <tr>
              <th className="px-4 py-3">Tarih</th>
              <th className="px-4 py-3">Ad</th>
              <th className="px-4 py-3">İletişim</th>
              <th className="px-4 py-3">Mesaj</th>
              <th className="px-4 py-3">Durum</th>
              <th className="px-4 py-3">İşlem</th>
            </tr>
          </thead>
          <tbody>
            {quotes.map((item) => (
              <tr key={item.id} className="border-t align-top">
                <td className="px-4 py-3 whitespace-nowrap">{formatDate(item.created_at)}</td>
                <td className="px-4 py-3">
                  <p>{item.name}</p>
                  <p className="text-stone-500">{item.company}</p>
                  <p className="text-stone-500">{item.product_name}</p>
                </td>
                <td className="px-4 py-3">
                  {item.email}
                  <br />
                  {item.phone}
                </td>
                <td className="max-w-xs px-4 py-3">{item.message}</td>
                <td className="px-4 py-3">
                  <form action={updateQuoteStatus} className="flex gap-2">
                    <input type="hidden" name="id" value={item.id} />
                    <select name="status" defaultValue={item.status} className="admin-input">
                      <option value="yeni">yeni</option>
                      <option value="incelendi">incelendi</option>
                      <option value="kapandi">kapandı</option>
                    </select>
                    <button className="text-xs text-orange-700">Kaydet</button>
                  </form>
                </td>
                <td className="px-4 py-3">
                  <DeleteButton action={deleteQuote} id={item.id} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!quotes.length ? <p className="px-4 py-6 text-stone-500">Henüz talep yok.</p> : null}
      </div>
    </div>
  );
}
