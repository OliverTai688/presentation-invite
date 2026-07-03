import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AppToaster } from "@/components/AppToaster";
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
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <body>
        {children}
        <AppToaster />
      </body>
    </html>
  );
}
