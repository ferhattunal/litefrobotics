import { notFound } from "next/navigation";
import { LandingForm } from "@/components/admin/landing-form";
import { getModules, getPage, getPageModules } from "@/lib/queries";

export default async function EditLandingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [page, modules, assigned] = await Promise.all([getPage(id), getModules(), getPageModules(id)]);
  if (!page) notFound();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold">Landing page düzenle</h1>
      <LandingForm page={page} modules={modules} assigned={assigned} />
    </div>
  );
}
