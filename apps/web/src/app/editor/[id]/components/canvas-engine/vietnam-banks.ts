export interface VietBank {
  name: string;
  shortName: string;
  bin: string;
}

export const VIETNAM_BANKS: VietBank[] = [
  { name: "Vietcombank", shortName: "VCB", bin: "970436" },
  { name: "Techcombank", shortName: "TCB", bin: "970407" },
  { name: "MB Bank", shortName: "MB", bin: "970422" },
  { name: "ACB", shortName: "ACB", bin: "970416" },
  { name: "BIDV", shortName: "BIDV", bin: "970418" },
  { name: "VPBank", shortName: "VPB", bin: "970432" },
  { name: "TPBank", shortName: "TPB", bin: "970423" },
  { name: "Agribank", shortName: "AGR", bin: "970405" },
  { name: "Sacombank", shortName: "STB", bin: "970403" },
  { name: "VietinBank", shortName: "CTG", bin: "970415" },
];

/**
 * Build VietQR image URL.
 * Format: https://img.vietqr.io/image/{bankBin}-{accountNumber}-compact.jpg
 */
export function buildVietQrUrl(
  bankBin: string,
  accountNumber: string,
  amount?: string,
  note?: string,
): string {
  const base = `https://img.vietqr.io/image/${bankBin}-${encodeURIComponent(accountNumber)}-compact.jpg`;
  const params = new URLSearchParams();
  if (amount) params.set("amount", amount);
  if (note) params.set("addInfo", note);
  const qs = params.toString();
  return qs ? `${base}?${qs}` : base;
}
