import { extractJson, ollamaText } from "./ollama";

export type ParsedRoom = {
  maPhong?: string;
  gia?: number;
  dienTich?: number;
  diaChi?: string;
  khuVuc?: string;
  tienIch: string[];
  giaDien?: number;
  giaNuoc?: number;
  internet?: string;
  rac?: number;
  guiXe?: number;
  loaiPhong?: string;
  moTaNguon: string;
};

const TIEN_ICH_MAP: [RegExp, string][] = [
  [/m[aá]y\s*l[aạ]nh|điều hoà|dieu hoa|air.?cond/i, "may_lanh"],
  [/wc\s*riêng|toilet riêng|nhà vệ sinh riêng|vs riêng/i, "wc_rieng"],
  [/gác|gac lung|gác lửng/i, "gac"],
  [/nước nóng|nuoc nong|bình nóng/i, "nuoc_nong"],
  [/tủ lạnh|tu lanh/i, "tu_lanh"],
  [/máy giặt|may giat/i, "may_giat"],
  [/ban công|ban cong/i, "ban_cong"],
  [/cửa sổ|cua so/i, "cua_so"],
  [/bếp|bep/i, "bep"],
  [/thang máy|thang may/i, "thang_may"],
  [/bảo vệ|bao ve|security/i, "bao_ve"],
  [/camera/i, "camera"],
  [/nội thất|noi that|full nt/i, "noi_that"],
];

const KHU_VUC = [
  "Gò Vấp",
  "Bình Thạnh",
  "Tân Bình",
  "Phú Nhuận",
  "Tân Phú",
  "Bình Tân",
  "Thủ Đức",
  "Quận 1",
  "Quận 2",
  "Quận 3",
  "Quận 4",
  "Quận 5",
  "Quận 6",
  "Quận 7",
  "Quận 8",
  "Quận 9",
  "Quận 10",
  "Quận 11",
  "Quận 12",
  "Bình Chánh",
  "Hóc Môn",
  "Nhà Bè",
];

function parseMoneyToken(raw: string): number | undefined {
  const s = raw.toLowerCase().replace(/\s/g, "").replace(/đ|d$/i, "");
  const tr = s.match(/^(\d+)(?:[.,](\d+))?tr(?:iệu)?(\d)?$/);
  if (tr) {
    const main = Number(tr[1]);
    const dec = tr[2] ? Number(`0.${tr[2]}`) : tr[3] ? Number(tr[3]) / 10 : 0;
    return Math.round((main + dec) * 1_000_000);
  }
  if (/rưỡi|ruoi/.test(raw.toLowerCase())) {
    const n = raw.match(/(\d+)/);
    if (n) return Math.round((Number(n[1]) + 0.5) * 1_000_000);
  }
  const k = s.match(/^(\d+)(?:[.,k](\d+))?k$/);
  if (k) {
    const main = Number(k[1]);
    const dec = k[2] ? Number(k[2].padEnd(3, "0").slice(0, 3)) : 0;
    return main * 1000 + (k[2] && k[2].length === 1 ? Number(k[2]) * 100 : dec);
  }
  const digits = s.replace(/[.]/g, "").replace(",", ".");
  const n = Number(digits);
  if (Number.isFinite(n) && n >= 1000) return Math.round(n);
  return undefined;
}

function parseGiaThue(text: string): number | undefined {
  const m =
    text.match(/(\d+(?:[.,]\d+)?)\s*(?:tr(?:iệu)?|trieu)(?:\s*(\d)|rưỡi|ruoi)?/i) ||
    text.match(/giá[:\s]*([0-9.]+)/i);
  if (m) {
    if (/rưỡi|ruoi/i.test(m[0])) return Math.round((Number(m[1].replace(",", ".")) + 0.5) * 1_000_000);
    const base = Number(m[1].replace(",", "."));
    if (/tr/i.test(m[0])) {
      const extra = m[2] ? Number(m[2]) / 10 : 0;
      return Math.round((base + extra) * 1_000_000);
    }
    return parseMoneyToken(m[1]);
  }
  const compact = text.match(/\b(\d+)tr(\d)\b/i);
  if (compact) return Math.round((Number(compact[1]) + Number(compact[2]) / 10) * 1_000_000);
  return undefined;
}

function parseKWh(text: string): number | undefined {
  const m = text.match(/điện[:\s]*([0-9k.,]+)/i);
  if (m) return parseMoneyToken(m[1]) ?? parseMoneyToken(m[1] + "d");
  return undefined;
}

function parseNuoc(text: string): number | undefined {
  const m = text.match(/nước[:\s]*([0-9k.,]+)/i);
  if (m) return parseMoneyToken(m[1]);
  return undefined;
}

function parseRac(text: string): number | undefined {
  const m = text.match(/rác[:\s]*([0-9k.,]+)/i);
  if (m) return parseMoneyToken(m[1]);
  return undefined;
}

function parseXe(text: string): number | undefined {
  const m = text.match(/(?:gửi xe|giữ xe|xe)[:\s]*([0-9k.,]+)/i);
  if (m) return parseMoneyToken(m[1]);
  return undefined;
}

