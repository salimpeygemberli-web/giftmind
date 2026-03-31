"use client";
import { COUNTRIES } from "@/app/lib/countries";
import { useMemo, useState } from "react";

type JoinForm = {
  businessName: string;
  country: string;
  city: string;
  category: string;
  whatsapp: string;
  mapsUrl: string;
  note: string;
};

const CATEGORIES = [
  "Perfumes",
  "Chocolate",
  "Gifts",
  "Restaurant",
  "Spa",
  "Flowers",
  "Experience",
];

export default function MerchantJoinPage() {
  const [form, setForm] = useState<JoinForm>({
    businessName: "",
    country: "JO",
    city: "",
    category: "Perfumes",
    whatsapp: "",
    mapsUrl: "",
    note: "",
  });

  const [sent, setSent] = useState(false);

  const canSend = useMemo(() => {
    return (
      form.businessName.trim().length >= 2 &&
      form.city.trim().length >= 2 &&
      form.whatsapp.trim().length >= 6
    );
  }, [form]);

  function update<K extends keyof JoinForm>(k: K, v: JoinForm[K]) {
    setForm((p) => ({ ...p, [k]: v }));
  }

  function saveDemo() {
    const key = "giftmind_merchant_join_requests";
    const prev = JSON.parse(localStorage.getItem(key) || "[]");
    prev.push({ ...form, createdAt: new Date().toISOString() });
    localStorage.setItem(key, JSON.stringify(prev));
  }

  return (
    <main style={{ padding: 20, maxWidth: 720, margin: "0 auto" }}>
      <h1 style={{ fontSize: 28, fontWeight: 900 }}>Merchant Join</h1>
      <p style={{ opacity: 0.75, marginTop: 8 }}>
        املأ البيانات وسنقوم بمراجعة الطلب وإضافة متجرك ضمن GiftMind.
      </p>

      {sent && (
        <div
          style={{
            marginTop: 14,
            padding: 12,
            borderRadius: 12,
            border: "1px solid #d1fae5",
            background: "#ecfdf5",
          }}
        >
          ✅ تم استلام طلبك (Demo). سنراجع البيانات ونتواصل معك.
        </div>
      )}

      <div style={{ display: "grid", gap: 12, marginTop: 16 }}>
        <Field label="Business name *">
          <input
            value={form.businessName}
            onChange={(e) => update("businessName", e.target.value)}
            placeholder="Abu Shakra Perfumes"
            style={inputStyle}
          />
        </Field>

       <div
  style={{
    display: "grid",
    gridTemplateColumns: "2fr 1fr",
    gap: 12,
  }}
>

       <Field label="Country">
  <select
    value={form.country}
    onChange={(e) => update("country", e.target.value)}
    style={inputStyle}
  >
{[...COUNTRIES]
  .sort((a, b) => a.name.en.localeCompare(b.name.en))
  .map((c) => (
    <option key={c.code} value={c.code}>
      {c.name.en} ({c.code})
    </option>
))}

  </select>
</Field>

          <Field label="City *">
            <input
              value={form.city}
              onChange={(e) => update("city", e.target.value)}
              placeholder="Amman"
              style={inputStyle}
            />
          </Field>
        </div>

        <Field label="Category">
          <select
            value={form.category}
            onChange={(e) => update("category", e.target.value)}
            style={inputStyle}
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </Field>

        <Field label="WhatsApp *">
          <input
            value={form.whatsapp}
            onChange={(e) => update("whatsapp", e.target.value)}
            placeholder="+9627xxxxxxx"
            style={inputStyle}
          />
        </Field>

        <Field label="Google Maps link">
          <input
            value={form.mapsUrl}
            onChange={(e) => update("mapsUrl", e.target.value)}
            placeholder="https://maps.google.com/?q=..."
            style={inputStyle}
          />
        </Field>

        <Field label="Note">
          <textarea
            value={form.note}
            onChange={(e) => update("note", e.target.value)}
            placeholder="مثال: عندي باقات هدايا + توصيل"
            style={{ ...inputStyle, minHeight: 90 }}
          />
        </Field>

        <button
          disabled={!canSend}
          onClick={() => {
            saveDemo();
            setSent(true);
          }}
          style={{
            padding: "12px 14px",
            borderRadius: 14,
            border: "1px solid #ddd",
            fontWeight: 800,
            cursor: canSend ? "pointer" : "not-allowed",
            opacity: canSend ? 1 : 0.5,
          }}
        >
          Submit request
        </button>

        <p style={{ opacity: 0.6, marginTop: 6, fontSize: 13 }}>
          * Demo الآن: يتم حفظ الطلب محليًا على جهازك. لاحقًا نربطه بـ Supabase.
        </p>
      </div>
    </main>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label style={{ display: "grid", gap: 6 }}>
      <span style={{ fontWeight: 700 }}>{label}</span>
      {children}
    </label>
  );
}

const inputStyle: React.CSSProperties = {
  padding: "11px 12px",
  borderRadius: 12,
  border: "1px solid #ddd",
  outline: "none",
};
