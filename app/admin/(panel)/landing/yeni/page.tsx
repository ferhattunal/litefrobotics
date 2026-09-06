import { LandingForm } from "@/components/admin/landing-form";
import { getModules } from "@/lib/queries";

export default async function NewLandingPage() {
  const modules = await getModules();
  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold">Yeni landing page</h1>
      <LandingForm modules={modules} />
    </div>
  );
}
