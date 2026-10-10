import { prisma } from "@/lib/prisma";
import { Home, Users, MessageSquare, Eye, TrendingUp } from "lucide-react";
import Link from "next/link";
import { formatVND } from "@/lib/utils";
export const dynamic = "force-dynamic";
export default async function AdminDashboard() {
  const [tongPhong, activePhong, lockedPhong, tongUser, moiLead, tongView, topPhong, phongMoi] =
    await Promise.all([
      prisma.phong.count(),
      prisma.phong.count({ where: { status: "active" } }),
      prisma.phong.count({ where: { status: "locked" } }),
      prisma.user.count({ where: { role: "sale" } }),
      prisma.lead.count({ where: { trangThai: "moi" } }),
      prisma.phong.aggregate({ _sum: { luotXem: true } }),
      prisma.phong.findMany({
        where: { status: "active" },
        orderBy: { luotXem: "desc" },
        take: 5,
        include: { khuVuc: true },
      }),
      prisma.phong.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        include: { khuVuc: true, sale: { select: { name: true, email: true } } },
      }),
    ]);
  const stats = [
    { label: "Tổng phòng", value: tongPhong, icon: Home, color: "cyan" },
    { label: "Đang hiển thị", value: activePhong, icon: TrendingUp, color: "emerald" },
    { label: "Đã khóa", value: lockedPhong, icon: Home, color: "amber" },
    { label: "Sale", value: tongUser, icon: Users, color: "violet" },
    { label: "Lead mới", value: moiLead, icon: MessageSquare, color: "rose" },
    { label: "Tổng view", value: tongView._sum.luotXem || 0, icon: Eye, color: "sky" },
  ];
  const colorMap: Record<string, string> = {
    cyan: "from-cyan-500/20 to-cyan-500/5 border-cyan-500/30 text-cyan-300",
    emerald: "from-emerald-500/20 to-emerald-500/5 border-emerald-500/30 text-emerald-300",
    amber: "from-amber-500/20 to-amber-500/5 border-amber-500/30 text-amber-300",
    violet: "from-violet-500/20 to-violet-500/5 border-violet-500/30 text-violet-300",
    rose: "from-rose-500/20 to-rose-500/5 border-rose-500/30 text-rose-300",
    sky: "from-sky-500/20 to-sky-500/5 border-sky-500/30 text-sky-300",
  };
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black text-gradient">Tổng quan</h1>
        <p className="text-slate-400 text-sm mt-1">Thống kê hệ thống PhòngTrọ</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div
              key={s.label}
              className={`glass-card rounded-2xl p-4 bg-gradient-to-br ${colorMap[s.color]}`}
            >
              <Icon size={18} className="mb-2 opacity-80" />
              <p className="text-2xl font-black text-white">{s.value.toLocaleString("vi-VN")}</p>
              <p className="text-xs text-slate-400 mt-0.5">{s.label}</p>
            </div>
          );
        })}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="glass-card rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-white flex items-center gap-2">
              <Eye size={16} className="text-cyan-400" /> Top phòng xem nhiều
            </h2>
            <Link href="/admin/phong" className="text-xs text-cyan-300 hover:text-cyan-200 font-bold">
              Xem tất cả
            </Link>
          </div>
          <div className="space-y-2">
            {topPhong.map((p, i) => (
              <div key={p.id} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/5 transition-colors">
                <span className="w-6 h-6 rounded-lg bg-cyan-500/20 text-cyan-300 text-xs font-black grid place-items-center shrink-0">
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white truncate">
                    {p.maPhong || p.id.slice(-6)}
                  </p>
                  <p className="text-xs text-slate-400">{p.khuVuc?.ten || "—"}</p>
                </div>
                <span className="text-xs text-cyan-300 font-bold shrink-0">{p.luotXem} view</span>
              </div>
            ))}
            {topPhong.length === 0 && <p className="text-sm text-slate-500">Chưa có dữ liệu</p>}
          </div>
        </div>
        <div className="glass-card rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-white flex items-center gap-2">
              <Home size={16} className="text-emerald-400" /> Phòng mới nhất
            </h2>
            <Link href="/admin/phong" className="text-xs text-cyan-300 hover:text-cyan-200 font-bold">
              Xem tất cả
            </Link>
          </div>
          <div className="space-y-2">
            {phongMoi.map((p) => (
              <div key={p.id} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/5 transition-colors">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white truncate">
                    {p.maPhong || p.id.slice(-6)}
                  </p>
                  <p className="text-xs text-slate-400 truncate">
                    {p.khuVuc?.ten || "—"} · {formatVND(p.gia)}
                  </p>
                </div>
                <span className={`text-[10px] px-2 py-1 rounded-full font-bold shrink-0 ${
                  p.status === "active"
                    ? "bg-emerald-500/20 text-emerald-300"
                    : "bg-amber-500/20 text-amber-300"
                }`}>
                  {p.status}
                </span>
              </div>
            ))}
            {phongMoi.length === 0 && <p className="text-sm text-slate-500">Chưa có dữ liệu</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
