"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { createBrowserClient } from "@supabase/ssr";
import {
  Play,
  Pause,
  Upload,
  Trash2,
  Plus,
  Heart,
  MapPin,
  Gift,
  Image as ImageIcon,
  Music,
  Check,
  Loader2,
  ExternalLink,
  ChevronRight
} from "lucide-react";

interface MobileFormEditorProps {
  projectId: string;
  initialCanvasJson: string | null;
  projectSlug: string;
  onPublish: () => void;
}

interface FormState {
  groomName: string;
  brideName: string;
  weddingDate: string;
  weddingTime: string;
  groomParents: string;
  brideParents: string;
  venueName: string;
  venueAddress: string;
  googleMapsUrl: string;
  story: string;
  message: string;
  bankName: string;
  bankAccount: string;
  bankOwner: string;
  musicUrl: string;
  musicName: string;
  photos: string[];
}

const MUSIC_LIBRARY = [
  { name: "Beautiful in White - Shane Filan", url: "https://cdn.freesound.org/previews/612/612095_5674468-lq.mp3" },
  { name: "Beautiful Wedding Mood - Piano", url: "https://cdn.freesound.org/previews/332/332616_5674468-lq.mp3" },
  { name: "Romantic Piano Strings - Cinematic", url: "https://cdn.freesound.org/previews/644/644023_5674468-lq.mp3" },
];

const POPULAR_BANKS = [
  { code: "vietcombank", name: "Vietcombank (VCB)" },
  { code: "mbbank", name: "MBBank (MB)" },
  { code: "techcombank", name: "Techcombank (TCB)" },
  { code: "vietinbank", name: "VietinBank" },
  { code: "bidv", name: "BIDV" },
  { code: "agribank", name: "Agribank" },
  { code: "vpbank", name: "VPBank" },
  { code: "tpbank", name: "TPBank" },
  { code: "acb", name: "ACB" },
  { code: "sacombank", name: "Sacombank" },
  { code: "vib", name: "VIB" },
  { code: "shb", name: "SHB" },
];

