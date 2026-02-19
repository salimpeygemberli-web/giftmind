"use client";

import { useEffect, useState } from "react";
import { getPlan, setPlan, type Plan } from "../lib/plan";
import Link from "next/link";

export default function SubscribePage() {
  const [plan, setPlanState] = useState<Plan>("free");

  useEffect(() => {
    setPlanState(getPlan());
  }, []);

  return (
    <main style={{ padding: 24, maxWidth: 720, margin: "0 auto" }}>
      <h1 style={{ fontSize: 28, fontWeight: 800 }}>GiftMind Pro</h1>
      <p style={{ opacity: 0.8, marginTop: 8 }}>
        افتح النتائج الكاملة + أفضل 3 اقتراحات + بدون قيود.
      </p>

      <div style={{ display: "grid", gap: 12, marginTop: 20 }}>
        <div style={{ border: "1px solid rgba(255,255,255,.12)", borderRadius: 16, padding: 16 }}>
          <h3 style={{ fontWeight: 700 }}>Free</h3>
          <p style={{ opacity: 0.8 }}>اقتراح واحد + معلومات مختصرة</p>
          <button
            onClick={() => {
              setPlan("free");
              setPlanState("free");
            }}
            style={{ marginTop: 10, padding: "10px 14px", borderRadius: 12 }}
          >
            تفعيل Free
          </button>
        </div>

        <div style={{ border: "1px solid rgba(255,255,255,.18)", borderRadius: 16, padding: 16 }}>
          <h3 style={{ fontWeight: 700 }}>Pro</h3>
          <p style={{ opacity: 0.8 }}>أفضل 3 اقتراحات + روابط كاملة + أولويات</p>
          <button
            onClick={() => {
              setPlan("pro");
              setPlanState("pro");
            }}
            style={{ marginTop: 10, padding: "10px 14px", borderRadius: 12 }}
          >
            تفعيل Pro (تجربة)
          </button>
        </div>
      </div>

      <p style={{ marginTop: 16, opacity: 0.75 }}>
        حالياً: <b>{plan.toUpperCase()}</b>
      </p>

      <div style={{ marginTop: 18 }}>
        <Link href="/quiz/results">رجوع للنتائج</Link>
      </div>
    </main>
  );
}
