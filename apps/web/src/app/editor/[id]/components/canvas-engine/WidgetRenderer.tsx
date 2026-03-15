"use client";

import React from "react";
import { VIETNAM_BANKS, buildVietQrUrl } from "./vietnam-banks";

/* ------------------------------------------------------------------ */
/*  Helper                                                             */
/* ------------------------------------------------------------------ */

function str(v: unknown, fallback: string): string {
  return typeof v === "string" && v.length > 0 ? v : fallback;
}

function num(v: unknown, fallback: number): number {
  return typeof v === "number" ? v : fallback;
}

function arr<T>(v: unknown, fallback: T[]): T[] {
  return Array.isArray(v) ? (v as T[]) : fallback;
}

/* ------------------------------------------------------------------ */
/*  Countdown                                                          */
/* ------------------------------------------------------------------ */

function CountdownWidget({ config }: { config: Record<string, unknown> }) {
  const label = str(config.label, "Dem nguoc");
  const color = str(config.color, "#ffffff");
  const labelColor = str(config.labelColor, "#e5e7eb");
  const background = str(config.background, "rgba(0,0,0,0.5)");
  const borderRadius = num(config.borderRadius, 12);
  const fontSize = num(config.fontSize, 28);

  const units = [
    { value: "00", unit: "Ngay" },
    { value: "00", unit: "Gio" },
    { value: "00", unit: "Phut" },
    { value: "00", unit: "Giay" },
  ];

  return (
    <div
      style={{
        background,
        borderRadius,
        padding: 16,
        textAlign: "center",
        width: "100%",
      }}
    >
      {label && (
        <div style={{ color: labelColor, fontSize: 14, marginBottom: 12 }}>
          {label}
        </div>
      )}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: 12,
        }}
      >
        {units.map((u) => (
          <div key={u.unit} style={{ textAlign: "center" }}>
            <div
              style={{
                fontSize,
                fontWeight: 700,
                color,
                background: "rgba(255,255,255,0.1)",
                borderRadius: 8,
                width: 52,
                height: 52,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {u.value}
            </div>
            <div
              style={{
                fontSize: 10,
                color: labelColor,
                marginTop: 4,
                textTransform: "uppercase",
              }}
            >
              {u.unit}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Calendar                                                           */
/* ------------------------------------------------------------------ */

function CalendarWidget({ config }: { config: Record<string, unknown> }) {
  const targetDate = str(config.targetDate, "2025-12-31");
  const accentColor = str(config.accentColor, "#e11d48");
  const textColor = str(config.textColor, "#1f2937");
  const background = str(config.background, "#ffffff");
  const borderRadius = num(config.borderRadius, 12);

  const date = new Date(targetDate);
  const monthNames = [
    "Thang 1",
    "Thang 2",
    "Thang 3",
    "Thang 4",
    "Thang 5",
    "Thang 6",
    "Thang 7",
    "Thang 8",
    "Thang 9",
    "Thang 10",
    "Thang 11",
    "Thang 12",
  ];
  const month = monthNames[date.getMonth()] ?? "Thang 12";
  const year = date.getFullYear();
  const day = date.getDate();
  const dayNames = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];

  return (
    <div
      style={{
        background,
        borderRadius,
        padding: 16,
        textAlign: "center",
        color: textColor,
        width: "100%",
      }}
    >
      <div
        style={{
          fontSize: 14,
          fontWeight: 600,
          color: accentColor,
          marginBottom: 8,
        }}
      >
        {month} {year}
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: 2,
          fontSize: 11,
          marginBottom: 4,
        }}
      >
        {dayNames.map((d) => (
          <div key={d} style={{ fontWeight: 600, opacity: 0.6, padding: 4 }}>
            {d}
          </div>
        ))}
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 4,
          marginTop: 8,
        }}
      >
        <div
          style={{
            background: accentColor,
            color: "#fff",
            borderRadius: "50%",
            width: 36,
            height: 36,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 16,
            fontWeight: 700,
          }}
        >
          {day}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Map                                                                */
/* ------------------------------------------------------------------ */

function MapWidget({ config }: { config: Record<string, unknown> }) {
  const venueName = str(config.venueName, "Dia diem");
  const address = str(config.address, "Dia chi se hien thi o day");
  const height = num(config.height, 200);
  const borderRadius = num(config.borderRadius, 12);
  const accentColor = str(config.accentColor, "#e11d48");

  return (
    <div
      style={{
        borderRadius,
        overflow: "hidden",
        width: "100%",
        height,
        background: "#e5e7eb",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
      }}
    >
      {/* Grid lines to suggest a map */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(0,0,0,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.04) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
      {/* Pin icon */}
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: "50% 50% 50% 0",
          background: accentColor,
          transform: "rotate(-45deg)",
          marginBottom: 12,
          position: "relative",
          zIndex: 1,
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 8,
            left: 8,
            width: 16,
            height: 16,
            borderRadius: "50%",
            background: "#fff",
          }}
        />
      </div>
      <div
        style={{
          fontWeight: 600,
          fontSize: 14,
          color: "#1f2937",
          position: "relative",
          zIndex: 1,
        }}
      >
        {venueName}
      </div>
      <div
        style={{
          fontSize: 12,
          color: "#6b7280",
          marginTop: 4,
          position: "relative",
          zIndex: 1,
          textAlign: "center",
          padding: "0 16px",
        }}
      >
        {address}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  RSVP                                                               */
/* ------------------------------------------------------------------ */

function RsvpWidget({ config }: { config: Record<string, unknown> }) {
  const title = str(config.title, "Xac nhan tham du");
  const subtitle = str(config.subtitle, "Vui long cho chung toi biet");
  const accentColor = str(config.accentColor, "#e11d48");
  const textColor = str(config.textColor, "#1f2937");
  const background = str(config.background, "#ffffff");
  const borderRadius = num(config.borderRadius, 12);

  return (
    <div
      style={{
        background,
        borderRadius,
        padding: 20,
        width: "100%",
        color: textColor,
      }}
    >
      <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 4 }}>
        {title}
      </div>
      <div style={{ fontSize: 13, opacity: 0.7, marginBottom: 16 }}>
        {subtitle}
      </div>
      {/* Name field */}
      <div
        style={{
          border: "1px solid #d1d5db",
          borderRadius: 8,
          padding: "8px 12px",
          marginBottom: 10,
          fontSize: 13,
          color: "#9ca3af",
        }}
      >
        Ho va ten
      </div>
      {/* Attendance toggle */}
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <div
          style={{
            flex: 1,
            padding: 8,
            borderRadius: 8,
            background: accentColor,
            color: "#fff",
            textAlign: "center",
            fontSize: 13,
            fontWeight: 500,
          }}
        >
          Tham du
        </div>
        <div
          style={{
            flex: 1,
            padding: 8,
            borderRadius: 8,
            border: "1px solid #d1d5db",
            textAlign: "center",
            fontSize: 13,
            color: textColor,
          }}
        >
          Vang mat
        </div>
      </div>
      {/* Submit button */}
      <div
        style={{
          background: accentColor,
          color: "#fff",
          padding: 10,
          borderRadius: 8,
          textAlign: "center",
          fontSize: 14,
          fontWeight: 600,
        }}
      >
        Gui xac nhan
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  QR Box                                                             */
/* ------------------------------------------------------------------ */

function QrBoxWidget({ config }: { config: Record<string, unknown> }) {
  const bankBin = str(config.bankBin, "");
  const bankName = str(config.bankName, "");
  const accountNumber = str(config.accountNumber, "");
  const accountName = str(config.accountName, "NGUYEN VAN A");
  const amount = str(config.amount, "");
  const note = str(config.note, "Mung cuoi");
  const accentColor = str(config.accentColor, "#e11d48");
  const textColor = str(config.textColor, "#1f2937");
  const borderRadius = num(config.borderRadius, 12);

  const hasQrData = bankBin && accountNumber;
  const qrUrl = hasQrData
    ? buildVietQrUrl(bankBin, accountNumber, amount, note)
    : "";
  const displayBankName =
    bankName ||
    VIETNAM_BANKS.find((b) => b.bin === bankBin)?.name ||
    "Ngan hang";

  return (
    <div
      style={{
        borderRadius,
        padding: 20,
        width: "100%",
        background: "#ffffff",
        textAlign: "center",
        color: textColor,
      }}
    >
      <div
        style={{
          fontSize: 16,
          fontWeight: 600,
          color: accentColor,
          marginBottom: 12,
        }}
      >
        {displayBankName}
      </div>
      {hasQrData ? (
        <img
          src={qrUrl}
          alt="QR chuyen khoan"
          width={160}
          height={160}
          style={{
            display: "block",
            margin: "0 auto 12px",
            borderRadius: 8,
          }}
        />
      ) : (
        <div
          style={{
            width: 120,
            height: 120,
            margin: "0 auto 12px",
            background: "#f3f4f6",
            borderRadius: 8,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "2px dashed #d1d5db",
            flexDirection: "column",
            gap: 4,
          }}
        >
          <div style={{ fontSize: 20 }}>📱</div>
          <div style={{ fontSize: 10, color: "#9ca3af" }}>Chua cau hinh QR</div>
        </div>
      )}
      <div style={{ fontSize: 14, fontWeight: 600 }}>{accountName}</div>
      {accountNumber && (
        <div style={{ fontSize: 13, color: "#6b7280", marginTop: 2 }}>
          {accountNumber}
        </div>
      )}
      {note && (
        <div
          style={{
            fontSize: 12,
            color: "#9ca3af",
            marginTop: 8,
            fontStyle: "italic",
          }}
        >
          Noi dung: {note}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Photo Album                                                        */
/* ------------------------------------------------------------------ */

function AlbumWidget({ config }: { config: Record<string, unknown> }) {
  const photos = arr<string>(config.photos, []);
  const columns = num(config.columns, 2);
  const gap = num(config.gap, 8);
  const borderRadius = num(config.borderRadius, 8);
  const accentColor = str(config.accentColor, "#e11d48");
  const title = str(config.title, "");

  const displayPhotos =
    photos.length > 0 ? photos : Array.from({ length: 4 }, () => "");

  return (
    <div style={{ width: "100%" }}>
      {title && (
        <div
          style={{
            fontSize: 16,
            fontWeight: 600,
            color: accentColor,
            textAlign: "center",
            marginBottom: 12,
          }}
        >
          {title}
        </div>
      )}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
          gap,
        }}
      >
        {displayPhotos.map((src, i) => (
          <div
            key={i}
            style={{
              borderRadius,
              overflow: "hidden",
              aspectRatio: "1",
              background: "#e5e7eb",
            }}
          >
            {src ? (
              <img
                src={src}
                alt=""
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                }}
              />
            ) : (
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 11,
                  color: "#9ca3af",
                }}
              >
                Anh {i + 1}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Envelope                                                           */
/* ------------------------------------------------------------------ */

function EnvelopeWidget({ config }: { config: Record<string, unknown> }) {
  const groomName = str(config.groomName, "Chu re");
  const brideName = str(config.brideName, "Co dau");
  const label = str(config.label, "Thiep Moi");
  const envelopeColor = str(config.envelopeColor, "#fef3c7");
  const sealColor = str(config.sealColor, "#e11d48");
  const textColor = str(config.textColor, "#92400e");
  const fontFamily = str(config.fontFamily, "'Playfair Display', serif");

  return (
    <div
      style={{
        width: "100%",
        position: "relative",
        fontFamily,
      }}
    >
      {/* Envelope body */}
      <div
        style={{
          background: envelopeColor,
          borderRadius: 12,
          padding: "32px 20px",
          textAlign: "center",
          color: textColor,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Flap triangle */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 60,
            background: `linear-gradient(135deg, ${envelopeColor} 49.5%, transparent 50.5%), linear-gradient(-135deg, ${envelopeColor} 49.5%, transparent 50.5%)`,
            filter: "brightness(0.9)",
          }}
        />
        {/* Seal */}
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            background: sealColor,
            margin: "0 auto 16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            zIndex: 1,
          }}
        >
          <div style={{ color: "#fff", fontSize: 16, fontWeight: 700 }}>W</div>
        </div>
        <div
          style={{
            fontSize: 12,
            textTransform: "uppercase",
            letterSpacing: 2,
            marginBottom: 8,
          }}
        >
          {label}
        </div>
        <div style={{ fontSize: 18, fontWeight: 600 }}>
          {groomName} & {brideName}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  YouTube                                                            */
/* ------------------------------------------------------------------ */

function YoutubeWidget({ config }: { config: Record<string, unknown> }) {
  const borderRadius = num(config.borderRadius, 12);
  const aspectRatio = str(config.aspectRatio, "16/9");

  return (
    <div
      style={{
        width: "100%",
        aspectRatio,
        borderRadius,
        background: "#0f0f0f",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Play button */}
      <div
        style={{
          width: 56,
          height: 40,
          background: "#e11d48",
          borderRadius: 8,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: 0,
            height: 0,
            borderTop: "10px solid transparent",
            borderBottom: "10px solid transparent",
            borderLeft: "16px solid #fff",
            marginLeft: 4,
          }}
        />
      </div>
      <div
        style={{
          position: "absolute",
          bottom: 8,
          left: 12,
          fontSize: 11,
          color: "#9ca3af",
        }}
      >
        YouTube Video
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Call Button                                                        */
/* ------------------------------------------------------------------ */

function CallButtonWidget({ config }: { config: Record<string, unknown> }) {
  const buttonLabel = str(config.label, "Goi dien");
  const callType = str(config.type, "call") as "call" | "zalo" | "sms";
  const accentColor = str(config.accentColor, "#e11d48");
  const textColor = str(config.textColor, "#ffffff");
  const borderRadius = num(config.borderRadius, 24);

  const typeLabels: Record<string, string> = {
    call: "Tel",
    zalo: "Zalo",
    sms: "SMS",
  };

  return (
    <div style={{ width: "100%", textAlign: "center" }}>
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          background: accentColor,
          color: textColor,
          padding: "10px 24px",
          borderRadius,
          fontSize: 14,
          fontWeight: 600,
          cursor: "default",
        }}
      >
        <span style={{ fontSize: 11, opacity: 0.8 }}>
          [{typeLabels[callType] ?? "Tel"}]
        </span>
        {buttonLabel}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Guest Name                                                         */
/* ------------------------------------------------------------------ */

function GuestNameWidget({ config }: { config: Record<string, unknown> }) {
  const prefix = str(config.prefix, "Kinh gui");
  const defaultName = str(config.defaultName, "Quy khach");
  const fontSize = num(config.fontSize, 20);
  const fontFamily = str(config.fontFamily, "'Playfair Display', serif");
  const color = str(config.color, "#1f2937");
  const textAlign = str(
    config.textAlign,
    "center",
  ) as React.CSSProperties["textAlign"];
  const accentColor = str(config.accentColor, "#e11d48");

  return (
    <div
      style={{
        width: "100%",
        textAlign,
        fontFamily,
      }}
    >
      {prefix && (
        <div
          style={{
            fontSize: fontSize * 0.6,
            color,
            opacity: 0.7,
            marginBottom: 4,
          }}
        >
          {prefix}
        </div>
      )}
      <div
        style={{
          fontSize,
          fontWeight: 600,
          color: accentColor,
          borderBottom: `2px dashed ${accentColor}40`,
          display: "inline-block",
          paddingBottom: 4,
          minWidth: 120,
        }}
      >
        {defaultName}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Form Builder                                                       */
/* ------------------------------------------------------------------ */

interface FormField {
  id?: string;
  label?: string;
  type?: string;
  placeholder?: string;
  options?: string[];
  required?: boolean;
}

function FormBuilderWidget({ config }: { config: Record<string, unknown> }) {
  const title = str(config.title, "Bieu mau");
  const subtitle = str(config.subtitle, "");
  const fields = arr<FormField>(config.fields, [
    { id: "1", label: "Ho ten", type: "text", placeholder: "Nhap ho ten" },
    { id: "2", label: "So dien thoai", type: "tel", placeholder: "Nhap SDT" },
  ]);
  const buttonText = str(config.buttonText, "Gui");
  const accentColor = str(config.accentColor, "#e11d48");
  const textColor = str(config.textColor, "#1f2937");
  const background = str(config.background, "#ffffff");
  const borderRadius = num(config.borderRadius, 12);

  return (
    <div
      style={{
        background,
        borderRadius,
        padding: 20,
        width: "100%",
        color: textColor,
      }}
    >
      <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 4 }}>
        {title}
      </div>
      {subtitle && (
        <div style={{ fontSize: 13, opacity: 0.7, marginBottom: 16 }}>
          {subtitle}
        </div>
      )}
      {fields.map((field, i) => (
        <div key={field.id ?? i} style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 12, fontWeight: 500, marginBottom: 4 }}>
            {field.label ?? `Truong ${i + 1}`}
            {field.required && (
              <span style={{ color: accentColor, marginLeft: 2 }}>*</span>
            )}
          </div>
          {field.type === "select" ? (
            <div
              style={{
                border: "1px solid #d1d5db",
                borderRadius: 8,
                padding: "8px 12px",
                fontSize: 13,
                color: "#9ca3af",
              }}
            >
              {field.placeholder ?? "Chon..."}
            </div>
          ) : field.type === "textarea" ? (
            <div
              style={{
                border: "1px solid #d1d5db",
                borderRadius: 8,
                padding: "8px 12px",
                fontSize: 13,
                color: "#9ca3af",
                minHeight: 60,
              }}
            >
              {field.placeholder ?? "Nhap noi dung..."}
            </div>
          ) : (
            <div
              style={{
                border: "1px solid #d1d5db",
                borderRadius: 8,
                padding: "8px 12px",
                fontSize: 13,
                color: "#9ca3af",
              }}
            >
              {field.placeholder ?? "Nhap..."}
            </div>
          )}
        </div>
      ))}
      <div
        style={{
          background: accentColor,
          color: "#fff",
          padding: 10,
          borderRadius: 8,
          textAlign: "center",
          fontSize: 14,
          fontWeight: 600,
          marginTop: 8,
        }}
      >
        {buttonText}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main renderer                                                      */
/* ------------------------------------------------------------------ */

const WIDGET_MAP: Record<
  string,
  React.ComponentType<{ config: Record<string, unknown> }>
> = {
  countdown: CountdownWidget,
  calendar: CalendarWidget,
  map: MapWidget,
  rsvp: RsvpWidget,
  qrbox: QrBoxWidget,
  album: AlbumWidget,
  envelope: EnvelopeWidget,
  youtube: YoutubeWidget,
  callbutton: CallButtonWidget,
  guestname: GuestNameWidget,
  formbuilder: FormBuilderWidget,
};

export function WidgetRenderer({
  widgetType,
  config,
}: {
  widgetType: string;
  config: Record<string, unknown>;
}) {
  const Component = WIDGET_MAP[widgetType];

  if (!Component) {
    return (
      <div
        style={{
          padding: 16,
          background: "#fef2f2",
          borderRadius: 8,
          color: "#991b1b",
          fontSize: 13,
          textAlign: "center",
        }}
      >
        Widget khong ho tro: {widgetType}
      </div>
    );
  }

  return <Component config={config} />;
}

export default WidgetRenderer;
