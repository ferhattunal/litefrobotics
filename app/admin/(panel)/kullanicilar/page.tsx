import { DeleteButton } from "@/components/admin/delete-button";
import { addAdminUser, deleteAdminUser } from "@/lib/actions/content";
import { getAdminUsers } from "@/lib/queries-content";

export default async function UsersAdminPage() {
  const users = await getAdminUsers();
  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold">Kullanıcılar</h1>
      <form action={addAdminUser} className="grid max-w-xl gap-4 rounded-2xl bg-white p-5">
        <p className="text-sm text-stone-500">
          Önce Supabase Authentication içinden kullanıcı oluşturun, ardından UUID ve e-postayı ekleyin.
        </p>
        <label>
          <span className="admin-label">Auth UUID</span>
          <input className="admin-input" name="id" required />
        </label>
        <label>
          <span className="admin-label">E-posta</span>
          <input className="admin-input" name="email" type="email" required />
        </label>
        <button className="w-fit rounded-lg bg-stone-900 px-4 py-2 text-white">Admin ekle</button>
      </form>
      <div className="mt-8 overflow-hidden rounded-2xl bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-stone-50 text-stone-500">
            <tr>
              <th className="px-4 py-3">E-posta</th>
              <th className="px-4 py-3">UUID</th>
              <th className="px-4 py-3">İşlem</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-t">
                <td className="px-4 py-3">{user.email}</td>
                <td className="px-4 py-3 font-mono text-xs">{user.id}</td>
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
