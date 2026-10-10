import { prisma } from "@/lib/prisma";
import { findOrCreateDiaChi, findOrCreateKhuVuc } from "@/lib/khu-vuc";
import { aiLog } from "./log";
import { parseRoomsWithAI, vietMoTa, type ParsedRoom } from "./parse";
import { detectAmenitiesFromImages } from "./vision";
import { runOwnerCommand } from "./commands";
export type IngestPayload = {
  text: string;
  images?: string[];
  saleTen?: string;
  saleSdt?: string;
  saleZalo?: string;
  fromOwner?: boolean;
};
function enoughToPublish(r: ParsedRoom) {
  return Boolean(r.gia && (r.khuVuc || r.diaChi));
}
export async function ingestListing(payload: IngestPayload) {
  const { text, images = [], saleTen, saleSdt, saleZalo, fromOwner } = payload;
  if (fromOwner) {
    const cmd = await runOwnerCommand(text);
    if (cmd.handled) {
      await aiLog("lenh", { text }, cmd);
      return { kind: "command" as const, message: cmd.message };
    }
  }
  const rooms = await parseRoomsWithAI(text);
  const vision = await detectAmenitiesFromImages(images);
  const created: { id: string; maPhong: string | null }[] = [];
  const skipped: string[] = [];
  for (const room of rooms) {
    const tienIch = [...new Set([...room.tienIch, ...vision])];
    if (!enoughToPublish({ ...room, tienIch })) {
      skipped.push(room.maPhong || room.moTaNguon.slice(0, 40));
      continue;
    }
    const khuVuc = room.khuVuc ? await findOrCreateKhuVuc(room.khuVuc) : null;
    const diaChi =
      room.diaChi && khuVuc
        ? await findOrCreateDiaChi(khuVuc.id, room.diaChi)
        : null;
    const moTa = await vietMoTa({ ...room, tienIch });
    let maPhong = room.maPhong;
    if (maPhong) {
      const exists = await prisma.phong.findUnique({ where: { maPhong } });
      if (exists) maPhong = `${maPhong}-${Date.now().toString(36).slice(-4)}`;
    }
    const phong = await prisma.phong.create({
      data: {
        maPhong,
        khuVucId: khuVuc?.id,
        diaChiId: diaChi?.id,
        gia: BigInt(room.gia!),
        dienTich: room.dienTich,
        loaiPhong: room.loaiPhong || "don",
        giaDien: room.giaDien != null ? BigInt(room.giaDien) : null,
        giaNuoc: room.giaNuoc != null ? BigInt(room.giaNuoc) : null,
        internet: room.internet,
        rac: room.rac != null ? BigInt(room.rac) : null,
        guiXe: room.guiXe != null ? BigInt(room.guiXe) : null,
        tienIch: JSON.stringify(tienIch),
        hinhAnh: JSON.stringify(images),
        moTa,
        saleTen,
        saleSdt,
        saleZalo,
        status: "active",
        activeUntil: new Date(Date.now() + 40 * 24 * 60 * 60 * 1000),
        nguon: "zalo",
      },
    });
    created.push({ id: phong.id, maPhong: phong.maPhong });
  }
  await aiLog("tao_phong", { text, images: images.length }, { created, skipped });
  if (!created.length) {
    return {
      kind: "listing" as const,
      message:
        skipped.length
          ? "Chưa đủ giá hoặc khu vực để đăng. Gửi lại: mã phòng, giá, diện tích, địa chỉ."
          : "Không đọc được tin phòng. Gửi dạng: P101 4tr5 25m2 Gò Vấp máy lạnh WC riêng.",
      created,
    };
  }
  const names = created.map((c) => c.maPhong || c.id.slice(-6)).join(", ");
  return {
    kind: "listing" as const,
    message: `✅ Đã tạo và duyệt ${created.length} phòng: ${names}.`,
    created,
  };
}
