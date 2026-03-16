import type { Metadata } from "next";
import {
  Inter,
  Dancing_Script,
  Playfair_Display,
  Lora,
  Quicksand,
  Montserrat,
  Great_Vibes,
  Cormorant_Garamond,
  Pacifico,
  Sacramento,
  Alex_Brush,
  Satisfy,
  Allura,
  Pinyon_Script,
  Cinzel_Decorative,
  Parisienne,
  Tangerine,
  Petit_Formal_Script,
  Italianno,
  Lovers_Quarrel,
  Rouge_Script,
  Carattere,
  Cormorant_Infant,
  Libre_Baskerville,
  EB_Garamond,
  Crimson_Text,
  Spectral,
  Raleway,
  Josefin_Sans,
  Poppins,
  Cinzel,
  Playfair_Display_SC,
  Bodoni_Moda,
  Tenor_Sans,
  Antic_Didone,
} from "next/font/google";
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

const quicksand = Quicksand({
  variable: "--font-quicksand",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "700"],
  display: "swap",
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "700"],
  display: "swap",
});

const greatVibes = Great_Vibes({
  variable: "--font-great-vibes",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

const cormorantGaramond = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const pacifico = Pacifico({
  variable: "--font-pacifico",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

const sacramento = Sacramento({
  variable: "--font-sacramento",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

const alexBrush = Alex_Brush({
  variable: "--font-alex-brush",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

const satisfy = Satisfy({
  variable: "--font-satisfy",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

const allura = Allura({
  variable: "--font-allura",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

const pinyonScript = Pinyon_Script({
  variable: "--font-pinyon-script",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

const cinzelDecorative = Cinzel_Decorative({
  variable: "--font-cinzel-decorative",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

const parisienne = Parisienne({
  variable: "--font-parisienne",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

const tangerine = Tangerine({
  variable: "--font-tangerine",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

const petitFormalScript = Petit_Formal_Script({
  variable: "--font-petit-formal-script",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

const italianno = Italianno({
  variable: "--font-italianno",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

const loversQuarrel = Lovers_Quarrel({
  variable: "--font-lovers-quarrel",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

const rougeScript = Rouge_Script({
  variable: "--font-rouge-script",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

const carattere = Carattere({
  variable: "--font-carattere",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

const cormorantInfant = Cormorant_Infant({
  variable: "--font-cormorant-infant",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

const libreBaskerville = Libre_Baskerville({
  variable: "--font-libre-baskerville",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

const ebGaramond = EB_Garamond({
  variable: "--font-eb-garamond",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

const crimsonText = Crimson_Text({
  variable: "--font-crimson-text",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

const spectral = Spectral({
  variable: "--font-spectral",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

const raleway = Raleway({
  variable: "--font-raleway",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

const josefinSans = Josefin_Sans({
  variable: "--font-josefin-sans",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

const playfairDisplaySC = Playfair_Display_SC({
  variable: "--font-playfair-display-sc",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

const bodoniModa = Bodoni_Moda({
  variable: "--font-bodoni-moda",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

const tenorSans = Tenor_Sans({
  variable: "--font-tenor-sans",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

const anticDidone = Antic_Didone({
  variable: "--font-antic-didone",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

/*
 * CineLove custom fonts → free Google Font equivalents:
 * - BucThu (Vietnamese decorative/brush) → Dancing Script / Pacifico
 * - Aquarelle (handwritten/brush) → Sacramento / Alex Brush
 * - Mallong (decorative) → Satisfy
 * - RetroSignature (script/signature) → Allura
 * - Carlytte (calligraphy) → Pinyon Script
 * - Soul Note Display (display/decorative) → Cinzel Decorative
 */

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
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "https://7app.online",
  ),
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
    <html lang="vi" suppressHydrationWarning>
      <head>
        {GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga4" strategy="afterInteractive">
              {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${GA_ID}');`}
            </Script>
          </>
        )}
      </head>
      <body
        suppressHydrationWarning
        className={`${inter.variable} ${dancingScript.variable} ${playfairDisplay.variable} ${lora.variable} ${quicksand.variable} ${montserrat.variable} ${greatVibes.variable} ${cormorantGaramond.variable} ${pacifico.variable} ${sacramento.variable} ${alexBrush.variable} ${satisfy.variable} ${allura.variable} ${pinyonScript.variable} ${cinzelDecorative.variable} ${parisienne.variable} ${tangerine.variable} ${petitFormalScript.variable} ${italianno.variable} ${loversQuarrel.variable} ${rougeScript.variable} ${carattere.variable} ${cormorantInfant.variable} ${libreBaskerville.variable} ${ebGaramond.variable} ${crimsonText.variable} ${spectral.variable} ${raleway.variable} ${josefinSans.variable} ${poppins.variable} ${cinzel.variable} ${playfairDisplaySC.variable} ${bodoniModa.variable} ${tenorSans.variable} ${anticDidone.variable} antialiased`}
        style={{ margin: 0 }}
      >
        <TRPCProvider>{children}</TRPCProvider>
      </body>
    </html>
  );
}
