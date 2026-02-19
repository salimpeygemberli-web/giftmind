// app/merchant/dashboard/page.tsx
"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/app/lib/supabaseClient";
import { getCountryLabel } from "@/app/lib/countries";

type Stat = { label: string; value: string };
type LinkItem = { label: string; value: string };


export default function MerchantDashboardPage() {
  // MVP placeholders (لاحقًا نربطها بـ Supabase)
  const stats: Stat[] = [
    { label: "Status", value: "Pending review" },
    { label: "Subscription", value: "Not active" },
    { label: "Visibility", value: "Hidden" },
  ];

  const profile: Stat[] = [
    { label: "Business name", value: "—" },
    { label: "Country", value: "—" },
    { label: "City", value: "—" },
    { label: "Category", value: "—" },
  ];

  const links: LinkItem[] = [
    { label: "WhatsApp", value: "—" },
    { label: "Google Maps", value: "—" },
    { label: "Instagram", value: "—" },
    { label: "Website", value: "—" },
  ];

  const perf: Stat[] = [
    { label: "Appearances", value: "0" },
    { label: "Clicks", value: "0" },
    { label: "Conversion", value: "—" },
  ];
type MerchantRow = {
  id: string;
  name: string | null;
  country: string | null;
  city: string | null;
  category: string | null;
  whatsapp: string | null;
  maps_link: string | null;
  instagram: string | null;
  website: string | null;
  status: string | null;
  created_at?: string;
};

const [loading, setLoading] = useState(true);
const [m, setM] = useState<MerchantRow | null>(null);

useEffect(() => {
  let cancelled = false;
  (async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("merchants")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(1);

    if (!cancelled) {
      if (error) {
        console.error(error);
        setM(null);
      } else {
        setM(data?.[0] ?? null);
      }
      setLoading(false);
    }
  })();

  return () => {
    cancelled = true;
  };
}, []);

  return (
    <main style={styles.page}>
      <header style={styles.header}>
        <div>
          <h1 style={styles.h1}>Merchant Dashboard</h1>
          <p style={styles.sub}>
            Manage your profile, links, and subscription. (MVP UI)
          </p>
        </div>

        <div style={styles.headerActions}>
          <a href="/merchant/join" style={styles.btnPrimary}>
            Edit / Submit details
          </a>
          <a href="/" style={styles.btnGhost}>
            Back to GiftMind
          </a>
        </div>
      </header>

      <section style={styles.grid}>
        <Card title="Account" desc="Your current approval & subscription state.">
          <div style={styles.badgeRow}>
            {stats.map((s) => (
              <Badge key={s.label} text={`${s.label}: ${s.value}`} />
            ))}
          </div>
          <p style={styles.note}>
            GiftMind shows up to 3 merchants after the user decides the gift. Your
            listing becomes eligible after approval.
          </p>
        </Card>

        <Card title="Business Profile" desc="Basic details used for matching.">
          <KeyValue items={profile} />
          <a href="/merchant/join" style={styles.link}>
            Update profile →
          </a>
        </Card>

        <Card title="Links" desc="Contact & social links.">
          <KeyValue items={links} />
          <a href="/merchant/join" style={styles.link}>
            Update links →
          </a>
        </Card>

        <Card title="Subscription" desc="Activate to keep visibility enabled.">
          <p style={{ ...styles.note, marginTop: 0 }}>
            (MVP) Payments integration later. For now this is UI-only.
          </p>
          <div style={styles.actionRow}>
            <button style={styles.btnPrimaryBtn} onClick={() => alert("MVP: Coming soon")}>
              Activate
            </button>
            <button style={styles.btnGhostBtn} onClick={() => alert("MVP: Coming soon")}>
              View plans
            </button>
          </div>
        </Card>

        <Card title="Performance" desc="Simple analytics (MVP placeholders).">
          <KeyValue items={perf} />
          <p style={{ ...styles.note, marginTop: 10 }}>
            Later: impressions, clicks, and conversion by country/city.
          </p>
        </Card>
      </section>

      <footer style={styles.footer}>
        Tip: Keep your city + maps link accurate for best matching.
      </footer>
    </main>
  );
}

