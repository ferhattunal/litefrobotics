import { createAdminSupabase } from "./supabase/admin";
import { createServerSupabase } from "./supabase/server";
import { hasSupabaseEnv } from "./utils";
import type {
  AboutPage,
  BlogPost,
  Category,
  ContactPage,
  ModuleRecord,
  PageModule,
  PageRecord,
  Product,
  ProductImage,
  ProductWithRelations,
  SiteSettings,
} from "./types";

async function db() {
  return createServerSupabase();
}

export async function getSiteSettings(): Promise<SiteSettings | null> {
  if (!hasSupabaseEnv()) return null;
  const supabase = await db();
  const { data } = await supabase.from("site_settings").select("*").eq("id", 1).maybeSingle();
  return data as SiteSettings | null;
}

export async function getHomepage(): Promise<PageRecord | null> {
  if (!hasSupabaseEnv()) return null;
  const supabase = await db();
  const { data } = await supabase.from("pages").select("*").eq("is_homepage", true).maybeSingle();
  return data as PageRecord | null;
}

export async function getPageBySlug(slug: string): Promise<PageRecord | null> {
  if (!hasSupabaseEnv()) return null;
  const supabase = await db();
  const { data } = await supabase.from("pages").select("*").eq("slug", slug).maybeSingle();
  return data as PageRecord | null;
}

export async function getPageModules(pageId: string): Promise<(PageModule & { modules: ModuleRecord })[]> {
  if (!hasSupabaseEnv()) return [];
  const supabase = await db();
  const { data } = await supabase
    .from("page_modules")
    .select("*, modules(*)")
    .eq("page_id", pageId)
    .order("sort_order", { ascending: true });
  return (data ?? []) as (PageModule & { modules: ModuleRecord })[];
}

export async function getModules(): Promise<ModuleRecord[]> {
  if (!hasSupabaseEnv()) return [];
  const supabase = await db();
  const { data } = await supabase.from("modules").select("*").order("created_at", { ascending: false });
  return (data ?? []) as ModuleRecord[];
}

export async function getModule(id: string): Promise<ModuleRecord | null> {
  if (!hasSupabaseEnv()) return null;
  const supabase = await db();
  const { data } = await supabase.from("modules").select("*").eq("id", id).maybeSingle();
  return data as ModuleRecord | null;
}

export async function getPages(): Promise<PageRecord[]> {
  if (!hasSupabaseEnv()) return [];
  const supabase = await db();
  const { data } = await supabase.from("pages").select("*").order("created_at", { ascending: false });
  return (data ?? []) as PageRecord[];
}

export async function getPage(id: string): Promise<PageRecord | null> {
  if (!hasSupabaseEnv()) return null;
  const supabase = await db();
  const { data } = await supabase.from("pages").select("*").eq("id", id).maybeSingle();
  return data as PageRecord | null;
}

export async function getCategories(): Promise<Category[]> {
  if (!hasSupabaseEnv()) return [];
  const supabase = await db();
  const { data } = await supabase.from("categories").select("*").order("name");
  return (data ?? []) as Category[];
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  if (!hasSupabaseEnv()) return null;
  const supabase = await db();
  const { data } = await supabase.from("categories").select("*").eq("slug", slug).maybeSingle();
  return data as Category | null;
}

export async function getCategory(id: string): Promise<Category | null> {
  if (!hasSupabaseEnv()) return null;
  const supabase = await db();
  const { data } = await supabase.from("categories").select("*").eq("id", id).maybeSingle();
  return data as Category | null;
}

export async function getProductsByCategory(categoryId: string): Promise<ProductWithRelations[]> {
  if (!hasSupabaseEnv()) return [];
  const supabase = await db();
  const { data } = await supabase
    .from("products")
    .select("*, product_images(*)")
    .eq("category_id", categoryId)
    .order("name");
  return (data ?? []) as ProductWithRelations[];
}

export async function getProducts(): Promise<ProductWithRelations[]> {
  if (!hasSupabaseEnv()) return [];
  const supabase = await db();
  const { data } = await supabase
    .from("products")
    .select("*, categories(*), product_images(*)")
    .order("created_at", { ascending: false });
  return (data ?? []) as ProductWithRelations[];
}

export async function getProductBySlug(slug: string): Promise<ProductWithRelations | null> {
  if (!hasSupabaseEnv()) return null;
  const supabase = await db();
  const { data } = await supabase
    .from("products")
    .select("*, categories(*), product_images(*)")
    .eq("slug", slug)
    .maybeSingle();
  return data as ProductWithRelations | null;
}

export async function getProduct(id: string): Promise<ProductWithRelations | null> {
  if (!hasSupabaseEnv()) return null;
  const supabase = await db();
  const { data } = await supabase
    .from("products")
    .select("*, categories(*), product_images(*)")
    .eq("id", id)
    .maybeSingle();
  return data as ProductWithRelations | null;
}

export async function getPublishedPosts(): Promise<BlogPost[]> {
  if (!hasSupabaseEnv()) return [];
  const supabase = await db();
  const { data } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("published", true)
    .order("created_at", { ascending: false });
  return (data ?? []) as BlogPost[];
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  if (!hasSupabaseEnv()) return null;
  const supabase = await db();
  const { data } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();
  return data as BlogPost | null;
}

export async function getPosts(): Promise<BlogPost[]> {
  if (!hasSupabaseEnv()) return [];
  const supabase = await db();
  const { data } = await supabase.from("blog_posts").select("*").order("created_at", { ascending: false });
  return (data ?? []) as BlogPost[];
}

export async function getPost(id: string): Promise<BlogPost | null> {
  if (!hasSupabaseEnv()) return null;
  const supabase = await db();
  const { data } = await supabase.from("blog_posts").select("*").eq("id", id).maybeSingle();
  return data as BlogPost | null;
}

export async function getAboutPage(): Promise<AboutPage | null> {
  if (!hasSupabaseEnv()) return null;
  const supabase = await db();
  const { data } = await supabase.from("about_page").select("*").eq("id", 1).maybeSingle();
  return data as AboutPage | null;
}

export async function getContactPage(): Promise<ContactPage | null> {
  if (!hasSupabaseEnv()) return null;
  const supabase = await db();
  const { data } = await supabase.from("contact_page").select("*").eq("id", 1).maybeSingle();
  return data as ContactPage | null;
}

export async function getDashboardCounts() {
  if (!hasSupabaseEnv() || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return { pages: 0, modules: 0, categories: 0, products: 0, posts: 0 };
  }
  const admin = createAdminSupabase();
  const [pages, modules, categories, products, posts] = await Promise.all([
    admin.from("pages").select("id", { count: "exact", head: true }),
    admin.from("modules").select("id", { count: "exact", head: true }),
    admin.from("categories").select("id", { count: "exact", head: true }),
    admin.from("products").select("id", { count: "exact", head: true }),
    admin.from("blog_posts").select("id", { count: "exact", head: true }),
  ]);
  return {
    pages: pages.count ?? 0,
    modules: modules.count ?? 0,
    categories: categories.count ?? 0,
    products: products.count ?? 0,
    posts: posts.count ?? 0,
  };
}
