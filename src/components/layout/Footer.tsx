import Link from "next/link";
import { Home, Phone, MessageCircle, MapPin } from "lucide-react";
import { HOTLINE } from "@/lib/constants";
export default function Footer() {
  return (
    <footer className="relative z-10 mt-16 border-t border-cyan-500/15 bg-[#040812]/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-emerald-400 p-[1px]">
              <div className="w-full h-full bg-[#060B17] rounded-[10px] flex items-center justify-center">
                <Home size={16} className="text-cyan-400" />
              </div>
            </div>
            <span className="text-lg font-black tracking-wider text-gradient">
              Phòng<span className="text-cyan-400 font-light">Trọ</span>
            </span>
          </div>
          <p className="text-sm text-slate-400 leading-relaxed">
            Chỉ đẩy tin phòng. Không đăng ký. Liên hệ sale trực tiếp qua SĐT / Zalo.
          </p>
        </div>
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-300 mb-3">
            Liên kết
          </h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/" className="text-slate-400 hover:text-cyan-300 transition-colors">
                Trang chủ
              </Link>
            </li>
            <li>
              <Link href="/phong" className="text-slate-400 hover:text-cyan-300 transition-colors">
                Danh sách phòng
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-300 mb-3">
            Liên hệ
          </h4>
          <div className="space-y-2">
            <a
              href={`tel:${HOTLINE}`}
              className="flex items-center gap-2 text-sm text-emerald-400 font-bold hover:text-emerald-300"
            >
              <Phone size={14} /> {HOTLINE}
            </a>
            <a
              href={`https://zalo.me/${HOTLINE}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-cyan-300 hover:text-cyan-200"
            >
              <MessageCircle size={14} /> Chat Zalo
            </a>
            <p className="flex items-center gap-2 text-xs text-slate-500">
              <MapPin size={12} /> TP. Hồ Chí Minh
            </p>
          </div>
        </div>
      </div>
      <div className="border-t border-cyan-500/10 py-4 text-center">
        <p className="text-xs text-slate-500">
          © {new Date().getFullYear()} PhòngTrọ. Mobile-first luxury design.
        </p>
      </div>
    </footer>
  );
}
