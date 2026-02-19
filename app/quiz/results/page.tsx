"use client";

import React, { useEffect, useMemo, useState } from "react";
import { readQuiz } from "@/app/lib/quizStore";
import { getPlan } from "@/app/lib/plan";

type Emotion =
  | "love"
  | "wow"
  | "apology"
  | "thanks"
  | "surprise"
  | "comfort"
  | "honor";

type MerchantLinkType = "maps" | "instagram" | "website" | "whatsapp" | "phone";

type MerchantCard = {
  id: string;
  name: string;
  distanceKm: number;
  links: Array<{ type: MerchantLinkType; url: string }>;
};

function bestLink(links: MerchantCard["links"]) {
  const order: MerchantLinkType[] = ["maps", "whatsapp", "instagram", "website", "phone"];
  for (const t of order) {
    const hit = links.find((l) => l.type === t);
    if (hit) return hit.url;
  }
  return links[0]?.url;
}

const UI = {
  ar: {
    title: "أفضل 3 أماكن قريبة منك",
    pickedGoal: "الهدف المختار:",
    loading: "جاري البحث عن أقرب الأماكن…",
    noGeo: "المتصفح لا يدعم تحديد الموقع.",
    geoFail: "لا يمكن تحديد موقعك. فعّل GPS أو اسمح للموقع بالوصول للموقع.",
    unknownErr: "حدث خطأ غير متوقع.",
    empty: "لا توجد نتائج قريبة الآن. جرّب توسيع الموقع أو لاحقًا.",
    go: "اذهب",
    km: "كم",
    freePlan: "نسخة Free",
    freeMsg: "أنت ترى اقتراح واحد فقط. فعّل Pro لرؤية أفضل 3 اقتراحات.",
    upgrade: "Upgrade to Pro",
  },
  en: {
    title: "Top 3 places near you",
    pickedGoal: "Selected goal:",
    loading: "Finding nearby places…",
    noGeo: "Your browser doesn't support location.",
    geoFail: "We couldn't get your location. Enable GPS or allow location access.",
    unknownErr: "Something went wrong.",
    empty: "No nearby results right now. Try again later.",
    go: "Go",
    km: "km",
    freePlan: "Free Plan",
    freeMsg: "You are seeing 1 result only. Upgrade to Pro to view top 3 suggestions.",
    upgrade: "Upgrade to Pro",
  },
} as const;

type Lang = keyof typeof UI;

function safeLangFromStorage(): Lang {
  if (typeof window === "undefined") return "en";
  const v = String(localStorage.getItem("lang") || "").toLowerCase();
  return v === "ar" ? "ar" : "en";
}

function prettyGoal(goal: string, lang: Lang) {
  const map: Record<string, { ar: string; en: string }> = {
    thanks: { ar: "شكر", en: "Thanks" },
    surprise: { ar: "مفاجأة", en: "Surprise" },
    love: { ar: "حب", en: "Love" },
    wow: { ar: "إبهار", en: "Wow" },
    apology: { ar: "اعتذار", en: "Apology" },
    comfort: { ar: "مواساة", en: "Comfort" },
    honor: { ar: "تكريم", en: "Honor" },
    impress: { ar: "إبهار", en: "Impress" },
    romantic: { ar: "رومانسي", en: "Romantic" },
  };
  return map[goal]?.[lang] ?? goal;
}

// ✅ ربط الهدف بالـ Emotion
function goalToEmotion(goal: string): Emotion {
  const g = String(goal || "").toLowerCase();
  if (g === "comfort") return "comfort";
  if (g === "thanks") return "thanks";
  if (g === "surprise") return "surprise";
  if (g === "love" || g === "romantic") return "love";
  if (g === "apology") return "apology";
  if (g === "honor") return "honor";
  return "wow";
}

// ✅ تتبع ضغطة Go (مضمون حتى لو فتح رابط بسرعة)
function trackGoClick(payload: {
  merchantId: string;
  merchantName: string;
  country: string | null;
  goal: string;
}) {
  const endpoint = "/api/suggest/track-click";
  const body = JSON.stringify(payload);

  if (typeof navigator !== "undefined" && "sendBeacon" in navigator) {
    const blob = new Blob([body], { type: "application/json" });
    navigator.sendBeacon(endpoint, blob);
    return;
  }

  fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    keepalive: true,
  }).catch(() => {});
}

