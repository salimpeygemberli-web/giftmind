"use client";

import { useEffect, useMemo, useState } from "react";

type Merchant = {
  id: string;
  name?: string | null;
  country?: string | null;
  city?: string | null;
  category?: string | null;
  whatsapp?: string | null;
  maps_link?: string | null;
  note?: string | null;
  status?: "pending" | "approved" | "rejected" | null;
  created_at?: string | null;
};

type Tab = "pending" | "approved" | "rejected" | "all";

export default function MerchantsAdminPage() {
  const [loading, setLoading] = useState(true);
  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const [tab, setTab] = useState<Tab>("pending");
  const [q, setQ] = useState("");

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/merchants", { cache: "no-store" });
      const json = await res.json();
      if (json?.ok) setMerchants(json.merchants || []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const counts = useMemo(() => {
    const c = { pending: 0, approved: 0, rejected: 0, all: merchants.length };
    for (const m of merchants) {
      if (m.status === "approved") c.approved++;
      else if (m.status === "rejected") c.rejected++;
      else c.pending++;
    }
    return c;
  }, [merchants]);

  const filtered = useMemo(() => {
    const qq = q.trim().toLowerCase();
    return merchants.filter((m) => {
      const statusOk =
        tab === "all" ? true : (m.status || "pending") === tab;

      const text = `${m.name || ""} ${m.country || ""} ${m.city || ""} ${m.category || ""} ${m.whatsapp || ""}`.toLowerCase();
      const searchOk = !qq || text.includes(qq);

      return statusOk && searchOk;
    });
  }, [merchants, tab, q]);

  async function setStatus(id: string, status: "pending" | "approved" | "rejected") {
    // تحديث سريع بالواجهة (Optimistic)
    setMerchants((prev) => prev.map((m) => (m.id === id ? { ...m, status } : m)));

    const res = await fetch("/api/admin/merchants", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });

    const json = await res.json();
    if (!json?.ok) {
      // رجع تحميل إذا صار خطأ
      await load();
      alert(json?.error || "Failed to update");
    }
  }

  function badge(status?: string | null) {
    const s = status || "pending";
    const bg =
      s === "approved" ? "#e8fff0" : s === "rejected" ? "#ffecec" : "#fff7e6";
    const fg =
      s === "approved" ? "#0a7a2f" : s === "rejected" ? "#b42318" : "#b25f00";
    return (
      <span
        style={{
          padding: "4px 10px",
          borderRadius: 999,
          background: bg,
          color: fg,
          fontWeight: 700,
          fontSize: 12,
          display: "inline-block",
        }}
      >
        {s.toUpperCase()}
      </span>
    );
  }

  return (
    <main style={{ minHeight: "100vh", background: "#f6f7fb", padding: 24 }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div
          style={{
            background: "white",
            borderRadius: 16,
            padding: 18,
            boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
            <div>
              <h1 style={{ margin: 0, fontSize: 26 }}>Merchants Dashboard</h1>
              <p style={{ margin: "6px 0 0", color: "#6b7280" }}>
                Review merchant join requests and approve/reject.
              </p>
            </div>

            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <button
                onClick={load}
                style={{
                  padding: "10px 12px",
                  borderRadius: 10,
                  border: "1px solid #e5e7eb",
                  background: "white",
                  cursor: "pointer",
                  fontWeight: 700,
                }}
              >
                Refresh
              </button>
            </div>
          </div>

          <div style={{ display: "flex", gap: 8, marginTop: 14, flexWrap: "wrap" }}>
            {(["pending", "approved", "rejected", "all"] as Tab[]).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                style={{
                  padding: "10px 12px",
                  borderRadius: 999,
                  border: "1px solid #e5e7eb",
                  background: tab === t ? "#111" : "white",
                  color: tab === t ? "white" : "#111",
                  cursor: "pointer",
                  fontWeight: 800,
                }}
              >
                {t === "all" ? `ALL (${counts.all})` : `${t.toUpperCase()} (${counts[t] as number})`}
              </button>
            ))}
          </div>

          <div style={{ marginTop: 12 }}>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search name, city, category, whatsapp..."
              style={{
                width: "100%",
                padding: "12px 14px",
                borderRadius: 12,
                border: "1px solid #e5e7eb",
                outline: "none",
                fontSize: 14,
              }}
            />
          </div>
        </div>

        <div style={{ marginTop: 14, background: "white", borderRadius: 16, overflow: "hidden" }}>
          <div style={{ padding: 14, borderBottom: "1px solid #eef0f3" }}>
            <strong>{loading ? "Loading..." : `${filtered.length} merchants`}</strong>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ textAlign: "left", background: "#fafafa" }}>
                  <th style={{ padding: 12, borderBottom: "1px solid #eef0f3" }}>Name</th>
                  <th style={{ padding: 12, borderBottom: "1px solid #eef0f3" }}>Country / City</th>
                  <th style={{ padding: 12, borderBottom: "1px solid #eef0f3" }}>Category</th>
                  <th style={{ padding: 12, borderBottom: "1px solid #eef0f3" }}>WhatsApp</th>
                  <th style={{ padding: 12, borderBottom: "1px solid #eef0f3" }}>Status</th>
                  <th style={{ padding: 12, borderBottom: "1px solid #eef0f3" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((m) => (
                  <tr key={m.id}>
                    <td style={{ padding: 12, borderBottom: "1px solid #eef0f3" }}>
                      <div style={{ fontWeight: 800 }}>{m.name || "-"}</div>
                      {m.note ? <div style={{ color: "#6b7280", fontSize: 12, marginTop: 4 }}>{m.note}</div> : null}
                    </td>
                    <td style={{ padding: 12, borderBottom: "1px solid #eef0f3" }}>
                      {(m.country || "-") + " / " + (m.city || "-")}
                    </td>
                    <td style={{ padding: 12, borderBottom: "1px solid #eef0f3" }}>{m.category || "-"}</td>
                    <td style={{ padding: 12, borderBottom: "1px solid #eef0f3" }}>{m.whatsapp || "-"}</td>
                    <td style={{ padding: 12, borderBottom: "1px solid #eef0f3" }}>{badge(m.status)}</td>
                    <td style={{ padding: 12, borderBottom: "1px solid #eef0f3" }}>
                      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                        <button
                          onClick={() => setStatus(m.id, "approved")}
                          style={{
                            padding: "8px 10px",
                            borderRadius: 10,
                            border: "1px solid #d1fae5",
                            background: "#ecfdf5",
                            cursor: "pointer",
                            fontWeight: 800,
                          }}
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => setStatus(m.id, "rejected")}
                          style={{
                            padding: "8px 10px",
                            borderRadius: 10,
                            border: "1px solid #fee2e2",
                            background: "#fff1f2",
                            cursor: "pointer",
                            fontWeight: 800,
                          }}
                        >
                          Reject
                        </button>
                        {m.maps_link ? (
                          <a
                            href={m.maps_link}
                            target="_blank"
                            rel="noreferrer"
                            style={{ padding: "8px 10px", borderRadius: 10, border: "1px solid #e5e7eb", fontWeight: 800, textDecoration: "none", color: "#111" }}
                          >
                            Maps
                          </a>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                ))}

                {!loading && filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ padding: 18, color: "#6b7280" }}>
                      No merchants found.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </div>

        <div style={{ marginTop: 12, color: "#6b7280", fontSize: 12 }}>
          Open dashboard URL: <code>/admin/merchants</code>
        </div>
      </div>
    </main>
  );
}