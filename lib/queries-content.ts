import { createAdminSupabase } from "./supabase/admin";
import { createQuerySupabase } from "./supabase/query";
import { hasSupabaseEnv } from "./utils";
import type {
  AdminUser,
  Dealer,
  Faq,
  GalleryItem,
  PriceList,
  QuoteRequest,
  ReferenceItem,
  Rental,
  Slide,
} from "./types";

function db() {
  return createQuerySupabase();
}

export async function listRows<T>(table: string, order = "created_at", ascending = false): Promise<T[]> {
  if (!hasSupabaseEnv()) return [];
  try {
    const supabase = db();
    const { data } = await supabase.from(table).select("*").order(order, { ascending });
    return (data ?? []) as T[];
  } catch {
    return [];
  }
}

export async function getRow<T>(table: string, id: string): Promise<T | null> {
  if (!hasSupabaseEnv()) return null;
  try {
    const supabase = db();
    const { data } = await supabase.from(table).select("*").eq("id", id).maybeSingle();
    return data as T | null;
  } catch {
    return null;
  }
}

export async function getQuotes() {
  if (!hasSupabaseEnv() || !process.env.SUPABASE_SERVICE_ROLE_KEY) return [];
  try {
    const admin = createAdminSupabase();
    const { data } = await admin.from("quote_requests").select("*").order("created_at", { ascending: false });
    return (data ?? []) as QuoteRequest[];
  } catch {
    return [];
  }
}

export async function getDealers() {
  return listRows<Dealer>("dealers", "name", true);
}

export async function getDealer(id: string) {
  return getRow<Dealer>("dealers", id);
}

export async function getPriceLists() {
  return listRows<PriceList>("price_lists", "created_at", false);
}

export async function getPriceList(id: string) {
  return getRow<PriceList>("price_lists", id);
}

export async function getRentals() {
  return listRows<Rental>("rentals", "title", true);
}

export async function getRental(id: string) {
  return getRow<Rental>("rentals", id);
}

export async function getRentalBySlug(slug: string) {
  if (!hasSupabaseEnv()) return null;
  try {
    const supabase = db();
    const { data } = await supabase.from("rentals").select("*").eq("slug", slug).maybeSingle();
    return data as Rental | null;
  } catch {
    return null;
  }
}

export async function getGallery() {
  return listRows<GalleryItem>("gallery_items", "sort_order", true);
}

export async function getGalleryItem(id: string) {
  return getRow<GalleryItem>("gallery_items", id);
}

export async function getReferences() {
  return listRows<ReferenceItem>("reference_items", "sort_order", true);
}

export async function getReference(id: string) {
  return getRow<ReferenceItem>("reference_items", id);
}

export async function getFaqs() {
  return listRows<Faq>("faqs", "sort_order", true);
}

export async function getFaq(id: string) {
  return getRow<Faq>("faqs", id);
}

export async function getSlides() {
  return listRows<Slide>("slides", "sort_order", true);
}

export async function getSlide(id: string) {
  return getRow<Slide>("slides", id);
}

export async function getAdminUsers() {
  if (!hasSupabaseEnv()) return [];
  try {
    const admin = createAdminSupabase();
    const { data } = await admin.from("admin_users").select("*").order("created_at");
    return (data ?? []) as AdminUser[];
  } catch {
    return [];
  }
}

export async function listStorageFiles() {
  if (!hasSupabaseEnv() || !process.env.SUPABASE_SERVICE_ROLE_KEY) return [];
  try {
    const admin = createAdminSupabase();
    const { data } = await admin.storage.from("page-assets").list("uploads", {
      limit: 100,
      sortBy: { column: "created_at", order: "desc" },
    });
    return data ?? [];
  } catch {
    return [];
  }
}
