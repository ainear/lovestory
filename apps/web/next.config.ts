import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "img.vietqr.io" },
      { protocol: "https", hostname: "quickchart.io" },
      { protocol: "https", hostname: "*.supabase.co" },
      { protocol: "https", hostname: "cinelove.me" },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/cinelove-cdn/:path*",
        destination: "https://assets.cinelove.me/:path*",
      },
    ];
  },
};

export default nextConfig;
