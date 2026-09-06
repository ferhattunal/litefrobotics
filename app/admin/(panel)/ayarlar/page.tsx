import { SystemSettingsForm } from "@/components/admin/system-settings-form";
import { getSiteSettings } from "@/lib/queries";
import { parseSiteConfig } from "@/lib/site-config";

export const dynamic = "force-dynamic";

export default async function SettingsAdminPage() {
  const settings = await getSiteSettings();
  const config = parseSiteConfig(settings);

  return (
    <SystemSettingsForm initial={config} />
  );
}
