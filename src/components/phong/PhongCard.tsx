import Link from "next/link";
import { MapPin, Maximize2 } from "lucide-react";
import { formatVND } from "@/lib/utils";
import { TIEN_ICH_LABEL } from "@/lib/constants";
import type { PublicPhong } from "@/lib/serialize";

export function PhongCard({ phong }: { phong: PublicPhong }) {
  const img = phong.hinhAnh[0];
  const title = phong.maPhong ? `Phòng ${phong.maPhong}` : "Phòng trọ";
  const addr = phong.diaChi?.text || phong.khuVuc?.ten || "Đang cập nhật";

  return (
    <Link href={`/phong/${phong.id}`} className="group block h-full">
      <article className="bg-white rounded-2xl border border-gray-100 overflow-hidden h-full flex flex-col hover:shadow-lg transition">
        <div className="relative aspect-[4/3] bg-gray-100">
          {img ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={img} alt={title} className="w-full h-full object-cover" loading="lazy" />
          ) : (
            <div className="w-full h-full grid place-items-center text-5xl">🏠</div>
          )}
          <span className="absolute top-3 left-3 bg-green-600 text-white text-xs px-2.5 py-1 rounded-full">
            Còn trống
          </span>
        </div>
        <div className="p-4 flex-1 flex flex-col">
          <h3 className="font-semibold line-clamp-1 group-hover:text-blue-600">{title}</h3>
          <p className="text-sm text-gray-500 flex items-center gap-1 mt-1 line-clamp-1">
            <MapPin size={14} /> {addr}
          </p>
          {phong.tienIch.length > 0 && (
            <p className="text-xs text-gray-500 mt-2">
              {phong.tienIch
                .slice(0, 3)
                .map((k) => TIEN_ICH_LABEL[k] || k)
                .join(" · ")}
            </p>
          )}
          <div className="mt-auto pt-3 flex items-center justify-between">
            <span className="text-blue-600 font-bold">{formatVND(phong.gia)}</span>
            {phong.dienTich != null && (
              <span className="text-sm text-gray-500 flex items-center gap-1">
                <Maximize2 size={12} /> {phong.dienTich}m²
              </span>
            )}
          </div>
        </div>
      </article>
    </Link>
  );
}
