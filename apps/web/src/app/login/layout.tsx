import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Đăng nhập — LoveStory",
  description: "Đăng nhập vào LoveStory để tạo và quản lý thiệp cưới online của bạn.",
  robots: { index: false, follow: false }, // login page should not be indexed
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
