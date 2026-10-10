import { NextRequest } from "next/server";

export function cronAuthorized(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  const header = req.headers.get("authorization") || "";
  const q = req.nextUrl.searchParams.get("secret") || "";
  return header === `Bearer ${secret}` || q === secret;
}
