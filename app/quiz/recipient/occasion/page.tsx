"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { normalizeLang, tSection } from "../../lib/i18n";
import { readQuiz, writeQuiz } from "../../lib/quizStore";

type Occasion =
  | "birthday"
  | "anniversary"
  | "wedding"
  | "thankyou"
  | "ramadan"
  | "justbecause";

export default function Page() {
  const router = useRouter();

  const data = readQuiz();
  const lang = normalizeLang(data?.lang || "en");
  const t = tSection("occasion", lang);

  const [selected, setSelected] = useState<Occasion | null>(
    (data?.occasion as Occasion) || null
  );

  const options: Array<{ key: Occasion; label: string; sub: string }> = [
    { key: "birthday", label: "🎂 Birthday", sub: "Celebrate their day" },
    { key: "anniversary", label: "💍 Anniversary", sub: "A special date" },
    { key: "wedding", label: "👰 Wedding", sub: "A meaningful gift" },
    { key: "thankyou", label: "🙏 Thank you", sub: "Show appreciation" },
    { key: "ramadan", label: "🌙 Ramadan", sub: "Seasonal gifting" },
    { key: "justbecause", label: "✨ Just because", sub: "No reason needed" },
  ];

  function choose(opt: Occasion) {
    setSelected(opt);

    const current = readQuiz();
    writeQuiz({
      ...current,
      occasion: opt,
    });

    // الخطوة التالية (لسه ما عملناها): goal
    router.push("/quiz/goal");
  }

  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ marginBottom: 6 }}>
        {t?.("title") || (lang === "ar" ? "ما المناسبة؟" : "What’s the occasion?")}
      </h1>

      <p style={{ marginTop: 0, color: "#555", marginBottom: 16 }}>
        {lang === "ar" ? "اختر المناسبة" : "Pick the occasion"}
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: 12,
          maxWidth: 640,
        }}
      >
        {options.map((opt) => {
          const active = selected === opt.key;

          return (
            <button
              key={opt.key}
              onClick={() => choose(opt.key)}
              style={{
                padding: 16,
                borderRadius: 14,
                border: active ? "2px solid #111" : "1px solid #ddd",
                background: active ? "#111" : "#fff",
                color: active ? "#fff" : "#111",
                cursor: "pointer",
                textAlign: "left",
              }}
            >
              <div style={{ fontWeight: 800, fontSize: 15 }}>{opt.label}</div>
              <div style={{ opacity: active ? 0.9 : 0.7, fontSize: 13, marginTop: 6 }}>
                {opt.sub}
              </div>
            </button>
          );
        })}
      </div>

      <div style={{ marginTop: 16 }}>
        <button
          onClick={() => router.push("/quiz/recipient")}
          style={{
            border: "1px solid #ddd",
            background: "#fff",
            padding: "10px 14px",
            borderRadius: 12,
            cursor: "pointer",
          }}
        >
          {lang === "ar" ? "رجوع" : "Back"}
        </button>
      </div>
    </div>
  );
}
