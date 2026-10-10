import { extractJson, ollamaVision } from "./ollama";

const KEYS = [
  "may_lanh",
  "wc_rieng",
  "gac",
  "nuoc_nong",
  "tu_lanh",
  "may_giat",
  "ban_cong",
  "cua_so",
  "bep",
  "noi_that",
] as const;

export async function detectAmenitiesFromImages(images: string[]): Promise<string[]> {
  if (!images.length) return [];
  const raw = await ollamaVision(
    `Ảnh phòng trọ. Trả JSON: {"tienIch":["may_lanh"]}. Chỉ dùng: ${KEYS.join(", ")}. Không giải thích.`,
    images.slice(0, 3),
  );
  if (!raw) return [];
  const json = extractJson<{ tienIch?: string[] }>(raw);
  return (json?.tienIch || []).filter((k) => (KEYS as readonly string[]).includes(k));
}
