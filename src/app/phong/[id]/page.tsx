import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { serializePhong } from "@/lib/serialize";
import { formatVND } from "@/lib/utils";
import { TIEN_ICH_LABEL, HOTLINE } from "@/lib/constants";
import { PhongGallery } from "@/components/phong/PhongGallery";
import { LeadForm } from "@/components/phong/LeadForm";
import { Bike, Droplet, MapPin, MessageCircle, Phone, Trash2, Wifi, Zap } from "lucide-react";

export const revalidate = 120;

export default async function PhongDetailPage({ params }: { params: { id: string } }) {
  const row = await prisma.phong.findFirst({
    where: { id: params.id, status: "active" },
    include: { khuVuc: true, diaChi: true },
  });
  if (!row) return notFound();

  prisma.phong
    .update({ where: { id: row.id }, data: { luotXem: { increment: 1 } } })
    .catch(() => {});

  const phong = serializePhong(row);
  const title = phong.maPhong ? `Phòng ${phong.maPhong}` : "Phòng trọ";
  const addr = phong.diaChi?.text || phong.khuVuc?.ten || "—";
  const sdt = phong.saleSdt || HOTLINE;
  const zalo = phong.saleZalo || phong.saleSdt || HOTLINE;

  const fees = [
    { icon: Zap, label: "Điện", value: phong.giaDien ? `${formatVND(phong.giaDien)}/kWh` : "—" },
    { icon: Droplet, label: "Nước", value: phong.giaNuoc ? `${formatVND(phong.giaNuoc)}/m³` : "—" },
    {
      icon: Wifi,
      label: "Internet",
      value: phong.internet === "free" ? "Free" : phong.internet ? formatVND(Number(phong.internet)) : "—",
    },
    { icon: Trash2, label: "Rác", value: phong.rac ? `${formatVND(phong.rac)}/tháng` : "—" },
    { icon: Bike, label: "Xe", value: phong.guiXe ? `${formatVND(phong.guiXe)}/tháng` : "—" },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        <PhongGallery images={phong.hinhAnh} ten={title} />
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <div className="flex justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">{title}</h1>
              <p className="text-gray-600 flex items-center gap-2">
                <MapPin size={16} /> {addr}
                {phong.khuVuc ? ` · ${phong.khuVuc.ten}` : ""}
              </p>
            </div>
            <span className="h-fit bg-green-500 text-white text-xs px-3 py-1 rounded-full">Còn trống</span>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t">
            <div>
              <p className="text-xs text-gray-500">Giá thuê</p>
              <p className="text-xl font-bold text-blue-600">{formatVND(phong.gia)}/tháng</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Diện tích</p>
              <p className="font-semibold">{phong.dienTich ? `${phong.dienTich} m²` : "—"}</p>
            </div>
          </div>
          {phong.moTa && <p className="mt-6 text-gray-700 whitespace-pre-line">{phong.moTa}</p>}
        </div>

        {phong.tienIch.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h2 className="font-bold mb-3">Tiện ích</h2>
            <div className="flex flex-wrap gap-2">
              {phong.tienIch.map((k) => (
                <span key={k} className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm">
                  {TIEN_ICH_LABEL[k] || k}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h2 className="font-bold mb-4">Chi phí</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {fees.map((f) => {
              const Icon = f.icon;
              return (
                <div key={f.label} className="flex items-center gap-3 border rounded-xl p-3">
                  <Icon size={18} className="text-blue-600" />
                  <div>
                    <p className="text-xs text-gray-500">{f.label}</p>
                    <p className="text-sm font-medium">{f.value}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <aside className="space-y-4 lg:sticky lg:top-20 h-fit">
        <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-3">
          <p className="text-2xl font-bold text-blue-600">{formatVND(phong.gia)}</p>
          <p className="text-sm text-gray-500">{phong.dienTich ? `${phong.dienTich}m²` : ""} · Còn trống</p>
          <a href={`tel:${sdt}`} className="flex items-center justify-center gap-2 w-full bg-blue-600 text-white py-3 rounded-xl font-semibold">
            <Phone size={16} /> Gọi ngay
          </a>
          <a
            href={`https://zalo.me/${zalo}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full bg-sky-500 text-white py-3 rounded-xl font-semibold"
          >
            <MessageCircle size={16} /> Zalo
          </a>
          {(phong.saleTen || phong.saleSdt) && (
            <p className="text-sm text-gray-600 pt-2 border-t">
              Sale: {phong.saleTen || "Liên hệ"} {phong.saleSdt ? `· ${phong.saleSdt}` : ""}
            </p>
          )}
        </div>
        <LeadForm phongId={phong.id} />
      </aside>
    </div>
  );
}