export function MobileFormEditor({
  projectId,
  initialCanvasJson,
  projectSlug,
  onPublish,
}: MobileFormEditorProps) {
  const [activeTab, setActiveTab] = useState<"couple" | "venue" | "gift" | "photos">("couple");
  const [form, setForm] = useState<FormState>({
    groomName: "",
    brideName: "",
    weddingDate: "",
    weddingTime: "",
    groomParents: "",
    brideParents: "",
    venueName: "",
    venueAddress: "",
    googleMapsUrl: "",
    story: "",
    message: "",
    bankName: "",
    bankAccount: "",
    bankOwner: "",
    musicUrl: "",
    musicName: "",
    photos: [],
  });

  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saved" | "error">("idle");
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [playingUrl, setPlayingUrl] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

  // Parse initial canvas_json to form state
  useEffect(() => {
    if (!initialCanvasJson) return;
    try {
      const canvasObj = JSON.parse(initialCanvasJson);
      const elements = canvasObj.elements || [];
      const meta = canvasObj.meta || {};

      // Helper to find text
      const findText = (id: string, fallbackText: string = "") => {
        const el = elements.find((e: any) => e.id === id);
        return el?.props?.text || fallbackText;
      };

      // Extract image urls
      const imgElements = elements.filter((e: any) => e.type === "image" && e.props?.src);
      const photos = imgElements.map((e: any) => e.props.src);

      // Extract qrbox config
      const qrEl = elements.find((e: any) => e.type === "widget" && e.props?.widgetType === "qrbox");
      const qrConfig = qrEl?.props?.config || {};

      setForm({
        groomName: findText("s3-groom") || findText("s3-bride-and-groom") || "Chú rể",
        brideName: findText("s3-bride") || "Cô dâu",
        weddingDate: findText("s4-date") || "",
        weddingTime: findText("s4-time") || "",
        groomParents: findText("s6-parents-groom") || "",
        brideParents: findText("s6-parents-bride") || "",
        venueName: findText("s10-venue-name") || findText("s12-venue-name") || "",
        venueAddress: findText("s10-venue-address") || findText("s12-venue-address") || "",
        googleMapsUrl: qrConfig.mapsUrl || "",
        story: findText("s9-story") || findText("s13-story") || "",
        message: findText("s12-message") || findText("s14-message") || "",
        bankName: qrConfig.bankName || "",
        bankAccount: qrConfig.accountNumber || "",
        bankOwner: qrConfig.accountName || "",
        musicUrl: meta.musicUrl || "",
        musicName: meta.musicName || "",
        photos: photos.length > 0 ? photos : [
          "https://images.unsplash.com/photo-1519741497674-611481863552?w=600",
          "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600",
        ],
      });
    } catch (e) {
      console.error("Parse canvas_json failed:", e);
    }
  }, [initialCanvasJson]);

  // Cleanup audio preview on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const handleChange = (key: keyof FormState, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setSaveStatus("idle");
  };

  const handleSave = useCallback(async () => {
    setSaving(true);
    setSaveStatus("idle");

    try {
      // Sync form state back into canvas_json
      let canvasObj: any = { version: 2, canvas: { width: 390, height: 7300, bg: "#fff" }, elements: [], meta: {} };
      if (initialCanvasJson) {
        try {
          canvasObj = JSON.parse(initialCanvasJson);
        } catch {}
      }

      if (!canvasObj.meta) canvasObj.meta = {};
      canvasObj.meta.musicUrl = form.musicUrl;
      canvasObj.meta.musicName = form.musicName;

      canvasObj.elements = (canvasObj.elements || []).map((el: any) => {
        if (el.id === "s3-groom") {
          return { ...el, props: { ...el.props, text: form.groomName } };
        }
        if (el.id === "s3-bride") {
          return { ...el, props: { ...el.props, text: form.brideName } };
        }
        if (el.id === "s10-venue-name" || el.id === "s12-venue-name") {
          return { ...el, props: { ...el.props, text: form.venueName } };
        }
        if (el.id === "s10-venue-address" || el.id === "s12-venue-address") {
          return { ...el, props: { ...el.props, text: form.venueAddress } };
        }
        if (el.id === "s12-message" || el.id === "s14-message") {
          return { ...el, props: { ...el.props, text: form.message } };
        }
        if (el.id === "s9-story" || el.id === "s13-story") {
          return { ...el, props: { ...el.props, text: form.story } };
        }
        if (el.type === "widget" && el.props?.widgetType === "qrbox") {
          return {
            ...el,
            props: {
              ...el.props,
              config: {
                ...el.props.config,
                bankName: form.bankName,
                accountNumber: form.bankAccount,
                accountName: form.bankOwner,
              }
            }
          };
        }
        // Sync images mapping
        if (el.type === "image" && form.photos.length > 0) {
          if (el.id === "img-main" || el.id === "s2-hero-left") {
            return { ...el, props: { ...el.props, src: form.photos[0] } };
          }
          if (el.id === "s2-hero-right" && form.photos.length > 1) {
            return { ...el, props: { ...el.props, src: form.photos[1] } };
          }
          if (el.id === "img-groom" && form.photos.length > 2) {
            return { ...el, props: { ...el.props, src: form.photos[2] } };
          }
          if (el.id === "img-bride" && form.photos.length > 3) {
            return { ...el, props: { ...el.props, src: form.photos[3] } };
          }
        }
        return el;
      });

      // Update project core data too
      const { error } = await supabase
        .from("projects")
        .update({
          canvas_json: JSON.stringify(canvasObj),
          groom_name: form.groomName,
          bride_name: form.brideName,
          wedding_date: form.weddingDate ? `${form.weddingDate}T12:00:00Z` : null,
          venue_name: form.venueName,
          venue_address: form.venueAddress,
          updated_at: new Date().toISOString(),
        })
        .eq("id", projectId);

      if (error) throw error;
      setSaveStatus("saved");
    } catch (err) {
      console.error("Save project failed:", err);
      setSaveStatus("error");
    } finally {
      setSaving(false);
    }
  }, [form, projectId, initialCanvasJson, supabase]);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    const MAX_SIZE = 10 * 1024 * 1024; // 10MB

    if (!ALLOWED_TYPES.includes(file.type)) {
      alert("Chỉ hỗ trợ file ảnh (JPEG, PNG, GIF, WebP).");
      return;
    }
    if (file.size > MAX_SIZE) {
      alert("File ảnh quá lớn. Giới hạn dung lượng là 10MB.");
      return;
    }

    setUploadingPhoto(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("projectId", projectId);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.url) {
        handleChange("photos", [...form.photos, data.url]);
      } else {
        alert("Tải lên thất bại. Không nhận được URL từ máy chủ.");
      }
    } catch (err) {
      console.error("Upload image error:", err);
      alert("Đã xảy ra lỗi khi tải ảnh lên. Vui lòng thử lại.");
    } finally {
      setUploadingPhoto(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleRemovePhoto = (index: number) => {
    handleChange("photos", form.photos.filter((_, i) => i !== index));
  };

  const togglePlayMusic = (url: string) => {
    if (playingUrl === url) {
      audioRef.current?.pause();
      setPlayingUrl(null);
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      audioRef.current = new Audio(url);
      audioRef.current.play().catch((e) => console.error("Error playing audio:", e));
      setPlayingUrl(url);
      audioRef.current.onended = () => setPlayingUrl(null);
    }
  };

  const activeTabStyle = {
    flex: 1,
    padding: "12px 0",
    fontSize: "13px",
    fontWeight: 700,
    color: "#be8a70",
    border: "none",
    borderBottom: "3px solid #be8a70",
    background: "none",
    cursor: "pointer",
    whiteSpace: "nowrap" as const,
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    gap: "4px",
    transition: "all 0.2s ease",
  };

  const inactiveTabStyle = {
    flex: 1,
    padding: "12px 0",
    fontSize: "13px",
    fontWeight: 500,
    color: "#9ca3af",
    border: "none",
    borderBottom: "3px solid transparent",
    background: "none",
    cursor: "pointer",
    whiteSpace: "nowrap" as const,
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    gap: "4px",
    transition: "all 0.2s ease",
  };

  const inputStyle = {
    width: "100%",
    padding: "12px 14px",
    borderRadius: "12px",
    border: "1px solid #e5e7eb",
    fontSize: "14px",
    color: "#1f2937",
    background: "#fff",
    outline: "none",
    boxShadow: "0 1px 2px rgba(0, 0, 0, 0.02)",
    transition: "all 0.2s ease",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#faf9f6",
        display: "flex",
        flexDirection: "column",
        fontFamily: "var(--font-outfit), -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      }}
    >
      {/* Mobile Editor Header */}
      <header
        style={{
          background: "rgba(255, 255, 255, 0.85)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          padding: "14px 16px",
          borderBottom: "1px solid rgba(229, 231, 235, 0.5)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          position: "sticky",
          top: 0,
          zIndex: 10,
        }}
      >
        <div>
          <h1 style={{ fontSize: "15px", fontWeight: 700, color: "#1f2937", margin: 0, letterSpacing: "-0.01em" }}>
            CineLove Editor 💍
          </h1>
          <p style={{ fontSize: "10px", color: "#9ca3af", margin: "1px 0 0" }}>
            Trình soạn thảo di động cao cấp
          </p>
        </div>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <span style={{ fontSize: "11px", fontWeight: 500, color: saveStatus === "saved" ? "#10b981" : saveStatus === "error" ? "#ef4444" : "#9ca3af" }}>
            {saveStatus === "saved" ? "✓ Đã lưu" : saveStatus === "error" ? "⚠ Lỗi lưu" : ""}
          </span>
          <button
            onClick={handleSave}
            disabled={saving}
            style={{
              padding: "7px 16px",
              borderRadius: "20px",
              background: "linear-gradient(135deg, #e2b49a, #be8a70)",
              color: "#fff",
              fontSize: "12px",
              fontWeight: 600,
              border: "none",
              cursor: "pointer",
              boxShadow: "0 4px 10px rgba(190, 138, 112, 0.2)",
              display: "flex",
              alignItems: "center",
              gap: "4px",
              opacity: saving ? 0.7 : 1,
            }}
          >
            {saving && <Loader2 size={12} className="animate-spin" />}
            {saving ? "Đang lưu..." : "Lưu lại"}
          </button>
        </div>
      </header>

      {/* Tabs list */}
      <div
        style={{
          display: "flex",
          background: "#fff",
          borderBottom: "1px solid #f3f4f6",
          padding: "0 8px",
          gap: "4px",
          overflowX: "auto",
          scrollbarWidth: "none",
        }}
      >
        {[
          { key: "couple", label: "Cặp đôi", icon: <Heart size={16} /> },
          { key: "venue", label: "Sự kiện", icon: <MapPin size={16} /> },
          { key: "gift", label: "Mừng cưới", icon: <Gift size={16} /> },
          { key: "photos", label: "Album ảnh", icon: <ImageIcon size={16} /> },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            style={activeTab === tab.key ? activeTabStyle : inactiveTabStyle}
          >
            {tab.icon}
            <span style={{ fontSize: "11px" }}>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Main Content Area */}
      <main style={{ flex: 1, padding: "20px 16px", overflowY: "auto", paddingBottom: "100px" }}>
        {activeTab === "couple" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
            <div style={{ display: "flex", gap: "12px" }}>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: "12px", fontWeight: 600, color: "#4b5563", display: "block", marginBottom: "6px" }}>
                  Tên chú rể
                </label>
                <input
                  type="text"
                  value={form.groomName}
                  onChange={(e) => handleChange("groomName", e.target.value)}
                  placeholder="Gõ tên chú rể..."
                  style={inputStyle}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: "12px", fontWeight: 600, color: "#4b5563", display: "block", marginBottom: "6px" }}>
                  Tên cô dâu
                </label>
                <input
                  type="text"
                  value={form.brideName}
                  onChange={(e) => handleChange("brideName", e.target.value)}
                  placeholder="Gõ tên cô dâu..."
                  style={inputStyle}
                />
              </div>
            </div>

            <div style={{ display: "flex", gap: "12px" }}>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: "12px", fontWeight: 600, color: "#4b5563", display: "block", marginBottom: "6px" }}>
                  Ngày cưới
                </label>
                <input
                  type="date"
                  value={form.weddingDate}
                  onChange={(e) => handleChange("weddingDate", e.target.value)}
                  style={inputStyle}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: "12px", fontWeight: 600, color: "#4b5563", display: "block", marginBottom: "6px" }}>
                  Giờ hôn lễ
                </label>
                <input
                  type="time"
                  value={form.weddingTime}
                  onChange={(e) => handleChange("weddingTime", e.target.value)}
                  style={inputStyle}
                />
              </div>
            </div>

            <div style={{ borderTop: "1px dashed #e5e7eb", padding: "12px 0 0" }}>
              <label style={{ fontSize: "12px", fontWeight: 600, color: "#4b5563", display: "block", marginBottom: "6px", marginTop: "12px" }}>
                Bố mẹ chú rể
              </label>
              <input
                type="text"
                placeholder="Ông Nguyễn Văn A & Bà Lê Thị B"
                value={form.groomParents}
                onChange={(e) => handleChange("groomParents", e.target.value)}
                style={inputStyle}
              />
            </div>

            <div>
              <label style={{ fontSize: "12px", fontWeight: 600, color: "#4b5563", display: "block", marginBottom: "6px" }}>
                Bố mẹ cô dâu
              </label>
              <input
                type="text"
                placeholder="Ông Trần Văn C & Bà Phạm Thị D"
                value={form.brideParents}
                onChange={(e) => handleChange("brideParents", e.target.value)}
                style={inputStyle}
              />
            </div>
          </div>
        )}

        {activeTab === "venue" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
            <div>
              <label style={{ fontSize: "12px", fontWeight: 600, color: "#4b5563", display: "block", marginBottom: "6px" }}>
                Tên địa điểm tổ chức
              </label>
              <input
                type="text"
                placeholder="Trung tâm tiệc cưới Diamond Palace..."
                value={form.venueName}
                onChange={(e) => handleChange("venueName", e.target.value)}
                style={inputStyle}
              />
            </div>

            <div>
              <label style={{ fontSize: "12px", fontWeight: 600, color: "#4b5563", display: "block", marginBottom: "6px" }}>
                Địa chỉ chính xác
              </label>
              <input
                type="text"
                placeholder="Số 123 Đường Nguyễn Huệ, Quận 1..."
                value={form.venueAddress}
                onChange={(e) => handleChange("venueAddress", e.target.value)}
                style={inputStyle}
              />
            </div>

            <div>
              <label style={{ fontSize: "12px", fontWeight: 600, color: "#4b5563", display: "block", marginBottom: "6px" }}>
                Lời mời gửi tới quan khách
              </label>
              <textarea
                rows={3}
                placeholder="Sự hiện diện của bạn là niềm vinh hạnh lớn của gia đình chúng tôi..."
                value={form.message}
                onChange={(e) => handleChange("message", e.target.value)}
                style={{ ...inputStyle, resize: "vertical", minHeight: "80px" }}
              />
            </div>

            <div>
              <label style={{ fontSize: "12px", fontWeight: 600, color: "#4b5563", display: "block", marginBottom: "6px" }}>
                Câu chuyện tình yêu của chúng mình
              </label>
              <textarea
                rows={4}
                placeholder="Chia sẻ ngắn về hành trình bên nhau của hai bạn..."
                value={form.story}
                onChange={(e) => handleChange("story", e.target.value)}
                style={{ ...inputStyle, resize: "vertical", minHeight: "100px" }}
              />
            </div>
          </div>
        )}

        {activeTab === "gift" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
            <div style={{ background: "#fff", padding: "16px", borderRadius: "16px", border: "1px solid rgba(229,231,235,0.6)", display: "flex", flexDirection: "column", gap: "14px" }}>
              <h3 style={{ fontSize: "13px", fontWeight: 700, color: "#be8a70", margin: "0 0 4px" }}>
                Thông tin Mừng cưới (VietQR Động)
              </h3>
              
              <div>
                <label style={{ fontSize: "12px", fontWeight: 600, color: "#4b5563", display: "block", marginBottom: "6px" }}>
                  Chọn Ngân hàng
                </label>
                <select
                  value={form.bankName}
                  onChange={(e) => handleChange("bankName", e.target.value)}
                  style={{ ...inputStyle, appearance: "none", WebkitAppearance: "none", backgroundImage: "url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%236B7280%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')", backgroundRepeat: "no-repeat", backgroundPosition: "right 14px top 50%", backgroundSize: "10px auto" }}
                >
                  <option value="">-- Chọn ngân hàng --</option>
                  {POPULAR_BANKS.map((b) => (
                    <option key={b.code} value={b.code}>
                      {b.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ fontSize: "12px", fontWeight: 600, color: "#4b5563", display: "block", marginBottom: "6px" }}>
                  Số tài khoản
                </label>
                <input
                  type="text"
                  placeholder="Nhập số tài khoản..."
                  value={form.bankAccount}
                  onChange={(e) => handleChange("bankAccount", e.target.value)}
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={{ fontSize: "12px", fontWeight: 600, color: "#4b5563", display: "block", marginBottom: "6px" }}>
                  Tên chủ tài khoản
                </label>
                <input
                  type="text"
                  placeholder="Ví dụ: NGUYEN VAN A..."
                  value={form.bankOwner}
                  onChange={(e) => handleChange("bankOwner", e.target.value)}
                  style={inputStyle}
                />
              </div>
            </div>

            <div style={{ background: "#fff", padding: "16px", borderRadius: "16px", border: "1px solid rgba(229,231,235,0.6)", display: "flex", flexDirection: "column", gap: "12px" }}>
              <h3 style={{ fontSize: "13px", fontWeight: 700, color: "#be8a70", margin: "0", display: "flex", alignItems: "center", gap: "6px" }}>
                <Music size={16} /> Nhạc nền thiệp cưới
              </h3>
              <p style={{ fontSize: "11px", color: "#9ca3af", margin: "0 0 6px" }}>
                Bấm nút play ▶ để nghe thử giai điệu trực tiếp trước khi chọn.
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {MUSIC_LIBRARY.map((m) => (
                  <div
                    key={m.name}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      padding: "10px 12px",
                      borderRadius: "12px",
                      border: form.musicName === m.name ? "2px solid #be8a70" : "1px solid #e5e7eb",
                      background: form.musicName === m.name ? "#fdf8f5" : "#fff",
                      transition: "all 0.2s ease",
                    }}
                  >
                    <button
                      onClick={() => togglePlayMusic(m.url)}
                      style={{
                        width: "32px",
                        height: "32px",
                        borderRadius: "50%",
                        border: "none",
                        background: playingUrl === m.url ? "#be8a70" : "#f3f4f6",
                        color: playingUrl === m.url ? "#fff" : "#4b5563",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                      }}
                    >
                      {playingUrl === m.url ? <Pause size={12} /> : <Play size={12} style={{ marginLeft: "2px" }} />}
                    </button>
                    
                    <div
                      onClick={() => {
                        handleChange("musicUrl", m.url);
                        handleChange("musicName", m.name);
                      }}
                      style={{
                        flex: 1,
                        cursor: "pointer",
                        textAlign: "left",
                      }}
                    >
                      <div style={{ fontSize: "13px", fontWeight: form.musicName === m.name ? 700 : 500, color: form.musicName === m.name ? "#be8a70" : "#1f2937" }}>
                        {m.name}
                      </div>
                    </div>

                    {form.musicName === m.name && (
                      <div style={{ color: "#be8a70" }}>
                        <Check size={16} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "photos" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{ background: "#eff6ff", padding: "12px 14px", borderRadius: "12px", border: "1px solid #bfdbfe" }}>
              <p style={{ fontSize: "11px", color: "#1e3a8a", margin: 0, lineHeight: 1.5 }}>
                💡 Hình ảnh cưới sẽ tự động ánh xạ vào biểu ngữ chính (Hero Banner) và Thư viện Album cưới trên thiệp di động của khách. Tối đa hỗ trợ tải lên 4 ảnh cưới độ phân giải cao.
              </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              {form.photos.map((url, i) => (
                <div
                  key={i}
                  style={{
                    position: "relative",
                    borderRadius: "14px",
                    overflow: "hidden",
                    aspectRatio: "1/1",
                    border: "1px solid #e5e7eb",
                    background: "#f3f4f6",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.03)",
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={url} alt={`Ảnh cưới ${i + 1}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  <button
                    onClick={() => handleRemovePhoto(i)}
                    style={{
                      position: "absolute",
                      top: "8px",
                      right: "8px",
                      width: "26px",
                      height: "26px",
                      borderRadius: "50%",
                      background: "rgba(0,0,0,0.65)",
                      color: "#fff",
                      border: "none",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "background 0.2s",
                    }}
                  >
                    <Trash2 size={12} />
                  </button>
                  <div
                    style={{
                      position: "absolute",
                      bottom: "8px",
                      left: "8px",
                      background: "rgba(255, 255, 255, 0.9)",
                      padding: "2px 8px",
                      borderRadius: "10px",
                      fontSize: "9px",
                      fontWeight: 700,
                      color: "#be8a70",
                    }}
                  >
                    {i === 0 ? "Ảnh bìa" : `Ảnh ${i + 1}`}
                  </div>
                </div>
              ))}
              
              {form.photos.length < 4 && (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingPhoto}
                  style={{
                    borderRadius: "14px",
                    border: "2px dashed #e2b49a",
                    background: "#fff",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    aspectRatio: "1/1",
                    cursor: "pointer",
                    color: "#be8a70",
                    gap: "8px",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.01)",
                    opacity: uploadingPhoto ? 0.7 : 1,
                  }}
                >
                  {uploadingPhoto ? (
                    <Loader2 size={24} className="animate-spin" />
                  ) : (
                    <Plus size={24} />
                  )}
                  <span style={{ fontSize: "11px", fontWeight: 600 }}>
                    {uploadingPhoto ? "Đang tải lên..." : "Tải ảnh lên"}
                  </span>
                </button>
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handlePhotoUpload}
            />
          </div>
        )}
      </main>

      {/* Floating Bottom action bar for preview / publish */}
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          background: "rgba(255, 255, 255, 0.9)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderTop: "1px solid rgba(229, 231, 235, 0.5)",
          padding: "12px 16px",
          display: "flex",
          gap: "12px",
          zIndex: 10,
          boxShadow: "0 -4px 20px rgba(0, 0, 0, 0.04)",
        }}
      >
        <a
          href={`/i/${projectSlug}?preview=true`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => {
            // Tự động lưu trước khi xem trước
            handleSave();
          }}
          style={{
            flex: 1,
            padding: "12px 0",
            borderRadius: "30px",
            border: "1px solid #e5e7eb",
            background: "#fff",
            color: "#4b5563",
            textAlign: "center",
            fontSize: "14px",
            fontWeight: 600,
            textDecoration: "none",
            boxShadow: "0 2px 4px rgba(0,0,0,0.02)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "6px",
          }}
        >
          <ExternalLink size={14} />
          Xem thử thiệp
        </a>
        <button
          onClick={onPublish}
          style={{
            flex: 1,
            padding: "12px 0",
            borderRadius: "30px",
            border: "none",
            background: "linear-gradient(135deg, #e2b49a, #be8a70)",
            color: "#fff",
            fontSize: "14px",
            fontWeight: 600,
            cursor: "pointer",
            boxShadow: "0 4px 14px rgba(190, 138, 112, 0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "6px",
          }}
        >
          <span>🎉</span>
          Xuất bản ngay
        </button>
      </div>
    </div>
  );
}
