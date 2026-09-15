import { redirect } from "next/navigation";
import { localePath } from "@/lib/i18n/href";
import { parseLang } from "@/lib/i18n/params";

export default async function HaberlerRedirect({ params }: { params: Promise<{ lang: string }> }) {
  const lang = await parseLang(params);
  redirect(localePath(lang, "blog"));
}
