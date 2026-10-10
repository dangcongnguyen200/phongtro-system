"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { UserPlus, Mail, Lock, User, Phone, Loader2 } from "lucide-react";
export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const fd = new FormData(e.currentTarget);
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: fd.get("email"),
        password: fd.get("password"),
        name: fd.get("name"),
        phone: fd.get("phone"),
      }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error || "Đăng ký thất bại");
      return;
    }
    router.push("/sale");
    router.refresh();
  }
  const inputCls =
    "w-full pl-11 pr-4 py-3 rounded-xl glass-pill border border-cyan-500/20 text-slate-100 placeholder-slate-400 outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all";
  return (
    <div className="glass-card rounded-2xl p-8">
      <div className="text-center mb-6">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-cyan-500 to-emerald-400 p-[1px] mb-3">
          <div className="w-full h-full bg-[#060B17] rounded-[15px] flex items-center justify-center">
            <UserPlus size={24} className="text-cyan-400" />
          </div>
        </div>
        <h1 className="text-2xl font-black text-gradient">Đăng ký Sale</h1>
        <p className="text-slate-400 text-sm mt-1">Tạo tài khoản để đăng tin phòng</p>
      </div>
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="relative">
          <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-cyan-400/70" size={16} />
          <input name="name" required aria-label="Họ tên" placeholder="Họ tên" className={inputCls} />
        </div>
        <div className="relative">
          <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-cyan-400/70" size={16} />
          <input name="email" type="email" required aria-label="Email" placeholder="Email" className={inputCls} />
        </div>
        <div className="relative">
          <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-cyan-400/70" size={16} />
          <input name="phone" required aria-label="Số điện thoại" placeholder="Số điện thoại" className={inputCls} />
        </div>
        <div className="relative">
          <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-cyan-400/70" size={16} />
          <input name="password" type="password" required minLength={6} aria-label="Mật khẩu" placeholder="Mật khẩu (tối thiểu 6 ký tự)" className={inputCls} />
        </div>
        {error && (
          <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
            {error}
          </p>
        )}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-cyan-500 to-emerald-400 text-black py-3 rounded-xl font-black text-sm inline-flex items-center justify-center gap-2 neon-cyan disabled:opacity-60 transition-all"
        >
          {loading ? <Loader2 size={16} className="animate-spin" /> : <UserPlus size={16} />}
          {loading ? "Đang tạo tài khoản..." : "Đăng ký"}
        </button>
      </form>
      <p className="text-center text-sm text-slate-400 mt-6">
        Đã có tài khoản?{" "}
        <Link href="/login" className="text-cyan-300 hover:text-cyan-200 font-bold">
          Đăng nhập
        </Link>
      </p>
    </div>
  );
}
