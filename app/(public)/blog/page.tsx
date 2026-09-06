import type { Metadata } from "next";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { getPublishedPosts } from "@/lib/queries";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Blog",
  description: "Litef Robotics blog yazıları",
};

export default async function BlogPage() {
  const posts = await getPublishedPosts();

  return (
    <section className="mx-auto max-w-5xl px-6 py-16">
      <h1 className="text-4xl font-semibold tracking-tight">Blog</h1>
      <div className="mt-10 grid gap-6">
        {posts.map((post) => (
          <Link
            key={post.id}
            href={`/blog/${post.slug}`}
            className="grid overflow-hidden rounded-2xl bg-white shadow-sm md:grid-cols-[240px_1fr]"
          >
            <div className="min-h-40 bg-stone-200">
              {post.cover_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={post.cover_url} alt="" className="h-full w-full object-cover" />
              ) : null}
            </div>
            <div className="p-6">
              <p className="text-sm text-stone-500">{formatDate(post.created_at)}</p>
              <h2 className="mt-2 text-2xl font-semibold">{post.title}</h2>
              <p className="mt-2 text-stone-600">{post.excerpt}</p>
            </div>
          </Link>
        ))}
        {!posts.length ? <p className="text-stone-500">Henüz yayınlanmış yazı yok.</p> : null}
      </div>
    </section>
  );
}
