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
    const [selectedProjectId, setSelectedProjectId] = useState(projects[0]?.id || "");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [adding, setAdding] = useState(false);
    const [copied, setCopied] = useState<string | null>(null);
    const [error, setError] = useState("");

    const selectedProject = projects.find(p => p.id === selectedProjectId);

    const { data: guests = [], refetch } = trpc.guest.listGuests.useQuery(
        { projectId: selectedProjectId },
        { enabled: !!selectedProjectId },
    );

    const addGuest = trpc.guest.addGuest.useMutation({
        onSuccess: () => {
            setName(""); setEmail(""); setPhone(""); setAdding(false); setError("");
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
        addGuest.mutate({ projectId: selectedProjectId, name: name.trim(), email, phone });
    };

    const copyLink = (guestName: string) => {
        const slug = selectedProject?.slug;
        if (!slug) return;
        const link = `${appUrl}/i/${slug}?guest=${encodeURIComponent(guestName)}`;
        navigator.clipboard.writeText(link).then(() => {
            setCopied(guestName);
            setTimeout(() => setCopied(null), 2000);
        });
    };

    return (
        <div>
            {/* Project Selector */}
            {projects.length > 1 && (
                <div style={{ marginBottom: 24 }}>
                    <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 8 }}>
                        Thiệp:
                    </label>
                    <select
                        value={selectedProjectId}
                        onChange={e => setSelectedProjectId(e.target.value)}
                        style={{
                            padding: "10px 16px", borderRadius: 10, border: "1px solid #e5e7eb",
                            fontSize: 14, color: "#1f2937", background: "#fff", cursor: "pointer",
                            minWidth: 240, outline: "none",
                        }}
                    >
                        {projects.map(p => (
                            <option key={p.id} value={p.id}>{p.title || p.slug}</option>
                        ))}
                    </select>
                </div>
            )}

            {/* Add Guest Form */}
            <div style={{
                background: "#fff", borderRadius: 16, padding: 24,
                border: "1px solid #e8e8ec", marginBottom: 24,
            }}>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: "#1f2937", margin: "0 0 16px" }}>
                    ➕ Thêm khách mời
                </h3>
                <form onSubmit={handleAdd}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr auto", gap: 12, alignItems: "end" }}>
                        <div>
                            <label style={{ fontSize: 12, fontWeight: 600, color: "#6b7280", display: "block", marginBottom: 4 }}>
                                Tên khách mời *
                            </label>
                            <input
                                required
                                value={name}
                                onChange={e => setName(e.target.value)}
                                placeholder="Nguyễn Văn A"
                                style={{
                                    width: "100%", padding: "10px 14px", borderRadius: 10,
                                    border: "1px solid #e5e7eb", fontSize: 14, outline: "none",
                                    boxSizing: "border-box",
                                }}
                            />
                        </div>
                        <div>
                            <label style={{ fontSize: 12, fontWeight: 600, color: "#6b7280", display: "block", marginBottom: 4 }}>
                                Email (tuỳ chọn)
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                placeholder="guest@email.com"
                                style={{
                                    width: "100%", padding: "10px 14px", borderRadius: 10,
                                    border: "1px solid #e5e7eb", fontSize: 14, outline: "none",
                                    boxSizing: "border-box",
                                }}
                            />
                        </div>
                        <div>
                            <label style={{ fontSize: 12, fontWeight: 600, color: "#6b7280", display: "block", marginBottom: 4 }}>
                                SĐT (tuỳ chọn)
                            </label>
                            <input
                                value={phone}
                                onChange={e => setPhone(e.target.value)}
                                placeholder="0901234567"
                                style={{
                                    width: "100%", padding: "10px 14px", borderRadius: 10,
                                    border: "1px solid #e5e7eb", fontSize: 14, outline: "none",
                                    boxSizing: "border-box",
                                }}
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={addGuest.isPending || !name.trim()}
                            style={{
                                padding: "10px 20px", borderRadius: 10, border: "none",
                                background: addGuest.isPending ? "#e5e7eb" : "linear-gradient(135deg, #ff6b9d, #c084fc)",
                                color: addGuest.isPending ? "#9ca3af" : "#fff",
                                fontSize: 14, fontWeight: 700, cursor: addGuest.isPending ? "not-allowed" : "pointer",
                                whiteSpace: "nowrap",
                            }}
                        >
                            {addGuest.isPending ? "Đang thêm..." : "Thêm"}
                        </button>
                    </div>
                    {error && <p style={{ color: "#ef4444", fontSize: 13, margin: "8px 0 0" }}>❌ {error}</p>}
                </form>
            </div>

            {/* Guest count */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: "#1f2937", margin: 0 }}>
                    👥 Danh sách ({guests.length} khách)
                </h3>
                {selectedProject && (
                    <p style={{ fontSize: 12, color: "#9ca3af", margin: 0 }}>
                        Link thiệp: <code style={{ background: "#f3f4f6", padding: "2px 6px", borderRadius: 4, fontSize: 11 }}>
                            /i/{selectedProject.slug}?guest=Tên
                        </code>
                    </p>
                )}
            </div>

            {/* Empty state */}
            {guests.length === 0 && (
                <div style={{
                    background: "#fff", borderRadius: 16, padding: "40px 24px",
                    textAlign: "center", border: "1px solid #e8e8ec",
                }}>
                    <p style={{ fontSize: 36, margin: "0 0 12px" }}>👥</p>
                    <p style={{ fontSize: 14, color: "#6b7280", margin: 0 }}>
                        Chưa có khách mời nào. Thêm khách ở trên để bắt đầu!
                    </p>
                </div>
            )}

            {/* Guest Table */}
            {guests.length > 0 && (
                <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #e8e8ec", overflow: "hidden" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                            <tr style={{ background: "#f9fafb" }}>
                                {["Tên khách mời", "Email", "SĐT", "Trạng thái", "Hành động"].map((h, i) => (
                                    <th key={i} style={{
                                        padding: "12px 16px", fontSize: 12, fontWeight: 700,
                                        color: "#6b7280", textAlign: "left", textTransform: "uppercase",
                                        letterSpacing: "0.05em", borderBottom: "1px solid #e5e7eb",
                                    }}>
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {guests.map((guest: { id: string; name: string; email?: string | null; phone?: string | null; status: string; created_at: string }, i: number) => {

                                const s = STATUS_CONFIG[guest.status as GuestStatus] || STATUS_CONFIG.pending;
                                return (
                                    <tr
                                        key={guest.id}
                                        style={{ borderTop: i > 0 ? "1px solid #f3f4f6" : "none" }}
                                    >
                                        <td style={{ padding: "14px 16px", fontSize: 14, fontWeight: 600, color: "#1f2937" }}>
                                            {guest.name}
                                        </td>
                                        <td style={{ padding: "14px 16px", fontSize: 13, color: "#6b7280" }}>
                                            {guest.email || "—"}
                                        </td>
                                        <td style={{ padding: "14px 16px", fontSize: 13, color: "#6b7280" }}>
                                            {guest.phone || "—"}
                                        </td>
                                        <td style={{ padding: "14px 16px" }}>
                                            <span style={{
                                                fontSize: 11, fontWeight: 600,
                                                color: s.color, background: s.bg,
                                                padding: "3px 8px", borderRadius: 6,
                                            }}>
                                                {s.label}
                                            </span>
                                        </td>
                                        <td style={{ padding: "14px 16px" }}>
                                            <div style={{ display: "flex", gap: 8 }}>
                                                <button
                                                    onClick={() => copyLink(guest.name)}
                                                    style={{
                                                        padding: "6px 12px", borderRadius: 8, border: "1px solid #e5e7eb",
                                                        background: copied === guest.name ? "#ecfdf5" : "#fff",
                                                        color: copied === guest.name ? "#10b981" : "#374151",
                                                        fontSize: 12, fontWeight: 600, cursor: "pointer",
                                                    }}
                                                >
                                                    {copied === guest.name ? "✅ Đã copy" : "🔗 Copy link"}
                                                </button>
                                                <button
                                                    onClick={() => deleteGuest.mutate({ guestId: guest.id })}
                                                    disabled={deleteGuest.isPending}
                                                    style={{
                                                        padding: "6px 12px", borderRadius: 8, border: "1px solid #fee2e2",
                                                        background: "#fff5f5", color: "#ef4444",
                                                        fontSize: 12, fontWeight: 600, cursor: "pointer",
                                                    }}
                                                >
                                                    🗑️
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}

            <style>{`
                @media (max-width: 768px) {
                    div[style*="repeat(4, 1fr)"] { grid-template-columns: 1fr !important; }
                }
            `}</style>
        </div>
    );
}
