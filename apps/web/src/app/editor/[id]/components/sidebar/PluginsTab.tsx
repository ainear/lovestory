"use client";

import React from "react";
import { panelLabelStyle } from "../editor-constants";

interface PluginsTabProps {
  triggerAutosave: () => void;
  /** Stub query object for legacy CraftJS sidebar code */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  query: any;
  /** Stub actions object for legacy CraftJS sidebar code */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  actions: any;
  /** Stub components for legacy CraftJS sidebar code */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  CraftCountdown: React.ComponentType<any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  CraftCalendar: React.ComponentType<any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  CraftMap: React.ComponentType<any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  CraftRSVP: React.ComponentType<any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  CraftCallButton: React.ComponentType<any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  CraftPhotoAlbum: React.ComponentType<any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  CraftYouTube: React.ComponentType<any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  CraftQRBox: React.ComponentType<any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  CraftGuestName: React.ComponentType<any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  CraftFormBuilder: React.ComponentType<any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  CraftEnvelope: React.ComponentType<any>;
}

export function PluginsTab({
  triggerAutosave,
  query,
  actions,
  CraftCountdown,
  CraftCalendar,
  CraftMap,
  CraftRSVP,
  CraftCallButton,
  CraftPhotoAlbum,
  CraftYouTube,
  CraftQRBox,
  CraftGuestName,
  CraftFormBuilder,
  CraftEnvelope,
}: PluginsTabProps) {
  const widgets = [
    {
      label: "⏱️ Đếm ngược",
      desc: "Live countdown đến ngày cưới",
      component: (
        <CraftCountdown
          targetDate="2026-05-28"
          label="Đếm ngược đến ngày cưới"
          color="#831843"
          labelColor="#9f1239"
          background="rgba(255,255,255,0.6)"
          borderRadius={16}
          fontSize={28}
        />
      ),
    },
    {
      label: "📅 Lịch cưới",
      desc: "Lịch tháng đánh dấu ngày cưới",
      component: (
        <CraftCalendar
          targetDate="2026-05-28"
          accentColor="#ff6b9d"
          textColor="#374151"
          background="rgba(255,255,255,0.7)"
          borderRadius={16}
        />
      ),
    },
    {
      label: "📍 Bản đồ",
      desc: "Google Maps + nút chỉ đường",
      component: (
        <CraftMap
          address="123 Nguyễn Huệ, Quận 1, TP.HCM"
          venueName="Diamond Palace"
          lat={10.7769}
          lng={106.7009}
          zoom={15}
          height={200}
          borderRadius={12}
          accentColor="#ff6b9d"
        />
      ),
    },
    {
      label: "💌 RSVP",
      desc: "Form xác nhận tham dự",
      component: (
        <CraftRSVP
          title="Xác nhận tham dự"
          subtitle="Vui lòng xác nhận sự hiện diện của bạn"
          accentColor="#ff6b9d"
          textColor="#374151"
          background="rgba(255,255,255,0.7)"
          borderRadius={16}
        />
      ),
    },
    {
      label: "📞 Nút gọi",
      desc: "Gọi điện / Zalo / SMS",
      component: (
        <CraftCallButton
          phoneNumber="0901234567"
          label="Gọi cho chúng tôi"
          type="call"
          accentColor="#ff6b9d"
          textColor="#ffffff"
          borderRadius={24}
        />
      ),
    },
    {
      label: "📸 Album ảnh",
      desc: "Gallery ảnh cưới",
      component: (
        <CraftPhotoAlbum
          photos={[]}
          columns={3}
          gap={6}
          borderRadius={8}
          accentColor="#ff6b9d"
          title="Album ảnh"
        />
      ),
    },
    {
      label: "🎥 Video YouTube",
      desc: "Nhúng video cưới",
      component: (
        <CraftYouTube
          videoUrl=""
          borderRadius={12}
          aspectRatio="16:9"
        />
      ),
    },
    {
      label: "🎁 QR Box",
      desc: "Mừng cưới qua QR ngân hàng",
      component: (
        <CraftQRBox
          bankName="VCB"
          accountNumber=""
          accountName=""
          amount="500000"
          note="Mung cuoi"
          accentColor="#ff6b9d"
          textColor="#374151"
          borderRadius={16}
        />
      ),
    },
    {
      label: "👤 Tên khách mời",
      desc: "Tự động điền tên khi chia sẻ",
      component: (
        <CraftGuestName
          prefix="Trân trọng kính mời"
          defaultName="Quý khách"
          fontSize={28}
          fontFamily="'Playfair Display', serif"
          color="#374151"
          textAlign="center"
          accentColor="#ff6b9d"
        />
      ),
    },
    {
      label: "📋 Form tuỳ chỉnh",
      desc: "Tạo form thông tin khách mời",
      component: (
        <CraftFormBuilder
          title="Thông tin khách mời"
          subtitle="Vui lòng điền đầy đủ thông tin"
          fields={[
            {
              id: "name",
              label: "Họ và tên",
              type: "text",
              placeholder: "Nhập tên của bạn",
              options: [],
              required: true,
            },
            {
              id: "phone",
              label: "Số điện thoại",
              type: "text",
              placeholder: "0901234567",
              options: [],
              required: false,
            },
            {
              id: "message",
              label: "Lời chúc",
              type: "textarea",
              placeholder: "Gửi lời chúc...",
              options: [],
              required: false,
            },
            {
              id: "attend",
              label: "Bạn sẽ tham dự?",
              type: "radio",
              placeholder: "",
              options: ["Sẽ tham dự", "Không tham dự"],
              required: true,
            },
          ]}
          buttonText="Gửi thông tin"
          accentColor="#ff6b9d"
          textColor="#374151"
          background="rgba(255,255,255,0.8)"
          borderRadius={16}
        />
      ),
    },
    {
      label: "💌 Phong bì thư",
      desc: "Hiệu ứng mở phong bì",
      component: (
        <CraftEnvelope
          groomName="Anh"
          brideName="Em"
          label="Nhấn để mở thiệp mời"
          envelopeColor="#d4a574"
          sealColor="#c0392b"
          textColor="#374151"
          fontFamily="'Playfair Display', serif"
        />
      ),
    },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <p style={panelLabelStyle}>Thêm tiện ích</p>
      {widgets.map((widget) => (
        <button
          key={widget.label}
          onClick={() => {
            const tree = query
              .parseReactElement(widget.component)
              .toNodeTree();
            const rootNodeId = query.node("ROOT").get().data
              .nodes?.[0];
            if (rootNodeId) {
              actions.addNodeTree(tree, rootNodeId);
            }
            triggerAutosave();
          }}
          style={{
            padding: "12px 14px",
            borderRadius: 12,
            border: "1px solid #e5e7eb",
            background: "#fff",
            cursor: "pointer",
            textAlign: "left",
            display: "flex",
            flexDirection: "column",
            gap: 4,
            transition: "all 0.15s",
          }}
        >
          <span
            style={{
              fontSize: 14,
              fontWeight: 600,
              color: "#374151",
            }}
          >
            {widget.label}
          </span>
          <span style={{ fontSize: 11, color: "#9ca3af" }}>
            {widget.desc}
          </span>
        </button>
      ))}
    </div>
  );
}
