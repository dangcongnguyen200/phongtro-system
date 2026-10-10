"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard, Home, Users, MessageSquare, MapPin,
  LogOut, Menu, X, Shield, ChevronRight
} from "lucide-react";
const NAV = [
  { href: "/admin", label: "Tổng quan", icon: LayoutDashboard },
  { href: "/admin/phong", label: "Quản lý phòng", icon: Home },
  { href: "/admin/lead", label: "Khách hàng", icon: MessageSquare },
  { href: "/admin/user", label: "Người dùng", icon: Users },
  { href: "/admin/khu-vuc", label: "Khu vực", icon: MapPin },
];
export function AdminSidebar({ user }: { user: { name?: string; email: string; role: string } }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }
  const content = (
    <>
      <div className="p-5 border-b border-cyan-500/15">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-emerald-400 p-[1px]">
            <div className="w-full h-full bg-[#060B17] rounded-[11px] flex items-center justify-center">
              <Shield size={18} className="text-cyan-400" />
            </div>
          </div>
          <div className="min-w-0">
            <p className="font-black text-sm text-gradient truncate">Admin Panel</p>
            <p className="text-xs text-slate-400 truncate">{user.email}</p>
          </div>
        </div>
      </div>
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {NAV.map((item) => {
          const Icon = item.icon;
          const active = item.href === "/admin"
            ? pathname === "/admin"
            : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                active
                  ? "bg-gradient-to-r from-cyan-500/20 to-emerald-500/20 text-cyan-300 border border-cyan-500/30"
                  : "text-slate-300 hover:bg-white/5 hover:text-cyan-300"
              }`}
            >
              <Icon size={16} />
              <span className="flex-1">{item.label}</span>
              {active && <ChevronRight size={14} />}
            </Link>
          );
        })}
      </nav>
      <div className="p-3 border-t border-cyan-500/15">
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-red-400 hover:bg-red-500/10 transition-all"
        >
          <LogOut size={16} />
          Đăng xuất
        </button>
      </div>
    </>
  );
  return (
    <>
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-lg glass-pill text-white"
        onClick={() => setOpen(true)}
        aria-label="Mở menu"
      >
        <Menu size={20} />
      </button>
      <aside className="hidden md:flex flex-col w-64 shrink-0 glass-card border-r border-cyan-500/15 min-h-screen sticky top-0">
        {content}
      </aside>
      {open && (
        <div className="md:hidden fixed inset-0 z-40 flex">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <aside className="relative flex flex-col w-64 bg-[#091122] border-r border-cyan-500/15 h-full">
            <button
              className="absolute top-4 right-4 p-1.5 rounded-lg glass-pill text-white z-10"
              onClick={() => setOpen(false)}
              aria-label="Đóng menu"
            >
              <X size={16} />
            </button>
            {content}
          </aside>
        </div>
      )}
    </>
  );
}
