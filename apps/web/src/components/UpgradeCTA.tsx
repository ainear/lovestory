"use client";

import Link from "next/link";
import type { PlanId } from "@/config/plans";

interface UpgradeCTAProps {
  feature: string;
  requiredPlan: PlanId;
  className?: string;
  compact?: boolean;
}

function getPlanLabel(plan: PlanId): string {
  return plan === "premium" ? "Premium" : "Basic";
}

export default function UpgradeCTA({
  feature,
  requiredPlan,
  className = "",
  compact = false,
}: UpgradeCTAProps) {
  const planLabel = getPlanLabel(requiredPlan);

  if (compact) {
    return (
      <div
        className={`flex items-center gap-2 text-sm text-amber-600 ${className}`}
      >
        <span aria-hidden="true">🔒</span>
        <span>
          Nâng cấp lên {planLabel} để mở khóa {feature}
        </span>
        <Link
          href="/pricing"
          className="ml-1 font-medium underline underline-offset-2 hover:text-amber-700"
        >
          Xem gói
        </Link>
      </div>
    );
  }

  return (
    <div
      className={`rounded-lg border border-amber-300 bg-amber-50 p-5 ${className}`}
    >
      <div className="flex items-center gap-2 text-amber-600">
        <span className="text-2xl" aria-hidden="true">
          🔒
        </span>
        <h3 className="text-lg font-semibold text-amber-800">{feature}</h3>
      </div>

      <p className="mt-2 text-sm text-amber-700">
        Tính năng này yêu cầu gói {planLabel}. Nâng cấp để sử dụng {feature} và
        nhiều tính năng cao cấp khác.
      </p>

      <Link
        href="/pricing"
        className="mt-4 inline-block rounded-md bg-amber-500 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-amber-600"
      >
        Nâng cấp ngay
      </Link>
    </div>
  );
}
