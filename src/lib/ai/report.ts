import { prisma } from "@/lib/prisma";
export async function buildDailyReport(range: "day" | "week" = "day") {
  const since = new Date();
  if (range === "week") since.setDate(since.getDate() - 7);
  else since.setHours(0, 0, 0, 0);
  const [tong, active, locked, moi, lead, chuaGoi, daGoi, daHen, huy, top, taoLog, lockLog] =
    await Promise.all([
      prisma.phong.count(),
      prisma.phong.count({ where: { status: "active" } }),
      prisma.phong.count({ where: { status: "locked" } }),
      prisma.phong.count({ where: { createdAt: { gte: since } } }),
      prisma.lead.count({ where: { createdAt: { gte: since } } }),
      prisma.lead.count({ where: { trangThai: "moi" } }),
      prisma.lead.count({ where: { trangThai: "da_goi" } }),
      prisma.lead.count({ where: { trangThai: "da_hen" } }),
      prisma.lead.count({ where: { trangThai: "huy" } }),
      prisma.phong.findFirst({ where: { status: "active" }, orderBy: { luotXem: "desc" } }),
      prisma.aiLog.count({ where: { action: "tao_phong", createdAt: { gte: since } } }),
      prisma.aiLog.count({ where: { action: "cleanup", createdAt: { gte: since } } }),
    ]);
  const views = await prisma.phong.aggregate({
    _sum: { luotXem: true },
    where: { status: "active" },
  });
  const label = range === "week" ? "TUẦN NÀY" : `NGÀY ${new Date().toLocaleDateString("vi-VN")}`;
  return `📊 BÁO CÁO ${label}
�� Phòng:
- Tổng: ${tong}
- Active: ${active}
- Locked: ${locked}
- Mới: ${moi}
📞 Lead:
- Kỳ này: ${lead}
- Chưa gọi: ${chuaGoi}
- Đã gọi: ${daGoi}
- Đã hẹn: ${daHen}
- Hủy: ${huy}
👁️ View:
- Tổng active: ${views._sum.luotXem || 0}
- Top phòng: ${top?.maPhong || "—"} (${top?.luotXem || 0} view)
⚡ Hành động AI:
- Log tạo phòng: ${taoLog}
- Log cleanup: ${lockLog}`;
}
