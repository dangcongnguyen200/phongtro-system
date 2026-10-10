import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { PhongCard } from "@/components/phong/PhongCard";
import { serializePhong } from "@/lib/serialize";
import Link from "next/link";
import { Search, SlidersHorizontal } from "lucide-react";
export const revalidate = 60;
type Props = {
  searchParams: {
    q?: string;
    khuVuc?: string;
    giaMin?: string;
    giaMax?: string;
    dienTichMin?: string;
    page?: string;
  };
};
export default async function PhongListPage({ searchParams }: Props) {
  const page = Math.max(1, Number(searchParams.page || 1));
  const take = 12;
  const where: Prisma.PhongWhereInput = {
    status: "active",
    khuVuc: { an: false },
  };
  if (searchParams.khuVuc) {
    where.khuVuc = { an: false, slug: searchParams.khuVuc };
  }
  if (searchParams.giaMin)
    where.gia = { ...(where.gia as object), gte: BigInt(searchParams.giaMin) };
  if (searchParams.giaMax)
    where.gia = { ...(where.gia as object), lte: BigInt(searchParams.giaMax) };
  if (searchParams.dienTichMin)
    where.dienTich = { gte: Number(searchParams.dienTichMin) };
  if (searchParams.q) {
    const q = searchParams.q;
    where.OR = [
      { maPhong: { contains: q } },
      { moTa: { contains: q } },
      { diaChi: { text: { contains: q } } },
      { khuVuc: { ten: { contains: q } } },
    ];
  }
  const [total, rows, khuVucs] = await Promise.all([
    prisma.phong.count({ where }),
    prisma.phong.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * take,
      take,
      include: { khuVuc: true, diaChi: true },
    }),
    prisma.khuVuc.findMany({ where: { an: false }, orderBy: { ten: "asc" } }),
  ]);
  const items = rows.map(serializePhong);
  const totalPages = Math.max(1, Math.ceil(total / take));
  const inputCls =
    "px-3.5 py-2.5 rounded-xl glass-pill border border-cyan-500/20 text-slate-100 placeholder-slate-400 outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all text-sm";
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl md:text-4xl font-black text-gradient mb-2">Danh sách phòng</h1>
      <p className="text-slate-400 mb-6 text-sm">
        <span className="text-cyan-300 font-bold">{total}</span> phòng đang hiển thị
      </p>
      <form className="glass-card rounded-2xl p-4 mb-6 grid grid-cols-2 md:grid-cols-5 gap-3">
        <div className="relative col-span-2 md:col-span-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-400/70" size={16} />
          <input
            name="q"
            defaultValue={searchParams.q}
            placeholder="Từ khóa"
            className={`${inputCls} w-full pl-10`}
          />
        </div>
        <select
          name="khuVuc"
          defaultValue={searchParams.khuVuc || ""}
          className={inputCls}
        >
          <option value="">Tất cả khu vực</option>
          {khuVucs.map((k) => (
            <option key={k.id} value={k.slug} className="bg-slate-900">
              {k.ten}
            </option>
          ))}
        </select>
        <select
          name="giaMax"
          defaultValue={searchParams.giaMax || ""}
          className={inputCls}
        >
          <option value="">Mọi mức giá</option>
          <option value="2000000" className="bg-slate-900">&lt; 2 triệu</option>
          <option value="3000000" className="bg-slate-900">&lt; 3 triệu</option>
          <option value="5000000" className="bg-slate-900">&lt; 5 triệu</option>
        </select>
        <input
          name="dienTichMin"
          defaultValue={searchParams.dienTichMin}
          placeholder="m² tối thiểu"
          className={inputCls}
        />
        <button className="bg-gradient-to-r from-cyan-500 to-emerald-400 text-black rounded-xl font-black text-sm inline-flex items-center justify-center gap-1.5 neon-cyan hover:shadow-[0_0_25px_-3px_rgba(6,182,212,0.6)] transition-all">
          <SlidersHorizontal size={14} /> Lọc
        </button>
      </form>
      {items.length === 0 ? (
        <div className="glass-card rounded-2xl p-16 text-center">
          <p className="text-slate-400">Không có phòng phù hợp.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((p) => (
            <PhongCard key={p.id} phong={p} />
          ))}
        </div>
      )}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-10 flex-wrap">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
            <Link
              key={n}
              href={`/phong?${new URLSearchParams({ ...searchParams, page: String(n) } as Record<string, string>)}`}
              className={`min-w-[40px] text-center px-3 py-2 rounded-xl text-sm font-bold transition-all ${
                n === page
                  ? "bg-gradient-to-r from-cyan-500 to-emerald-400 text-black neon-cyan"
                  : "glass-pill text-slate-300 hover:border-cyan-400/40"
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
