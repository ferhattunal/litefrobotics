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
      .order("name");
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

export type SearchProductHit = {
  id: string;
  name: string;
  slug: string;
  brand: string;
  series: string;
  model: string;
  href: string;
  image: string | null;
  category: string;
};

export type SearchCategoryHit = {
  id: string;
  name: string;
  slug: string;
  href: string;
  image: string | null;
};

export type SearchCatalogResult = {
  products: SearchProductHit[];
  categories: SearchCategoryHit[];
};

function sanitizeSearchTerm(value: string) {
  return value.replace(/[%_,()]/g, " ").replace(/\s+/g, " ").trim().slice(0, 80);
}

function orIlike(columns: string[], term: string) {
  const pattern = `%${term}%`;
  return columns.map((column) => `${column}.ilike.${pattern}`).join(",");
}

function firstProductImage(images: { url: string; sort_order: number }[] | null | undefined) {
  return images?.slice().sort((a, b) => a.sort_order - b.sort_order)[0]?.url ?? null;
}

export async function searchCatalog(rawQuery: string): Promise<SearchCatalogResult> {
  const empty: SearchCatalogResult = { products: [], categories: [] };
  return run(empty, async () => {
    const supabase = db();
    const term = sanitizeSearchTerm(rawQuery);

    const mapCategory = (row: { id: string; name: string; slug: string; hero_image_url?: string | null }): SearchCategoryHit => ({
      id: row.id,
      name: row.name,
      slug: row.slug,
      href: `/kategoriler/${row.slug}`,
      image: row.hero_image_url || null,
    });

    const categoryName = (value: unknown) => {
      if (Array.isArray(value)) return String(value[0]?.name || "");
      if (value && typeof value === "object" && "name" in value) {
        return String((value as { name?: string }).name || "");
      }
      return "";
    };

    const mapProduct = (row: {
      id: string;
      name: string;
      slug: string;
      brand?: string | null;
      series?: string | null;
      model?: string | null;
      categories?: unknown;
      product_images?: { url: string; sort_order: number }[] | null;
    }): SearchProductHit => ({
      id: row.id,
      name: row.name,
      slug: row.slug,
      brand: row.brand || "",
      series: row.series || "",
      model: row.model || "",
      href: `/urunler/${row.slug}`,
      image: firstProductImage(row.product_images),
      category: categoryName(row.categories),
    });

    if (!term) {
      const [{ data: categories }, { data: products }] = await Promise.all([
        supabase.from("categories").select("id,name,slug,hero_image_url").order("name").limit(6),
        supabase
          .from("products")
          .select("id,name,slug,brand,series,model,categories(name),product_images(url,sort_order)")
          .eq("show_on_homepage", true)
          .order("featured", { ascending: false })
          .limit(6),
      ]);
      return {
        categories: (categories ?? []).map(mapCategory),
        products: (products ?? []).map(mapProduct),
      };
    }

    const categoryFilter = orIlike(["name", "slug", "hero_title", "hero_text"], term);
    const productFilter = orIlike(
      ["name", "slug", "brand", "series", "model", "description", "meta_title", "meta_description"],
      term,
    );

    const [{ data: categories }, { data: matchedProducts }] = await Promise.all([
      supabase.from("categories").select("id,name,slug,hero_image_url").or(categoryFilter).order("name").limit(8),
      supabase
        .from("products")
        .select("id,name,slug,brand,series,model,category_id,categories(name),product_images(url,sort_order)")
        .or(productFilter)
        .order("name")
        .limit(12),
    ]);

    const categoryRows = categories ?? [];
    const productMap = new Map((matchedProducts ?? []).map((row) => [row.id as string, mapProduct(row)]));

    const categoryIds = categoryRows.map((row) => row.id as string);
    if (categoryIds.length) {
      const { data: fromCategories } = await supabase
        .from("products")
        .select("id,name,slug,brand,series,model,categories(name),product_images(url,sort_order)")
        .in("category_id", categoryIds)
        .order("name")
        .limit(12);
      for (const row of fromCategories ?? []) {
        if (!productMap.has(row.id as string)) productMap.set(row.id as string, mapProduct(row));
      }
    }

    return {
      categories: categoryRows.map(mapCategory),
      products: [...productMap.values()].slice(0, 12),
    };
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
    quotesNew: 0,
    ...(await run({}, async () => {
      if (!process.env.SUPABASE_SERVICE_ROLE_KEY) return {};
      const admin = createAdminSupabase();
      const [pages, modules, categories, products, posts, quotesNew] = await Promise.all([
        admin.from("pages").select("id", { count: "exact", head: true }),
        admin.from("modules").select("id", { count: "exact", head: true }),
        admin.from("categories").select("id", { count: "exact", head: true }),
        admin.from("products").select("id", { count: "exact", head: true }),
        admin.from("blog_posts").select("id", { count: "exact", head: true }),
        admin.from("quote_requests").select("id", { count: "exact", head: true }).eq("status", "yeni"),
      ]);
      return {
        pages: pages.count ?? 0,
        modules: modules.count ?? 0,
        categories: categories.count ?? 0,
        products: products.count ?? 0,
        posts: posts.count ?? 0,
        quotesNew: quotesNew.count ?? 0,
      };
    })),
  };
}
