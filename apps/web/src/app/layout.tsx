import type { Metadata } from "next";
import { Inter, Dancing_Script, Playfair_Display, Lora } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { TRPCProvider } from "@/lib/trpc/client";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "vietnamese"],
});

const dancingScript = Dancing_Script({
  variable: "--font-dancing",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "LoveStory — Thiệp cưới online & AI Video",
    template: "%s | LoveStory",
  },
  description:
    "Tạo thiệp cưới online đẹp trong 5 phút. 50+ mẫu thiệp, RSVP thông minh, tường lời chúc, QR mừng cưới. Miễn phí!",
  keywords: [
    "thiệp cưới online",
    "thiệp cưới điện tử",
    "wedding invitation",
    "thiệp mời đám cưới",
    "RSVP online",
    "LoveStory",
  ],
  authors: [{ name: "LoveStory" }],
  creator: "LoveStory",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://7app.online"),
  openGraph: {
    type: "website",
    locale: "vi_VN",
    siteName: "LoveStory",
    title: "LoveStory — Thiệp cưới online & AI Video",
    description:
      "Tạo thiệp cưới online đẹp trong 5 phút. 50+ mẫu thiệp, RSVP, lời chúc, QR mừng cưới. Miễn phí!",
  },
  twitter: {
    card: "summary_large_image",
    title: "LoveStory — Thiệp cưới online & AI Video",
    description: "Tạo thiệp cưới online đẹp trong 5 phút. Miễn phí!",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <head>
        {GA_ID && (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
            <Script id="ga4" strategy="afterInteractive">
              {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${GA_ID}');`}
            </Script>
          </>
        )}
      </head>
      <body className={`${inter.variable} ${dancingScript.variable} ${playfairDisplay.variable} ${lora.variable} antialiased`} style={{ margin: 0 }}>
        <TRPCProvider>{children}</TRPCProvider>
      </body>
    </html>
  );
}
