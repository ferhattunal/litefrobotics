"use client";

import { useState } from "react";
import { FileUploader } from "@/components/admin/file-uploader";
import { savePost } from "@/lib/actions/blog";
import { slugify } from "@/lib/utils";
import type { BlogPost } from "@/lib/types";

export function BlogForm({ post }: { post?: BlogPost }) {
  const [title, setTitle] = useState(post?.title ?? "");
  const [slug, setSlug] = useState(post?.slug ?? "");
  const [cover, setCover] = useState(post?.cover_url ?? "");

  return (
    <form action={savePost} className="grid max-w-4xl gap-5">
      {post ? <input type="hidden" name="id" value={post.id} /> : null}
      <input type="hidden" name="cover_url" value={cover} />

      <label>
        <span className="admin-label">Başlık</span>
        <input
          className="admin-input"
          name="title"
          value={title}
          onChange={(event) => {
            setTitle(event.target.value);
            if (!post) setSlug(slugify(event.target.value));
          }}
          required
        />
      </label>
      <label>
        <span className="admin-label">Slug</span>
        <input className="admin-input" name="slug" value={slug} onChange={(event) => setSlug(event.target.value)} required />
      </label>
      <FileUploader bucket="blog-images" folder="covers" value={cover} label="Kapak görseli" onChange={setCover} />
      <label>
        <span className="admin-label">Özet</span>
        <textarea className="admin-textarea min-h-20" name="excerpt" defaultValue={post?.excerpt} />
      </label>
      <label>
        <span className="admin-label">İçerik (HTML)</span>
        <textarea className="admin-textarea min-h-48" name="content" defaultValue={post?.content} />
      </label>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="published" value="1" defaultChecked={post?.published} />
        Yayınla
      </label>
      <button type="submit" className="w-fit rounded-lg bg-stone-900 px-4 py-2 text-white">
        Yazıyı kaydet
      </button>
    </form>
  );
}
