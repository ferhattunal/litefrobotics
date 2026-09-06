import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { formatDate } from "@/lib/utils";
import { getPostBySlug } from "@/lib/queries";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  return {
    title: post?.title ?? "Blog",
    description: post?.excerpt || undefined,
  };
}

export default async function BlogDetailPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  return (
    <article className="mx-auto max-w-3xl px-6 py-16">
      <p className="text-sm text-stone-500">{formatDate(post.created_at)}</p>
      <h1 className="mt-3 text-4xl font-semibold tracking-tight">{post.title}</h1>
      {post.cover_url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={post.cover_url} alt="" className="mt-8 w-full rounded-2xl object-cover" />
      ) : null}
      <div
        className="prose-litef mt-8 space-y-4 text-stone-700 [&_h2]:text-2xl [&_p]:leading-7"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
    </article>
  );
}
