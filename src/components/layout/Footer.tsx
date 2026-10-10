import Link from "next/link";
import { HOTLINE } from "@/lib/constants";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-16">
      <div className="max-w-6xl mx-auto px-4 py-10 flex flex-col md:flex-row gap-6 justify-between">
        <div>
          <p className="text-white font-semibold mb-2">PhòngTrọ</p>
          <p className="text-sm text-gray-400">Chỉ đẩy tin phòng. Không đăng ký. Liên hệ sale qua SĐT / Zalo.</p>
        </div>
        <div className="text-sm space-y-1">
          <Link href="/" className="block hover:text-white">Trang chủ</Link>
          <Link href="/phong" className="block hover:text-white">Danh sách phòng</Link>
          <a href={`tel:${HOTLINE}`} className="block hover:text-white">Gọi {HOTLINE}</a>
        </div>
      </div>
    </footer>
  );
}
