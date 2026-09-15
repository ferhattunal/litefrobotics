import { NextResponse } from "next/server";
import { searchCatalog } from "@/lib/queries";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const q = url.searchParams.get("q") ?? "";
  const lang = url.searchParams.get("lang") ?? "tr";
  const result = await searchCatalog(q, lang);
  return NextResponse.json(result);
}
