"use client";

import { MessageCircle, Phone } from "lucide-react";

export function FloatingContact({ hotline }: { hotline: string }) {
  return (
    <div className="fixed bottom-4 right-4 z-40 flex flex-col gap-2">
      <a
        href={`https://zalo.me/${hotline}`}
        target="_blank"
        rel="noopener noreferrer"
        className="w-12 h-12 rounded-full bg-blue-500 text-white grid place-items-center shadow-lg"
        aria-label="Zalo"
      >
        <MessageCircle size={20} />
      </a>
      <a
        href={`tel:${hotline}`}
        className="w-12 h-12 rounded-full bg-green-500 text-white grid place-items-center shadow-lg"
        aria-label="Gọi"
      >
        <Phone size={20} />
      </a>
    </div>
  );
}
