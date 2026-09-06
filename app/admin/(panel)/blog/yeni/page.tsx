import { BlogForm } from "@/components/admin/blog-form";

export default function NewPostPage() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold">Yeni blog yazısı</h1>
      <BlogForm />
    </div>
  );
}
