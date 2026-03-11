"use client";

import { usePathname } from "next/navigation";
import BottomNav from "./BottomNav";

export default function BottomNavGate() {
  const pathname = usePathname();
  if (pathname === "/") return null; // اخفاء بالـ Landing
  return <BottomNav />;
}