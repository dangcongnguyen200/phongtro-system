import { DiaChi, KhuVuc, Phong } from "@prisma/client";
import { toNum } from "./utils";
export type PublicPhong = {
  id: string;
  maPhong: string | null;
  gia: number;
  dienTich: number | null;
  loaiPhong: string;
  giaDien: number | null;
  giaNuoc: number | null;
  internet: string | null;
  rac: number | null;
  guiXe: number | null;
  tienIch: string[];
  hinhAnh: string[];
  moTa: string | null;
  saleTen: string | null;
  saleSdt: string | null;
  saleZalo: string | null;
  status: string;
  luotXem: number;
  createdAt: Date;
  updatedAt: Date;
  khuVuc: { id: string; ten: string; slug: string } | null;
  diaChi: { id: string; text: string } | null;
};
function parseJsonArray(raw: string | null | undefined): string[] {
  if (!raw) return [];
  try {
    const v = JSON.parse(raw);
    return Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : [];
  } catch {
    return [];
  }
}
export function serializePhong(
  p: Phong & { khuVuc?: KhuVuc | null; diaChi?: DiaChi | null },
): PublicPhong {
  return {
    id: p.id,
    maPhong: p.maPhong,
    gia: Number(p.gia),
    dienTich: p.dienTich,
    loaiPhong: p.loaiPhong,
    giaDien: toNum(p.giaDien),
    giaNuoc: toNum(p.giaNuoc),
    internet: p.internet,
    rac: toNum(p.rac),
    guiXe: toNum(p.guiXe),
    tienIch: parseJsonArray(p.tienIch),
    hinhAnh: parseJsonArray(p.hinhAnh),
    moTa: p.moTa,
    saleTen: p.saleTen,
    saleSdt: p.saleSdt,
    saleZalo: p.saleZalo,
    status: p.status,
    luotXem: p.luotXem,
    createdAt: p.createdAt,
    updatedAt: p.updatedAt,
    khuVuc: p.khuVuc ? { id: p.khuVuc.id, ten: p.khuVuc.ten, slug: p.khuVuc.slug } : null,
    diaChi: p.diaChi ? { id: p.diaChi.id, text: p.diaChi.text } : null,
  };
}