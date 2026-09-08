import { NextResponse } from "next/server";
import { searchCatalog } from "@/lib/queries";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const q = url.searchParams.get("q") ?? "";
  const result = await searchCatalog(q);
  return NextResponse.json(result);
}
