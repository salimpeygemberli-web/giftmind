"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { Lang } from "./lib/countries";
import { COUNTRIES, getCountryLabel } from "./lib/countries";
import { readQuiz, writeQuiz } from "./lib/quizStore";

export default function HomePage() {
  const router = useRouter();

  // منع hydration mismatch
  const [mounted, setMounted] = useState(false);

  const [lang, setLang] = useState<Lang>("en");
  const [country, setCountry] = useState<string>("JO");

  useEffect(() => {
    setMounted(true);
    const data = readQuiz();
    setLang((data.lang as Lang) || "en");

    setCountry(data.country || "JO");
  }, []);

  // خيارات مرتبة حسب اللغة
  const options = useMemo(() => {
    const list = [...COUNTRIES];
    list.sort((a, b) =>
      (a.name[lang] ?? a.name.en).localeCompare(
        b.name[lang] ?? b.name.en,
        lang === "ar" ? "ar" : "en"
      )
    );
    return list;
  }, [lang]);

  function onStart() {
    writeQuiz({ lang, country });
    router.push("/quiz/recipient");
  }

  const dir = lang === "ar" ? "rtl" : "ltr";

  // قبل mount: رجّع UI ثابت لتفادي اختلاف السيرفر/الكلينت
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
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16 }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 40, letterSpacing: -0.5 }}>GiftMind</h1>
            <p style={{ margin: "8px 0 0", color: "#6b7280", fontSize: 16 }}>
              {lang === "ar" ? "دليلك للهدية المثالية" : "Your guide to the perfect gift"}
            </p>
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            <button
              onClick={() => setLang("ar")}
              style={{
                padding: "10px 14px",
                borderRadius: 10,
                border: "1px solid #e5e7eb",
                background: lang === "ar" ? "#f3f4f6" : "white",
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              العربية
            </button>
            <button
              onClick={() => setLang("en")}
              style={{
                padding: "10px 14px",
                borderRadius: 10,
                border: "1px solid #e5e7eb",
                background: lang === "en" ? "#f3f4f6" : "white",
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              English
            </button>
          </div>
        </div>

        <div style={{ marginTop: 28 }}>
          <h3 style={{ margin: 0, fontSize: 18 }}>
            {lang === "ar" ? "اختر الدولة" : "Choose country"}
          </h3>

          <div style={{ marginTop: 12 }}>
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              style={{
                width: "100%",
                padding: "14px 14px",
                borderRadius: 12,
                border: "1px solid #e5e7eb",
                outline: "none",
                fontSize: 16,
              }}
            >
        {options.map((c) => (
  <option key={c.code} value={c.code}>
    {getCountryLabel(c.code, lang)}
  </option>
))}

            </select>
          </div>

          <button
            onClick={onStart}
            style={{
              marginTop: 16,
              width: "100%",
              padding: "16px 18px",
              borderRadius: 14,
              border: "none",
              background: "#0b0b0b",
              color: "white",
              fontSize: 16,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            {lang === "ar" ? "ابدأ" : "Start"}
          </button>
        </div>
      </div>
    </main>
  );
}
