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
  themeColor: "#06B6D4",
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased bg-brand-bg text-slate-100 min-h-screen flex flex-col relative">
        <Header />
        <main className="flex-1 relative z-10">{children}</main>
        <Footer />
        <FloatingContact hotline={HOTLINE} />
      </body>
    </html>
  );
}
