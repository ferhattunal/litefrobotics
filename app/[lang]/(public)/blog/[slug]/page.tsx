import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PublicImage } from "@/components/public/public-image";
import { pageMetadata } from "@/lib/i18n/metadata";
import { parseLang } from "@/lib/i18n/params";
import { formatDate } from "@/lib/utils";
import { getPostBySlug } from "@/lib/queries";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ lang: string; slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const lang = await parseLang(params);
  const post = await getPostBySlug(slug);
  return pageMetadata({
    locale: lang,
    route: "blog",
    slug,
    title: post?.title ?? "Blog",
    description: post?.excerpt,
  });
}

export default async function BlogDetailPage({ params }: Props) {
  const { slug } = await params;
  await parseLang(params);
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  return (
    <article className="mx-auto max-w-3xl px-6 py-16">
      <p className="text-sm text-stone-500">{formatDate(post.created_at)}</p>
      <h1 className="mt-3 text-4xl font-semibold tracking-tight">{post.title}</h1>
      {post.cover_url ? (
        <div className="relative mt-8 aspect-[16/9] w-full overflow-hidden rounded-2xl">
          <PublicImage src={post.cover_url} alt="" fill className="object-cover" sizes="768px" />
        </div>
      ) : null}
      <div
        className="prose-litef mt-8 space-y-4 text-stone-700 [&_h2]:text-2xl [&_p]:leading-7"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
    </article>
  );
}
