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
