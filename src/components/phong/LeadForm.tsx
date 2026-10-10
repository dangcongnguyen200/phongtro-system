"use client";
import { FormEvent, useState } from "react";
export function LeadForm({ phongId }: { phongId: string }) {
  const [status, setStatus] = useState<"idle" | "ok" | "err">("idle");
  const [loading, setLoading] = useState(false);
  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setStatus("idle");
    const fd = new FormData(e.currentTarget);
    const res = await fetch("/api/lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        phongId,
        khachTen: fd.get("khachTen"),
        sdt: fd.get("sdt"),
        ghiChu: fd.get("ghiChu"),
      }),
    });
    setLoading(false);
    setStatus(res.ok ? "ok" : "err");
    if (res.ok) e.currentTarget.reset();
  }
  const inputCls =
    "w-full px-3 py-2 rounded-lg glass-pill border border-cyan-500/20 text-slate-100 placeholder-slate-400 outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all text-sm";
  return (
    <form onSubmit={onSubmit} className="glass-card rounded-2xl p-5 space-y-3">
      <h3 className="font-bold text-white">Để lại SĐT</h3>
      <div>
        <label htmlFor="khachTen" className="sr-only">Họ tên</label>
        <input
          id="khachTen"
          name="khachTen"
          required
          aria-label="Họ tên"
          placeholder="Họ tên"
          className={inputCls}
        />
      </div>
      <div>
        <label htmlFor="sdt" className="sr-only">Số điện thoại</label>
        <input
          id="sdt"
          name="sdt"
          required
          inputMode="tel"
          aria-label="Số điện thoại / Zalo"
          placeholder="Số điện thoại / Zalo"
          className={inputCls}
        />
      </div>
      <div>
        <label htmlFor="ghiChu" className="sr-only">Ghi chú</label>
        <textarea
          id="ghiChu"
          name="ghiChu"
          rows={2}
          aria-label="Ghi chú"
          placeholder="Ghi chú (không bắt buộc)"
          className={inputCls}
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-gradient-to-r from-cyan-500 to-emerald-400 text-black py-2.5 rounded-xl font-black text-sm disabled:opacity-60 neon-cyan"
      >
        {loading ? "Đang gửi..." : "Gửi liên hệ"}
      </button>
      {status === "ok" && <p className="text-sm text-emerald-400">Đã nhận SĐT. Sale sẽ liên hệ.</p>}
      {status === "err" && <p className="text-sm text-red-400">Không gửi được. Thử lại.</p>}
    </form>
  );
}
