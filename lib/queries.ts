import { createAdminSupabase } from "./supabase/admin";
import { createQuerySupabase } from "./supabase/query";
import { hasSupabaseEnv } from "./utils";
import type {
  AboutPage,
  BlogPost,
  Category,
  ContactPage,
  ModuleRecord,
  PageModule,
  PageRecord,
  ProductWithRelations,
  SiteSettings,
} from "./types";

async function run<T>(fallback: T, fn: () => Promise<T>): Promise<T> {
  if (!hasSupabaseEnv()) return fallback;
  try {
    return await fn();
  } catch {
    return fallback;
  }
}

function db() {
  return createQuerySupabase();
}

export async function getSiteSettings() {
  return run<SiteSettings | null>(null, async () => {
    const supabase = db();
    const { data } = await supabase.from("site_settings").select("*").eq("id", 1).maybeSingle();
    return data as SiteSettings | null;
  });
}

export async function getHomepage() {
  return run<PageRecord | null>(null, async () => {
    const supabase = db();
    const { data } = await supabase.from("pages").select("*").eq("is_homepage", true).maybeSingle();
    return data as PageRecord | null;
  });
}

export async function getPageBySlug(slug: string) {
  return run<PageRecord | null>(null, async () => {
    const supabase = db();
    const { data } = await supabase.from("pages").select("*").eq("slug", slug).maybeSingle();
    return data as PageRecord | null;
  });
}

export async function getPageModules(pageId: string) {
  return run<(PageModule & { modules: ModuleRecord })[]>([], async () => {
    const supabase = db();
    const { data } = await supabase
      .from("page_modules")
      .select("*, modules(*)")
      .eq("page_id", pageId)
      .order("sort_order", { ascending: true });
    return (data ?? []) as (PageModule & { modules: ModuleRecord })[];
  });
}

export async function getModules() {
  return run<ModuleRecord[]>([], async () => {
    const supabase = db();
    const { data } = await supabase.from("modules").select("*").order("created_at", { ascending: false });
    return (data ?? []) as ModuleRecord[];
  });
}

export async function getModule(id: string) {
  return run<ModuleRecord | null>(null, async () => {
    const supabase = db();
    const { data } = await supabase.from("modules").select("*").eq("id", id).maybeSingle();
    return data as ModuleRecord | null;
  });
}

export async function getPages() {
  return run<PageRecord[]>([], async () => {
    const supabase = db();
    const { data } = await supabase.from("pages").select("*").order("created_at", { ascending: false });
    return (data ?? []) as PageRecord[];
  });
}

export async function getPage(id: string) {
  return run<PageRecord | null>(null, async () => {
    const supabase = db();
    const { data } = await supabase.from("pages").select("*").eq("id", id).maybeSingle();
    return data as PageRecord | null;
  });
}

export async function getCategories() {
  return run<Category[]>([], async () => {
    const supabase = db();
    const { data } = await supabase.from("categories").select("*").order("name");
    return (data ?? []) as Category[];
  });
}

export async function getCategoryBySlug(slug: string) {
  return run<Category | null>(null, async () => {
    const supabase = db();
    const { data } = await supabase.from("categories").select("*").eq("slug", slug).maybeSingle();
    return data as Category | null;
  });
}

export async function getCategory(id: string) {
  return run<Category | null>(null, async () => {
    const supabase = db();
    const { data } = await supabase.from("categories").select("*").eq("id", id).maybeSingle();
    return data as Category | null;
  });
}

export async function getProductsByCategory(categoryId: string) {
  return run<ProductWithRelations[]>([], async () => {
    const supabase = db();
    const { data } = await supabase
      .from("products")
      .select("*, product_images(*)")
      .eq("category_id", categoryId)
      .order("name");
    return (data ?? []) as ProductWithRelations[];
  });
}

export async function getProducts() {
  return run<ProductWithRelations[]>([], async () => {
    const supabase = db();
    const { data } = await supabase
      .from("products")
      .select("*, categories(*), product_images(*), product_landing_pages(*)")
      .order("created_at", { ascending: false });
    return (data ?? []) as ProductWithRelations[];
  });
}

export async function getProductBySlug(slug: string) {
  return run<ProductWithRelations | null>(null, async () => {
    const supabase = db();
    const { data } = await supabase
      .from("products")
      .select("*, categories(*), product_images(*), product_landing_pages(*)")
      .eq("slug", slug)
      .maybeSingle();
    return data as ProductWithRelations | null;
  });
}

export async function getProduct(id: string) {
  return run<ProductWithRelations | null>(null, async () => {
    const supabase = db();
    const { data } = await supabase
      .from("products")
      .select("*, categories(*), product_images(*), product_landing_pages(*)")
      .eq("id", id)
      .maybeSingle();
    return data as ProductWithRelations | null;
  });
}

export async function getShowcaseProducts() {
  return run<ProductWithRelations[]>([], async () => {
    const supabase = db();
    const { data } = await supabase
      .from("products")
      .select("*, categories(*), product_images(*)")
      .eq("show_on_homepage", true)
      .order("featured", { ascending: false })
      .order("name");
    return (data ?? []) as ProductWithRelations[];
  });
}

export async function getProductsForLandingPage(pageId: string) {
  return run<ProductWithRelations[]>([], async () => {
    const supabase = db();
    const { data } = await supabase
      .from("product_landing_pages")
      .select("products(*, categories(*), product_images(*))")
      .eq("page_id", pageId);
    const rows = (data ?? []) as { products?: ProductWithRelations | ProductWithRelations[] | null }[];
    return rows.flatMap((row) => {
      const product = row.products;
      if (!product) return [];
      return Array.isArray(product) ? product : [product];
    });
  });
}

export async function getPublishedPosts() {
  return run<BlogPost[]>([], async () => {
    const supabase = db();
    const { data } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("published", true)
      .order("created_at", { ascending: false });
    return (data ?? []) as BlogPost[];
  });
}

export async function getPostBySlug(slug: string) {
  return run<BlogPost | null>(null, async () => {
    const supabase = db();
    const { data } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("slug", slug)
      .eq("published", true)
      .maybeSingle();
    return data as BlogPost | null;
  });
}

export async function getPosts() {
  return run<BlogPost[]>([], async () => {
    const supabase = db();
    const { data } = await supabase.from("blog_posts").select("*").order("created_at", { ascending: false });
    return (data ?? []) as BlogPost[];
  });
}

export async function getPost(id: string) {
  return run<BlogPost | null>(null, async () => {
    const supabase = db();
    const { data } = await supabase.from("blog_posts").select("*").eq("id", id).maybeSingle();
    return data as BlogPost | null;
  });
}

export async function getAboutPage() {
  return run<AboutPage | null>(null, async () => {
    const supabase = db();
    const { data } = await supabase.from("about_page").select("*").eq("id", 1).maybeSingle();
    return data as AboutPage | null;
  });
}

export async function getContactPage() {
  return run<ContactPage | null>(null, async () => {
    const supabase = db();
    const { data } = await supabase.from("contact_page").select("*").eq("id", 1).maybeSingle();
    return data as ContactPage | null;
  });
}

export async function getDashboardCounts() {
  return {
    pages: 0,
    modules: 0,
    categories: 0,
    products: 0,
    posts: 0,
    ...(await run({}, async () => {
      if (!process.env.SUPABASE_SERVICE_ROLE_KEY) return {};
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
    })),
  };
}
