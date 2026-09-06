import { FileManager } from "@/components/admin/file-manager";
import { listStorageFiles } from "@/lib/queries-content";

export default async function FilesAdminPage() {
  const files = await listStorageFiles();
  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold">Dosya Yöneticisi</h1>
      <FileManager
        files={files.map((file) => ({ name: file.name, created_at: file.created_at ?? undefined }))}
      />
    </div>
  );
}
