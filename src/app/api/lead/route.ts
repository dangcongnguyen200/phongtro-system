import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { notifyAdmin, sendZaloText } from "@/lib/zalo/client";
import { z } from "zod";
const schema = z.object({
  phongId: z.string().optional(),
  khachTen: z.string().min(1).max(100),
  sdt: z.string().min(8).max(20),
  ghiChu: z.string().max(500).optional(),
});
export async function POST(req: NextRequest) {
  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "SĐT hoặc tên không hợp lệ" }, { status: 400 });
  }
  const lead = await prisma.lead.create({
    data: {
      phongId: parsed.data.phongId,
      khachTen: parsed.data.khachTen,
      sdt: parsed.data.sdt,
      ghiChu: parsed.data.ghiChu,
      trangThai: "moi",
    },
  });
  const phong = parsed.data.phongId
    ? await prisma.phong.findUnique({ where: { id: parsed.data.phongId } })
    : null;
  const msg = `📞 Lead mới: ${lead.khachTen} — ${lead.sdt}${phong?.maPhong ? ` · phòng ${phong.maPhong}` : ""}`;
  await notifyAdmin(msg);
  if (phong?.saleZalo && phong.saleZalo !== process.env.ZALO_ADMIN_USER_ID) {
    await sendZaloText(phong.saleZalo, msg);
  }
  return NextResponse.json({ ok: true, id: lead.id });
}
export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const trangThai = sp.get("trangThai");
  const page = Math.max(1, Number(sp.get("page") || 1));
  const take = 20;
  const where = trangThai ? { trangThai } : {};
  const [items, total] = await Promise.all([
    prisma.lead.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * take,
      take,
      include: { phong: { select: { maPhong: true } } },
    }),
    prisma.lead.count({ where }),
  ]);
  return NextResponse.json({ items, total, totalPages: Math.ceil(total / take) });
}
