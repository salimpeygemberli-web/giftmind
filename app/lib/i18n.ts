// app/lib/i18n.ts
export type Lang = "en" | "ar";

export function normalizeLang(x: unknown): Lang {
  const s = String(x ?? "").toLowerCase();
  return s === "ar" ? "ar" : "en";
}

type Dict = Record<string, string>;

export const TEXT: Record<string, { en: Dict; ar: Dict }> = {
  // حد أدنى حتى لا يكسر البناء — نوسعها لاحقاً
  occasion: {
    en: { title: "Choose the occasion", subtitle: "Pick one option." },
    ar: { title: "اختر المناسبة", subtitle: "اختر خياراً واحداً." },
  },
  common: {
    en: { back: "Back", next: "Next" },
    ar: { back: "رجوع", next: "التالي" },
  },
};

export function tSection(
  section: keyof typeof TEXT,
  lang: Lang
): Dict {
  const sec = TEXT[section];
  return (sec?.[lang] ?? sec?.en ?? {}) as Dict;
}
