"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DeleteButton({ projectId }: { projectId: string }) {
    const router = useRouter();
    const [deleting, setDeleting] = useState(false);

    async function handleDelete() {
        if (!confirm("Bạn chắc chắn muốn xóa thiệp này? Hành động này không thể hoàn tác.")) return;
        setDeleting(true);
        try {
            const res = await fetch("/api/projects", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ projectId }),
            });
            if (res.ok) {
                router.refresh();
            } else {
                alert("Lỗi khi xóa thiệp");
            }
        } catch {
            alert("Lỗi kết nối");
        }
        setDeleting(false);
    }

    return (
        <button
            onClick={handleDelete}
            disabled={deleting}
            style={{
                padding: "8px 14px",
                borderRadius: 8,
                border: "1px solid #fecaca",
                background: "#fff5f5",
                color: "#dc2626",
                fontSize: 12,
                fontWeight: 600,
                cursor: deleting ? "not-allowed" : "pointer",
                opacity: deleting ? 0.5 : 1,
            }}
        >
            {deleting ? "⏳" : "🗑️ Xóa"}
        </button>
    );
}
