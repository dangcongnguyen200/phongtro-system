"use client";
import { useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
export function PhongGallery({ images, ten }: { images: string[]; ten: string }) {
  const [selected, setSelected] = useState<number | null>(null);
  const [errors, setErrors] = useState<Set<number>>(new Set());
  if (!images.length) {
    return <div className="aspect-video bg-gray-100 rounded-2xl grid place-items-center text-6xl">🏠</div>;
  }
  function handleError(idx: number) {
    setErrors((s) => new Set(s).add(idx));
  }
  return (
    <>
      <div className="space-y-2">
        <button
          type="button"
          className="w-full aspect-video rounded-2xl overflow-hidden bg-gray-100"
          onClick={() => setSelected(0)}
          aria-label="Xem ảnh lớn"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={images[0]}
            alt={`${ten} - ảnh 1`}
            width={800}
            height={600}
            className="w-full h-full object-cover"
            onError={() => handleError(0)}
          />
        </button>
        {images.length > 1 && (
          <div className="grid grid-cols-4 gap-2">
            {images.slice(1, 5).map((src, i) => {
              const idx = i + 1;
              return (
                <button
                  key={src + i}
                  type="button"
                  className="aspect-video rounded-xl overflow-hidden bg-gray-100"
                  onClick={() => setSelected(idx)}
                  aria-label={`Xem ảnh ${idx + 1}`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={src}
                    alt={`${ten} - ảnh ${idx + 1}`}
                    width={200}
                    height={150}
                    className="w-full h-full object-cover"
                    onError={() => handleError(idx)}
                  />
                </button>
              );
            })}
          </div>
        )}
      </div>
      {selected !== null && (
        <div className="fixed inset-0 z-[200] bg-black/95 grid place-items-center">
          <button
            className="absolute top-4 right-4 text-white p-2"
            onClick={() => setSelected(null)}
            aria-label="Đóng"
          >
            <X />
          </button>
          {selected > 0 && (
            <button
              className="absolute left-4 text-white p-2"
              onClick={() => setSelected(selected - 1)}
              aria-label="Ảnh trước"
            >
              <ChevronLeft size={32} />
            </button>
          )}
          {selected < images.length - 1 && (
            <button
              className="absolute right-4 text-white p-2"
              onClick={() => setSelected(selected + 1)}
              aria-label="Ảnh sau"
            >
              <ChevronRight size={32} />
            </button>
          )}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={images[selected]}
            alt={`${ten} - ảnh ${selected + 1}`}
            className="max-w-[90vw] max-h-[85vh] object-contain"
            onError={() => handleError(selected)}
          />
        </div>
      )}
    </>
  );
}