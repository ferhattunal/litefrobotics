import { SystemSettingsForm } from "@/components/admin/system-settings-form";
import { getSiteSettings } from "@/lib/queries";
import { parseSiteConfig } from "@/lib/site-config";

export const dynamic = "force-dynamic";

export default async function SettingsAdminPage() {
  const settings = await getSiteSettings();
  const config = parseSiteConfig(settings);

  return (
    <div className="-m-6 min-h-[calc(100vh-73px)] bg-[#0f1115] p-6">
      <SystemSettingsForm initial={config} />
    </div>
  );
}
