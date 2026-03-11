// app/lib/decisionEngine.ts
import type { Emotion, Merchant, PriceTier } from "./merchantModel";
import { haversineKm } from "./distance";

export type Plan = "free" | "pro";

export type DecisionInput = {
  user: { lat: number; lng: number };
  country: string | null;
  goal: string;            // عندك goal من quizStore
  emotion: Emotion;        // goalToEmotion عندك ممتاز
  budgetTier?: PriceTier;  // (لاحقاً من slider) حالياً optional
  plan: Plan;
};

export type RankedMerchant = Merchant & {
  distanceKm: number;
  score: number; // 0..100
  why: string[]; // explainability
};

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function distanceScore(distanceKm: number) {
  // 0km = 100، 10km ~ 70، 30km ~ 40، 60km ~ 20
  const s = 100 - distanceKm * 2.5;
  return clamp(s, 10, 100);
}

function priceFit(budgetTier: PriceTier | undefined, merchantTier: PriceTier) {
  if (!budgetTier) return 60; // إذا ما عنا ميزانية بعد، نعطي وسط
  const order: PriceTier[] = ["low", "mid", "high", "lux"];
  const a = order.indexOf(budgetTier);
  const b = order.indexOf(merchantTier);
  const diff = Math.abs(a - b);
  if (diff === 0) return 100;
  if (diff === 1) return 75;
  if (diff === 2) return 45;
  return 20;
}

export function rankMerchants(all: Merchant[], input: DecisionInput): RankedMerchant[] {
  const pool = all.filter((m) => !input.country || m.country === input.country);

  const ranked: RankedMerchant[] = pool.map((m) => {
    const dKm = haversineKm(input.user, { lat: m.lat, lng: m.lng });
    const dScore = distanceScore(dKm);

    const emo = clamp(m.emotionAffinity?.[input.emotion] ?? 40, 0, 100);
    const q = clamp(m.qualityScore ?? 50, 0, 100);
    const p = clamp(m.premiumScore ?? 50, 0, 100);
    const r = clamp(m.reliabilityScore ?? 50, 0, 100);
    const bFit = priceFit(input.budgetTier, m.priceTier);

    // ✅ وزن منطقي (Rule-based)
    // Emotion (أهم) + Quality + Distance + Reliability + BudgetFit + Premium
    const raw =
      emo * 0.30 +
      q * 0.22 +
      dScore * 0.18 +
      r * 0.14 +
      bFit * 0.10 +
      p * 0.06;

    const score = Math.round(clamp(raw, 0, 100));

    // ✅ Explainability (3 أسباب)
    const why: string[] = [];
    if (emo >= 70) why.push("Strong match to emotional intent");
    else if (emo >= 55) why.push("Good alignment with intent");

    if (q >= 75) why.push("High quality score");
    else if (r >= 75) why.push("Reliable provider");

    if (dKm <= 5) why.push("Very close to you");
    else if (dKm <= 12) why.push("Near your location");

    // fallback إذا نقصت
    while (why.length < 3) why.push("Optimized by Decision Engine");

    return Object.assign(m, { distanceKm: Number(dKm.toFixed(1)), score, why: why.slice(0, 3) });
  });

  ranked.sort((a, b) => b.score - a.score);

  // ✅ Free يشوف 1، Pro يشوف 3
  const max = input.plan === "pro" ? 3 : 1;
  return ranked.slice(0, max);
}