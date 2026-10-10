export function formatVND(n: number | string | bigint | null | undefined): string {
  if (n === null || n === undefined || n === "") return "—";
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(Number(n));
}
export function slugify(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
export function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
export function formatDate(d: Date | string) {
  return new Date(d).toLocaleDateString("vi-VN");
}
export function toNum(n: bigint | number | null | undefined): number | null {
  if (n === null || n === undefined) return null;
  return Number(n);
}
export function bigIntToNumber<T extends Record<string, unknown>>(obj: T): T {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(obj)) {
    if (typeof v === "bigint") {
      out[k] = Number(v);
    } else if (v instanceof Date) {
      out[k] = v.toISOString();
    } else if (v && typeof v === "object" && !Array.isArray(v)) {
      out[k] = bigIntToNumber(v as Record<string, unknown>);
    } else if (Array.isArray(v)) {
      out[k] = v.map((item) =>
        item && typeof item === "object" ? bigIntToNumber(item as Record<string, unknown>) : item
      );
    } else {
      out[k] = v;
    }
  }
  return out as T;
}