export default function ResultsPage() {
  const [mounted, setMounted] = useState(false);
  const [lang, setLang] = useState<Lang>("en");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [merchants, setMerchants] = useState<MerchantCard[]>([]);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    setMounted(true);
    const q = readQuiz();
    const l: Lang = q?.lang === "ar" ? "ar" : safeLangFromStorage();
    setLang(l);
  }, []);

  const t = UI[lang];

  // ✅ Plan (Free/Pro)
  const plan = useMemo(() => {
    if (!mounted) return "free";
    return getPlan(); // "free" | "pro"
  }, [mounted]);

  const goal = useMemo(() => {
    if (!mounted) return "impress";
    const q = readQuiz();
    return (q?.goal as string) || "impress";
  }, [mounted]);

  const country = useMemo(() => {
    if (!mounted) return null;
    const q = readQuiz();
    return (q?.country as string) || null;
  }, [mounted]);

  const emotion = useMemo(() => goalToEmotion(goal), [goal]);

  useEffect(() => {
    if (!mounted) return;

    if (!navigator.geolocation) {
      setError(t.noGeo);
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      },
      () => {
        setError(t.geoFail);
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  }, [mounted, t.noGeo, t.geoFail]);

  useEffect(() => {
    if (!coords) return;

    (async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch("/api/suggest", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            emotion,
            goal,
            country,
            lat: coords.lat,
            lng: coords.lng,
          }),
        });

        const ct = res.headers.get("content-type") || "";
        let data: any = null;

        if (ct.includes("application/json")) {
          data = await res.json();
        } else {
          const text = await res.text();
          throw new Error(`API returned non-JSON (${res.status}). ${text.slice(0, 80)}`);
        }

        if (!res.ok) throw new Error(data?.error || "Fetch failed");

        setMerchants(Array.isArray(data?.merchants) ? data.merchants : []);
      } catch (e: any) {
        setError(e?.message || t.unknownErr);
      } finally {
        setLoading(false);
      }
    })();
  }, [coords, emotion, goal, country, t.unknownErr]);

  const empty = useMemo(
    () => mounted && !loading && !error && merchants.length === 0,
    [mounted, loading, error, merchants]
  );

  // ✅ only 1 for free, 3 for pro
  const visibleMerchants = useMemo(() => {
    const max = plan === "pro" ? 3 : 1;
    return merchants.slice(0, max);
  }, [merchants, plan]);

  if (!mounted) {
    return (
      <div style={{ padding: 20, maxWidth: 720, margin: "0 auto" }}>
        <h1 style={{ fontSize: 22, marginBottom: 12 }}>...</h1>
        <p style={{ marginTop: 0, opacity: 0.7 }}>...</p>
        <p>Loading…</p>
      </div>
    );
  }

  return (
    <div style={{ padding: 20, maxWidth: 720, margin: "0 auto" }}>
      <h1 style={{ fontSize: 22, marginBottom: 12 }}>{t.title}</h1>

      <p style={{ marginTop: 0, opacity: 0.7 }}>
        {t.pickedGoal} <b>{prettyGoal(goal, lang)}</b>
        {country ? (
          <>
            {" "}
            — <span style={{ opacity: 0.8 }}>{country}</span>
          </>
        ) : null}
      </p>

      {loading && <p>{t.loading}</p>}

      {error && (
        <div style={{ padding: 12, border: "1px solid #ddd", borderRadius: 12 }}>
          <p style={{ margin: 0 }}>{error}</p>
        </div>
      )}

      {empty && (
        <div style={{ padding: 12, border: "1px solid #ddd", borderRadius: 12 }}>
          <p style={{ margin: 0 }}>{t.empty}</p>
        </div>
      )}

      <div style={{ display: "grid", gap: 12, marginTop: 12 }}>
        {visibleMerchants.map((m) => {
          const url = bestLink(m.links);

          return (
            <div
              key={m.id}
              style={{
                padding: 14,
                borderRadius: 16,
                border: "1px solid #eee",
                boxShadow: "0 6px 20px rgba(0,0,0,0.04)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                <div>
                  <div style={{ fontSize: 18, fontWeight: 700 }}>{m.name}</div>
                  <div style={{ opacity: 0.75, marginTop: 6 }}>
                    {Number.isFinite(m.distanceKm) ? m.distanceKm.toFixed(1) : "—"} {t.km}
                  </div>
                </div>

                {url ? (
                  <a
                    href={url}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => {
                      trackGoClick({
                        merchantId: m.id,
                        merchantName: m.name,
                        country,
                        goal,
                      });
                    }}
                    style={{
                      alignSelf: "center",
                      padding: "10px 12px",
                      borderRadius: 12,
                      border: "1px solid #ddd",
                      textDecoration: "none",
                      fontWeight: 700,
                    }}
                  >
                    {t.go}
                  </a>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>

      {/* ✅ Upgrade box (خارج map) */}
      {plan !== "pro" && merchants.length > 1 && (
        <div style={{ marginTop: 16, padding: 14, borderRadius: 14, border: "1px solid #ddd" }}>
          <b>{t.freePlan}</b>
          <p style={{ opacity: 0.8, marginTop: 6 }}>{t.freeMsg}</p>
          <a
            href="/subscribe"
            style={{ display: "inline-block", marginTop: 10, fontWeight: 700 }}
          >
            {t.upgrade}
          </a>
        </div>
      )}
    </div>
  );
}
