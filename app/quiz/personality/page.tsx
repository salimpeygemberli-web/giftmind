"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { readQuiz, writeQuiz, type Personality } from "../../lib/quizStore";

type Lang = "en" | "ar";

const TEXT: Record<Lang, any> = {
  en: {
    title: "What type of personality?",
    subtitle: "Choose the closest style.",
    items: {
      classic: "Classic",
      modern: "Modern",
      luxury: "Loves luxury",
      practical: "Practical",
      creative: "Creative",
      minimal: "Minimal",
    },
    back: "Back",
    next: "Next",
  },
  ar: {
    title: "ما نوع الشخصية؟",
    subtitle: "اختر النمط الأقرب له.",
    items: {
      classic: "كلاسيكي",
      modern: "عصري",
      luxury: "يحب الفخامة",
      practical: "عملي",
      creative: "مبدع",
      minimal: "بسيط",
    },
    back: "رجوع",
    next: "التالي",
  },
};

export default function PersonalityPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  const [lang, setLang] = useState<Lang>("en");
  const [country, setCountry] = useState("JO");
  const [goal, setGoal] = useState<string | undefined>(undefined);
  const [personality, setPersonality] = useState<Personality | null>(null);

  useEffect(() => {
    setMounted(true);
    const data = readQuiz();

    const l: Lang = data.lang === "ar" ? "ar" : "en";
    setLang(l);
    setCountry(data.country || "JO");
    setGoal(data.goal);

    if (!data.goal) {
      router.replace("/quiz/goal");
      return;
    }

    if (data.personality) setPersonality(data.personality);
  }, [router]);

  const t = useMemo(() => TEXT[lang], [lang]);
  const dir = lang === "ar" ? "rtl" : "ltr";

  function goBack() {
    router.push("/quiz/goal");
  }

  function goNext() {
    if (!personality) return;
    const prev = readQuiz();
    writeQuiz({ ...prev, personality });
    router.push("/quiz/budget"); // الخطوة الجاية
  }

  if (!mounted) return null;

  const items: { key: Personality; label: string }[] = [
    { key: "classic", label: t.items.classic },
    { key: "modern", label: t.items.modern },
    { key: "luxury", label: t.items.luxury },
    { key: "practical", label: t.items.practical },
    { key: "creative", label: t.items.creative },
    { key: "minimal", label: t.items.minimal },
  ];

  return (
    <main dir={dir} style={{ minHeight: "100vh", padding: 24, background: "#f6f7fb" }}>
      <div style={{ maxWidth: 760, margin: "0 auto", background: "white", borderRadius: 18, padding: 28 }}>
        <h1>{t.title}</h1>
        <p style={{ color: "#6b7280" }}>{t.subtitle}</p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 12, marginTop: 20 }}>
          {items.map((it) => (
            <button
              key={it.key}
              onClick={() => setPersonality(it.key)}
              style={{
                padding: 16,
                borderRadius: 14,
                border: personality === it.key ? "2px solid #111" : "1px solid #e5e7eb",
                background: personality === it.key ? "#f3f4f6" : "white",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              {it.label}
            </button>
          ))}
        </div>

        <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
          <button onClick={goBack} style={{ flex: 1, padding: 14 }}>{t.back}</button>
          <button
            onClick={goNext}
            disabled={!personality}
            style={{ flex: 1, padding: 14, background: "#000", color: "white" }}
          >
            {t.next}
          </button>
        </div>
      </div>
    </main>
  );
}
