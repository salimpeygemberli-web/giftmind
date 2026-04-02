export type Lang = "en" | "ar";

export type Country = {
  code: string;
  name: { en: string; ar: string };
};

export const COUNTRIES: Country[] = [
  { code: "JO", name: { en: "Jordan", ar: "الأردن" } },
  { code: "AE", name: { en: "UAE", ar: "الإمارات" } },
  { code: "SA", name: { en: "Saudi Arabia", ar: "السعودية" } },
  { code: "IQ", name: { en: "Iraq", ar: "العراق" } },
  { code: "TR", name: { en: "Turkey", ar: "تركيا" } },
  { code: "KW", name: { en: "Kuwait", ar: "الكويت" } },
  { code: "QA", name: { en: "Qatar", ar: "قطر" } },
  { code: "BH", name: { en: "Bahrain", ar: "البحرين" } },
  { code: "OM", name: { en: "Oman", ar: "عُمان" } },
  { code: "EG", name: { en: "Egypt", ar: "مصر" } },
  { code: "LB", name: { en: "Lebanon", ar: "لبنان" } },
  { code: "SY", name: { en: "Syria", ar: "سوريا" } },
  { code: "PS", name: { en: "Palestine", ar: "فلسطين" } },
  { code: "YE", name: { en: "Yemen", ar: "اليمن" } },
  { code: "MA", name: { en: "Morocco", ar: "المغرب" } },
  { code: "DZ", name: { en: "Algeria", ar: "الجزائر" } },
  { code: "TN", name: { en: "Tunisia", ar: "تونس" } },
  { code: "LY", name: { en: "Libya", ar: "ليبيا" } },

  // أوروبا (مهم للسياح)
  { code: "DE", name: { en: "Germany", ar: "ألمانيا" } },
  { code: "FR", name: { en: "France", ar: "فرنسا" } },
  { code: "GB", name: { en: "United Kingdom", ar: "بريطانيا" } },
  { code: "IT", name: { en: "Italy", ar: "إيطاليا" } },
  { code: "ES", name: { en: "Spain", ar: "إسبانيا" } },
  { code: "NL", name: { en: "Netherlands", ar: "هولندا" } },
  { code: "SE", name: { en: "Sweden", ar: "السويد" } },
  { code: "CH", name: { en: "Switzerland", ar: "سويسرا" } },

  // دول عالمية
  { code: "US", name: { en: "United States", ar: "أمريكا" } },
  { code: "CA", name: { en: "Canada", ar: "كندا" } },
  { code: "AU", name: { en: "Australia", ar: "أستراليا" } },
  { code: "IN", name: { en: "India", ar: "الهند" } },
];

export function getCountryLabel(code: string, lang: Lang = "en") {
  const c = COUNTRIES.find((x) => x.code === code);
  if (!c) return code;
  return c.name[lang] ?? c.name.en;
}
