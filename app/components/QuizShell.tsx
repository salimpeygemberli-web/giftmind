"use client";

import React from "react";

type Props = {
  dir?: "ltr" | "rtl";
  title: string;
  subtitle?: string;
  rightInfo?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
};

export default function QuizShell({
  dir = "ltr",
  title,
  subtitle,
  rightInfo,
  children,
  footer,
}: Props) {
  return (
    <main
      dir={dir}
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        padding: "34px 16px",
        background: `
          radial-gradient(1200px 700px at 50% -15%, rgba(79,70,229,0.34), transparent 62%),
          radial-gradient(900px 520px at 12% 18%, rgba(14,165,233,0.16), transparent 60%),
          radial-gradient(900px 520px at 88% 22%, rgba(168,85,247,0.12), transparent 60%),
          linear-gradient(180deg, #0B1020 0%, #0E1630 35%, #0B1020 100%)
        `,
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 760,
          borderRadius: 28,
          padding: 30,

          // Glass قوي
          background: "rgba(255,255,255,0.10)",
          backdropFilter: "blur(26px)",

          // إطار لامع يعطي فخامة
          border: "1px solid rgba(255,255,255,0.14)",
          boxShadow: "0 28px 110px rgba(0,0,0,0.45)",

          // لمعة داخلية خفيفة
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Inner glow layer */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            background:
              "radial-gradient(800px 400px at 50% 0%, rgba(255,255,255,0.10), transparent 60%)",
          }}
        />

        {/* Header */}
        <div style={{ position: "relative" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 16,
              alignItems: "flex-start",
            }}
          >
        <div style={{ flex: 1 }}>
<img
  src="/logo.jpg"
  alt="GiftMind"
  style={{
    height: 44,
    width: 44,
    borderRadius: 999,            // ✅ يخفي المربع
    objectFit: "cover",
    background: "transparent",
    boxShadow: "0 10px 30px rgba(0,0,0,0.35)",
    marginBottom: 18,
  }}
/>
  <h1
    style={{
      margin: 0,
      fontSize: 34,
      letterSpacing: -1.2,
      fontWeight: 950,
      color: "rgba(255,255,255,0.95)",
    }}
  >
    {title}
  </h1>

              {subtitle ? (
                <p
                  style={{
                    margin: "10px 0 0",
                    color: "rgba(226,232,240,0.82)",
                    lineHeight: 1.7,
                    fontSize: 15,
                  }}
                >
                  {subtitle}
                </p>
              ) : null}

              {/* AI badge */}
              <div
                style={{
                  marginTop: 12,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "8px 12px",
                  borderRadius: 999,
                  border: "1px solid rgba(99,102,241,0.35)",
                  background:
                    "linear-gradient(135deg, rgba(79,70,229,0.22), rgba(14,165,233,0.12))",
                  color: "rgba(255,255,255,0.92)",
                  fontSize: 12,
                  fontWeight: 900,
                  letterSpacing: 1.2,
                  textTransform: "uppercase",
                }}
              >
                <span
                  style={{
                    width: 9,
                    height: 9,
                    borderRadius: 99,
                    background: "linear-gradient(135deg, #6366F1, #0EA5E9)",
                    boxShadow: "0 0 0 4px rgba(99,102,241,0.16)",
                  }}
                />
                AI DECISION ENGINE
              </div>
            </div>

            {rightInfo ? (
              <div
                style={{
                  minWidth: 170,
                  textAlign: dir === "rtl" ? "left" : "right",
                  color: "rgba(226,232,240,0.78)",
                  fontSize: 13,
                }}
              >
                {rightInfo}
              </div>
            ) : null}
          </div>

          {/* Divider */}
          <div
            style={{
              marginTop: 18,
              height: 1,
              background:
                "linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent)",
            }}
          />
        </div>

        {/* Content */}
        <div style={{ marginTop: 22, position: "relative" }}>{children}</div>

        {/* Footer */}
        {footer ? <div style={{ marginTop: 22, position: "relative" }}>{footer}</div> : null}
      </div>
    </main>
  );
}