"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Home, Menu, Phone, X } from "lucide-react";
import { HOTLINE } from "@/lib/constants";

const NAV = [
  { href: "/", label: "Trang chủ" },
  { href: "/phong", label: "Phòng trọ" },
];

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-blue-600">
          <span className="w-9 h-9 rounded-xl bg-blue-600 text-white grid place-items-center">
            <Home size={18} />
          </span>
          PhòngTrọ
        </Link>
        <nav className="hidden md:flex items-center gap-1">
          {NAV.map((item) => {
            const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  active ? "bg-blue-50 text-blue-700" : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center gap-2">
          <a
            href={`tel:${HOTLINE}`}
            className="hidden sm:inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium"
          >
            <Phone size={14} />
            {HOTLINE}
          </a>
          <button className="md:hidden p-2" onClick={() => setOpen((v) => !v)} aria-label="Menu">
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>
      {open && (
        <nav className="md:hidden border-t px-4 py-3 space-y-1 bg-white">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
