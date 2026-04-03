"use client";

import { useEffect, useMemo, useState } from "react";
import { readQuiz, type QuizState } from "../lib/quizStore";
import { MERCHANTS } from "../lib/giftmind/merchants";
import { getTopMerchants } from "../lib/giftmind/scoring";
import type {
  BudgetTier,
  Occasion,
  SocialCircle,
  Tone,
  Urgency,
  UserAnswers,
} from "../lib/giftmind/types";

const TEXT = {
  en: {
    title: "Your Best Gift Matches",
    subtitle:
      "GiftMind selected these results based on occasion, social circle, tone, budget, and urgency.",
    bestMatch: "Best Match",
    alternative: "Alternative",
    newDecision: "Start New Decision",
    noDecision: "No saved quiz found. Please start from the main page.",
    why: "Why selected",
    testNote:
      "Test mode: your saved quiz was converted into GiftMind's new decision engine.",
    score: "Score",
    countryFallback:
      "Your selected country has no seeded merchants yet, so a test country was used temporarily.",
  },
  ar: {
    title: "أفضل نتائج الهدية",
    subtitle:
      "اختار GiftMind هذه النتائج بناءً على المناسبة، الدائرة الاجتماعية، النغمة، الميزانية، والاستعجال.",
    bestMatch: "أفضل اختيار",
    alternative: "بديل",
    newDecision: "ابدأ قرارًا جديدًا",
    noDecision: "لا يوجد كويز محفوظ. ارجع إلى الصفحة الرئيسية وابدأ من جديد.",
    why: "سبب الاختيار",
    testNote:
      "وضع تجريبي: تم تحويل إجابات الكويز إلى محرك GiftMind الجديد.",
    score: "النتيجة",
    countryFallback:
      "البلد المختار لا يوجد له تجار مضافون بعد، لذلك تم استخدام بلد تجريبي مؤقتًا.",
  },
};

function normalizeBudget(value?: number): BudgetTier {
  if (typeof value !== "number") return "medium";
  if (value <= 80) return "low";
  if (value <= 180) return "medium";
  if (value <= 350) return "high";
  return "luxury";
}

function normalizeOccasion(quiz: QuizState): Occasion {
  const raw = `${quiz.occasion || ""} ${quiz.goal || ""}`.toLowerCase();

  if (raw.includes("apolog")) return "apology";
  if (raw.includes("sorry")) return "apology";
  if (raw.includes("anniversary")) return "anniversary";
  if (raw.includes("birthday")) return "birthday";
  if (raw.includes("thank")) return "thank_you";
  if (raw.includes("achievement")) return "achievement";
  if (raw.includes("success")) return "achievement";
  if (raw.includes("support")) return "support";
  if (raw.includes("romance")) return "romance";
  if (raw.includes("love")) return "romance";
  if (raw.includes("surprise")) return "surprise";
  if (raw.includes("celebr")) return "celebration";

  return "celebration";
}

function normalizeSocialCircle(recipient?: string): SocialCircle {
  const raw = (recipient || "").toLowerCase();

  if (
    raw.includes("partner") ||
    raw.includes("wife") ||
    raw.includes("husband") ||
    raw.includes("spouse")
  ) {
    return "intimate";
  }

  if (
    raw.includes("family") ||
    raw.includes("brother") ||
    raw.includes("sister") ||
    raw.includes("friend") ||
    raw.includes("parent") ||
    raw.includes("mother") ||
    raw.includes("father")
  ) {
    return "close";
  }

  if (
    raw.includes("colleague") ||
    raw.includes("boss") ||
    raw.includes("manager") ||
    raw.includes("client") ||
    raw.includes("work")
  ) {
    return "professional";
  }

  return "casual";
}

function normalizeTone(quiz: QuizState): Tone {
  const raw = `${quiz.style || ""} ${quiz.personality || ""} ${quiz.goal || ""}`.toLowerCase();

  if (
    raw.includes("formal") ||
    raw.includes("classic") ||
    raw.includes("elegant") ||
    raw.includes("luxury")
  ) {
    return "formal";
  }

  if (
    raw.includes("fun") ||
    raw.includes("playful") ||
    raw.includes("adventure") ||
    raw.includes("kid")
  ) {
    return "playful";
  }

  return "balanced";
}

