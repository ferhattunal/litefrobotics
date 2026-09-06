import { saveNavbarFooter } from "@/lib/actions/settings";
import { getSiteSettings } from "@/lib/queries";

export default async function NavbarFooterPage() {
  const settings = await getSiteSettings();

  return (
    <div>
      <h1 className="mb-2 text-2xl font-semibold">Navbar ve footer</h1>
      <p className="mb-6 max-w-2xl text-sm text-stone-500">
        Div derinliğinde HTML/CSS yazın. Bu kod tüm vitrin sayfalarında layout olarak görünür. Mobilde navbar
        hamburger menüye dönüşür ve arka plan %70 opak olur.
      </p>
      <form action={saveNavbarFooter} className="grid max-w-5xl gap-5">
        <label>
          <span className="admin-label">Navbar HTML</span>
          <textarea className="admin-textarea min-h-40" name="navbar_html" defaultValue={settings?.navbar_html} />
        </label>
        <label>
          <span className="admin-label">Navbar CSS</span>
          <textarea className="admin-textarea min-h-32" name="navbar_css" defaultValue={settings?.navbar_css} />
        </label>
        <label>
          <span className="admin-label">Footer HTML</span>
          <textarea className="admin-textarea min-h-40" name="footer_html" defaultValue={settings?.footer_html} />
        </label>
        <label>
          <span className="admin-label">Footer CSS</span>
          <textarea className="admin-textarea min-h-32" name="footer_css" defaultValue={settings?.footer_css} />
        </label>
        <button type="submit" className="w-fit rounded-lg bg-stone-900 px-4 py-2 text-white">
          Kaydet
        </button>
      </form>
    </div>
  );
}
