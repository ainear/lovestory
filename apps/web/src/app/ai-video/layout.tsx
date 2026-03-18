import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Video từ thiệp cưới — LoveStory",
  description:
    "Tạo video đám cưới đẹp tự động từ thiệp mời online. Chỉ 1 click, có nhạc, có hiệu ứng. Export MP4 chất lượng cao.",
  openGraph: {
    title: "🎬 Tạo Video Thiệp Cưới AI — LoveStory",
    description:
      "Biến thiệp cưới thành video tuyệt đẹp tự động. Nhạc nền, hiệu ứng, chuyên nghiệp.",
  },
  robots: { index: true, follow: true },
};

export default function AiVideoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
