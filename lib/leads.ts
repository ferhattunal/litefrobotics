import { z } from "zod";
import { locales } from "@/lib/i18n/config";

export const leadSchema = z.object({
  full_name: z.string().trim().min(2).max(120),
  phone: z.string().trim().min(6).max(40),
  company: z.string().trim().max(160),
  interested_product: z.string().trim().max(200),
  language: z.enum(locales),
  utm_source: z.string().trim().max(200),
});

export type LeadInput = z.infer<typeof leadSchema>;
