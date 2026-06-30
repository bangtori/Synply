import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Synply",
  description: "취업 지원 기록 관리 대시보드",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
