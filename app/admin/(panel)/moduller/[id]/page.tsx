import { notFound } from "next/navigation";
import { ModuleForm } from "@/components/admin/module-form";
import { getModule } from "@/lib/queries";

export default async function EditModulePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const module = await getModule(id);
  if (!module) notFound();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold">Modülü düzenle</h1>
      <ModuleForm module={module} />
    </div>
  );
}
