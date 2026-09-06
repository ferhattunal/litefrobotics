import { notFound } from "next/navigation";
import { BlogForm } from "@/components/admin/blog-form";
import { getPost } from "@/lib/queries";

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await getPost(id);
  if (!post) notFound();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold">Yazıyı düzenle</h1>
      <BlogForm post={post} />
    </div>
  );
}
