import { NextRequest, NextResponse } from "next/server";
import { autoCleanup } from "@/lib/ai/cleanup";
import { cronAuthorized } from "@/lib/cron-auth";

export async function GET(req: NextRequest) {
  if (!cronAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const result = await autoCleanup();
  return NextResponse.json(result);
}
