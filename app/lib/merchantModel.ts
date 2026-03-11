// app/lib/merchantModel.ts

export type Lang = "en" | "ar" | "fr" | "tr" | "es";
export type CountryCode = string; // "JO" | "AE" | ...

export type Emotion =
  | "love"
  | "wow"
  | "apology"
  | "thanks"
  | "surprise"
  | "comfort"
  | "honor";

export type GiftCategory =
  | "fine_dining"
  | "spa"
  | "perfume"
  | "watch_accessory"
  | "flowers"
  | "chocolate"
  | "experience"
  | "personalized"
  | "tech"
  | "gift_card";

export type PriceTier = "low" | "mid" | "high" | "lux";

export type MerchantLinkType = "maps" | "instagram" | "website" | "whatsapp" | "phone";

export type Merchant = {
  id: string;

  // اسم متعدد اللغات (عشان العالمية الحقيقية)
  name: Partial<Record<Lang, string>> & { en: string };

  country: CountryCode;
  city?: string;

  // موقع
  lat: number;
  lng: number;

  // خصائص القرار
  category: GiftCategory;
  priceTier: PriceTier;        // low/mid/high/lux
  qualityScore: number;        // 0..100 (تقييم داخلي)
  premiumScore: number;        // 0..100 (فخامة/براند)
  reliabilityScore: number;    // 0..100 (ثقة/تجربة/خدمة)

  // الذوق/المشاعر التي يخدمها هذا التاجر
  emotionAffinity: Partial<Record<Emotion, number>>; // 0..100 لكل Emotion

  // وسوم اختيارية تساعد engine
  tags?: string[]; // ["vip","romantic","family-friendly","fast-delivery"]

  links: Array<{ type: MerchantLinkType; url: string }>;
};

// عشان نعرض الاسم حسب اللغة مع fallback
export function getMerchantName(m: Merchant, lang: Lang) {
  return m.name[lang] || m.name.en;
}