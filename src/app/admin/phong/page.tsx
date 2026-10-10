import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { formatVND } from "@/lib/utils";
import { Search, Home, Lock, Unlock, Trash2, Edit } from "lucide-react";
export const dynamic = "force-dynamic";
type Props = { searchParams: { q?: string; status?: string; page?: string } };
export default async function AdminPhongPage({ searchParams }: Props) {
  const page = Math.max(1, Number(searchParams.page || 1));
  const take = 20;
  const where: any = {};
  if (searchParams.status) where.status = searchParams.status;
  if (searchParams.q) {
    where.OR = [
      { maPhong: { contains: searchParams.q } },
      { moTa: { contains: searchParams.q } },
    ];
  }
  const [items, total] = await Promise.all([
    prisma.phong.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * take,
      take,
      include: { khuVuc: true, sale: { select: { name: true, email: true } } },
    }),
    prisma.phong.count({ where }),
  ]);
  const totalPages = Math.max(1, Math.ceil(total / take));
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-black text-gradient">Quản lý phòng</h1>
          <p className="text-slate-400 text-sm mt-1">{total} phòng</p>
        </div>
      </div>
      <form className="glass-card rounded-2xl p-4 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-400/70" size={16} />
          <input
            name="q"
            defaultValue={searchParams.q}
            aria-label="Tìm phòng"
            placeholder="Tìm mã phòng, mô tả..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-pill border border-cyan-500/20 text-slate-100 placeholder-slate-400 outline-none focus:border-cyan-400 text-sm"
          />
        </div>
        <select
          name="status"
          defaultValue={searchParams.status || ""}
          aria-label="Lọc trạng thái"
          className="px-3.5 py-2.5 rounded-xl glass-pill border border-cyan-500/20 text-slate-100 text-sm"
        >
          <option value="" className="bg-slate-900">Tất cả trạng thái</option>
          <option value="active" className="bg-slate-900">Active</option>
          <option value="locked" className="bg-slate-900">Locked</option>
          <option value="pending" className="bg-slate-900">Pending</option>
        </select>
        <button
          type="submit"
          className="bg-gradient-to-r from-cyan-500 to-emerald-400 text-black px-5 rounded-xl font-black text-sm neon-cyan"
        >
          Lọc
        </button>
      </form>
      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-cyan-500/15 text-left">
                <th className="p-3 font-bold text-slate-300">Mã phòng</th>
                <th className="p-3 font-bold text-slate-300">Khu vực</th>
                <th className="p-3 font-bold text-slate-300">Giá</th>
                <th className="p-3 font-bold text-slate-300">Sale</th>
                <th className="p-3 font-bold text-slate-300">View</th>
                <th className="p-3 font-bold text-slate-300">Trạng thái</th>
                <th className="p-3 font-bold text-slate-300">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {items.map((p) => (
                <tr key={p.id} className="border-b border-cyan-500/5 hover:bg-white/5">
                  <td className="p-3 font-semibold text-white">{p.maPhong || p.id.slice(-6)}</td>
                  <td className="p-3 text-slate-300">{p.khuVuc?.ten || "—"}</td>
                  <td className="p-3 text-emerald-300 font-semibold">{formatVND(p.gia)}</td>
                  <td className="p-3 text-slate-400 text-xs">{p.sale?.name || p.saleTen || "—"}</td>
                  <td className="p-3 text-cyan-300">{p.luotXem}</td>
                  <td className="p-3">
                    <span className={`text-[10px] px-2 py-1 rounded-full font-bold ${
                      p.status === "active"
                        ? "bg-emerald-500/20 text-emerald-300"
                        : p.status === "locked"
                        ? "bg-amber-500/20 text-amber-300"
                        : "bg-slate-500/20 text-slate-300"
                    }`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-1">
                      <Link
                        href={`/phong/${p.id}`}
                        className="p-1.5 rounded-lg hover:bg-cyan-500/20 text-cyan-300"
                        title="Xem"
                      >
                        <Edit size={14} />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 flex-wrap">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
            <Link
              key={n}
              href={`/admin/phong?${new URLSearchParams({ ...searchParams, page: String(n) } as Record<string, string>)}`}
              className={`min-w-[40px] text-center px-3 py-2 rounded-xl text-sm font-bold transition-all ${
                n === page
                  ? "bg-gradient-to-r from-cyan-500 to-emerald-400 text-black neon-cyan"
                  : "glass-pill text-slate-300"
              }`}
            >
              {n}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
