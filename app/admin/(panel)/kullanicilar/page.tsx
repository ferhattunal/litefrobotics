import { AdminForm } from "@/components/admin/admin-form";
import { DeleteButton } from "@/components/admin/delete-button";
import { addAdminUser, deleteAdminUser } from "@/lib/actions/content";
import { requireAdmin } from "@/lib/auth";
import { getAdminUsers } from "@/lib/queries-content";

export default async function UsersAdminPage() {
  await requireAdmin();
  const users = await getAdminUsers();
  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold">Kullanıcılar</h1>
      <AdminForm action={addAdminUser} className="grid max-w-xl gap-4 rounded-2xl bg-white p-5" label="Kullanıcı oluştur">
        <div className="grid gap-4 md:grid-cols-2">
          <label>
            <span className="admin-label">Kullanıcı adı</span>
            <input className="admin-input" name="username" required autoComplete="off" />
          </label>
          <label>
            <span className="admin-label">Şifre</span>
            <input className="admin-input" name="password" type="password" required minLength={6} />
          </label>
          <label>
            <span className="admin-label">Ad</span>
            <input className="admin-input" name="first_name" required />
          </label>
          <label>
            <span className="admin-label">Soyad</span>
            <input className="admin-input" name="last_name" required />
          </label>
          <label>
            <span className="admin-label">Kullanıcı durumu</span>
            <select className="admin-input" name="status" defaultValue="active">
              <option value="active">Aktif</option>
              <option value="inactive">Pasif</option>
            </select>
          </label>
          <label>
            <span className="admin-label">Kullanıcı seviyesi</span>
            <select className="admin-input" name="role" defaultValue="editor">
              <option value="admin">Yönetici</option>
              <option value="editor">Editör</option>
            </select>
          </label>
        </div>
      </AdminForm>
      <div className="mt-8 overflow-hidden rounded-2xl bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-stone-50 text-stone-500">
            <tr>
              <th className="px-4 py-3">Kullanıcı</th>
              <th className="px-4 py-3">Ad Soyad</th>
              <th className="px-4 py-3">Durum</th>
              <th className="px-4 py-3">Seviye</th>
              <th className="px-4 py-3">İşlem</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-t">
                <td className="px-4 py-3">{user.username || user.email}</td>
                <td className="px-4 py-3">{`${user.first_name ?? ""} ${user.last_name ?? ""}`.trim() || "-"}</td>
                <td className="px-4 py-3">{user.status === "inactive" ? "Pasif" : "Aktif"}</td>
                <td className="px-4 py-3">{user.role === "editor" ? "Editör" : "Yönetici"}</td>
                <td className="px-4 py-3">
                  <DeleteButton action={deleteAdminUser} id={user.id} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