function normalizeUrgency(): Urgency {
  return "today";
}

function normalizeCountry(rawCountry?: string): string {
  const raw = (rawCountry || "").trim().toLowerCase();

  if (!raw) return "UAE";

  if (
    raw.includes("uae") ||
    raw.includes("ae") ||
    raw.includes("dubai") ||
    raw.includes("emirates") ||
    raw.includes("الإمارات") ||
    raw.includes("امارات")
  ) {
    return "UAE";
  }

  if (
    raw.includes("jordan") ||
    raw.includes("jo") ||
    raw.includes("amman") ||
    raw.includes("الأردن") ||
    raw.includes("اردن")
  ) {
    return "Jordan";
  }

  return "UAE";
}

function buildAnswersFromQuiz(quiz: QuizState): {
  answers: UserAnswers;
  usedCountryFallback: boolean;
} {
  const selectedCountry = normalizeCountry(quiz.country);
  const hasCountryMerchants = MERCHANTS.some(
    (m) => m.country === selectedCountry
  );

  const answers: UserAnswers = {
    country: hasCountryMerchants
      ? selectedCountry
      : MERCHANTS[0]?.country || "UAE",
    occasion: normalizeOccasion(quiz),
    budget: normalizeBudget(quiz.budget),
    urgency: normalizeUrgency(),
    socialCircle: normalizeSocialCircle(quiz.recipient),
    tone: normalizeTone(quiz),
  };

  return {
    answers,
    usedCountryFallback: !hasCountryMerchants,
  };
}
function getOnlineLink(selectedCountry: string, query: string) {
  const q = encodeURIComponent(query);

  const map: Record<string, string> = {
    AE: "https://www.amazon.ae/s?k=",
    SA: "https://www.amazon.sa/s?k=",
    US: "https://www.amazon.com/s?k=",
    JO: "https://www.amazon.ae/s?k=",
    UK: "https://www.amazon.co.uk/s?k=",
    DE: "https://www.amazon.de/s?k=",
    FR: "https://www.amazon.fr/s?k=",
    TR: "https://www.amazon.com.tr/s?k=",
    
  };
const base = map[selectedCountry] || map["US"];
return base + encodeURIComponent(q);
  
}
export default function ResultsPage() {
  const [quiz, setQuiz] = useState<QuizState | null>(null);

  useEffect(() => {
    const saved = readQuiz();
    setQuiz(saved);
  }, []);

  const lang = quiz?.lang === "ar" ? "ar" : "en";
  const t = TEXT[lang];
  const isRTL = lang === "ar";

  const computed = useMemo(() => {
    if (!quiz) return null;
    const built = buildAnswersFromQuiz(quiz);
    const results = getTopMerchants(built.answers, MERCHANTS);
    return { ...built, results };
  }, [quiz]);

 const top = computed?.results?.[0];
const country = quiz?.country || "US";

const searchQuery = [
  top?.matchedWorlds?.[0],
  quiz?.occasion,
  quiz?.recipient
]
  .filter(Boolean)
  .join(" ");

const onlineLink = getOnlineLink(country, searchQuery || "gift");

const others = computed?.results?.slice(1) || [];

  return (
    <main
      dir={isRTL ? "rtl" : "ltr"}
      className="min-h-screen bg-[#071827] text-white relative overflow-hidden"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 opacity-[0.55] bg-[radial-gradient(circle_at_20%_20%,rgba(255,215,140,0.16),transparent_55%),radial-gradient(circle_at_85%_25%,rgba(255,215,140,0.10),transparent_60%),radial-gradient(circle_at_50%_85%,rgba(255,255,255,0.06),transparent_55%)]" />
        <div className="absolute inset-0 opacity-60 bg-[radial-gradient(circle_at_50%_50%,transparent_30%,rgba(0,0,0,0.60)_100%)]" />
      </div>

      <div className="relative z-10 mx-auto max-w-3xl px-5 py-10">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <div className="text-2xl font-semibold tracking-wide">
              GiftMind
            </div>
            <div className="mt-1 text-xs text-white/60">
              {lang === "ar"
                ? "محرك قرار الهدايا العالمي"
                : "Global Gift Decision Engine"}
            </div>
          </div>

          <button
            onClick={() => (window.location.href = "/")}
            className="rounded-full border border-white/12 bg-white/6 px-5 py-3 text-sm font-semibold hover:bg-white/10 transition"
          >
            {t.newDecision}
          </button>
        </div>

        {!quiz || !computed || !top ? (
          <div className="rounded-3xl border border-white/12 bg-white/6 p-6 text-white/75">
            {t.noDecision}
          </div>
        ) : (
          <>
            <h1
              className="text-3xl sm:text-4xl font-semibold tracking-tight text-center"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              🎁 {t.title}
            </h1>

            <p className="mt-3 text-center text-white/65 max-w-2xl mx-auto">
              {t.subtitle}
            </p>

            <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/70">
              {t.testNote}
            </div>

            {computed.usedCountryFallback && (
              <div className="mt-3 rounded-2xl border border-[#d8b36a]/30 bg-[#d8b36a]/10 px-4 py-3 text-sm text-[#F2D39A]">
                {t.countryFallback}
              </div>
            )}

            <section className="mt-8 rounded-[28px] border border-[#d8b36a]/50 bg-[linear-gradient(135deg,rgba(242,211,154,0.20),rgba(185,139,69,0.08))] p-6 shadow-[0_24px_70px_rgba(0,0,0,0.40)]">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="max-w-[78%]">
                  <div className="inline-flex rounded-full border border-[#d8b36a]/55 bg-black/10 px-3 py-1 text-xs text-[#F2D39A]">
                    ⭐ {t.bestMatch}
                  </div>

                  <div className="mt-4 text-2xl font-semibold">{top.name}</div>

                  <div className="mt-2 text-white/70">
                    {top.matchedWorlds.join(" • ")}
                  </div>
                </div>

                <div className="h-16 w-16 rounded-full grid place-items-center border border-[#F2D39A]/55 bg-black/15 text-lg font-bold">
                  {top.score}
                </div>
              </div>

              <div className="mt-5">
                <div className="mb-2 text-sm text-white/65">{t.why}</div>
                <div className="rounded-2xl border border-white/10 bg-black/10 px-4 py-4">
                  <ul className="space-y-2 text-sm text-white/80">
                    {top.why.map((reason) => (
                      <li key={reason}>• {reason}</li>
                    ))}
                  </ul>
                  <a
  href={onlineLink}
  target="_blank"
  className="mt-4 inline-block rounded-xl bg-white/10 px-4 py-2 hover:bg-white/20"
>
  Buy Online
</a>
                </div>
              </div>
            </section>

            <section className="mt-6 space-y-4">
              {others.map((item) => (
                <div
                  key={item.id}
                  className="rounded-3xl border border-white/12 bg-white/6 p-5 shadow-[0_18px_50px_rgba(0,0,0,0.30)]"
                >
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="max-w-[78%]">
                      <div className="text-sm text-white/50">
                        {t.alternative} — {item.score}
                      </div>
                      <div className="mt-2 text-xl font-semibold">
                        {item.name}
                      </div>
                      <div className="mt-2 text-white/65">
                        {item.matchedWorlds.join(" • ")}
                      </div>
                    </div>

                    <div className="h-14 w-14 rounded-full grid place-items-center border border-white/15 bg-black/10 text-sm font-bold">
                      {item.score}
                    </div>
                  </div>

                  <div className="mt-4 rounded-2xl border border-white/10 bg-black/10 px-4 py-4">
                    <ul className="space-y-2 text-sm text-white/75">
                      {item.why.map((reason) => (
                        <li key={reason}>• {reason}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </section>
          </>
        )}
      </div>
    </main>
  );
}