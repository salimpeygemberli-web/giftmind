"use client";

import { usePathname } from "next/navigation";
import BottomNav from "@/app/components/BottomNav";

export default function BottomNavGate() {
  const pathname = usePathname();

  // لا نعرضه على صفحات اللغات الرئيسية (Landing)
  // مثال: /en  /ar  /fr  /tr  /es
  const isLangHome = /^\/(en|ar|fr|tr|es)$/.test(pathname);

  // ولا على root /
  if (pathname === "/" || isLangHome) return null;

  return <BottomNav />;
}