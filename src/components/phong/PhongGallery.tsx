"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

export function PhongGallery({ images, ten }: { images: string[]; ten: string }) {
  const [selected, setSelected] = useState<number | null>(null);
  if (!images.length) {
    return <div className="aspect-video bg-gray-100 rounded-2xl grid place-items-center text-6xl">🏠</div>;
  }
  return (
    <>
      <div className="space-y-2">
        <button type="button" className="w-full aspect-video rounded-2xl overflow-hidden bg-gray-100" onClick={() => setSelected(0)}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={images[0]} alt={ten} className="w-full h-full object-cover" />
        </button>
        {images.length > 1 && (
          <div className="grid grid-cols-4 gap-2">
            {images.slice(1, 5).map((src, i) => (
              <button
                key={src + i}
                type="button"
                className="aspect-video rounded-xl overflow-hidden bg-gray-100"
                onClick={() => setSelected(i + 1)}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>
      {selected !== null && (
        <div className="fixed inset-0 z-[200] bg-black/95 grid place-items-center">
          <button className="absolute top-4 right-4 text-white" onClick={() => setSelected(null)} aria-label="Đóng">
            <X />
          </button>
          {selected > 0 && (
            <button className="absolute left-4 text-white" onClick={() => setSelected(selected - 1)} aria-label="Trước">
              <ChevronLeft size={32} />
            </button>
          )}
          {selected < images.length - 1 && (
            <button className="absolute right-4 text-white" onClick={() => setSelected(selected + 1)} aria-label="Sau">
              <ChevronRight size={32} />
            </button>
          )}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={images[selected]} alt="" className="max-w-[90vw] max-h-[85vh] object-contain" />
        </div>
      )}
    </>
  );
}