function parseDienTich(text: string): number | undefined {
  const m = text.match(/(\d+(?:[.,]\d+)?)\s*(?:m2|m²|mét vuông|met vuong)/i);
  if (m) return Number(m[1].replace(",", "."));
  return undefined;
}

function parseMa(text: string): string | undefined {
  const m = text.match(/\b([A-Z]{1,3}\d{1,4})\b/i);
  return m ? m[1].toUpperCase() : undefined;
}

function parseKhuVuc(text: string): string | undefined {
  const lower = text.toLowerCase();
  return KHU_VUC.find((k) => lower.includes(k.toLowerCase()));
}

function parseInternet(text: string): string | undefined {
  if (/internet.*(?:free|miễn phí|mien phi)|wifi.*(?:free|miễn phí)/i.test(text)) {
    return "free";
  }
  const m = text.match(/(?:internet|wifi)[:\s]*([0-9k.,]+)/i);
  if (m) {
    const n = parseMoneyToken(m[1]);
    return n ? String(n) : undefined;
  }
  return undefined;
}

function parseTienIch(text: string): string[] {
  const out: string[] = [];
  for (const [re, key] of TIEN_ICH_MAP) {
    if (re.test(text)) out.push(key);
  }
  return [...new Set(out)];
}

function parseDiaChi(text: string): string | undefined {
  const m = text.match(
    /(\d+[A-Z]?\/?\d*\s+[^,\n]+(?:,\s*[^,\n]+){0,2})/i,
  );
  return m ? m[1].trim() : undefined;
}

function splitRooms(text: string): string[] {
  const parts = text
    .split(/[,;]|\n|(?=\b[A-Z]?\d{2,4}\b)/i)
    .map((s) => s.trim())
    .filter((s) => s.length > 6 && /(\d+\s*tr|giá|m2|m²)/i.test(s));
  if (parts.length >= 2) return parts;
  return [text];
}

export function parseRoomsHeuristic(text: string): ParsedRoom[] {
  return splitRooms(text).map((chunk) => ({
    maPhong: parseMa(chunk),
    gia: parseGiaThue(chunk),
    dienTich: parseDienTich(chunk),
    diaChi: parseDiaChi(chunk) || parseDiaChi(text),
    khuVuc: parseKhuVuc(chunk) || parseKhuVuc(text),
    tienIch: parseTienIch(`${chunk} ${text}`),
    giaDien: parseKWh(chunk) ?? parseKWh(text),
    giaNuoc: parseNuoc(chunk) ?? parseNuoc(text),
    internet: parseInternet(chunk) ?? parseInternet(text),
    rac: parseRac(chunk) ?? parseRac(text),
    guiXe: parseXe(chunk) ?? parseXe(text),
    loaiPhong: /gác/i.test(chunk) ? "gac_lung" : /studio/i.test(chunk) ? "studio" : "don",
    moTaNguon: chunk,
  }));
}

export async function parseRoomsWithAI(text: string): Promise<ParsedRoom[]> {
  const fallback = parseRoomsHeuristic(text);
  const raw = await ollamaText(`Bạn là bộ trích xuất dữ liệu phòng trọ tiếng Việt.
Trả về JSON array, mỗi phần tử:
{"maPhong":"P101","gia":4500000,"dienTich":25,"diaChi":"...","khuVuc":"Gò Vấp","tienIch":["may_lanh","wc_rieng"],"giaDien":3500,"giaNuoc":20000,"internet":"free","rac":20000,"guiXe":100000,"loaiPhong":"don"}
Quy tắc: 4tr5=4500000, 3k5=3500, 20k=20000. tienIch chỉ dùng: may_lanh, wc_rieng, gac, nuoc_nong, tu_lanh, may_giat, ban_cong, cua_so, bep, thang_may, bao_ve, camera, noi_that.
Tin nhắn:
${text}`);
  if (!raw) return fallback;
  const json = extractJson<ParsedRoom[]>(raw) || extractJson<{ rooms: ParsedRoom[] }>(raw);
  const rooms = Array.isArray(json) ? json : json && "rooms" in json ? json.rooms : null;
  if (!rooms?.length) return fallback;
  return rooms.map((r, i) => ({
    ...fallback[Math.min(i, fallback.length - 1)],
    ...r,
    gia: r.gia || fallback[i]?.gia,
    tienIch: [...new Set([...(r.tienIch || []), ...(fallback[i]?.tienIch || [])])],
    moTaNguon: text,
  }));
}

export async function vietMoTa(room: ParsedRoom): Promise<string> {
  const bits = [
    room.maPhong && `Phòng ${room.maPhong}`,
    room.khuVuc,
    room.dienTich && `${room.dienTich}m²`,
    room.gia && `${Math.round(room.gia / 1_000_000)} triệu/tháng`,
  ].filter(Boolean);
  const base = `${bits.join(" — ")}. ${room.tienIch.length ? `Tiện ích: ${room.tienIch.join(", ")}.` : ""}`.trim();
  const ai = await ollamaText(
    `Viết mô tả phòng trọ ngắn (2-3 câu, tiếng Việt, không thêm thông tin bịa). Dữ liệu: ${JSON.stringify(room)}`,
  );
  return ai || base;
}
