"use client";
import { MessageCircle, Phone } from "lucide-react";
export function FloatingContact({ hotline }: { hotline: string }) {
  return (
    <div className="fixed bottom-20 md:bottom-6 right-4 z-40 flex flex-col gap-2.5">
      <a
        href={`https://zalo.me/${hotline}`}
        target="_blank"
        rel="noopener noreferrer"
        className="w-12 h-12 rounded-full bg-gradient-to-tr from-cyan-500 to-cyan-400 text-white grid place-items-center shadow-lg neon-cyan hover:scale-110 transition-transform"
        aria-label="Zalo"
      >
        <MessageCircle size={20} />
      </a>
      <a
        href={`tel:${hotline}`}
        className="w-12 h-12 rounded-full bg-gradient-to-tr from-emerald-500 to-emerald-400 text-white grid place-items-center shadow-lg neon-emerald hover:scale-110 transition-transform animate-float"
        aria-label="Gọi"
      >
        <Phone size={20} />
      </a>
    </div>
  );
}
