"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { readQuiz, writeQuiz } from "../../lib/quizStore";

type Lang = "en" | "ar";
type Recipient = "partner" | "friend" | "family" | "colleague" | "kid";

const TEXT: Record<Lang, any> = {
  en: {
    title: "Who is the gift for?",
    subtitle: "Choose one to tailor the suggestions.",
    items: {
      partner: "Partner",
      friend: "Friend",
      family: "Family",
      colleague: "Colleague",
      kid: "Kid",
    },
    back: "Back",
    next: "Next",
  },
  ar: {
    title: "لمن الهدية؟",
    subtitle: "اختر خيارًا واحدًا لنخصص الاقتراحات.",
    items: {
      partner: "شريك/زوج",
      friend: "صديق",
      family: "العائلة",
      colleague: "زميل عمل",
      kid: "طفل",
    },
    back: "رجوع",
    next: "التالي",
  },
};

export default function RecipientPage() {
  const router = useRouter();

  // منع hydration mismatch
  const [mounted, setMounted] = useState(false);

  const [lang, setLang] = useState<Lang>("en");
  const [country, setCountry] = useState<string>("JO");
  const [recipient, setRecipient] = useState<Recipient | null>(null);

  useEffect(() => {
    setMounted(true);
    const data = readQuiz();
    const l: Lang = data.lang === "ar" ? "ar" : "en";
    setLang(l);
    setCountry(data.country || "JO");
  }, []);

  const t = useMemo(() => TEXT[lang], [lang]);
  const dir = lang === "ar" ? "rtl" : "ltr";

  function goBack() {
    router.push("/");
  }

  function goNext() {
    if (!recipient) return;
    writeQuiz({
      lang,
      country,
      // نضيف recipient داخل نفس التخزين بدون تغيير شكل الباقي
      // (الـ store الحالي يقبل فقط lang/country، فسنوسّعه الآن بطريقة آمنة)
      // @ts-ignore
      recipient,
    } as any);

    // الخطوة الجاية لاحقًا: /quiz/occasion أو /quiz/moment
    // خلّينا مؤقتًا نودّي لصفحة النتائج أو placeholder جديد
    router.push("/quiz/occasion");
  }

  // قبل mount: رجّع UI ثابت
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

  const items: { key: Recipient; label: string }[] = [
    { key: "partner", label: t.items.partner },
    { key: "friend", label: t.items.friend },
    { key: "family", label: t.items.family },
    { key: "colleague", label: t.items.colleague },
    { key: "kid", label: t.items.kid },
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
              minWidth: 180,
              textAlign: dir === "rtl" ? "left" : "right",
              color: "#6b7280",
              fontSize: 14,
            }}
          >
            <div>
              <strong style={{ color: "#111" }}>{lang.toUpperCase()}</strong>
            </div>
            <div>Country: <strong style={{ color: "#111" }}>{country}</strong></div>
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
            const active = recipient === it.key;
            return (
              <button
                key={it.key}
                onClick={() => setRecipient(it.key)}
                style={{
                  padding: 16,
                  borderRadius: 14,
                  border: active ? "2px solid #111" : "1px solid #e5e7eb",
                  background: active ? "#f3f4f6" : "white",
                  cursor: "pointer",
                  textAlign: "start",
                  transition: "all 150ms ease",
                }}
              >
                <div style={{ fontSize: 16, fontWeight: 800, color: "#111" }}>
                  {it.label}
                </div>
                <div style={{ marginTop: 6, fontSize: 13, color: "#6b7280" }}>
                  {lang === "ar"
                    ? "اضغط للاختيار"
                    : "Tap to select"}
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
            disabled={!recipient}
            style={{
              flex: 1,
              padding: "14px 16px",
              borderRadius: 14,
              border: "none",
              background: !recipient ? "#9ca3af" : "#0b0b0b",
              color: "white",
              cursor: !recipient ? "not-allowed" : "pointer",
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
