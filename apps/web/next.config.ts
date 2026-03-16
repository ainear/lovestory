import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "img.vietqr.io" },
      { protocol: "https", hostname: "quickchart.io" },
      { protocol: "https", hostname: "*.supabase.co" },
      // Sprint 55: cinelove.me removed — templates are now self-hosted
    ],
  },
  // Security headers
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
          {
            key: "Content-Security-Policy",
            value:
              "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data: https:; connect-src 'self' https:; media-src 'self' https:; frame-src 'self' https://www.youtube.com https://www.google.com",
          },
        ],
      },
    ];
  },
  // Sprint 55: CDN proxy removed — all 75 thumbnails self-hosted in public/templates/
  // Backward-compatible redirect for old canvas_json data referencing /cinelove-cdn/
  async redirects() {
    return [
      {
        source: "/cinelove-cdn/templates/long_thumbnail/:filename",
        destination: "/templates/:filename",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
