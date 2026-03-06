import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: "*",
                allow: "/",
                disallow: ["/dashboard/", "/admin/", "/editor/", "/api/", "/auth/"],
            },
        ],
        sitemap: "https://7app.online/sitemap.xml",
    };
}
