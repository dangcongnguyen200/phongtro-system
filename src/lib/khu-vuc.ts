import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";

export async function findOrCreateKhuVuc(ten: string) {
  const name = ten.trim();
  const slug = slugify(name);
  const existing = await prisma.khuVuc.findFirst({
    where: { OR: [{ slug }, { ten: { equals: name, mode: "insensitive" } }] },
  });
  if (existing) return existing;
  return prisma.khuVuc.create({ data: { ten: name, slug } });
}

export async function findOrCreateDiaChi(khuVucId: string, text: string) {
  const t = text.trim();
  const existing = await prisma.diaChi.findFirst({
    where: { khuVucId, text: { equals: t, mode: "insensitive" } },
  });
  if (existing) return existing;
  return prisma.diaChi.create({ data: { khuVucId, text: t, loai: "duong" } });
}
