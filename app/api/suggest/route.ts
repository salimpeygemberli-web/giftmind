// app/api/suggest/route.ts
import { NextResponse } from "next/server";
import { MERCHANTS } from "@/app/lib/merchantsSeed";
import { rankMerchants } from "@/app/lib/decisionEngine";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { emotion, goal, country, lat, lng, plan } = body || {};

    if (!lat || !lng) {
      return NextResponse.json({ error: "Missing coordinates" }, { status: 400 });
    }

    const ranked = rankMerchants(MERCHANTS, {
      user: { lat, lng },
      country: country ?? null,
      goal: String(goal || "impress"),
      emotion,
      plan: plan === "pro" ? "pro" : "free",
      // budgetTier: (اختياري لاحقاً)
    });

    // ✅ رجّع نفس الشكل اللي ResultsPage يحتاجه + معلومات إضافية للعرض
    return NextResponse.json({
      merchants: ranked.map((m) => ({
        id: m.id,
        name: m.name.en,          // ResultsPage عندك حاليا name string
        distanceKm: m.distanceKm,
        links: m.links,
        score: m.score,
        why: m.why,
        category: m.category,
        priceTier: m.priceTier,
      })),
    });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Server error" }, { status: 500 });
  }
}