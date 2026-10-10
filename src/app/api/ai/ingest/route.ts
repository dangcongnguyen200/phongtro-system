import { NextRequest, NextResponse } from "next/server";
import { ingestListing } from "@/lib/ai/agent";
import { cronAuthorized } from "@/lib/cron-auth";

export async function POST(req: NextRequest) {
  if (!cronAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json();
  const result = await ingestListing({
    text: String(body.text || ""),
    images: Array.isArray(body.images) ? body.images : [],
    saleTen: body.saleTen,
    saleSdt: body.saleSdt,
    saleZalo: body.saleZalo,
    fromOwner: true,
  });
  return NextResponse.json(result);
}
