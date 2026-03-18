import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Thanh toán — LoveStory",
  description: "Nâng cấp thiệp cưới của bạn với gói Basic hoặc Premium.",
  robots: { index: false, follow: false },
};

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
