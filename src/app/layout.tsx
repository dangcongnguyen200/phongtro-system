import type { Metadata, Viewport } from "next";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { FloatingContact } from "@/components/layout/FloatingContact";
import { HOTLINE, SITE_NAME } from "@/lib/constants";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://phongtro24h.vercel.app";
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — Tìm phòng trọ, giá rõ điện nước`,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "Đẩy tin phòng trọ: ảnh thật, giá thuê, điện nước, tiện ích. Gọi / Zalo trực tiếp sale. Không đăng ký tài khoản.",
  robots: { index: true, follow: true },
  alternates: { canonical: SITE_URL },
  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} — Tìm phòng trọ, giá rõ điện nước`,
    description:
      "Đẩy tin phòng trọ: ảnh thật, giá thuê, điện nước, tiện ích. Gọi / Zalo trực tiếp sale.",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: SITE_NAME }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — Tìm phòng trọ`,
    description: "Phòng trọ giá rõ điện nước, gọi sale trực tiếp.",
    images: ["/og-image.jpg"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-icon.png",
  },
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: SITE_NAME,
              url: SITE_URL,
              potentialAction: {
                "@type": "SearchAction",
                target: `${SITE_URL}/phong?q={search_term_string}`,
                "query-input": "required name=search_term_string",
              },
            }),
          }}
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
