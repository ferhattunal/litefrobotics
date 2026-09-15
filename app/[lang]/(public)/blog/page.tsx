import type { Metadata } from "next";
import Link from "next/link";
import { PublicImage } from "@/components/public/public-image";
import { getDictionary } from "@/lib/i18n/dictionary";
import { localePath } from "@/lib/i18n/href";
import { pageMetadata } from "@/lib/i18n/metadata";
import { parseLang } from "@/lib/i18n/params";
import { formatDate } from "@/lib/utils";
import { getPublishedPosts } from "@/lib/queries";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const lang = await parseLang(params);
  const copy = getDictionary(lang);
  return pageMetadata({ locale: lang, route: "blog", title: copy.blog.title });
}

export default async function BlogPage({ params }: Props) {
  const lang = await parseLang(params);
  const copy = getDictionary(lang);
  const posts = await getPublishedPosts();

  return (
    <section className="mx-auto max-w-5xl px-6 py-16">
      <h1 className="text-4xl font-semibold tracking-tight">{copy.blog.title}</h1>
      <div className="mt-10 grid gap-6">
        {posts.map((post) => (
          <Link
            key={post.id}
            href={localePath(lang, "blog", post.slug)}
            className="grid overflow-hidden rounded-2xl bg-white shadow-sm md:grid-cols-[240px_1fr]"
          >
            <div className="relative min-h-40 bg-stone-200">
              {post.cover_url ? <PublicImage src={post.cover_url} alt="" fill className="object-cover" sizes="240px" /> : null}
            </div>
            <div className="p-6">
              <p className="text-sm text-stone-500">{formatDate(post.created_at)}</p>
              <h2 className="mt-2 text-2xl font-semibold">{post.title}</h2>
              <p className="mt-2 text-stone-600">{post.excerpt}</p>
            </div>
          </Link>
        ))}
        {!posts.length ? <p className="text-stone-500">{copy.blog.empty}</p> : null}
      </div>
    </section>
  );
}
