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
