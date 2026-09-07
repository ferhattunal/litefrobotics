import Link from "next/link";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { requireAdminSession } from "@/lib/auth";

export default async function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  const { staff } = await requireAdminSession();

  return (
    <div className="min-h-screen bg-[#f3f4f6] lg:grid lg:grid-cols-[260px_1fr]">
      <AdminSidebar role={staff.role} />
      <div className="min-w-0">
        <div className="flex items-center justify-between border-b border-stone-200 bg-white px-6 py-4">
          <p className="text-sm text-stone-500">Yönetim Paneli</p>
          <Link href="/" className="text-sm text-orange-700 hover:underline" target="_blank">
            Siteyi gör
          </Link>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
