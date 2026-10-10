import { NextRequest, NextResponse } from "next/server";
import { ingestListing } from "@/lib/ai/agent";
import { isOwner, sendZaloText } from "@/lib/zalo/client";
import { aiLog } from "@/lib/ai/log";

export async function GET() {
  return NextResponse.json({ ok: true });
}

type ZaloEvent = {
  event_name?: string;
  sender?: { id?: string };
  message?: {
    text?: string;
    attachments?: { type?: string; payload?: { url?: string } }[];
  };
};

export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => null)) as ZaloEvent | null;
  if (!body) return NextResponse.json({ ok: true });

  const userId = body.sender?.id || "";
  const text = body.message?.text || "";
  const images =
    body.message?.attachments
      ?.map((a) => a.payload?.url)
      .filter((u): u is string => Boolean(u)) || [];

  await aiLog("zalo_in", { event: body.event_name, userId, text, images: images.length }, {});

  if (!userId || (!text && !images.length)) {
    return NextResponse.json({ ok: true });
  }

  const result = await ingestListing({
    text: text || "Ảnh phòng",
    images,
    saleZalo: userId,
    fromOwner: isOwner(userId),
  });

  await sendZaloText(userId, result.message);
  return NextResponse.json({ ok: true });
}
