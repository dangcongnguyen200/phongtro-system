import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";
import { buildDailyReport } from "./report";
export type CommandResult = { handled: boolean; message: string };
function parseMoney(s: string): number | undefined {
  const tr = s.match(/(\d+(?:[.,]\d+)?)\s*tr/i);
  if (tr) {
    const [a, b] = tr[1].replace(",", ".").split(".");
    return Math.round((Number(a) + (b ? Number(`0.${b}`) : 0)) * 1_000_000);
  }
  const n = Number(s.replace(/[^\d]/g, ""));
  return n > 0 ? n : undefined;
}
async function findPhong(code: string) {
  return prisma.phong.findFirst({
    where: {
      status: { not: "deleted" },
      OR: [
        { maPhong: { equals: code } },
        { id: code },
      ],
    },
  });
}
export async function runOwnerCommand(text: string): Promise<CommandResult> {
  const t = text.trim();
  const lower = t.toLowerCase();
  // ==================== HELP ====================
  if (/^help$|^hướng dẫn$|^huong dan$/i.test(lower)) {
    return {
      handled: true,
      message: `🤖 Lệnh khả dụng:
- khóa phòng P101
- gia hạn P101 thêm 30 ngày
- gia hạn tất cả 30 ngày
- đổi giá P101 thành 4tr5
- đổi sđt P101 thành 0987654321
- duyệt phòng P101
- duyệt tất cả phòng mới
- danh sách phòng
- lead mới
- thống kê
- báo cáo hôm nay / báo cáo tuần
- top 10 view
- thêm khu vực Gò Vấp
- ẩn khu vực Gò Vấp
- xóa hết phòng quá hạn`,
    };
  }
  // ==================== KHÓA PHÒNG ====================
  const khoa = t.match(/khóa phòng\s+([A-Za-z0-9]+)/i) || t.match(/khoá phòng\s+([A-Za-z0-9]+)/i);
  if (khoa) {
    const phong = await findPhong(khoa[1]);
    if (!phong) return { handled: true, message: `Không thấy phòng ${khoa[1]}.` };
    await prisma.phong.update({
      where: { id: phong.id },
      data: { status: "locked", lockedAt: new Date() },
    });
    const active = await prisma.phong.count({ where: { status: "active" } });
    return {
      handled: true,
      message: `✅ Đã khóa ${phong.maPhong || phong.id}. Phòng sẽ bị xóa sau 1 ngày. Còn ${active} phòng active.`,
    };
  }
  // ==================== XÓA PHÒNG QUÁ HẠN ====================
  if (/xóa hết phòng quá (hạn|40 ngày)|xoa het phong qua/i.test(lower)) {
    const old = await prisma.phong.findMany({
      where: {
        OR: [
          { status: "locked" },
          { status: "active", activeUntil: { lt: new Date() } },
        ],
      },
    });
    if (old.length) {
      await prisma.phong.deleteMany({ where: { id: { in: old.map((p) => p.id) } } });
    }
    const active = await prisma.phong.count({ where: { status: "active" } });
    return {
      handled: true,
      message: `✅ Đã xóa ${old.length} phòng quá hạn. Còn ${active} phòng active.`,
    };
  }
  // ==================== GIA HẠN 1 PHÒNG ====================
  const giaHan = t.match(/gia hạn(?: phòng)?\s+([A-Za-z0-9]+)\s+thêm\s+(\d+)\s*ngày/i);
  if (giaHan) {
    const phong = await findPhong(giaHan[1]);
    if (!phong) return { handled: true, message: `Không thấy phòng ${giaHan[1]}.` };
    const days = Number(giaHan[2]);
    const until = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
    await prisma.phong.update({
      where: { id: phong.id },
      data: { status: "active", lockedAt: null, activeUntil: until },
    });
    return {
      handled: true,
      message: `✅ Đã gia hạn ${phong.maPhong || phong.id} đến ${until.toLocaleDateString("vi-VN")}.`,
    };
  }
  // ==================== GIA HẠN TẤT CẢ ====================
  const giaHanAll = t.match(/gia hạn tất cả(?: phòng)?\s+(\d+)\s*ngày/i);
  if (giaHanAll) {
    const days = Number(giaHanAll[1]);
    const until = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
    const r = await prisma.phong.updateMany({
      where: { status: "active" },
      data: { activeUntil: until },
    });
    return {
      handled: true,
      message: `✅ Đã gia hạn ${r.count} phòng đến ${until.toLocaleDateString("vi-VN")}.`,
    };
  }
  // ==================== ĐỔI GIÁ ====================
  const doiGia = t.match(/đổi giá(?: phòng)?\s+([A-Za-z0-9]+)\s+thành\s+(.+)/i);
  if (doiGia) {
    const phong = await findPhong(doiGia[1]);
    const gia = parseMoney(doiGia[2]);
    if (!phong) return { handled: true, message: `Không thấy phòng ${doiGia[1]}.` };
    if (!gia) return { handled: true, message: "Không đọc được giá mới." };
    await prisma.phong.update({ where: { id: phong.id }, data: { gia: BigInt(gia) } });
    return { handled: true, message: `✅ Đã đổi giá ${phong.maPhong || phong.id} thành ${gia.toLocaleString("vi-VN")}đ.` };
  }
  // ==================== ĐỔI SĐT ====================
  const doiSdt = t.match(/đổi sđt(?: phòng)?\s+([A-Za-z0-9]+)\s+thành\s+(\d+)/i);
  if (doiSdt) {
    const phong = await findPhong(doiSdt[1]);
    if (!phong) return { handled: true, message: `Không thấy phòng ${doiSdt[1]}.` };
    await prisma.phong.update({
      where: { id: phong.id },
      data: { saleSdt: doiSdt[2], saleZalo: doiSdt[2] },
    });
    return { handled: true, message: `✅ Đã đổi SĐT ${phong.maPhong} thành ${doiSdt[2]}.` };
  }
  // ==================== BÁO CÁO ====================
  if (/báo cáo hôm nay|bao cao hom nay/i.test(lower)) {
    return { handled: true, message: await buildDailyReport("day") };
  }
  if (/báo cáo tuần|bao cao tuan/i.test(lower)) {
    return { handled: true, message: await buildDailyReport("week") };
  }
  // ==================== TOP VIEW ====================
  if (/top\s*10.*view|phòng nhiều view/i.test(lower)) {
    const top = await prisma.phong.findMany({
      where: { status: "active" },
      orderBy: { luotXem: "desc" },
      take: 10,
    });
    const lines = top.map((p, i) => `${i + 1}. ${p.maPhong || p.id.slice(-6)} — ${p.luotXem} view`);
    return { handled: true, message: `👁️ Top 10 phòng:\n${lines.join("\n")}` };
  }
  // ==================== DANH SÁCH PHÒNG ====================
  if (/danh sách phòng|liệt kê phòng|list phòng/i.test(lower)) {
    const list = await prisma.phong.findMany({
      where: { status: "active" },
      orderBy: { createdAt: "desc" },
      take: 20,
      include: { khuVuc: true },
    });
    if (!list.length) return { handled: true, message: "Chưa có phòng active nào." };
    const lines = list.map(
      (p, i) => `${i + 1}. ${p.maPhong || p.id.slice(-6)} — ${Number(p.gia).toLocaleString("vi-VN")}đ — ${p.khuVuc?.ten || "?"}`,
    );
    return { handled: true, message: `📋 ${list.length} phòng active:\n${lines.join("\n")}` };
  }
  // ==================== LEAD MỚI ====================
  if (/lead mới|khách mới|danh sách lead/i.test(lower)) {
    const leads = await prisma.lead.findMany({
      where: { trangThai: "moi" },
      orderBy: { createdAt: "desc" },
      take: 20,
      include: { phong: true },
    });
    if (!leads.length) return { handled: true, message: "Không có lead mới." };
    const lines = leads.map(
      (l, i) => `${i + 1}. ${l.khachTen} — ${l.sdt}${l.phong?.maPhong ? ` (${l.phong.maPhong})` : ""}`,
    );
    return { handled: true, message: `📞 ${leads.length} lead mới:\n${lines.join("\n")}` };
  }
  // ==================== THỐNG KÊ ====================
  if (/thống kê|thong ke|stats/i.test(lower)) {
    const [tong, active, locked, leads] = await Promise.all([
      prisma.phong.count(),
      prisma.phong.count({ where: { status: "active" } }),
      prisma.phong.count({ where: { status: "locked" } }),
      prisma.lead.count({ where: { trangThai: "moi" } }),
    ]);
    return {
      handled: true,
      message: `📊 Thống kê:\n- Tổng phòng: ${tong}\n- Active: ${active}\n- Locked: ${locked}\n- Lead mới: ${leads}`,
    };
  }
  // ==================== ẨN KHU VỰC ====================
  const anKv = t.match(/ẩn khu vực\s+(.+)/i);
  if (anKv) {
    const ten = anKv[1].trim();
    const kv = await prisma.khuVuc.findFirst({
      where: { ten: { equals: ten } },
    });
    if (!kv) return { handled: true, message: `Không thấy khu vực ${ten}.` };
    await prisma.khuVuc.update({ where: { id: kv.id }, data: { an: true } });
    return { handled: true, message: `✅ Đã ẩn khu vực ${kv.ten}.` };
  }
  // ==================== THÊM KHU VỰC ====================
  const themKv = t.match(/thêm khu vực\s+(.+)/i);
  if (themKv) {
    const ten = themKv[1].trim();
    const slug = slugify(ten);
    await prisma.khuVuc.upsert({
      where: { slug },
      update: { an: false, ten },
      create: { ten, slug },
    });
    return { handled: true, message: `✅ Đã thêm khu vực ${ten}.` };
  }
  // ==================== DUYỆT ====================
  if (/duyệt tất cả phòng mới/i.test(lower)) {
    const r = await prisma.phong.updateMany({
      where: { status: "locked", lockedAt: null },
      data: { status: "active" },
    });
    return { handled: true, message: `✅ Đã duyệt ${r.count} phòng.` };
  }
  const duyet = t.match(/duyệt phòng\s+([A-Za-z0-9]+)/i);
  if (duyet) {
    const phong = await findPhong(duyet[1]);
    if (!phong) return { handled: true, message: `Không thấy phòng ${duyet[1]}.` };
    await prisma.phong.update({
      where: { id: phong.id },
      data: { status: "active", lockedAt: null },
    });
    return { handled: true, message: `✅ Đã duyệt ${phong.maPhong || phong.id}.` };
  }
  return { handled: false, message: "" };
}
