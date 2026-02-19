"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { readQuiz, writeQuiz } from "../../lib/quizStore";

type Lang = "en" | "ar";

const TEXT: Record<Lang, any> = {
  en: {
    title: "What’s your budget?",
    subtitle: "Drag the slider to set your budget.",
    currency: "USD",
    back: "Back",
    next: "Next",
  },
  ar: {
    title: "ما ميزانيتك؟",
    subtitle: "حرّك المؤشر لتحديد الميزانية.",
    currency: "USD",
    back: "رجوع",
    next: "التالي",
  },
};

export default function BudgetPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  const [lang, setLang] = useState<Lang>("en");
  const [value, setValue] = useState<number>(150);

  useEffect(() => {
    setMounted(true);
    const data = readQuiz();
    const l: Lang = data.lang === "ar" ? "ar" : "en";
    setLang(l);

    // حماية المسار: لازم personality موجودة قبل budget
    if (!data.personality) {
      router.replace("/quiz/personality");
      return;
    }

    if (typeof data.budget === "number") setValue(data.budget);
  }, [router]);

  const t = useMemo(() => TEXT[lang], [lang]);
  const dir = lang === "ar" ? "rtl" : "ltr";

  function goBack() {
    router.push("/quiz/personality");
  }

  function goNext() {
    const prev = readQuiz();
    writeQuiz({ ...prev, budget: value });
    router.push("/quiz/results");
  }

  if (!mounted) return null;

  return (
    <main
      dir={dir}
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        background: "#f6f7fb",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 760,
          background: "white",
          borderRadius: 18,
          padding: 28,
          boxShadow: "0 10px 40px rgba(0,0,0,0.08)",
        }}
      >
        <h1 style={{ margin: 0, fontSize: 34, letterSpacing: -0.4 }}>{t.title}</h1>
        <p style={{ margin: "10px 0 0", color: "#6b7280" }}>{t.subtitle}</p>

        <div style={{ marginTop: 22 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
              gap: 12,
            }}
          >
            <div style={{ fontSize: 14, color: "#6b7280" }}>
              {lang === "ar" ? "القيمة المختارة" : "Selected"}
            </div>
            <div style={{ fontSize: 26, fontWeight: 900 }}>
              {value} <span style={{ fontSize: 14, color: "#6b7280" }}>{t.currency}</span>
            </div>
          </div>

          <div style={{ marginTop: 14 }}>
            <input
              type="range"
              min={20}
              max={500}
              step={10}
              value={value}
              onChange={(e) => setValue(Number(e.target.value))}
              style={{ width: "100%" }}
            />
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, color: "#9ca3af", fontSize: 12 }}>
            <span>20</span>
            <span>500</span>
          </div>

          <div style={{ marginTop: 10, color: "#6b7280", fontSize: 13 }}>
            {lang === "ar"
              ? "نصيحة: إذا بدك شي فخم، ارفع الميزانية شوي."
              : "Tip: For premium gifts, increase the budget a bit."}
          </div>
        </div>

        <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
          <button
            onClick={goBack}
            style={{
              flex: 1,
              padding: "14px 16px",
              borderRadius: 14,
              border: "1px solid #e5e7eb",
              background: "white",
              cursor: "pointer",
              fontWeight: 700,
            }}
          >
            {t.back}
          </button>

          <button
            onClick={goNext}
            style={{
              flex: 1,
              padding: "14px 16px",
              borderRadius: 14,
              border: "none",
              background: "#0b0b0b",
              color: "white",
              cursor: "pointer",
              fontWeight: 800,
            }}
          >
            {t.next}
          </button>
        </div>
      </div>
    </main>
  );
}
