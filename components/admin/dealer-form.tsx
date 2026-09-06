import { saveDealer } from "@/lib/actions/content";
import type { Dealer } from "@/lib/types";

export function DealerForm({ dealer }: { dealer?: Dealer }) {
  return (
    <form action={saveDealer} className="grid max-w-2xl gap-4">
      {dealer ? <input type="hidden" name="id" value={dealer.id} /> : null}
      <label>
        <span className="admin-label">Bayi adı</span>
        <input className="admin-input" name="name" defaultValue={dealer?.name} required />
      </label>
      <label>
        <span className="admin-label">Şehir</span>
        <input className="admin-input" name="city" defaultValue={dealer?.city} />
      </label>
      <label>
        <span className="admin-label">Adres</span>
        <textarea className="admin-textarea min-h-20" name="address" defaultValue={dealer?.address} />
      </label>
      <label>
        <span className="admin-label">Telefon</span>
        <input className="admin-input" name="phone" defaultValue={dealer?.phone} />
      </label>
      <label>
        <span className="admin-label">E-posta</span>
        <input className="admin-input" name="email" defaultValue={dealer?.email} />
      </label>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="published" value="1" defaultChecked={dealer?.published ?? true} />
        Yayınla
      </label>
      <button className="w-fit rounded-lg bg-stone-900 px-4 py-2 text-white">Kaydet</button>
    </form>
  );
}
