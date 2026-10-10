import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { PhongCard } from "@/components/phong/PhongCard";
import { serializePhong } from "@/lib/serialize";
import { MapPin, Search } from "lucide-react";

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
    <div>
      <section className="bg-gradient-to-br from-blue-600 to-indigo-800 text-white">
        <div className="max-w-6xl mx-auto px-4 py-16 md:py-20 text-center">
          <p className="text-sm opacity-80 mb-3">{tong} phòng đang hiển thị</p>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Tìm phòng trọ theo khu vực</h1>
          <p className="opacity-90 mb-8">Giá thuê, điện nước, tiện ích — gọi / Zalo sale, không cần đăng ký.</p>
          <form action="/phong" className="max-w-xl mx-auto flex gap-2">
            <input
              name="q"
              placeholder="Gò Vấp, 25m2, máy lạnh..."
              className="flex-1 px-4 py-3 rounded-xl text-gray-900 outline-none"
            />
            <button className="bg-yellow-300 text-gray-900 px-5 rounded-xl font-semibold inline-flex items-center gap-2">
              <Search size={16} /> Tìm
            </button>
          </form>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold mb-6">Khu vực</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {khuVucs.map((k) => (
            <Link
              key={k.id}
              href={`/phong?khuVuc=${k.slug}`}
              className="bg-white border border-gray-100 rounded-2xl p-4 hover:border-blue-400 transition"
            >
              <p className="font-medium flex items-center gap-2">
                <MapPin size={14} className="text-blue-600" /> {k.ten}
              </p>
              <p className="text-xs text-gray-500 mt-1">{k._count.phongs} phòng</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 pb-16">
        <div className="flex items-end justify-between mb-6">
          <h2 className="text-2xl font-bold">Phòng mới nhất</h2>
          <Link href="/phong" className="text-sm text-blue-600">
            Xem tất cả
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
