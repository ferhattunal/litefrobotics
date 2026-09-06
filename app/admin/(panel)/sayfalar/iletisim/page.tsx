import { saveContactPage } from "@/lib/actions/cms-pages";
import { getContactPage } from "@/lib/queries";

export default async function ContactAdminPage() {
  const page = await getContactPage();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold">İletişim</h1>
      <form action={saveContactPage} className="grid max-w-3xl gap-5">
        <label>
          <span className="admin-label">Başlık</span>
          <input className="admin-input" name="title" defaultValue={page?.title} />
        </label>
        <label>
          <span className="admin-label">İçerik (HTML)</span>
          <textarea className="admin-textarea min-h-32" name="content" defaultValue={page?.content} />
        </label>
        <label>
          <span className="admin-label">Adres</span>
          <input className="admin-input" name="address" defaultValue={page?.address} />
        </label>
        <label>
          <span className="admin-label">Telefon</span>
          <input className="admin-input" name="phone" defaultValue={page?.phone} />
        </label>
        <label>
          <span className="admin-label">E-posta</span>
          <input className="admin-input" name="email" defaultValue={page?.email} />
        </label>
        <label>
          <span className="admin-label">Google Maps yerleşim URL / iframe</span>
          <textarea
            className="admin-textarea min-h-24"
            name="maps_embed_url"
            defaultValue={page?.maps_embed_url}
            placeholder="https://www.google.com/maps/embed?pb=... veya iframe kodu"
          />
        </label>
        <label>
          <span className="admin-label">Meta description</span>
          <textarea className="admin-textarea min-h-20" name="meta_description" defaultValue={page?.meta_description} />
        </label>
        <label>
          <span className="admin-label">Meta keywords</span>
          <input className="admin-input" name="meta_keywords" defaultValue={page?.meta_keywords} />
        </label>
        <button type="submit" className="w-fit rounded-lg bg-stone-900 px-4 py-2 text-white">
          Kaydet
        </button>
      </form>
    </div>
  );
}
