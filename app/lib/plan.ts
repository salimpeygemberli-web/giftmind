export type Plan = "free" | "pro";

export function getPlan(): Plan {
  if (typeof window === "undefined") return "free";
  const p = localStorage.getItem("giftmind_plan");
  return (p === "pro" ? "pro" : "free");
}

export function setPlan(p: Plan) {
  if (typeof window === "undefined") return;
  localStorage.setItem("giftmind_plan", p);
}
