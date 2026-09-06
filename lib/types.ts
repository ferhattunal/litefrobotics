import type { SiteConfig } from "./site-config";

export type { SiteConfig };

export type RenderMode = "code" | "modules";

export type CardDesign = {
  imageHeight: number;
  titleFontSize: number;
  background: string;
  shadow: string;
  radius: number;
};

export type SiteSettings = {
  id: number;
  navbar_html: string;
  navbar_css: string;
  footer_html: string;
  footer_css: string;
  homepage_page_id: string | null;
  config?: SiteConfig | null;
  updated_at: string;
};

export type ModuleRecord = {
  id: string;
  name: string;
  html: string;
  css: string;
  js: string;
  created_at: string;
  updated_at: string;
};

export type PageRecord = {
  id: string;
  title: string;
  slug: string;
  meta_description: string;
  meta_keywords: string;
  is_homepage: boolean;
  render_mode: RenderMode;
  html: string;
  css: string;
  js: string;
  created_at: string;
  updated_at: string;
};

export type PageModule = {
  id: string;
  page_id: string;
  module_id: string;
  sort_order: number;
  modules?: ModuleRecord;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  hero_image_url: string | null;
  hero_title: string;
  hero_text: string;
  card_design: CardDesign | null;
  created_at: string;
  updated_at: string;
};

export type Product = {
  id: string;
  category_id: string;
  name: string;
  slug: string;
  description: string;
  pdf_url: string | null;
  card_design: CardDesign | null;
  created_at: string;
  updated_at: string;
};

export type ProductImage = {
  id: string;
  product_id: string;
  url: string;
  sort_order: number;
};

export type ProductWithRelations = Product & {
  categories?: Category | null;
  product_images?: ProductImage[];
};

export type BlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_url: string | null;
  published: boolean;
  created_at: string;
  updated_at: string;
};

export type AboutPage = {
  id: number;
  title: string;
  content: string;
  meta_description: string;
  meta_keywords: string;
  updated_at: string;
};

export type ContactPage = {
  id: number;
  title: string;
  content: string;
  address: string;
  phone: string;
  email: string;
  maps_embed_url: string;
  meta_description: string;
  meta_keywords: string;
  updated_at: string;
};

export type QuoteRequest = {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  message: string;
  product_name: string;
  status: string;
  created_at: string;
};

export type Dealer = {
  id: string;
  name: string;
  city: string;
  address: string;
  phone: string;
  email: string;
  published: boolean;
  created_at: string;
  updated_at: string;
};

export type PriceList = {
  id: string;
  title: string;
  file_url: string | null;
  published: boolean;
  created_at: string;
  updated_at: string;
};

export type Rental = {
  id: string;
  title: string;
  slug: string;
  description: string;
  image_url: string | null;
  published: boolean;
  created_at: string;
  updated_at: string;
};

export type GalleryItem = {
  id: string;
  title: string;
  image_url: string;
  sort_order: number;
  created_at: string;
};

export type ReferenceItem = {
  id: string;
  name: string;
  logo_url: string | null;
  url: string;
  sort_order: number;
  created_at: string;
};

export type Faq = {
  id: string;
  question: string;
  answer: string;
  sort_order: number;
  created_at: string;
};

export type Slide = {
  id: string;
  title: string;
  image_url: string;
  link_url: string;
  sort_order: number;
  published: boolean;
  created_at: string;
};

export type AdminUser = {
  id: string;
  email: string;
  created_at: string;
};
