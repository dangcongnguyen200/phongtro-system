"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Home, Menu, Phone, X, Search, User, LogIn } from "lucide-react";
import { HOTLINE } from "@/lib/constants";
const NAV = [
  { href: "/", label: "Trang chủ" },
  { href: "/phong", label: "Phòng trọ" },
];
export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<{ name?: string; role: string } | null>(null);
  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => setUser(d.user))
      .catch(() => {});
  }, []);
  return (
    <header className="sticky top-0 z-50 glass-card border-b border-cyan-500/15 backdrop-blur-2xl">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-emerald-400 p-[1px] flex items-center justify-center neon-cyan">
            <div className="w-full h-full bg-[#091122] rounded-[11px] flex items-center justify-center">
              <Home size={18} className="text-cyan-400" />
            </div>
          </div>
          <div className="leading-tight">
            <span className="text-lg font-black tracking-wider text-gradient block">
              Phòng<span className="text-cyan-400 font-light">Trọ</span>
            </span>
            <span className="text-[8px] uppercase tracking-widest text-emerald-400/90 font-bold">
              100% Tin Thực
            </span>
          </div>
        </Link>
        <nav className="hidden md:flex items-center gap-1">
          {NAV.map((item) => {
            const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                  active
                    ? "bg-gradient-to-r from-cyan-500/20 to-emerald-500/20 text-cyan-300 border border-cyan-500/30"
                    : "text-slate-300 hover:bg-white/5 hover:text-cyan-300"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center gap-2">
          <Link
            href="/phong"
            className="hidden lg:flex items-center gap-2 px-3 py-2 rounded-xl glass-pill text-cyan-300 text-sm hover:border-cyan-400/40 transition-all"
          >
            <Search size={14} />
            <span className="text-xs">Tìm phòng</span>
          </Link>
          <a
            href={`tel:${HOTLINE}`}
            className="hidden sm:inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500/20 to-emerald-500/20 hover:from-cyan-500 hover:to-emerald-400 hover:text-black border border-cyan-500/30 text-cyan-300 px-3.5 py-2 rounded-xl text-xs font-bold transition-all neon-cyan"
          >
            <Phone size={13} className="text-emerald-400" />
            {HOTLINE}
          </a>
          {user ? (
            <Link
              href={user.role === "admin" ? "/admin" : "/sale"}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-400 text-black text-xs font-black neon-cyan"
            >
              <User size={13} />
              {user.role === "admin" ? "Admin" : "Sale"}
            </Link>
          ) : (
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl glass-pill text-cyan-300 text-xs font-bold hover:border-cyan-400/40"
            >
              <LogIn size={13} />
              Đăng nhập
            </Link>
          )}
          <button
            className="md:hidden p-2 rounded-lg glass-pill text-white"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>
      {open && (
        <nav className="md:hidden border-t border-cyan-500/15 px-4 py-3 space-y-1 bg-[#091122]/95 backdrop-blur-xl">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="block px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-200 hover:bg-cyan-500/10 hover:text-cyan-300"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href={user ? (user.role === "admin" ? "/admin" : "/sale") : "/login"}
            onClick={() => setOpen(false)}
            className="block px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-200 hover:bg-cyan-500/10 hover:text-cyan-300"
          >
            {user ? (user.role === "admin" ? "Admin Panel" : "Sale Portal") : "Đăng nhập"}
          </Link>
          <a
            href={`tel:${HOTLINE}`}
            className="flex items-center justify-center gap-2 mt-2 bg-gradient-to-r from-emerald-500 to-cyan-500 text-black py-2.5 rounded-xl font-bold text-sm"
          >
            <Phone size={14} /> Gọi ngay {HOTLINE}
          </a>
        </nav>
      )}
    </header>
  );
}
