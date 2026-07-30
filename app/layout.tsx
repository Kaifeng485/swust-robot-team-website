import type { Metadata, Viewport } from "next";
import "./globals.css";
import "./mobile-fix.css";
import MobileNavEnhancer from "./MobileNavEnhancer";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: "西南科大机器人小组 | SWUST Robot Team",
  description: "西南科技大学机器人小组官方网站——比赛影像、团队故事与招新信息。",
  icons: {
    icon: `${basePath}/favicon.svg`,
    shortcut: `${basePath}/favicon.svg`,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <head>
        <meta charSet="utf-8" />
      </head>
      <body>
        <MobileNavEnhancer />
        {children}
      </body>
    </html>
  );
}
