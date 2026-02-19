import { NextResponse } from "next/server";

type MerchantLinkType = "maps" | "instagram" | "website" | "whatsapp" | "phone";

type Merchant = {
  id: string;
  name: string;
  distanceKm: number;
  country?: string; // JO / AE / ...
  tags?: string[]; // optional
  links: Array<{ type: MerchantLinkType; url: string }>;
};

const DEMO_MERCHANTS: Merchant[] = [
  // Jordan (Amman)
  {
    id: "jo-m1",
    name: "Abu Shakra Perfumes",
    distanceKm: 6.6,
    country: "JO",
    tags: ["perfume", "luxury"],
    links: [{ type: "maps", url: "https://maps.google.com/?q=Abu+Shakra+Perfumes+Amman" }],
  },
  {
    id: "jo-m2",
    name: "Samir & Mamis Chocolate (Amman)",
    distanceKm: 7.9,
    country: "JO",
    tags: ["chocolate", "gift"],
    links: [{ type: "maps", url: "https://maps.google.com/?q=Samir+%26+Mamis+Amman" }],
  },
  {
    id: "jo-m3",
    name: "Luxury Chocolate House (Amman)",
    distanceKm: 9.4,
    country: "JO",
    tags: ["chocolate", "luxury"],
    links: [{ type: "maps", url: "https://maps.google.com/?q=Luxury+Chocolate+House+Amman" }],
  },

  // UAE (Dubai) - demo
  {
    id: "ae-m1",
    name: "Dubai Luxury Chocolates (Demo)",
    distanceKm: 4.2,
    country: "AE",
    tags: ["chocolate", "gift"],
    links: [{ type: "maps", url: "https://maps.google.com/?q=Luxury+Chocolates+Dubai" }],
  },
  {
    id: "ae-m2",
    name: "Premium Perfumes Dubai (Demo)",
    distanceKm: 5.1,
    country: "AE",
    tags: ["perfume", "luxury"],
    links: [{ type: "maps", url: "https://maps.google.com/?q=Premium+Perfumes+Dubai" }],
  },
  {
    id: "ae-m3",
    name: "Romantic Dinner Experience Dubai (Demo)",
    distanceKm: 6.0,
    country: "AE",
    tags: ["experience", "romantic"],
    links: [{ type: "maps", url: "https://maps.google.com/?q=Romantic+Dinner+Dubai" }],
  },
];

function pick3ByCountry(country: string | null) {
  const list = country
    ? DEMO_MERCHANTS.filter((m) => (m.country || "").toUpperCase() === country.toUpperCase())
    : DEMO_MERCHANTS;

  // إذا ما كفى، نكمّل من العام
  const base = list.length >= 3 ? list : [...list, ...DEMO_MERCHANTS];

  // نضمن 3 عناصر
  const unique: Merchant[] = [];
  const seen = new Set<string>();
  for (const m of base) {
    if (seen.has(m.id)) continue;
    seen.add(m.id);
    unique.push(m);
    if (unique.length === 3) break;
  }

  // كحل أخير لو صار شيء غريب
  return unique.length >= 3 ? unique : DEMO_MERCHANTS.slice(0, 3);
}

export async function POST(req: Request) {
  // نقرأ body لو موجود (emotion/goal/country/lat/lng)
  let country: string | null = null;
  let goal: string | null = null;

  try {
    const body = await req.json();
    country = body?.country ? String(body.country) : null;
    goal = body?.goal ? String(body.goal) : null;
  } catch {
    // ignore
  }

  const merchants = pick3ByCountry(country);

  return NextResponse.json({
    mode: "demo",
    country,
    goal,
    merchants,
  });
}
