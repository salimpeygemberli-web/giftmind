"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { readQuiz, writeQuiz, type Occasion } from "../../lib/quizStore";

type Lang = "en" | "ar";

const TEXT: Record<Lang, any> = {
  en: {
    title: "What’s the occasion?",
    subtitle: "Choose one to match the moment.",
    items: {
      birthday: "Birthday",
      anniversary: "Anniversary",
      wedding: "Wedding",
      new_baby: "New Baby",
      graduation: "Graduation",
      thank_you: "Thank You",
      get_well: "Get Well Soon",
      just_because: "Just Because",
    },
    back: "Back",
    next: "Next",
  },
  ar: {
    title: "ما المناسبة؟",
    subtitle: "اختر مناسبة واحدة لتناسب اللحظة.",
    items: {
      birthday: "عيد ميلاد",
      anniversary: "ذكرى سنوية",
      wedding: "زواج",
      new_baby: "مولود جديد",
      graduation: "تخرج",
      thank_you: "شكر/امتنان",
      get_well: "سلامات",
      just_because: "بدون سبب",
    },
    back: "رجوع",
    next: "التالي",
  },
};

export default function OccasionPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  const [lang, setLang] = useState<Lang>("en");
  const [country, setCountry] = useState("JO");
  const [recipient, setRecipient] = useState<string | undefined>(undefined);
  const [occasion, setOccasion] = useState<Occasion | null>(null);

  useEffect(() => {
    setMounted(true);
    const data = readQuiz();
    const l: Lang = data.lang === "ar" ? "ar" : "en";
    setLang(l);
    setCountry(data.country || "JO");
    setRecipient(data.recipient);

    // لو ما اختار recipient قبل، رجّعه للبداية الصحيحة
    if (!data.recipient) {
      router.replace("/quiz/recipient");
      return;
    }

    if (data.occasion) setOccasion(data.occasion);
  }, [router]);

  const t = useMemo(() => TEXT[lang], [lang]);
  const dir = lang === "ar" ? "rtl" : "ltr";

  function goBack() {
    router.push("/quiz/recipient");
  }

  function goNext() {
    if (!occasion) return;
    const prev = readQuiz();
    writeQuiz({ ...prev, occasion });
    router.push("/quiz/goal"); // الخطوة الجاية
  }

  if (!mounted) {
    return (
      <main
        dir="ltr"
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 24,
          background: "#f6f7fb",
        }}
      />
    );
  }

  const items: { key: Occasion; label: string }[] = [
    { key: "birthday", label: t.items.birthday },
    { key: "anniversary", label: t.items.anniversary },
    { key: "wedding", label: t.items.wedding },
    { key: "new_baby", label: t.items.new_baby },
    { key: "graduation", label: t.items.graduation },
    { key: "thank_you", label: t.items.thank_you },
    { key: "get_well", label: t.items.get_well },
    { key: "just_because", label: t.items.just_because },
  ];

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
        <div style={{ display: "flex", justifyContent: "space-between", gap: 16 }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 34, letterSpacing: -0.4 }}>{t.title}</h1>
            <p style={{ margin: "10px 0 0", color: "#6b7280" }}>{t.subtitle}</p>
          </div>

          <div
            style={{
              minWidth: 220,
              textAlign: dir === "rtl" ? "left" : "right",
              color: "#6b7280",
              fontSize: 14,
            }}
          >
            <div>Lang: <strong style={{ color: "#111" }}>{lang.toUpperCase()}</strong></div>
            <div>Country: <strong style={{ color: "#111" }}>{country}</strong></div>
            <div>Recipient: <strong style={{ color: "#111" }}>{recipient ?? "-"}</strong></div>
          </div>
        </div>

        <div
          style={{
            marginTop: 22,
            display: "grid",
            gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
            gap: 12,
          }}
        >
          {items.map((it) => {
            const active = occasion === it.key;
            return (
              <button
                key={it.key}
                onClick={() => setOccasion(it.key)}
                style={{
                  padding: 16,
                  borderRadius: 14,
                  border: active ? "2px solid #111" : "1px solid #e5e7eb",
                  background: active ? "#f3f4f6" : "white",
                  cursor: "pointer",
                  textAlign: "start",
                }}
              >
                <div style={{ fontSize: 16, fontWeight: 800, color: "#111" }}>
                  {it.label}
                </div>
                <div style={{ marginTop: 6, fontSize: 13, color: "#6b7280" }}>
                  {lang === "ar" ? "اضغط للاختيار" : "Tap to select"}
                </div>
              </button>
            );
          })}
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
            disabled={!occasion}
            style={{
              flex: 1,
              padding: "14px 16px",
              borderRadius: 14,
              border: "none",
              background: !occasion ? "#9ca3af" : "#0b0b0b",
              color: "white",
              cursor: !occasion ? "not-allowed" : "pointer",
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
