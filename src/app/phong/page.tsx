import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { PhongCard } from "@/components/phong/PhongCard";
import { serializePhong } from "@/lib/serialize";
import Link from "next/link";

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

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Danh sách phòng</h1>
      <p className="text-gray-500 mb-6">{total} phòng đang hiển thị</p>

      <form className="bg-white border border-gray-100 rounded-2xl p-4 mb-6 grid grid-cols-2 md:grid-cols-5 gap-3">
        <input
          name="q"
          defaultValue={searchParams.q}
          placeholder="Từ khóa"
          className="px-3 py-2 border rounded-lg col-span-2 md:col-span-1"
        />
        <select
          name="khuVuc"
          defaultValue={searchParams.khuVuc || ""}
          className="px-3 py-2 border rounded-lg"
        >
          <option value="">Tất cả khu vực</option>
          {khuVucs.map((k) => (
            <option key={k.id} value={k.slug}>
              {k.ten}
            </option>
          ))}
        </select>
        <select
          name="giaMax"
          defaultValue={searchParams.giaMax || ""}
          className="px-3 py-2 border rounded-lg"
        >
          <option value="">Giá</option>
          <option value="2000000">&lt; 2tr</option>
          <option value="3000000">&lt; 3tr</option>
          <option value="5000000">&lt; 5tr</option>
        </select>
        <input
          name="dienTichMin"
          defaultValue={searchParams.dienTichMin}
          placeholder="m² tối thiểu"
          className="px-3 py-2 border rounded-lg"
        />
        <button className="bg-blue-600 text-white rounded-lg font-medium">
          Lọc
        </button>
      </form>

      {items.length === 0 ? (
        <p className="text-center text-gray-500 py-16">
          Không có phòng phù hợp.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((p) => (
            <PhongCard key={p.id} phong={p} />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-10">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
            <Link
              key={n}
              href={`/phong?${new URLSearchParams({ ...searchParams, page: String(n) } as Record<string, string>)}`}
              className={`px-3 py-2 rounded-lg border ${n === page ? "bg-blue-600 text-white" : "bg-white"}`}
            >
              {n}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
