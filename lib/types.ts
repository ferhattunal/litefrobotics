import type { SiteConfig } from "./site-config";

export type { SiteConfig };

export type RenderMode = "code" | "modules";

export type ModuleType = "hero" | "features" | "cta" | "richtext" | "custom";

export type ImageRatio = "1/1" | "4/3" | "16/9" | "3/4" | "auto";

export type CardDesign = {
  imageHeight: number;
  titleFontSize: number;
  background: string;
  shadow: string;
  hoverShadow: string;
  radius: number;
  borderWidth: number;
  borderColor: string;
  accentColor: string;
  padding: number;
  imageRatio: ImageRatio;
  hoverPan: boolean;
};

export type ColorFill =
  | { mode: "solid"; color: string }
  | { mode: "gradient"; from: string; to: string; angle: number };

export type PriceDisplay = "try" | "usd" | "both";

export type UserStatus = "active" | "inactive";

export type UserRole = "admin" | "editor";

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
  module_type?: ModuleType | string | null;
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
  brand: string;
  series: string;
  model: string;
  price_try: number | null;
  price_usd: number | null;
  price_display: PriceDisplay;
  show_on_homepage: boolean;
  show_price_on_card: boolean;
  show_stock_badge_on_card: boolean;
  featured: boolean;
  stock_qty: number;
  in_stock: boolean;
  about_heading: string;
  about_html: string;
  about_image_url: string | null;
  specs_xml: string;
  meta_title: string;
  meta_description: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type ProductImage = {
  id: string;
  product_id: string;
  url: string;
  sort_order: number;
};

export type ProductLandingPage = {
  product_id: string;
  page_id: string;
};

export type ProductWithRelations = Product & {
  categories?: Category | null;
  product_images?: ProductImage[];
  product_landing_pages?: ProductLandingPage[];
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
  username: string;
  first_name: string;
  last_name: string;
  status: UserStatus;
  role: UserRole;
  created_at: string;
};
