import { AdminForm } from "@/components/admin/admin-form";
import { saveAboutPage } from "@/lib/actions/cms-pages";
import { getAboutPage } from "@/lib/queries";

export default async function AboutAdminPage() {
  const page = await getAboutPage();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold">Hakkımızda</h1>
      <AdminForm action={saveAboutPage} className="grid max-w-3xl gap-5">
        <label>
          <span className="admin-label">Başlık</span>
          <input className="admin-input" name="title" defaultValue={page?.title} />
        </label>
        <label>
          <span className="admin-label">İçerik (HTML)</span>
          <textarea className="admin-textarea min-h-48" name="content" defaultValue={page?.content} />
        </label>
        <label>
          <span className="admin-label">Meta description</span>
          <textarea className="admin-textarea min-h-20" name="meta_description" defaultValue={page?.meta_description} />
        </label>
        <label>
          <span className="admin-label">Meta keywords</span>
          <input className="admin-input" name="meta_keywords" defaultValue={page?.meta_keywords} />
        </label>
      </AdminForm>
    </div>
  );
}