function Card(props: { title: string; desc?: string; children: any }) {
  return (
    <div style={styles.card}>
      <div style={styles.cardHead}>
        <div style={styles.cardTitle}>{props.title}</div>
        {props.desc ? <div style={styles.cardDesc}>{props.desc}</div> : null}
      </div>
      <div>{props.children}</div>
    </div>
  );
}

function Badge({ text }: { text: string }) {
  return <span style={styles.badge}>{text}</span>;
}

function KeyValue({ items }: { items: Array<{ label: string; value: string }> }) {
  return (
    <div style={styles.kv}>
      {items.map((it) => (
        <div key={it.label} style={styles.kvRow}>
          <div style={styles.k}>{it.label}</div>
          <div style={styles.v}>{it.value}</div>
        </div>
      ))}
    </div>
  );
}

const styles: Record<string, any> = {
  page: {
    padding: 24,
    maxWidth: 1100,
    margin: "0 auto",
  },
  header: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 16,
    marginBottom: 18,
    flexWrap: "wrap",
  },
  h1: { margin: 0, fontSize: 36 },
  sub: { marginTop: 8, opacity: 0.8, lineHeight: 1.6 },
  headerActions: { display: "flex", gap: 10, flexWrap: "wrap" },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(12, 1fr)",
    gap: 14,
  },

  card: {
    gridColumn: "span 12",
    border: "1px solid rgba(0,0,0,0.12)",
    borderRadius: 16,
    padding: 16,
    background: "#fff",
  },

  // على الشاشات الواسعة نخليها عمودين
  // (CSS inline ما يدعم media queries، بس المظهر رح يضل مرتب حتى لو عمود واحد)
  cardHead: { marginBottom: 10 },
  cardTitle: { fontWeight: 900, fontSize: 18 },
  cardDesc: { marginTop: 4, opacity: 0.75, fontSize: 13, lineHeight: 1.5 },

  badgeRow: { display: "flex", gap: 10, flexWrap: "wrap", marginTop: 8 },
  badge: {
    display: "inline-flex",
    alignItems: "center",
    padding: "6px 10px",
    borderRadius: 999,
    border: "1px solid rgba(0,0,0,0.12)",
    fontSize: 13,
    fontWeight: 800,
    background: "rgba(0,0,0,0.03)",
  },

  kv: { display: "grid", gap: 8, marginTop: 8 },
  kvRow: { display: "flex", justifyContent: "space-between", gap: 12 },
  k: { opacity: 0.7 },
  v: { fontWeight: 800 },

  link: {
    display: "inline-block",
    marginTop: 12,
    textDecoration: "none",
    fontWeight: 900,
  },

  actionRow: { display: "flex", gap: 10, flexWrap: "wrap", marginTop: 12 },

  btnPrimary: {
    padding: "10px 14px",
    borderRadius: 12,
    textDecoration: "none",
    fontWeight: 900,
    background: "rgba(0,0,0,0.88)",
    color: "#fff",
  },
  btnGhost: {
    padding: "10px 14px",
    borderRadius: 12,
    textDecoration: "none",
    fontWeight: 900,
    border: "1px solid rgba(0,0,0,0.18)",
    color: "inherit",
    background: "transparent",
  },

  btnPrimaryBtn: {
    border: "none",
    padding: "10px 14px",
    borderRadius: 12,
    fontWeight: 900,
    cursor: "pointer",
    background: "rgba(0,0,0,0.88)",
    color: "#fff",
  },
  btnGhostBtn: {
    padding: "10px 14px",
    borderRadius: 12,
    fontWeight: 900,
    cursor: "pointer",
    background: "transparent",
    border: "1px solid rgba(0,0,0,0.18)",
  },

  note: { opacity: 0.75, lineHeight: 1.6, marginTop: 10 },
  footer: { marginTop: 18, opacity: 0.65, fontSize: 13 },
};

