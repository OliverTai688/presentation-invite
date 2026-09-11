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
  "BNI 臺北北區長冠軍分會 ｜ 2026.09.17 AM 06:30–08:30 ｜ 睿琪有限公司執行長 黃嘉琪《靜奢之境：霽雲的精品之路，與頂層生活圈的共創》";

// OG/Twitter image URLs must be absolute; Vercel supplies the host at build time.
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "靜奢之境｜BNI 臺北北區長冠軍分會 邀請函",
    template: "%s | 靜奢之境",
  },
  description: eventDescription,
  openGraph: {
    title: "靜奢之境｜黃嘉琪 × BNI 臺北北區長冠軍分會",
    description: eventDescription,
    type: "website",
    locale: "zh_TW",
    images: [{ url: "/poster.jpg", width: 1721, height: 2435, alt: "活動海報" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "靜奢之境｜黃嘉琪 × BNI 臺北北區長冠軍分會",
    description: eventDescription,
    images: ["/poster.jpg"],
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
