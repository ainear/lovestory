"use client";

import { useState } from "react";
import { trpc } from "@/lib/trpc/client";

const STATUS_CONFIG = {
  pending: { label: "Chờ", color: "#6b7280", bg: "#f3f4f6" },
  invited: { label: "Đã mời", color: "#3b82f6", bg: "#eff6ff" },
  confirmed: { label: "Xác nhận", color: "#10b981", bg: "#ecfdf5" },
  declined: { label: "Từ chối", color: "#ef4444", bg: "#fef2f2" },
} as const;

type GuestStatus = keyof typeof STATUS_CONFIG;

interface Project {
  id: string;
  title: string;
  slug: string;
}

interface GuestListProps {
  projects: Project[];
  appUrl: string;
}

export function GuestList({ projects, appUrl }: GuestListProps) {
  const [selectedProjectId, setSelectedProjectId] = useState(
    projects[0]?.id || "",
  );
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [adding, setAdding] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [error, setError] = useState("");
  // Sprint 43: batch import + bulk copy
  const [showBatchImport, setShowBatchImport] = useState(false);
  const [batchText, setBatchText] = useState("");
  const [batchImporting, setBatchImporting] = useState(false);
  const [bulkCopied, setBulkCopied] = useState(false);

  const selectedProject = projects.find((p) => p.id === selectedProjectId);

  const { data: guests = [], refetch } = trpc.guest.listGuests.useQuery(
    { projectId: selectedProjectId },
    { enabled: !!selectedProjectId },
  );

  const addGuest = trpc.guest.addGuest.useMutation({
    onSuccess: () => {
      setName("");
      setEmail("");
      setPhone("");
      setAdding(false);
      setError("");
      refetch();
    },
    onError: (e) => setError(e.message),
  });

  const deleteGuest = trpc.guest.deleteGuest.useMutation({
    onSuccess: () => refetch(),
  });

  const handleAdd = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name.trim()) return;
    if (!selectedProjectId) return;
    addGuest.mutate({
      projectId: selectedProjectId,
      name: name.trim(),
      email,
      phone,
    });
  };

  const getGuestLink = (guestName: string) => {
    const slug = selectedProject?.slug;
    if (!slug) return "";
    return `${appUrl}/i/${slug}?guest=${encodeURIComponent(guestName)}`;
  };

  const copyLink = (guestName: string) => {
    const link = getGuestLink(guestName);
    if (!link) return;
    navigator.clipboard.writeText(link).then(() => {
      setCopied(guestName);
      setTimeout(() => setCopied(null), 2000);
    });
  };

  // Sprint 43: Batch import — one name per line
  const handleBatchImport = async () => {
    if (!batchText.trim() || !selectedProjectId) return;
    setBatchImporting(true);
    const names = batchText
      .split("\n")
      .map((n) => n.trim())
      .filter(Boolean);
    for (const gName of names) {
      try {
        await addGuest.mutateAsync({
          projectId: selectedProjectId,
          name: gName,
          email: "",
          phone: "",
        });
      } catch {
        /* skip duplicates */
      }
    }
    setBatchText("");
    setShowBatchImport(false);
    setBatchImporting(false);
    refetch();
  };

  // Sprint 43: Bulk copy all links
  const handleBulkCopy = () => {
    if (!selectedProject?.slug || guests.length === 0) return;
    const allLinks = guests
      .map((g: { name: string }) => `${g.name}: ${getGuestLink(g.name)}`)
      .join("\n");
    navigator.clipboard.writeText(allLinks).then(() => {
      setBulkCopied(true);
      setTimeout(() => setBulkCopied(false), 3000);
    });
  };

  // Sprint 43: Export CSV
  const handleExportCSV = () => {
    if (guests.length === 0) return;
    const header = "Tên,Email,SĐT,Trạng thái,Link thiệp\n";
    const rows = guests
      .map(
        (g: {
          name: string;
          email?: string | null;
          phone?: string | null;
          status: string;
        }) =>
          `"${g.name}","${g.email || ""}","${g.phone || ""}","${g.status}","${getGuestLink(g.name)}"`,
      )
      .join("\n");
    const blob = new Blob([header + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `guests_${selectedProject?.slug || "export"}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Sprint 43: Share via Zalo
  const shareZalo = (guestName: string) => {
    const link = getGuestLink(guestName);
    const text = `Thiệp mời cưới dành riêng cho ${guestName} 💌`;
    window.open(
      `https://zalo.me/share?url=${encodeURIComponent(link)}&title=${encodeURIComponent(text)}`,
      "_blank",
    );
  };

  // Sprint 43: Share via SMS
  const shareSMS = (guestName: string, guestPhone?: string | null) => {
    const link = getGuestLink(guestName);
    const text = `Thư mời cưới dành cho ${guestName}: ${link}`;
    window.open(`sms:${guestPhone || ""}?body=${encodeURIComponent(text)}`);
  };

  // Sprint 43: Share via Facebook
  const shareFB = (guestName: string) => {
    const link = getGuestLink(guestName);
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(link)}`,
      "_blank",
    );
  };

  return (
    <div>
      {/* Project Selector */}
      {projects.length > 1 && (
        <div style={{ marginBottom: 24 }}>
          <label
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: "#374151",
              display: "block",
              marginBottom: 8,
            }}
          >
            Thiệp:
          </label>
          <select
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
            style={{
              padding: "10px 16px",
              borderRadius: 10,
              border: "1px solid #e5e7eb",
              fontSize: 14,
              color: "#1f2937",
              background: "#fff",
              cursor: "pointer",
              minWidth: 240,
              outline: "none",
            }}
          >
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title || p.slug}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Add Guest Form */}
      <div
        style={{
          background: "#fff",
          borderRadius: 16,
          padding: 24,
          border: "1px solid #e8e8ec",
          marginBottom: 24,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 16,
          }}
        >
          <h3
            style={{
              fontSize: 15,
              fontWeight: 700,
              color: "#1f2937",
              margin: 0,
            }}
          >
            ➕ Thêm khách mời
          </h3>
          <button
            onClick={() => setShowBatchImport(!showBatchImport)}
            style={{
              padding: "6px 14px",
              borderRadius: 8,
              border: "1px solid #e5e7eb",
              background: showBatchImport ? "#fdf2f8" : "#fff",
              color: showBatchImport ? "#be185d" : "#6b7280",
              fontSize: 12,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            📋 {showBatchImport ? "Nhập từng người" : "Nhập hàng loạt"}
          </button>
        </div>

        {/* Sprint 43: Batch Import */}
        {showBatchImport ? (
          <div>
            <p style={{ fontSize: 12, color: "#6b7280", margin: "0 0 8px" }}>
              Mỗi dòng một tên khách mời. Ví dụ:
            </p>
            <textarea
              value={batchText}
              onChange={(e) => setBatchText(e.target.value)}
              placeholder={"Nguyễn Văn A\nTrần Thị B\nLê Văn C\nPhạm Thị D"}
              rows={6}
              style={{
                width: "100%",
                padding: "12px 14px",
                borderRadius: 10,
                border: "1px solid #e5e7eb",
                fontSize: 14,
                outline: "none",
                resize: "vertical",
                fontFamily: "inherit",
                boxSizing: "border-box",
              }}
            />
            <div
              style={{
                display: "flex",
                gap: 8,
                marginTop: 12,
                alignItems: "center",
              }}
            >
              <button
                onClick={handleBatchImport}
                disabled={batchImporting || !batchText.trim()}
                style={{
                  padding: "10px 20px",
                  borderRadius: 10,
                  border: "none",
                  background: batchImporting
                    ? "#e5e7eb"
                    : "linear-gradient(135deg, #ff6b9d, #c084fc)",
                  color: batchImporting ? "#9ca3af" : "#fff",
                  fontSize: 14,
                  fontWeight: 700,
                  cursor: batchImporting ? "not-allowed" : "pointer",
                }}
              >
                {batchImporting
                  ? "Đang thêm..."
                  : `📋 Thêm ${batchText.split("\n").filter((l) => l.trim()).length} khách`}
              </button>
              <span style={{ fontSize: 12, color: "#9ca3af" }}>
                {batchText.split("\n").filter((l) => l.trim()).length} tên
              </span>
            </div>
          </div>
        ) : (
          <form onSubmit={handleAdd}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr auto",
                gap: 12,
                alignItems: "end",
              }}
            >
              <div>
                <label
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: "#6b7280",
                    display: "block",
                    marginBottom: 4,
                  }}
                >
                  Tên khách mời *
                </label>
                <input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nguyễn Văn A"
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    borderRadius: 10,
                    border: "1px solid #e5e7eb",
                    fontSize: 14,
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
              </div>
              <div>
                <label
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: "#6b7280",
                    display: "block",
                    marginBottom: 4,
                  }}
                >
                  Email (tuỳ chọn)
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="guest@email.com"
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    borderRadius: 10,
                    border: "1px solid #e5e7eb",
                    fontSize: 14,
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
              </div>
              <div>
                <label
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: "#6b7280",
                    display: "block",
                    marginBottom: 4,
                  }}
                >
                  SĐT (tuỳ chọn)
                </label>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="0901234567"
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    borderRadius: 10,
                    border: "1px solid #e5e7eb",
                    fontSize: 14,
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
              </div>
              <button
                type="submit"
                disabled={addGuest.isPending || !name.trim()}
                style={{
                  padding: "10px 20px",
                  borderRadius: 10,
                  border: "none",
                  background: addGuest.isPending
                    ? "#e5e7eb"
                    : "linear-gradient(135deg, #ff6b9d, #c084fc)",
                  color: addGuest.isPending ? "#9ca3af" : "#fff",
                  fontSize: 14,
                  fontWeight: 700,
                  cursor: addGuest.isPending ? "not-allowed" : "pointer",
                  whiteSpace: "nowrap",
                }}
              >
                {addGuest.isPending ? "Đang thêm..." : "Thêm"}
              </button>
            </div>
            {error && (
              <p style={{ color: "#ef4444", fontSize: 13, margin: "8px 0 0" }}>
                ❌ {error}
              </p>
            )}
          </form>
        )}
      </div>

      {/* Guest count + Actions */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 16,
          flexWrap: "wrap",
          gap: 8,
        }}
      >
        <h3
          style={{ fontSize: 15, fontWeight: 700, color: "#1f2937", margin: 0 }}
        >
          👥 Danh sách ({guests.length} khách)
        </h3>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {guests.length > 0 && (
            <>
              <button
                onClick={handleBulkCopy}
                style={{
                  padding: "6px 14px",
                  borderRadius: 8,
                  border: "1px solid #e5e7eb",
                  background: bulkCopied ? "#ecfdf5" : "#fff",
                  color: bulkCopied ? "#10b981" : "#374151",
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                {bulkCopied ? "✅ Đã copy tất cả" : "📋 Copy tất cả link"}
              </button>
              <button
                onClick={handleExportCSV}
                style={{
                  padding: "6px 14px",
                  borderRadius: 8,
                  border: "1px solid #e5e7eb",
                  background: "#fff",
                  color: "#374151",
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                📥 Xuất CSV
              </button>
            </>
          )}
        </div>
      </div>

      {/* Link format hint */}
      {selectedProject && (
        <p style={{ fontSize: 12, color: "#9ca3af", margin: "0 0 12px" }}>
          Link thiệp:{" "}
          <code
            style={{
              background: "#f3f4f6",
              padding: "2px 6px",
              borderRadius: 4,
              fontSize: 11,
            }}
          >
            /i/{selectedProject.slug}?guest=Tên
          </code>
        </p>
      )}

      {/* Empty state */}
      {guests.length === 0 && (
        <div
          style={{
            background: "#fff",
            borderRadius: 16,
            padding: "40px 24px",
            textAlign: "center",
            border: "1px solid #e8e8ec",
          }}
        >
          <p style={{ fontSize: 36, margin: "0 0 12px" }}>👥</p>
          <p style={{ fontSize: 14, color: "#6b7280", margin: 0 }}>
            Chưa có khách mời nào. Thêm khách ở trên để bắt đầu!
          </p>
        </div>
      )}

      {/* Guest Table */}
      {guests.length > 0 && (
        <div
          style={{
            background: "#fff",
            borderRadius: 16,
            border: "1px solid #e8e8ec",
            overflow: "hidden",
          }}
        >
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f9fafb" }}>
                {[
                  "Tên khách mời",
                  "Email",
                  "SĐT",
                  "Trạng thái",
                  "Hành động",
                ].map((h, i) => (
                  <th
                    key={i}
                    style={{
                      padding: "12px 16px",
                      fontSize: 12,
                      fontWeight: 700,
                      color: "#6b7280",
                      textAlign: "left",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      borderBottom: "1px solid #e5e7eb",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {guests.map(
                (
                  guest: {
                    id: string;
                    name: string;
                    email?: string | null;
                    phone?: string | null;
                    status: string;
                    created_at: string;
                  },
                  i: number,
                ) => {
                  const s =
                    STATUS_CONFIG[guest.status as GuestStatus] ||
                    STATUS_CONFIG.pending;
                  return (
                    <tr
                      key={guest.id}
                      style={{
                        borderTop: i > 0 ? "1px solid #f3f4f6" : "none",
                      }}
                    >
                      <td
                        style={{
                          padding: "14px 16px",
                          fontSize: 14,
                          fontWeight: 600,
                          color: "#1f2937",
                        }}
                      >
                        {guest.name}
                      </td>
                      <td
                        style={{
                          padding: "14px 16px",
                          fontSize: 13,
                          color: "#6b7280",
                        }}
                      >
                        {guest.email || "—"}
                      </td>
                      <td
                        style={{
                          padding: "14px 16px",
                          fontSize: 13,
                          color: "#6b7280",
                        }}
                      >
                        {guest.phone || "—"}
                      </td>
                      <td style={{ padding: "14px 16px" }}>
                        <span
                          style={{
                            fontSize: 11,
                            fontWeight: 600,
                            color: s.color,
                            background: s.bg,
                            padding: "3px 8px",
                            borderRadius: 6,
                          }}
                        >
                          {s.label}
                        </span>
                      </td>
                      <td style={{ padding: "14px 16px" }}>
                        <div
                          style={{ display: "flex", gap: 4, flexWrap: "wrap" }}
                        >
                          <button
                            onClick={() => copyLink(guest.name)}
                            title="Copy link"
                            style={{
                              padding: "5px 10px",
                              borderRadius: 6,
                              border: "1px solid #e5e7eb",
                              background:
                                copied === guest.name ? "#ecfdf5" : "#fff",
                              color:
                                copied === guest.name ? "#10b981" : "#374151",
                              fontSize: 11,
                              fontWeight: 600,
                              cursor: "pointer",
                            }}
                          >
                            {copied === guest.name ? "✅" : "🔗"}
                          </button>
                          <button
                            onClick={() => shareZalo(guest.name)}
                            title="Gửi Zalo"
                            style={{
                              padding: "5px 10px",
                              borderRadius: 6,
                              border: "1px solid #e5e7eb",
                              background: "#fff",
                              color: "#0068ff",
                              fontSize: 11,
                              fontWeight: 700,
                              cursor: "pointer",
                            }}
                          >
                            Z
                          </button>
                          <button
                            onClick={() => shareSMS(guest.name, guest.phone)}
                            title="Gửi SMS"
                            style={{
                              padding: "5px 10px",
                              borderRadius: 6,
                              border: "1px solid #e5e7eb",
                              background: "#fff",
                              color: "#10b981",
                              fontSize: 11,
                              fontWeight: 600,
                              cursor: "pointer",
                            }}
                          >
                            💬
                          </button>
                          <button
                            onClick={() => shareFB(guest.name)}
                            title="Facebook"
                            style={{
                              padding: "5px 10px",
                              borderRadius: 6,
                              border: "1px solid #e5e7eb",
                              background: "#fff",
                              color: "#1877f2",
                              fontSize: 11,
                              fontWeight: 700,
                              cursor: "pointer",
                            }}
                          >
                            f
                          </button>
                          <button
                            onClick={() =>
                              deleteGuest.mutate({ guestId: guest.id })
                            }
                            disabled={deleteGuest.isPending}
                            title="Xóa"
                            style={{
                              padding: "5px 10px",
                              borderRadius: 6,
                              border: "1px solid #fee2e2",
                              background: "#fff5f5",
                              color: "#ef4444",
                              fontSize: 11,
                              fontWeight: 600,
                              cursor: "pointer",
                            }}
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                },
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* ── RSVP & Wishes Section ── */}
      <RsvpWishesSection projectId={selectedProjectId} />

      <style>{`
                @media (max-width: 768px) {
                    div[style*="repeat(4, 1fr)"] { grid-template-columns: 1fr !important; }
                }
            `}</style>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  RSVP & Wishes Section                                              */
/* ------------------------------------------------------------------ */

const RSVP_STATUS_STYLE = {
  confirmed: { label: "Xác nhận", color: "#10b981", bg: "#ecfdf5" },
  declined: { label: "Từ chối", color: "#ef4444", bg: "#fef2f2" },
  maybe: { label: "Có thể", color: "#f59e0b", bg: "#fffbeb" },
} as const;

function RsvpWishesSection({ projectId }: { projectId: string }) {
  const { data: rsvps = [] } = trpc.guest.listRsvps.useQuery(
    { projectId },
    { enabled: !!projectId },
  );
  const { data: wishes = [] } = trpc.guest.getWishes.useQuery(
    { projectId },
    { enabled: !!projectId },
  );

  const confirmed = rsvps.filter(
    (r: { status: string }) => r.status === "confirmed",
  ).length;
  const declined = rsvps.filter(
    (r: { status: string }) => r.status === "declined",
  ).length;
  const maybe = rsvps.filter(
    (r: { status: string }) => r.status === "maybe",
  ).length;
  const totalGuests = rsvps
    .filter(
      (r: { status: string; guest_count?: number }) => r.status === "confirmed",
    )
    .reduce(
      (acc: number, r: { guest_count?: number }) => acc + (r.guest_count ?? 1),
      0,
    );

  const statsCards = [
    {
      label: "Xác nhận",
      count: confirmed,
      icon: "✅",
      color: "#10b981",
      bg: "#ecfdf5",
    },
    {
      label: "Từ chối",
      count: declined,
      icon: "❌",
      color: "#ef4444",
      bg: "#fef2f2",
    },
    {
      label: "Có thể",
      count: maybe,
      icon: "🤔",
      color: "#f59e0b",
      bg: "#fffbeb",
    },
    {
      label: "Tổng khách",
      count: totalGuests,
      icon: "👥",
      color: "#3b82f6",
      bg: "#eff6ff",
    },
    {
      label: "Lời chúc",
      count: wishes.length,
      icon: "💌",
      color: "#c084fc",
      bg: "#faf5ff",
    },
  ];

  return (
    <div style={{ marginTop: 32 }}>
      {/* Stats Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(5, 1fr)",
          gap: 12,
          marginBottom: 24,
        }}
      >
        {statsCards.map((s) => (
          <div
            key={s.label}
            style={{
              background: s.bg,
              borderRadius: 12,
              padding: "16px 12px",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: 24, marginBottom: 4 }}>{s.icon}</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: s.color }}>
              {s.count}
            </div>
            <div style={{ fontSize: 11, color: "#6b7280", fontWeight: 600 }}>
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {/* RSVP Table */}
      <div
        style={{
          background: "#fff",
          borderRadius: 16,
          border: "1px solid #e8e8ec",
          overflow: "hidden",
          marginBottom: 24,
        }}
      >
        <div
          style={{
            padding: "16px 20px",
            borderBottom: "1px solid #e5e7eb",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <span style={{ fontSize: 16 }}>📋</span>
          <h3
            style={{
              fontSize: 15,
              fontWeight: 700,
              color: "#1f2937",
              margin: 0,
            }}
          >
            Phản hồi RSVP ({rsvps.length})
          </h3>
        </div>
        {rsvps.length === 0 ? (
          <div
            style={{
              padding: "32px 20px",
              textAlign: "center",
              color: "#9ca3af",
              fontSize: 13,
            }}
          >
            Chưa có phản hồi
          </div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f9fafb" }}>
                {["Tên", "Trạng thái", "Số khách", "SĐT", "Thời gian"].map(
                  (h) => (
                    <th
                      key={h}
                      style={{
                        padding: "10px 16px",
                        fontSize: 11,
                        fontWeight: 700,
                        color: "#6b7280",
                        textAlign: "left",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                        borderBottom: "1px solid #e5e7eb",
                      }}
                    >
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {rsvps.map(
                (
                  r: {
                    id?: string;
                    guest_name: string;
                    status: string;
                    guest_count?: number;
                    phone?: string;
                    created_at: string;
                  },
                  i: number,
                ) => {
                  const st =
                    RSVP_STATUS_STYLE[
                      r.status as keyof typeof RSVP_STATUS_STYLE
                    ] || RSVP_STATUS_STYLE.maybe;
                  return (
                    <tr
                      key={r.id ?? i}
                      style={{
                        borderTop: i > 0 ? "1px solid #f3f4f6" : "none",
                      }}
                    >
                      <td
                        style={{
                          padding: "12px 16px",
                          fontSize: 13,
                          fontWeight: 600,
                          color: "#1f2937",
                        }}
                      >
                        {r.guest_name}
                      </td>
                      <td style={{ padding: "12px 16px" }}>
                        <span
                          style={{
                            fontSize: 11,
                            fontWeight: 600,
                            color: st.color,
                            background: st.bg,
                            padding: "3px 8px",
                            borderRadius: 6,
                          }}
                        >
                          {st.label}
                        </span>
                      </td>
                      <td
                        style={{
                          padding: "12px 16px",
                          fontSize: 13,
                          color: "#6b7280",
                        }}
                      >
                        {r.guest_count ?? 1}
                      </td>
                      <td
                        style={{
                          padding: "12px 16px",
                          fontSize: 13,
                          color: "#6b7280",
                        }}
                      >
                        {r.phone || "—"}
                      </td>
                      <td
                        style={{
                          padding: "12px 16px",
                          fontSize: 12,
                          color: "#9ca3af",
                        }}
                      >
                        {formatRelativeTime(r.created_at)}
                      </td>
                    </tr>
                  );
                },
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Wishes Feed */}
      <div
        style={{
          background: "#fff",
          borderRadius: 16,
          border: "1px solid #e8e8ec",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            padding: "16px 20px",
            borderBottom: "1px solid #e5e7eb",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <span style={{ fontSize: 16 }}>💌</span>
          <h3
            style={{
              fontSize: 15,
              fontWeight: 700,
              color: "#1f2937",
              margin: 0,
            }}
          >
            Lời chúc ({wishes.length})
          </h3>
        </div>
        {wishes.length === 0 ? (
          <div
            style={{
              padding: "32px 20px",
              textAlign: "center",
              color: "#9ca3af",
              fontSize: 13,
            }}
          >
            Chưa có lời chúc
          </div>
        ) : (
          <div
            style={{
              padding: "12px 20px",
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}
          >
            {wishes.map(
              (w: {
                id: string;
                guest_name: string;
                message: string;
                emoji?: string;
                created_at: string;
              }) => (
                <div
                  key={w.id}
                  style={{
                    padding: "12px 16px",
                    borderRadius: 12,
                    background: "#faf5ff",
                    border: "1px solid #f3e8ff",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      marginBottom: 6,
                    }}
                  >
                    <span style={{ fontSize: 18 }}>{w.emoji || "💝"}</span>
                    <span
                      style={{
                        fontSize: 13,
                        fontWeight: 700,
                        color: "#1f2937",
                      }}
                    >
                      {w.guest_name}
                    </span>
                    <span
                      style={{
                        fontSize: 11,
                        color: "#9ca3af",
                        marginLeft: "auto",
                      }}
                    >
                      {formatRelativeTime(w.created_at)}
                    </span>
                  </div>
                  <p
                    style={{
                      fontSize: 13,
                      color: "#4b5563",
                      margin: 0,
                      lineHeight: 1.5,
                    }}
                  >
                    {w.message}
                  </p>
                </div>
              ),
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function formatRelativeTime(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diff = now - then;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Vừa xong";
  if (mins < 60) return `${mins} phút trước`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} giờ trước`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} ngày trước`;
  return new Date(dateStr).toLocaleDateString("vi-VN");
}
