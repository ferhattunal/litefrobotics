import { DeleteButton } from "@/components/admin/delete-button";
import { SlideCreateForm } from "@/components/admin/slide-create-form";
import { deleteSlide } from "@/lib/actions/content";
import { getSlides } from "@/lib/queries-content";

export default async function SlidesAdminPage() {
  const items = await getSlides();
  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold">Slayt / Banner</h1>
      <SlideCreateForm />
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {items.map((item) => (
          <div key={item.id} className="overflow-hidden rounded-2xl bg-white">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={item.image_url} alt={item.title} className="h-40 w-full object-cover" />
            <div className="flex items-center justify-between p-3 text-sm">
              <span>
                {item.title || "Banner"} {item.published ? "" : "(gizli)"}
              </span>
              <DeleteButton action={deleteSlide} id={item.id} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
