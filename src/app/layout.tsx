import type { Metadata, Viewport } from "next";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { FloatingContact } from "@/components/layout/FloatingContact";
import { HOTLINE, SITE_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: {
    default: `${SITE_NAME} — Tìm phòng trọ, giá rõ điện nước`,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "Đẩy tin phòng trọ: ảnh thật, giá thuê, điện nước, tiện ích. Gọi / Zalo trực tiếp sale. Không đăng ký tài khoản.",
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#2563eb",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body className="antialiased bg-gray-50 text-gray-900 min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <FloatingContact hotline={HOTLINE} />
      </body>
    </html>
  );
}
