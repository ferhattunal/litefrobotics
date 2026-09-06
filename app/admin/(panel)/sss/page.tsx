import { DeleteButton } from "@/components/admin/delete-button";
import { deleteFaq, saveFaq } from "@/lib/actions/content";
import { getFaqs } from "@/lib/queries-content";

export default async function FaqAdminPage() {
  const items = await getFaqs();
  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold">SSS</h1>
      <form action={saveFaq} className="grid max-w-xl gap-4 rounded-2xl bg-white p-5">
        <label>
          <span className="admin-label">Soru</span>
          <input className="admin-input" name="question" required />
        </label>
        <label>
          <span className="admin-label">Cevap</span>
          <textarea className="admin-textarea" name="answer" />
        </label>
        <label>
          <span className="admin-label">Sıra</span>
          <input className="admin-input" name="sort_order" type="number" defaultValue={0} />
        </label>
        <button className="w-fit rounded-lg bg-stone-900 px-4 py-2 text-white">Ekle</button>
      </form>
      <div className="mt-8 grid gap-3">
        {items.map((item) => (
          <div key={item.id} className="flex items-start justify-between rounded-2xl bg-white p-4">
            <div>
              <p className="font-medium">{item.question}</p>
              <p className="mt-1 text-sm text-stone-500">{item.answer}</p>
            </div>
            <DeleteButton action={deleteFaq} id={item.id} />
          </div>
        ))}
      </div>
    </div>
  );
}
