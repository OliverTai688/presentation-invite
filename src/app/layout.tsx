import type { Metadata } from "next";
import { Noto_Sans_TC, Noto_Serif_TC } from "next/font/google";
import { AppToaster } from "@/components/AppToaster";
import "./globals.css";

const notoSansTc = Noto_Sans_TC({
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
  variable: "--font-noto-sans-tc",
  display: "swap",
});

const notoSerifTc = Noto_Serif_TC({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  variable: "--font-noto-serif-tc",
  display: "swap",
});

const eventDescription =
  "BNI 臺北北區長冠軍分會 ｜ 2026.12.03（四）AM 06:30–08:30 ｜ 台北漢普頓酒店 ｜ 會計師古又帆 × 品牌顧問陳宜均：從募資 2,000 萬到企業成長，雙顧問如何打造企業競爭力。";

// OG/Twitter image URLs must be absolute; Vercel supplies the host at build time.
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "從募資 2,000 萬到企業成長｜BNI 臺北北區長冠軍分會 邀請函",
    template: "%s | BNI 臺北北區長冠軍分會",
  },
  description: eventDescription,
  openGraph: {
    title: "12/3 邀請函｜從募資 2,000 萬到企業成長：雙顧問如何打造企業競爭力",
    description: eventDescription,
    type: "website",
    locale: "zh_TW",
    images: [{ url: "/poster-20261203.jpg", width: 794, height: 1123, alt: "12/3 活動海報" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "12/3 邀請函｜從募資 2,000 萬到企業成長：雙顧問如何打造企業競爭力",
    description: eventDescription,
    images: ["/poster-20261203.jpg"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-TW" className={`${notoSansTc.variable} ${notoSerifTc.variable}`} suppressHydrationWarning>
      <body>
        {children}
        <AppToaster />
      </body>
    </html>
  );
}
