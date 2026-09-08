import { MenuForm } from "@/components/admin/menu-form";
import { requireStaff } from "@/lib/auth";
import { getSiteSettings } from "@/lib/queries";
import { parseSiteConfig } from "@/lib/site-config";

export const dynamic = "force-dynamic";

export default async function MenusAdminPage() {
  await requireStaff();
  const settings = await getSiteSettings();
  const config = parseSiteConfig(settings);
  return <MenuForm initial={config} />;
}
