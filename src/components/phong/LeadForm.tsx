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

  return (
    <form onSubmit={onSubmit} className="bg-white rounded-2xl border border-gray-100 p-5 space-y-3">
      <h3 className="font-semibold">Để lại SĐT</h3>
      <input
        name="khachTen"
        required
        placeholder="Họ tên"
        className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
      />
      <input
        name="sdt"
        required
        inputMode="tel"
        placeholder="Số điện thoại / Zalo"
        className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
      />
      <textarea
        name="ghiChu"
        rows={2}
        placeholder="Ghi chú (không bắt buộc)"
        className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-gray-900 text-white py-2.5 rounded-xl font-medium disabled:opacity-60"
      >
        {loading ? "Đang gửi..." : "Gửi liên hệ"}
      </button>
      {status === "ok" && <p className="text-sm text-green-700">Đã nhận SĐT. Sale sẽ liên hệ.</p>}
      {status === "err" && <p className="text-sm text-red-600">Không gửi được. Thử lại.</p>}
    </form>
  );
}
