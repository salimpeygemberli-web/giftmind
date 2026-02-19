"use client";

import { useRouter } from "next/navigation";
import { readQuiz, writeQuiz } from "@/app/lib/quizStore";

export default function GoalPage() {
  const router = useRouter();
  const quiz = readQuiz();
  const lang = quiz.lang || "en";

  function selectGoal(goal: string) {
    writeQuiz({ ...quiz, goal });
    router.push("/quiz/results");
  }

  const goals = [
    { id: "impress", ar: "إبهار", en: "Impress" },
    { id: "romantic", ar: "رومانسي", en: "Romantic" },
    { id: "apology", ar: "اعتذار", en: "Apology" },
    { id: "thanks", ar: "شكر", en: "Thanks" },
    { id: "surprise", ar: "مفاجأة", en: "Surprise" },
    { id: "comfort", ar: "مواساة", en: "Comfort" },
    { id: "honor", ar: "تكريم", en: "Honor" },
  ];

  return (
    <main
      dir={lang === "ar" ? "rtl" : "ltr"}
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
          maxWidth: 720,
          background: "white",
          borderRadius: 18,
          padding: 28,
          boxShadow: "0 10px 40px rgba(0,0,0,0.08)",
        }}
      >
        <h2 style={{ marginTop: 0 }}>
          {lang === "ar" ? "ماذا تريد أن تحقق بالهدية؟" : "What do you want to achieve?"}
        </h2>

        <div style={{ display: "grid", gap: 12, marginTop: 20 }}>
          {goals.map((g) => (
            <button
              key={g.id}
              onClick={() => selectGoal(g.id)}
              style={{
                padding: "16px 18px",
                borderRadius: 14,
                border: "1px solid #e5e7eb",
                background: "white",
                cursor: "pointer",
                fontSize: 16,
                fontWeight: 600,
                textAlign: "center",
              }}
            >
              {lang === "ar" ? g.ar : g.en}
            </button>
          ))}
        </div>
      </div>
    </main>
  );
}
