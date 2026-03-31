import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "GiftMind",
  description: "GiftMind Decision Engine",
  manifest: "/manifest.json",
  themeColor: "#071827",
  icons: {
    icon: "/icon-192.png",
    apple: "/icon-192.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" translate="no">
      <head>
        <meta name="google" content="notranslate" />
      </head>
      <body className="min-h-screen bg-[#071827] text-white">
        {children}
      </body>
    </html>
  );
}