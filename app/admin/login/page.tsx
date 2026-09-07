import { loginAction } from "@/lib/actions/auth";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f4f4f1] px-6">
      <form action={loginAction} className="w-full max-w-sm rounded-2xl border border-stone-200 bg-white p-8 shadow-sm">
        <p className="text-xs tracking-[0.2em] text-orange-700 uppercase">Litef Robotics</p>
        <h1 className="mt-2 text-2xl font-semibold">Admin girişi</h1>
        <label className="mt-6 block">
          <span className="admin-label">Kullanıcı adı</span>
          <input className="admin-input" name="username" required autoComplete="username" />
        </label>
        <label className="mt-4 block">
          <span className="admin-label">Şifre</span>
          <input className="admin-input" type="password" name="password" required />
        </label>
        {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}
        <button type="submit" className="mt-6 w-full rounded-lg bg-stone-900 py-2.5 text-white">
          Giriş yap
        </button>
      </form>
    </div>
  );
}
