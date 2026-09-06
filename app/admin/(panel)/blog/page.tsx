import Link from "next/link";
import { DeleteButton } from "@/components/admin/delete-button";
import { deletePost } from "@/lib/actions/blog";
import { getPosts } from "@/lib/queries";

export default async function BlogAdminPage() {
  const posts = await getPosts();

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Blog</h1>
        <Link href="/admin/blog/yeni" className="rounded-lg bg-stone-900 px-4 py-2 text-sm text-white">
          Yeni yazı
        </Link>
      </div>
      <div className="mt-6 overflow-hidden rounded-2xl bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-stone-50 text-stone-500">
            <tr>
              <th className="px-4 py-3">Başlık</th>
              <th className="px-4 py-3">Durum</th>
              <th className="px-4 py-3">İşlem</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post.id} className="border-t">
                <td className="px-4 py-3">{post.title}</td>
                <td className="px-4 py-3">{post.published ? "Yayında" : "Taslak"}</td>
                <td className="flex gap-4 px-4 py-3">
                  <Link href={`/admin/blog/${post.id}`} className="text-orange-700">
                    Düzenle
                  </Link>
                  <DeleteButton action={deletePost} id={post.id} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!posts.length ? <p className="px-4 py-6 text-stone-500">Henüz yazı yok.</p> : null}
      </div>
    </div>
  );
}
