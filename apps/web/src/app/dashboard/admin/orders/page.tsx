"use client";

import { useCallback, useEffect, useState } from "react";
import { formatPrice } from "@/config/plans";

type OrderStatus = "pending" | "paid" | "cancelled";

interface Order {
  id: string;
  order_code: string;
  plan: string;
  amount: number;
  status: OrderStatus;
  payment_method: string;
  created_at: string;
  paid_at: string | null;
  user_id: string;
  user: {
    email: string;
    full_name: string | null;
  } | null;
}

const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "Cho xu xac nhan",
  paid: "Da thanh toan",
  cancelled: "Da huy",
};

const STATUS_COLORS: Record<OrderStatus, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  paid: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

const TABS: { label: string; value: OrderStatus | "all" }[] = [
  { label: "Tat ca", value: "all" },
  { label: "Cho xac nhan", value: "pending" },
  { label: "Da thanh toan", value: "paid" },
  { label: "Da huy", value: "cancelled" },
];

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<OrderStatus | "all">("all");
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const params = activeTab !== "all" ? `?status=${activeTab}` : "";
      const res = await fetch(`/api/admin/orders${params}`);
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to fetch");
      }
      const data = await res.json();
      setOrders(data.orders);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to load orders";
      setToast({ message, type: "error" });
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(timer);
  }, [toast]);

  async function handleAction(orderId: string, action: "confirm" | "cancel") {
    const confirmMsg =
      action === "confirm"
        ? "Xac nhan thanh toan don hang nay?"
        : "Huy don hang nay?";

    if (!window.confirm(confirmMsg)) return;

    setActionLoading(orderId);
    try {
      const res = await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, action }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Action failed");
      }

      setToast({
        message:
          action === "confirm" ? "Da xac nhan thanh toan!" : "Da huy don hang!",
        type: "success",
      });

      await fetchOrders();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Action failed";
      setToast({ message, type: "error" });
    } finally {
      setActionLoading(null);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-6 text-2xl font-bold text-gray-900">
          Quan ly don hang
        </h1>

        {/* Filter Tabs */}
        <div className="mb-6 flex flex-wrap gap-2">
          {TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === tab.value
                  ? "bg-purple-600 text-white"
                  : "bg-white text-gray-600 hover:bg-gray-100"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Toast */}
        {toast && (
          <div
            className={`mb-4 rounded-lg px-4 py-3 text-sm font-medium ${
              toast.type === "success"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {toast.message}
          </div>
        )}

        {/* Table */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-purple-200 border-t-purple-600" />
          </div>
        ) : orders.length === 0 ? (
          <div className="rounded-xl bg-white p-12 text-center text-gray-500 shadow-sm">
            Khong co don hang nao.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl bg-white shadow-sm">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b bg-gray-50 text-xs font-semibold uppercase tracking-wider text-gray-500">
                  <th className="px-4 py-3">Ma don</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Goi</th>
                  <th className="px-4 py-3">So tien</th>
                  <th className="px-4 py-3">Trang thai</th>
                  <th className="px-4 py-3">Ngay tao</th>
                  <th className="px-4 py-3">Thao tac</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="whitespace-nowrap px-4 py-3 font-mono text-xs font-medium text-gray-900">
                      {order.order_code}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      <div className="max-w-[200px] truncate">
                        {order.user?.email ?? "N/A"}
                      </div>
                      {order.user?.full_name && (
                        <div className="text-xs text-gray-400">
                          {order.user.full_name}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-block rounded-full bg-purple-50 px-2 py-0.5 text-xs font-semibold capitalize text-purple-700">
                        {order.plan}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 font-medium text-gray-900">
                      {formatPrice(order.amount)}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${STATUS_COLORS[order.status]}`}
                      >
                        {STATUS_LABELS[order.status]}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-xs text-gray-500">
                      {formatDate(order.created_at)}
                      {order.paid_at && (
                        <div className="text-green-600">
                          TT: {formatDate(order.paid_at)}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {order.status === "pending" ? (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleAction(order.id, "confirm")}
                            disabled={actionLoading === order.id}
                            className="rounded-lg bg-green-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-green-700 disabled:opacity-50"
                          >
                            {actionLoading === order.id ? "..." : "Xac nhan"}
                          </button>
                          <button
                            onClick={() => handleAction(order.id, "cancel")}
                            disabled={actionLoading === order.id}
                            className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-red-700 disabled:opacity-50"
                          >
                            Huy
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400">--</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Summary */}
        {!loading && orders.length > 0 && (
          <div className="mt-4 text-sm text-gray-500">
            Hien thi {orders.length} don hang
          </div>
        )}
      </div>
    </div>
  );
}
