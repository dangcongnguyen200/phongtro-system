import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import { Users, Shield, User } from "lucide-react";
export const dynamic = "force-dynamic";
export default async function AdminUserPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { phongs: true } } },
  });
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black text-gradient">Người dùng</h1>
        <p className="text-slate-400 text-sm mt-1">{users.length} tài khoản</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {users.map((u) => (
          <div key={u.id} className="glass-card rounded-2xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-10 h-10 rounded-xl grid place-items-center ${
                u.role === "admin"
                  ? "bg-gradient-to-tr from-cyan-500 to-emerald-400 text-black"
                  : "bg-white/10 text-cyan-300"
              }`}>
                {u.role === "admin" ? <Shield size={18} /> : <User size={18} />}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-bold text-white truncate">{u.name || "Chưa đặt tên"}</p>
                <p className="text-xs text-slate-400 truncate">{u.email}</p>
              </div>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className={`px-2 py-1 rounded-full font-bold ${
                u.status === "active"
                  ? "bg-emerald-500/20 text-emerald-300"
                  : "bg-red-500/20 text-red-300"
              }`}>
                {u.status}
              </span>
              <span className="text-slate-400">
                {u._count.phongs} phòng · {formatDate(u.createdAt)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
