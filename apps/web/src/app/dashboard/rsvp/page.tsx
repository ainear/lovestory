"use client";

/**
 * Sprint 10 — RSVP Dashboard (Real-time + Multi-project filter)
 * - Supabase Realtime subscription on rsvp_responses
 * - Project picker to filter by specific wedding project
 * - 5 stat cards: total | attending | not | pending | total guests
 * - Attendance progress bar + CSV export per selected project
 */

import { useEffect, useState, useCallback } from "react";
import { createBrowserClient } from "@supabase/ssr";

interface RsvpRow {
  id: string;
  project_id: string;
  guest_name: string;
  attending: boolean | null;
  guest_count: number;
  note: string | null;
  created_at: string;
}

interface ProjectRow { id: string; title: string | null; slug: string | null; }

export default function RsvpPage() {
  const [projects, setProjects] = useState<ProjectRow[]>([]);
  const [rsvps, setRsvps] = useState<RsvpRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProjectId, setSelectedProjectId] = useState<string>("all");
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

  const loadData = useCallback(async (projectIds: string[], filterProjectId = "all") => {
    if (projectIds.length === 0) { setRsvps([]); return; }
    const query = filterProjectId === "all"
      ? supabase.from("rsvp_responses").select("*").in("project_id", projectIds).order("created_at", { ascending: false })
      : supabase.from("rsvp_responses").select("*").eq("project_id", filterProjectId).order("created_at", { ascending: false });

    const { data } = await query;
    setRsvps((data as RsvpRow[]) || []);
    setLastUpdated(new Date());
  }, [supabase]);

  useEffect(() => {
    let projectIds: string[] = [];

    async function bootstrap() {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoading(false); return; }

      const { data: proj } = await supabase
        .from("projects")
        .select("id, title, slug")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      const loadedProjects = (proj as ProjectRow[]) || [];
      setProjects(loadedProjects);
      projectIds = loadedProjects.map((p) => p.id);
      await loadData(projectIds, "all");
      setLoading(false);
    }

    bootstrap();

    // ── Supabase Realtime: subscribe to rsvp_responses changes ──
    const channel = supabase
      .channel("rsvp-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "rsvp_responses" },
        (_payload) => {
          // Re-fetch on any change (insert/update/delete)
          loadData(projectIds, selectedProjectId);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Refetch when project filter changes
  useEffect(() => {
    const projectIds = projects.map((p) => p.id);
    if (projectIds.length > 0) loadData(projectIds, selectedProjectId);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedProjectId]);

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "60px 0", color: "var(--dash-text-muted)" }}>
        <p style={{ fontSize: 32, marginBottom: 8 }}>⏳</p>
        <p style={{ fontSize: 14 }}>Đang tải...</p>
      </div>
    );
  }

  const attending = rsvps.filter((r) => r.attending === true);
  const notAttending = rsvps.filter((r) => r.attending === false);
  const pending = rsvps.filter((r) => r.attending === null || r.attending === undefined);
  const totalGuests = attending.reduce((sum, r) => sum + (r.guest_count || 1), 0);

  const exportProjectId = selectedProjectId === "all" ? (rsvps[0]?.project_id || "") : selectedProjectId;

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 20, display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: "var(--dash-text)", margin: 0 }}>📝 Xác nhận tham dự (RSVP)</h2>
          <p style={{ fontSize: 13, color: "var(--dash-text-secondary)", margin: "4px 0 0", display: "flex", alignItems: "center", gap: 8 }}>
            {rsvps.length} phản hồi — {projects.length} thiệp cưới
            {lastUpdated && (
              <span style={{
                display: "inline-flex", alignItems: "center", gap: 4,
                fontSize: 11, color: "#10b981", background: "#ecfdf5",
                padding: "2px 8px", borderRadius: 20, fontWeight: 600,
              }}>
                🟢 Live · {lastUpdated.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
              </span>
            )}
          </p>
        </div>
        {rsvps.length > 0 && exportProjectId && (
          <a
            href={`/api/guests/export?projectId=${exportProjectId}`}
            download
            style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              padding: "8px 16px", borderRadius: 8, border: "1px solid var(--dash-border)",
              background: "var(--dash-card)", color: "var(--dash-text)", fontSize: 12, fontWeight: 500,
              textDecoration: "none", flexShrink: 0,
            }}
          >
            📥 Xuất CSV
          </a>
        )}
      </div>

      {/* Project filter */}
      {projects.length > 1 && (
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 11, fontWeight: 600, color: "var(--dash-text-secondary)", display: "block", marginBottom: 6 }}>
            🎪 Lọc theo thiệp cưới
          </label>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <button
              onClick={() => setSelectedProjectId("all")}
              style={{
                padding: "6px 14px", borderRadius: 20, border: "1px solid var(--dash-border)",
                background: selectedProjectId === "all" ? "linear-gradient(135deg, #ff6b9d, #c084fc)" : "var(--dash-card)",
                color: selectedProjectId === "all" ? "#fff" : "var(--dash-text)",
                fontSize: 12, fontWeight: 600, cursor: "pointer",
              }}
            >
              🎊 Tất cả
            </button>
            {projects.slice(0, 6).map((p) => (
              <button
                key={p.id}
                onClick={() => setSelectedProjectId(p.id)}
                style={{
                  padding: "6px 14px", borderRadius: 20, border: "1px solid var(--dash-border)",
                  background: selectedProjectId === p.id ? "linear-gradient(135deg, #ff6b9d, #c084fc)" : "var(--dash-card)",
                  color: selectedProjectId === p.id ? "#fff" : "var(--dash-text)",
                  fontSize: 12, fontWeight: 600, cursor: "pointer",
                  maxWidth: 140, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                }}
                title={p.title || p.slug || p.id}
              >
                💍 {p.title || p.slug || p.id.slice(0, 8)}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Stats cards — 5 cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(110px, 1fr))", gap: 12, marginBottom: 20 }}>
        {[
          { icon: "📊", label: "Tổng phản hồi", value: rsvps.length, color: "#3b82f6" },
          { icon: "💕", label: "Sẽ tham dự", value: attending.length, color: "#059669" },
          { icon: "😔", label: "Không đến", value: notAttending.length, color: "#dc2626" },
          { icon: "⏳", label: "Chờ xác nhận", value: pending.length, color: "#f59e0b" },
          { icon: "👥", label: "Tổng khách đến", value: totalGuests, color: "#8b5cf6" },
        ].map((s, i) => (
          <div key={i} style={{ background: "var(--dash-card)", borderRadius: 12, padding: 16, border: "1px solid var(--dash-border)", textAlign: "center" }}>
            <p style={{ fontSize: 28, fontWeight: 700, color: s.color, margin: "0 0 2px" }}>{s.value}</p>
            <p style={{ fontSize: 11, color: "var(--dash-text-muted)", margin: 0 }}>{s.icon} {s.label}</p>
          </div>
        ))}
      </div>

      {/* Attendance bar */}
      {rsvps.length > 0 && (
        <div style={{ background: "var(--dash-card)", borderRadius: 12, padding: "14px 20px", border: "1px solid var(--dash-border)", marginBottom: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: "#059669" }}>💕 Tham dự: {attending.length}</span>
            <span style={{ fontSize: 12, fontWeight: 600, color: "#f59e0b" }}>⏳ Chờ: {pending.length}</span>
            <span style={{ fontSize: 12, fontWeight: 600, color: "#dc2626" }}>😔 Không đến: {notAttending.length}</span>
          </div>
          <div style={{ height: 8, background: "#f3f4f6", borderRadius: 8, overflow: "hidden", display: "flex" }}>
            <div style={{ height: "100%", background: "linear-gradient(90deg, #059669, #10b981)", width: `${rsvps.length > 0 ? (attending.length / rsvps.length) * 100 : 0}%`, transition: "width .5s ease" }} />
            <div style={{ height: "100%", background: "#f59e0b", width: `${rsvps.length > 0 ? (pending.length / rsvps.length) * 100 : 0}%`, transition: "width .5s ease" }} />
            <div style={{ height: "100%", background: "#dc2626", width: `${rsvps.length > 0 ? (notAttending.length / rsvps.length) * 100 : 0}%`, transition: "width .5s ease" }} />
          </div>
        </div>
      )}

      {/* Table / Empty state */}
      {rsvps.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 24px", background: "var(--dash-card-hover)", borderRadius: 16 }}>
          <p style={{ fontSize: 48, marginBottom: 12 }}>📝</p>
          <p style={{ fontSize: 16, fontWeight: 600, color: "var(--dash-text)", marginBottom: 6 }}>Chưa có RSVP nào</p>
          <p style={{ fontSize: 14, color: "var(--dash-text-secondary)", margin: 0 }}>
            Chia sẻ link thiệp cưới để khách xác nhận tham dự
          </p>
        </div>
      ) : (
        <div style={{ background: "var(--dash-card)", borderRadius: 16, border: "1px solid var(--dash-border)", overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "var(--dash-card-hover)" }}>
                <th style={{ padding: "12px 20px", textAlign: "left", fontSize: 12, fontWeight: 600, color: "var(--dash-text-secondary)" }}>Khách mời</th>
                <th style={{ padding: "12px 20px", textAlign: "center", fontSize: 12, fontWeight: 600, color: "var(--dash-text-secondary)" }}>Trả lời</th>
                <th style={{ padding: "12px 20px", textAlign: "center", fontSize: 12, fontWeight: 600, color: "var(--dash-text-secondary)" }}>Số người</th>
                <th style={{ padding: "12px 20px", textAlign: "left", fontSize: 12, fontWeight: 600, color: "var(--dash-text-secondary)" }}>Lời nhắn</th>
                <th style={{ padding: "12px 20px", textAlign: "right", fontSize: 12, fontWeight: 600, color: "var(--dash-text-secondary)" }}>Ngày</th>
              </tr>
            </thead>
            <tbody>
              {rsvps.map((rsvp) => (
                <tr key={rsvp.id} style={{ borderTop: "1px solid var(--dash-border-light)" }}>
                  <td style={{ padding: "14px 20px", fontSize: 14, fontWeight: 600, color: "var(--dash-text)" }}>
                    {rsvp.guest_name}
                  </td>
                  <td style={{ padding: "14px 20px", textAlign: "center" }}>
                    <span style={{
                      padding: "3px 12px", borderRadius: 20, fontSize: 12, fontWeight: 600,
                      color: rsvp.attending === true ? "#059669" : rsvp.attending === false ? "#dc2626" : "#d97706",
                      background: rsvp.attending === true ? "#ecfdf5" : rsvp.attending === false ? "#fef2f2" : "#fffbeb",
                    }}>
                      {rsvp.attending === true ? "💕 Tham dự" : rsvp.attending === false ? "😔 Không đến" : "⏳ Chờ"}
                    </span>
                  </td>
                  <td style={{ padding: "14px 20px", textAlign: "center", fontSize: 14, fontWeight: 600, color: "var(--dash-text)" }}>
                    {rsvp.attending ? (rsvp.guest_count || 1) : "—"}
                  </td>
                  <td style={{ padding: "14px 20px", fontSize: 13, color: "var(--dash-text-secondary)", maxWidth: 200 }}>
                    <span style={{ display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {rsvp.note || <span style={{ color: "var(--dash-text-muted)", fontStyle: "italic" }}>—</span>}
                    </span>
                  </td>
                  <td style={{ padding: "14px 20px", textAlign: "right", fontSize: 12, color: "var(--dash-text-muted)" }}>
                    {new Date(rsvp.created_at).toLocaleDateString("vi-VN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
