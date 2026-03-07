import type { Metadata } from "next";

// Dynamic OG metadata for social sharing on Zalo/Facebook/Telegram
export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string }>;
}): Promise<Metadata> {
    const { slug } = await params;

    // TODO: fetch real data from DB by slug
    // For now, demo data
    const groomName = "Minh";
    const brideName = "Mai";
    const weddingDate = "15/06/2026";

    const title = `Thiệp mời cưới ${groomName} & ${brideName}`;
    const description = `💌 ${groomName} & ${brideName} trân trọng kính mời quý khách đến chia sẻ niềm vui trong ngày lễ trọng đại — ${weddingDate}`;

    return {
        title,
        description,
        openGraph: {
            type: "website",
            locale: "vi_VN",
            siteName: "LoveStory",
            title: `💒 ${title}`,
            description,
            url: `${process.env.NEXT_PUBLIC_APP_URL || "https://7app.online"}/i/${slug}`,
        },
        twitter: {
            card: "summary_large_image",
            title: `💒 ${title}`,
            description,
        },
        other: {
            "og:image:width": "1200",
            "og:image:height": "630",
        },
    };
}

export default function InvitationLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
