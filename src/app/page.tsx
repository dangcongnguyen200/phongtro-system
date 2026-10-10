import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { PhongCard } from "@/components/phong/PhongCard";
import { serializePhong } from "@/lib/serialize";
import { MapPin, Search, Sparkles, ChevronRight, Zap } from "lucide-react";
export const revalidate = 300;
export default async function HomePage() {
  const [khuVucs, phongs, tong] = await Promise.all([
    prisma.khuVuc.findMany({
      where: { an: false },
      orderBy: { ten: "asc" },
      include: { _count: { select: { phongs: { where: { status: "active" } } } } },
    }),
    prisma.phong.findMany({
      where: { status: "active", khuVuc: { an: false } },
      orderBy: { createdAt: "desc" },
      take: 9,
      include: { khuVuc: true, diaChi: true },
    }),
    prisma.phong.count({ where: { status: "active" } }),
  ]);
  const items = phongs.map(serializePhong);
  return (
    <div className="relative">
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 py-16 md:py-24 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-pill border border-cyan-500/30 text-cyan-300 text-xs font-bold mb-6">
            <Zap size={12} className="text-emerald-400" />
            {tong} phòng đang hiển thị
          </div>
          <h1 className="text-4xl md:text-6xl font-black mb-5 leading-tight">
            <span className="text-gradient">Tìm phòng trọ</span>
            <br />
            <span className="text-white">Theo khu vực</span>
          </h1>
          <p className="text-slate-300 max-w-2xl mx-auto mb-8 text-sm md:text-base">
            Giá thuê, điện nước, tiện ích minh bạch — gọi / Zalo sale trực tiếp.
            <span className="text-emerald-400 font-semibold"> Không cần đăng ký.</span>
          </p>
          <form action="/phong" className="max-w-2xl mx-auto flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-400/70" size={18} />
              <input
                name="q"
                placeholder="Gò Vấp, 25m2, máy lạnh..."
                className="w-full pl-12 pr-4 py-4 rounded-2xl glass-pill border border-cyan-500/20 text-slate-100 placeholder-slate-400 outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
              />
            </div>
            <button className="bg-gradient-to-r from-cyan-500 to-emerald-400 text-black px-6 md:px-8 rounded-2xl font-black text-sm inline-flex items-center gap-2 neon-cyan transition-all">
              <Search size={16} /> Tìm
            </button>
          </form>
        </div>
      </section>
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex items-center gap-2 mb-6">
          <MapPin size={18} className="text-emerald-400" />
          <h2 className="text-2xl font-black text-white">Khu vực</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {khuVucs.map((k) => {
            const count = k._count.phongs;
            const has = count > 0;
            return (
              <Link
                key={k.id}
                href={`/phong?khuVuc=${k.slug}`}
                className={`glass-card rounded-2xl p-4 hover:border-cyan-400/50 transition-all group ${!has ? "opacity-60" : ""}`}
              >
                <div className="flex items-center justify-between">
                  <p className="font-bold text-sm text-white group-hover:text-cyan-300 transition-colors">
                    {k.ten}
                  </p>
                  {has && <span className="w-2 h-2 rounded-full bg-emerald-400 neon-emerald" />}
                </div>
                <p className={`text-xs mt-1 ${has ? "text-emerald-400 font-semibold" : "text-slate-500"}`}>
                  {count} phòng
                </p>
              </Link>
            );
          })}
        </div>
      </section>
      <section className="max-w-7xl mx-auto px-4 pb-16">
        <div className="flex items-end justify-between mb-6">
          <div className="flex items-center gap-2">
            <Sparkles size={18} className="text-emerald-400" />
            <h2 className="text-2xl font-black text-white">Phòng mới nhất</h2>
          </div>
          <Link href="/phong" className="text-sm text-cyan-300 hover:text-cyan-200 font-bold inline-flex items-center gap-1">
            Xem tất cả <ChevronRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((p) => (
            <PhongCard key={p.id} phong={p} />
          ))}
        </div>
      </section>
    </div>
  );
}
