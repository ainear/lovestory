import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Chọn mẫu thiệp",
    description:
        "50+ mẫu thiệp cưới online đẹp. Đám cưới, sinh nhật, tốt nghiệp. Miễn phí!",
    openGraph: {
        title: "🎨 Mẫu thiệp đẹp — LoveStory",
        description: "50+ mẫu thiệp cưới online. Chọn mẫu và tạo thiệp trong 5 phút!",
    },
};

export default function TemplatesLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
