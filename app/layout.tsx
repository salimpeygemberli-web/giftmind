import "./globals.css";
import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "GiftMind",
  description: "GiftMind Decision Engine",
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <header
          style={{
            maxWidth: 920,
            margin: "0 auto",
            padding: "18px 20px",
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <div style={{ width: 56, height: 56, borderRadius: 14, border: "1px solid #ddd" }} />

          <div style={{ fontSize: 20, fontWeight: 900 }}>GiftMind</div>
        </header>

        <main style={{ maxWidth: 920, margin: "0 auto" }}>{children}</main>
      </body>
    </html>
  );
}
