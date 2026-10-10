import { prisma } from "@/lib/prisma";
import { aiLog } from "./log";
import { notifyAdmin } from "@/lib/zalo/client";

const DAY = 24 * 60 * 60 * 1000;

export async function autoCleanup() {
  const now = new Date();
  const deleteCutoff = new Date(Date.now() - 1 * DAY);

  const oldRooms = await prisma.phong.findMany({
    where: { status: "active", activeUntil: { lt: now } },
  });

  if (oldRooms.length) {
    await prisma.phong.updateMany({
      where: { id: { in: oldRooms.map((r) => r.id) } },
      data: { status: "locked", lockedAt: new Date() },
    });
  }

  const toDelete = await prisma.phong.findMany({
    where: { status: "locked", lockedAt: { lt: deleteCutoff } },
    select: { id: true, maPhong: true },
  });

  if (toDelete.length) {
    await prisma.lead.deleteMany({ where: { phongId: { in: toDelete.map((r) => r.id) } } });
    await prisma.phong.deleteMany({ where: { id: { in: toDelete.map((r) => r.id) } } });
  }

  const summary = {
    locked: oldRooms.length,
    deleted: toDelete.length,
  };
  await aiLog("cleanup", {}, summary);

  if (oldRooms.length || toDelete.length) {
    await notifyAdmin(
      `🧹 Auto-cleanup: khóa ${oldRooms.length} phòng quá 40 ngày, xóa ${toDelete.length} phòng đã khóa > 1 ngày.`,
    );
  }

  return summary;
}
