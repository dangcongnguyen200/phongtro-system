import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
function slugify(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
const KHU_VUC = [
  "Gò Vấp","Bình Thạnh","Tân Bình","Phú Nhuận","Tân Phú","Bình Tân",
  "Thủ Đức","Quận 1","Quận 3","Quận 5","Quận 7","Quận 10","Quận 12",
  "Bình Chánh","Hóc Môn","Nhà Bè",
];
const DEMO_PHONG = [
  { maPhong: "P101", gia: 4_500_000, dienTich: 25, loaiPhong: "don", giaDien: 3500, giaNuoc: 20000, internet: "free", rac: 20000, guiXe: 100000, tienIch: ["may_lanh","wc_rieng","cua_so"], hinhAnh: ["/uploads/1791276443940-2tasw0.jpg","/uploads/1791276443955-5nv3bq.jpg","/uploads/1791276443967-h1a93y.jpg"], moTa: "Phòng P101 Gò Vấp — 25m², máy lạnh, WC riêng, cửa sổ thoáng. Điện 3k5, nước 20k, internet free.", saleTen: "Anh Tuấn", saleSdt: "0982509443", saleZalo: "0982509443", khuVuc: "Gò Vấp", diaChi: "123 Lê Đức Thọ, Phường 6" },
  { maPhong: "P102", gia: 3_800_000, dienTich: 20, loaiPhong: "gac_lung", giaDien: 3500, giaNuoc: 20000, internet: "100000", rac: 15000, guiXe: 80000, tienIch: ["wc_rieng","gac","may_lanh"], hinhAnh: ["/uploads/1791276443981-j0xequ.jpg","/uploads/1791276443994-k4z7t5.jpg"], moTa: "Phòng P102 Gò Vấp — 20m² gác lửng, WC riêng, máy lạnh. Hẻm xe hơi.", saleTen: "Anh Tuấn", saleSdt: "0982509443", saleZalo: "0982509443", khuVuc: "Gò Vấp", diaChi: "45 Nguyễn Văn Nghi, Phường 7" },
  { maPhong: "B201", gia: 5_500_000, dienTich: 30, loaiPhong: "studio", giaDien: 4000, giaNuoc: 25000, internet: "free", rac: 30000, guiXe: 120000, tienIch: ["may_lanh","wc_rieng","tu_lanh","may_giat","ban_cong","noi_that"], hinhAnh: ["/uploads/1791276994131-uy1inj.jpg","/uploads/1791276994153-s58c6s.jpg","/uploads/1791276994173-fcj2jj.jpg"], moTa: "Studio B201 Bình Thạnh — 30m² full nội thất, ban công, máy giặt, tủ lạnh. Gần ĐH Văn Lang.", saleTen: "Chị Hoa", saleSdt: "0912345678", saleZalo: "0912345678", khuVuc: "Bình Thạnh", diaChi: "78 Điện Biên Phủ, Phường 15" },
  { maPhong: "B202", gia: 4_200_000, dienTich: 28, loaiPhong: "don", giaDien: 3800, giaNuoc: 22000, internet: "100000", rac: 20000, guiXe: 100000, tienIch: ["may_lanh","wc_rieng","cua_so","bep"], hinhAnh: ["/uploads/1791276994191-b7z7ae.jpg","/uploads/1791276994211-efkpbx.jpg"], moTa: "Phòng B202 Bình Thạnh — 28m², có bếp, cửa sổ lớn, máy lạnh. Khu yên tĩnh.", saleTen: "Chị Hoa", saleSdt: "0912345678", saleZalo: "0912345678", khuVuc: "Bình Thạnh", diaChi: "12 Nguyễn Hữu Cảnh, Phường 22" },
  { maPhong: "T301", gia: 3_500_000, dienTich: 22, loaiPhong: "don", giaDien: 3500, giaNuoc: 20000, internet: "free", rac: 15000, guiXe: 80000, tienIch: ["wc_rieng","cua_so","may_lanh"], hinhAnh: ["/uploads/1791276994230-l5ih9w.jpg","/uploads/1791276994249-ndx7q9.jpg"], moTa: "Phòng T301 Tân Bình — 22m², máy lạnh, WC riêng, gần sân bay. Giờ giấc tự do.", saleTen: "Anh Dũng", saleSdt: "0933334444", saleZalo: "0933334444", khuVuc: "Tân Bình", diaChi: "56 Trường Chinh, Phường 13" },
  { maPhong: "T302", gia: 6_000_000, dienTich: 35, loaiPhong: "1pn", giaDien: 4000, giaNuoc: 25000, internet: "free", rac: 30000, guiXe: 150000, tienIch: ["may_lanh","wc_rieng","tu_lanh","may_giat","ban_cong","thang_may","noi_that"], hinhAnh: ["/uploads/1791276994266-b9qzkj.jpg","/uploads/1791276994286-cg4fkj.jpg","/uploads/1791276994304-a01oco.jpg"], moTa: "Căn hộ 1PN T302 Tân Bình — 35m² full nội thất, thang máy, ban công. Gần chợ Phạm Văn Hai.", saleTen: "Anh Dũng", saleSdt: "0933334444", saleZalo: "0933334444", khuVuc: "Tân Bình", diaChi: "89 Phạm Văn Hai, Phường 5" },
  { maPhong: "PN401", gia: 7_000_000, dienTich: 40, loaiPhong: "1pn", giaDien: 4000, giaNuoc: 25000, internet: "free", rac: 40000, guiXe: 150000, tienIch: ["may_lanh","wc_rieng","tu_lanh","may_giat","ban_cong","thang_may","bao_ve","camera","noi_that"], hinhAnh: ["/uploads/1791276994321-q2iedm.jpg","/uploads/1791276994340-ckj80f.jpg"], moTa: "Căn hộ dịch vụ PN401 Phú Nhuận — 40m² full nội thất, bảo vệ 24/7, camera, thang máy.", saleTen: "Chị Lan", saleSdt: "0977778888", saleZalo: "0977778888", khuVuc: "Phú Nhuận", diaChi: "15 Hoa Lan, Phường 2" },
  { maPhong: "TĐ501", gia: 3_200_000, dienTich: 18, loaiPhong: "don", giaDien: 3500, giaNuoc: 20000, internet: "free", rac: 15000, guiXe: 70000, tienIch: ["wc_rieng","may_lanh","cua_so"], hinhAnh: ["/uploads/1791276994358-7temia.jpg"], moTa: "Phòng TĐ501 Thủ Đức — 18m², gần ĐH Quốc Gia. Máy lạnh, WC riêng, cửa sổ.", saleTen: "Anh Hùng", saleSdt: "0966667777", saleZalo: "0966667777", khuVuc: "Thủ Đức", diaChi: "102 Võ Văn Ngân, Phường Bình Thọ" },
  { maPhong: "TĐ502", gia: 4_000_000, dienTich: 26, loaiPhong: "gac_lung", giaDien: 3800, giaNuoc: 22000, internet: "100000", rac: 20000, guiXe: 90000, tienIch: ["wc_rieng","gac","may_lanh","bep"], hinhAnh: ["/uploads/1791276994376-ihftvl.jpg"], moTa: "Phòng TĐ502 Thủ Đức — 26m² gác lửng, có bếp, máy lạnh. Gần chợ Thủ Đức.", saleTen: "Anh Hùng", saleSdt: "0966667777", saleZalo: "0966667777", khuVuc: "Thủ Đức", diaChi: "33 Đặng Văn Bi, Phường Trường Thọ" },
  { maPhong: "Q10601", gia: 8_500_000, dienTich: 45, loaiPhong: "1pn", giaDien: 4500, giaNuoc: 30000, internet: "free", rac: 50000, guiXe: 200000, tienIch: ["may_lanh","wc_rieng","tu_lanh","may_giat","ban_cong","thang_may","bao_ve","camera","noi_that"], hinhAnh: ["/uploads/1791276444007-y2wjzv.jpg","/uploads/1791276444020-jyi51m.jpg"], moTa: "Căn hộ dịch vụ Q10601 Quận 1 — 45m² full nội thất cao cấp, trung tâm, gần Bến Thành.", saleTen: "Chị Mai", saleSdt: "0901234567", saleZalo: "0901234567", khuVuc: "Quận 1", diaChi: "20 Lý Tự Trọng, Phường Bến Thành" },
  { maPhong: "Q30602", gia: 5_000_000, dienTich: 30, loaiPhong: "studio", giaDien: 4000, giaNuoc: 25000, internet: "free", rac: 30000, guiXe: 120000, tienIch: ["may_lanh","wc_rieng","tu_lanh","may_giat","cua_so","noi_that"], hinhAnh: ["/uploads/1791276444031-to7myy.jpg","/uploads/1791276449246-ea25gm.jpg"], moTa: "Studio Q30602 Quận 3 — 30m² nội thất cơ bản, gần ĐH Kinh Tế. Yên tĩnh, an ninh.", saleTen: "Chị Mai", saleSdt: "0901234567", saleZalo: "0901234567", khuVuc: "Quận 3", diaChi: "145 Nguyễn Thị Minh Khai, Phường 6" },
];
async function main() {
  console.log("🌱 Bắt đầu seed...");
  const khuVucMap = new Map<string, string>();
  for (const ten of KHU_VUC) {
    const slug = slugify(ten);
    const kv = await prisma.khuVuc.upsert({
      where: { slug },
      update: {},
      create: { ten, slug },
    });
    khuVucMap.set(ten, kv.id);
  }
  console.log(`✅ Đã tạo ${khuVucMap.size} khu vực`);
  let created = 0;
  for (const p of DEMO_PHONG) {
    const khuVucId = khuVucMap.get(p.khuVuc);
    if (!khuVucId) continue;
    const diaChi = await prisma.diaChi.upsert({
      where: { khuVucId_text: { khuVucId, text: p.diaChi } },
      update: {},
      create: { khuVucId, text: p.diaChi, loai: "duong" },
    });
    await prisma.phong.upsert({
      where: { maPhong: p.maPhong },
      update: {},
      create: {
        maPhong: p.maPhong,
        gia: BigInt(p.gia),
        dienTich: p.dienTich,
        loaiPhong: p.loaiPhong,
        giaDien: BigInt(p.giaDien),
        giaNuoc: BigInt(p.giaNuoc),
        internet: p.internet,
        rac: BigInt(p.rac),
        guiXe: BigInt(p.guiXe),
        tienIch: JSON.stringify(p.tienIch),
        hinhAnh: JSON.stringify(p.hinhAnh),
        moTa: p.moTa,
        saleTen: p.saleTen,
        saleSdt: p.saleSdt,
        saleZalo: p.saleZalo,
        status: "active",
        nguon: "admin",
        activeUntil: new Date(Date.now() + 40 * 24 * 60 * 60 * 1000),
        khuVucId,
        diaChiId: diaChi.id,
      },
    });
    created++;
  }
  console.log(`✅ Đã tạo ${created} phòng demo`);
  const phongSample = await prisma.phong.findFirst({ where: { maPhong: "P101" } });
  if (phongSample) {
    await prisma.lead.create({
      data: { khachTen: "Nguyễn Văn A", sdt: "0909999888", ghiChu: "Muốn xem phòng cuối tuần", trangThai: "moi", phongId: phongSample.id },
    });
    await prisma.lead.create({
      data: { khachTen: "Trần Thị B", sdt: "0908888777", ghiChu: "Hỏi giá điện nước", trangThai: "da_goi", phongId: phongSample.id },
    });
    console.log("✅ Đã tạo 2 lead demo");
  }
  console.log("🎉 Seed hoàn tất!");
}
main()
  .catch((e) => { console.error("❌ Seed lỗi:", e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
// ==================== ADMIN USER ====================
async function seedAdmin() {
  const bcrypt = await import("bcryptjs");
  const adminEmail = "admin@phongtro.vn";
  const existing = await prisma.user.findUnique({ where: { email: adminEmail } });
  if (existing) {
    console.log("⏭️  Admin đã tồn tại");
    return;
  }
  const password = await bcrypt.hash("admin123456", 10);
  const admin = await prisma.user.create({
    data: {
      email: adminEmail,
      password,
      name: "Admin",
      phone: "0982509443",
      role: "admin",
      status: "active",
    },
  });
  console.log(`✅ Đã tạo admin: ${adminEmail} / admin123456`);
}
// Chạy seed admin
seedAdmin()
  .then(() => console.log("🎉 Seed admin hoàn tất"))
  .catch((e) => console.error("❌ Seed admin lỗi:", e));
