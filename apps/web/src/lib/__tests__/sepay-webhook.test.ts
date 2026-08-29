import { describe, it, expect } from "vitest";

describe("SePay Webhook Logic & Order Code Extraction", () => {
  // Helper simulating the order code regex extraction in SePay webhook
  function extractOrderCode(content: string): string | null {
    if (!content) return null;
    const match = content.match(/LS[A-Z0-9]+/i);
    return match ? match[0].toUpperCase() : null;
  }

  // Helper simulating amount validation
  function validatePaymentAmount(transferAmount: number, orderAmount: number): boolean {
    return typeof transferAmount === "number" && transferAmount >= orderAmount;
  }

  // Helper simulating signature / secret header check
  function validateWebhookAuth(authHeader: string | null, secret: string | undefined): boolean {
    if (!secret || !authHeader) return false;
    return authHeader === `Bearer ${secret}`;
  }

  it("should extract order code correctly from various bank SMS contents", () => {
    expect(extractOrderCode("LSABCD1234 Thanh toan goi Premium")).toBe("LSABCD1234");
    expect(extractOrderCode("CT tu Nguyen Van A - ls998877ck qua VietQR")).toBe("LS998877CK");
    expect(extractOrderCode("MBBank: +199,000 VND LSX9K2026 nap tien")).toBe("LSX9K2026");
    expect(extractOrderCode("Chuyen tien mua hang khong co ma")).toBeNull();
    expect(extractOrderCode("")).toBeNull();
  });

  it("should validate payment amount accurately", () => {
    expect(validatePaymentAmount(199000, 199000)).toBe(true);
    expect(validatePaymentAmount(200000, 199000)).toBe(true); // Overpayment accepted
    expect(validatePaymentAmount(150000, 199000)).toBe(false); // Underpayment rejected
    expect(validatePaymentAmount(0, 199000)).toBe(false);
  });

  it("should enforce strict webhook secret authorization", () => {
    const SECRET = "sepay_super_secret_key_2026";
    expect(validateWebhookAuth(`Bearer ${SECRET}`, SECRET)).toBe(true);
    expect(validateWebhookAuth("Bearer wrong_secret", SECRET)).toBe(false);
    expect(validateWebhookAuth("Basic xyz", SECRET)).toBe(false);
    expect(validateWebhookAuth(null, SECRET)).toBe(false);
    expect(validateWebhookAuth(`Bearer ${SECRET}`, undefined)).toBe(false);
  });
});
