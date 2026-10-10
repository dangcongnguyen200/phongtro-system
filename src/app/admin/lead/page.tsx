import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import { MessageSquare, Phone } from "lucide-react";
export const dynamic = "force-dynamic";
export default async function AdminLeadPage() {
  const leads = await prisma.lead.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
    include: { phong: { select: { maPhong: true } } },
  });
  const statusLabel: Record<string, { text: string; cls: string }> = {
    moi: { text: "Mới", cls: "bg-cyan-500/20 text-cyan-300" },
    da_goi: { text: "Đã gọi", cls: "bg-amber-500/20 text-amber-300" },
    da_hen: { text: "Đã hẹn", cls: "bg-emerald-500/20 text-emerald-300" },
    huy: { text: "Hủy", cls: "bg-red-500/20 text-red-300" },
  };
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black text-gradient">Khách hàng</h1>
        <p className="text-slate-400 text-sm mt-1">{leads.length} lead</p>
      </div>
      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-cyan-500/15 text-left">
                <th className="p-3 font-bold text-slate-300">Khách</th>
                <th className="p-3 font-bold text-slate-300">SĐT</th>
                <th className="p-3 font-bold text-slate-300">Phòng</th>
                <th className="p-3 font-bold text-slate-300">Ghi chú</th>
                <th className="p-3 font-bold text-slate-300">Trạng thái</th>
                <th className="p-3 font-bold text-slate-300">Ngày</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((l) => {
                const s = statusLabel[l.trangThai] || statusLabel.moi;
                return (
                  <tr key={l.id} className="border-b border-cyan-500/5 hover:bg-white/5">
                    <td className="p-3 font-semibold text-white">{l.khachTen}</td>
                    <td className="p-3">
                      <a href={`tel:${l.sdt}`} className="text-cyan-300 hover:text-cyan-200 inline-flex items-center gap-1">
                        <Phone size={12} /> {l.sdt}
                      </a>
                    </td>
                    <td className="p-3 text-slate-300">{l.phong?.maPhong || "—"}</td>
                    <td className="p-3 text-slate-400 text-xs max-w-[200px] truncate">{l.ghiChu || "—"}</td>
                    <td className="p-3">
                      <span className={`text-[10px] px-2 py-1 rounded-full font-bold ${s.cls}`}>
                        {s.text}
                      </span>
                    </td>
                    <td className="p-3 text-slate-400 text-xs">{formatDate(l.createdAt)}</td>
                  </tr>
                );
              })}
              {leads.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500">
                    <MessageSquare size={32} className="mx-auto mb-2 opacity-50" />
                    Chưa có lead nào
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
