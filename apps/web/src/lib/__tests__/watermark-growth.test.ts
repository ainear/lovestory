import { describe, it, expect } from "vitest";

describe("Sprint 53 — Viral Watermark & K-Factor Growth Engine", () => {
  function generateViralUtmUrl(slug: string, medium: "viral_badge" | "footer_link" = "viral_badge", baseUrl = ""): string {
    const encodedSource = encodeURIComponent(slug || "invitation");
    const prefix = baseUrl || "/";
    const separator = prefix.endsWith("/") ? "?" : "/?";
    return `${prefix}${separator}ref=watermark&source=${encodedSource}&k_factor=1&utm_medium=${medium}`.replace("//?", "/?");
  }

  function shouldShowWatermark(userPlan: string | null | undefined): boolean {
    if (!userPlan) return true;
    return userPlan !== "basic" && userPlan !== "premium";
  }

  it("should generate correct viral UTM tracking URLs for invitation shares on Vercel demo or root path", () => {
    const slug = "minh-mai-wedding";
    const badgeUrl = generateViralUtmUrl(slug, "viral_badge");
    expect(badgeUrl).toBe("/?ref=watermark&source=minh-mai-wedding&k_factor=1&utm_medium=viral_badge");

    const footerUrl = generateViralUtmUrl(slug, "footer_link");
    expect(footerUrl).toBe("/?ref=watermark&source=minh-mai-wedding&k_factor=1&utm_medium=footer_link");

    const vercelDemoUrl = generateViralUtmUrl(slug, "viral_badge", "https://lovestory-demo.vercel.app");
    expect(vercelDemoUrl).toBe("https://lovestory-demo.vercel.app/?ref=watermark&source=minh-mai-wedding&k_factor=1&utm_medium=viral_badge");
  });

  it("should show watermark for free accounts and hide for paid accounts (basic/premium)", () => {
    expect(shouldShowWatermark(null)).toBe(true);
    expect(shouldShowWatermark(undefined)).toBe(true);
    expect(shouldShowWatermark("free")).toBe(true);

    // Paid plans (199K Basic / 299K Premium via SePay VietQR)
    expect(shouldShowWatermark("basic")).toBe(false);
    expect(shouldShowWatermark("premium")).toBe(false);
  });
});
