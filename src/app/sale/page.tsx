import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth/session";
import { Home, Eye, MessageSquare, TrendingUp } from "lucide-react";
import Link from "next/link";
import { formatVND } from "@/lib/utils";
export const dynamic = "force-dynamic";
export default async function SaleDashboard() {
  const session = await getSession();
  if (!session) return null;
  const [myPhongs, activeCount, totalViews, leadCount, recentPhongs] = await Promise.all([
    prisma.phong.count({ where: { saleId: session.userId } }),
    prisma.phong.count({ where: { saleId: session.userId, status: "active" } }),
    prisma.phong.aggregate({ _sum: { luotXem: true }, where: { saleId: session.userId } }),
    prisma.lead.count({ where: { phong: { saleId: session.userId } } }),
    prisma.phong.findMany({
      where: { saleId: session.userId },
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { khuVuc: true },
    }),
  ]);
  const stats = [
    { label: "Tổng phòng", value: myPhongs, icon: Home, color: "from-cyan-500/20 to-cyan-500/5 border-cyan-500/30 text-cyan-300" },
    { label: "Đang hiển thị", value: activeCount, icon: TrendingUp, color: "from-emerald-500/20 to-emerald-500/5 border-emerald-500/30 text-emerald-300" },
    { label: "Tổng view", value: totalViews._sum.luotXem || 0, icon: Eye, color: "from-violet-500/20 to-violet-500/5 border-violet-500/30 text-violet-300" },
    { label: "Khách hàng", value: leadCount, icon: MessageSquare, color: "from-rose-500/20 to-rose-500/5 border-rose-500/30 text-rose-300" },
  ];
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black text-gradient">Xin chào, {session.name || "Sale"}!</h1>
        <p className="text-slate-400 text-sm mt-1">Quản lý phòng trọ của bạn</p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className={`glass-card rounded-2xl p-4 bg-gradient-to-br ${s.color}`}>
              <Icon size={18} className="mb-2 opacity-80" />
              <p className="text-2xl font-black text-white">{s.value.toLocaleString("vi-VN")}</p>
              <p className="text-xs text-slate-400 mt-0.5">{s.label}</p>
            </div>
          );
        })}
      </div>
      <div className="glass-card rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-white flex items-center gap-2">
            <Home size={16} className="text-emerald-400" /> Phòng gần đây
          </h2>
          <Link href="/sale/phong" className="text-xs text-cyan-300 hover:text-cyan-200 font-bold">
            Xem tất cả
          </Link>
        </div>
        {recentPhongs.length === 0 ? (
          <p className="text-sm text-slate-500 text-center py-8">Bạn chưa có phòng nào.</p>
        ) : (
          <div className="space-y-2">
            {recentPhongs.map((p) => (
              <div key={p.id} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/5">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white truncate">{p.maPhong || p.id.slice(-6)}</p>
                  <p className="text-xs text-slate-400 truncate">
                    {p.khuVuc?.ten || "—"} · {formatVND(p.gia)}
                  </p>
                </div>
                <span className={`text-[10px] px-2 py-1 rounded-full font-bold ${
                  p.status === "active" ? "bg-emerald-500/20 text-emerald-300" : "bg-amber-500/20 text-amber-300"
                }`}>
                  {p.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
