import { prisma } from "@/lib/prisma";

const TOKEN = process.env.ZALO_OA_ACCESS_TOKEN || "";
const ADMIN_ID = process.env.ZALO_ADMIN_USER_ID || "";

export async function sendZaloText(userId: string, text: string) {
  if (!TOKEN || !userId) {
    await prisma.aiLog.create({
      data: {
        action: "zalo_skip",
        input: userId,
        output: text.slice(0, 2000),
      },
    });
    return { ok: false, skipped: true };
  }
  const res = await fetch("https://openapi.zalo.me/v3.0/oa/message/cs", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      access_token: TOKEN,
    },
    body: JSON.stringify({
      recipient: { user_id: userId },
      message: { text },
    }),
  });
  const body = await res.text();
  await prisma.aiLog.create({
    data: {
      action: "zalo_send",
      input: userId,
      output: body.slice(0, 2000),
    },
  });
  return { ok: res.ok, skipped: false };
}

export async function notifyAdmin(text: string) {
  if (!ADMIN_ID) return;
  await sendZaloText(ADMIN_ID, text);
}

export function isOwner(zaloUserId: string) {
  return Boolean(ADMIN_ID && zaloUserId === ADMIN_ID);
}
