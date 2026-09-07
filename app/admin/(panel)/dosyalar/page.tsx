import { FileManager } from "@/components/admin/file-manager";

export default function FilesAdminPage() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold">Dosya Yöneticisi</h1>
      <p className="mb-6 text-sm text-stone-500">
        Görseller <code>media</code>, PDF ve dökümanlar <code>documents</code> bucket&apos;ında tutulur. Klasörlerin içine
        klasör açabilir, her öğenin public linkini kopyalayabilirsiniz.
      </p>
      <FileManager />
    </div>
  );
}
