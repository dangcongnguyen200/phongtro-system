import Link from "next/link";
import { MapPin, Maximize2, Phone, MessageCircle } from "lucide-react";
import { formatVND } from "@/lib/utils";
import { TIEN_ICH_LABEL, HOTLINE } from "@/lib/constants";
import type { PublicPhong } from "@/lib/serialize";
import { SafeImage } from "@/components/ui/SafeImage";
export function PhongCard({ phong }: { phong: PublicPhong }) {
  const img = phong.hinhAnh[0];
  const title = phong.maPhong ? `Phòng ${phong.maPhong}` : "Phòng trọ";
  const addr = phong.diaChi?.text || phong.khuVuc?.ten || "Đang cập nhật";
  const sdt = phong.saleSdt || HOTLINE;
  const zalo = phong.saleZalo || phong.saleSdt || HOTLINE;
  return (
    <article className="glass-card rounded-2xl overflow-hidden h-full flex flex-col hover:border-cyan-400/50 hover:shadow-[0_0_30px_-8px_rgba(6,182,212,0.4)] transition-all duration-300 group">
      <Link href={`/phong/${phong.id}`} className="block">
        <div className="relative aspect-[4/3] bg-slate-900 overflow-hidden">
          {img ? (
            <SafeImage
              src={img}
              alt={`${title} - ${addr}`}
              width={400}
              height={300}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full grid place-items-center text-5xl opacity-30">🏠</div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#060B17]/80 via-transparent to-transparent pointer-events-none" />
          <span className="absolute top-3 left-3 bg-emerald-400 text-black text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full shadow-lg">
            🟢 Còn trống
          </span>
          {phong.khuVuc && (
            <span className="absolute top-3 right-3 glass-pill text-cyan-300 text-[10px] font-bold px-2.5 py-1 rounded-full border border-cyan-500/30">
              {phong.khuVuc.ten}
            </span>
          )}
        </div>
      </Link>
      <div className="p-4 flex-1 flex flex-col">
        <Link href={`/phong/${phong.id}`} className="block">
          <h2 className="font-bold line-clamp-1 group-hover:text-cyan-300 transition-colors text-white text-base">
            {title}
          </h2>
          <p className="text-xs text-slate-400 flex items-center gap-1 mt-1.5 line-clamp-1">
            <MapPin size={12} className="text-cyan-400 shrink-0" /> {addr}
          </p>
        </Link>
        {phong.tienIch.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2.5">
            {phong.tienIch.slice(0, 3).map((k) => (
              <span
                key={k}
                className="px-1.5 py-0.5 rounded-md bg-cyan-950/80 border border-cyan-500/20 text-[9px] text-slate-300"
              >
                {TIEN_ICH_LABEL[k] || k}
              </span>
            ))}
          </div>
        )}
        <div className="mt-auto pt-3 flex items-center justify-between border-t border-cyan-500/10">
          <span className="text-gradient-cyan font-black text-base">{formatVND(phong.gia)}</span>
          {phong.dienTich != null && (
            <span className="text-[11px] text-slate-400 flex items-center gap-1">
              <Maximize2 size={11} /> {phong.dienTich}m²
            </span>
          )}
        </div>
        <div className="flex items-center gap-1.5 mt-3">
          <a
            href={`tel:${sdt}`}
            className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[11px] font-bold hover:bg-emerald-500/25 transition-colors"
          >
            <Phone size={11} /> Gọi
          </a>
          <a
            href={`https://zalo.me/${zalo}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-[11px] font-bold hover:bg-cyan-500/25 transition-colors"
          >
            <MessageCircle size={11} /> Zalo
          </a>
        </div>
      </div>
    </article>
  );
}