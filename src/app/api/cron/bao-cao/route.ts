import { NextRequest, NextResponse } from "next/server";
import { buildDailyReport } from "@/lib/ai/report";
import { notifyAdmin } from "@/lib/zalo/client";
import { cronAuthorized } from "@/lib/cron-auth";

export async function GET(req: NextRequest) {
  if (!cronAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const report = await buildDailyReport("day");
  await notifyAdmin(report);
  return NextResponse.json({ ok: true });
}
