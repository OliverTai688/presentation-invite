import type { Metadata } from "next";
import { Geist, Geist_Mono, Noto_Sans_TC, Noto_Serif_TC } from "next/font/google";
import { AppToaster } from "@/components/AppToaster";
import { SiteBackground } from "@/components/SiteBackground";
import { defaultInvitationContent } from "@/lib/invitation-content";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Traditional-Chinese UI/body face. Self-hosted by next/font; loaded async
// (preload disabled) so the large CJK file never blocks first paint — the
// system PingFang/JhengHei fallback shows until it swaps in.
const notoSansTC = Noto_Sans_TC({
  variable: "--font-noto-sans-tc",
  weight: ["400", "500", "700", "900"],
  display: "swap",
  preload: false,
});

// Elegant serif reserved for the hero main title (主標) only.
const notoSerifTC = Noto_Serif_TC({
  variable: "--font-noto-serif-tc",
  weight: ["600", "700", "900"],
  display: "swap",
  preload: false,
});

const siteTitle = `${defaultInvitationContent.topic}邀請函｜${defaultInvitationContent.speakerName} × BNI 長冠軍分會`;
const siteDescription = `${defaultInvitationContent.speakerName} ${defaultInvitationContent.eventDate} ${defaultInvitationContent.topic}活動邀請與報名。${defaultInvitationContent.description}`;

export const metadata: Metadata = {
  applicationName: siteTitle,
  title: {
    default: siteTitle,
    template: `%s｜${defaultInvitationContent.topic}邀請函`,
  },
  description: siteDescription,
  openGraph: {
    title: siteTitle,
    description: siteDescription,
    siteName: siteTitle,
    locale: "zh_TW",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-Hant-TW"
      className={`${geistSans.variable} ${geistMono.variable} ${notoSansTC.variable} ${notoSerifTC.variable}`}
    >
      <body>
        <SiteBackground />
        {children}
        <AppToaster />
      </body>
    </html>
  );
}
