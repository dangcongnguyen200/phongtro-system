"use client";
import { useState } from "react";
type Props = {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  fallback?: string;
};
export function SafeImage({
  src,
  alt,
  width = 400,
  height = 300,
  className = "",
}: Props) {
  const [err, setErr] = useState(false);
  if (err) {
    return (
      <div
        className={`grid place-items-center bg-slate-900 text-4xl opacity-30 ${className}`}
        style={{ width: "100%", height: "100%" }}
      >
        🏠
      </div>
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      loading="lazy"
      decoding="async"
      onError={() => setErr(true)}
    />
  );
}