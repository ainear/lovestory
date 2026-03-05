import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { TRPCProvider } from "@/lib/trpc/client";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "vietnamese"],
});

export const metadata: Metadata = {
  title: "LoveStory — Thiệp cưới online & AI Video",
  description:
    "Tạo thiệp cưới online đẹp và video cinematic bằng AI. Chia sẻ câu chuyện tình yêu của bạn.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className={`${inter.variable} antialiased`} style={{ margin: 0 }}>
        <TRPCProvider>{children}</TRPCProvider>
      </body>
    </html>
  );
}
