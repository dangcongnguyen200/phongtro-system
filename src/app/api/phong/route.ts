import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { serializePhong } from "@/lib/serialize";
export const revalidate = 60;
export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const page = Math.max(1, Number(sp.get("page") || 1));
  const take = 12;
  const where: Prisma.PhongWhereInput = {
    status: "active",
    khuVuc: { an: false },
  };
  const khuVuc = sp.get("khuVuc");
  if (khuVuc) where.khuVuc = { an: false, slug: khuVuc };
  if (sp.get("giaMin"))
    where.gia = { ...(where.gia as object), gte: BigInt(sp.get("giaMin")!) };
  if (sp.get("giaMax"))
    where.gia = { ...(where.gia as object), lte: BigInt(sp.get("giaMax")!) };
  if (sp.get("dienTichMin"))
    where.dienTich = { gte: Number(sp.get("dienTichMin")) };
  if (sp.get("loaiPhong")) where.loaiPhong = sp.get("loaiPhong")!;
  const q = sp.get("q");
  if (q) {
    where.OR = [
      { maPhong: { contains: q } },
      { moTa: { contains: q } },
      { khuVuc: { ten: { contains: q } } },
      { diaChi: { text: { contains: q } } },
    ];
  }
  const sort = sp.get("sort") || "newest";
  const orderBy: Prisma.PhongOrderByWithRelationInput =
    sort === "price_asc"
      ? { gia: "asc" }
      : sort === "price_desc"
        ? { gia: "desc" }
        : sort === "view_desc"
          ? { luotXem: "desc" }
          : { createdAt: "desc" };
  const [total, rows] = await Promise.all([
    prisma.phong.count({ where }),
    prisma.phong.findMany({
      where,
      orderBy,
      skip: (page - 1) * take,
      take,
      include: { khuVuc: true, diaChi: true },
    }),
  ]);
  return NextResponse.json({
    items: rows.map(serializePhong),
    total,
    totalPages: Math.ceil(total / take),
  });
}
