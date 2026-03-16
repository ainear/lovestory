import Link from "next/link";

export const metadata = {
  title: "Hết lượt xem - LoveStory",
};

export default function LimitReachedPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-b from-rose-50 to-white px-4">
      <div className="max-w-md text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-rose-100">
          <svg
            className="h-10 w-10 text-rose-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
            />
          </svg>
        </div>

        <h1 className="mb-3 text-2xl font-bold text-gray-900">
          Thiệp này đã hết lượt xem trong tháng
        </h1>

        <p className="mb-8 text-gray-600">
          Thiệp mời đã đạt giới hạn lượt xem hàng tháng theo gói hiện tại.
          Chủ thiệp có thể nâng cấp gói để tiếp tục chia sẻ thiệp với mọi
          người.
        </p>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/pricing"
            className="inline-flex items-center justify-center rounded-lg bg-rose-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-rose-700"
          >
            Nâng cấp để tiếp tục
          </Link>

          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50"
          >
            Về trang chủ
          </Link>
        </div>
      </div>
    </main>
  );
}
