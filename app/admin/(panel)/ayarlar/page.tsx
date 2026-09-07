import { SystemSettingsForm } from "@/components/admin/system-settings-form";
import { requireAdmin } from "@/lib/auth";
import { getSiteSettings } from "@/lib/queries";
import { parseSiteConfig } from "@/lib/site-config";

export const dynamic = "force-dynamic";

export default async function SettingsAdminPage() {
  await requireAdmin();
  const settings = await getSiteSettings();
  const config = parseSiteConfig(settings);

  return <SystemSettingsForm initial={config} />;
}
