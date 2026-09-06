import { DeleteButton } from "@/components/admin/delete-button";
import { GalleryCreateForm } from "@/components/admin/gallery-create-form";
import { deleteGalleryItem } from "@/lib/actions/content";
import { getGallery } from "@/lib/queries-content";

export default async function GalleryAdminPage() {
  const items = await getGallery();
  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold">Galeri</h1>
      <GalleryCreateForm />
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {items.map((item) => (
          <div key={item.id} className="overflow-hidden rounded-2xl bg-white">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={item.image_url} alt={item.title} className="h-40 w-full object-cover" />
            <div className="flex items-center justify-between p-3 text-sm">
              <span>{item.title || "Görsel"}</span>
              <DeleteButton action={deleteGalleryItem} id={item.id} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
