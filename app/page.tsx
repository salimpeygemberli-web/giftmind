"use client";

import React, { useMemo, useState } from "react";
import {
  getResultTitle,
  getResultReason,
  getResultWhy,
  getSmartReason,
} from "./lib/translations";

import { type Language } from "./lib/types";

// =========================
// TYPES
// =========================

type Country =
 
  | "Jordan"
  | "UAE"
  | "Saudi Arabia"
  | "Qatar"
  | "Kuwait"
  | "Bahrain"
  | "Oman"
  | "Turkey"
  | "Egypt"
  | "France"
  | "Germany"
  | "UK"
  | "USA"
  | "Iraq"
  | "Spain"; 

type Step = "landing" | "mode" | "q1" | "q2" | "q3" | "q4" | "results" | "yellow";
type PlanType = "gift" | "experience";

type GiftRecipient = "partner" | "friend" | "parent" | "child" | "colleague" | "family" | "";
type ChildGender = "boy" | "girl" | "twins" | "";
type ChildAge = "0-3" | "4-7" | "8-12" | "13-17" | "";
type ExperienceRecipient = "friends" | "family" | "colleagues" | "";

type GiftOccasion = "birthday" | "anniversary" | "graduation" | "new_baby" | "appreciation" | "";
type ExperienceOccasion = "birthday" | "celebration" | "appreciation" | "casual" | "";

type Budget = "low" | "medium" | "high" | "";
type GiftEmotion = "emotional" | "fun" | "luxury" | "practical" | "";
type ExperienceEmotion = "fun" | "relax" | "luxury" | "connection" | "";

type Merchant = {
  name: string;
  category: string;
  country: Country;
  city: string;
  phone?: string;
  website: string;
  instagram: string;
  tiktok: string;
  verified: boolean;
  isOnline?: boolean;
};

type ResultCard = {
  type: "symbolic" | "experience" | "tangible";
  title: string;
  description?: string; // 🔥 هذا السطر مهم
  reason: string;
  why: string;
  score: number;
  merchant: Merchant;
};
type GiftAnswers = {
  recipient: GiftRecipient;
  childGender: ChildGender;
  childAge: ChildAge;
  occasion: GiftOccasion;
  budget: Budget;
  emotion: GiftEmotion;
};

type ExperienceAnswers = {
  recipient: ExperienceRecipient;
  occasion: ExperienceOccasion;
  budget: Budget;
  emotion: ExperienceEmotion;
};

type AppState = {
  planType: PlanType;
  country: Country;
  language: Language;
  gift: GiftAnswers;
  experience: ExperienceAnswers;
};

// =========================
// CONSTANTS
// =========================
const COUNTRIES: Country[] = [
  "Jordan",
  "UAE",
  "Saudi Arabia",
  "Qatar",
  "Kuwait",
  "Bahrain",
  "Oman",
  "Turkey",
  "Egypt",
  "France",
  "Germany",
  "UK",
  "USA",
  "Iraq",
  "Spain",
];

const LANGUAGES: Language[] = ["EN", "AR", "FR", "TR", "ES"];

const SOCIALS = {
  instagram: "https://instagram.com/giftmind2026",
  tiktok: "https://www.tiktok.com/@giftmind2026",
};

const YELLOW_PAGES: { country: Country; items: { name: string; category: string }[] }[] = [
  {
    country: "Jordan",
    items: [
      { name: "Luxury Flowers", category: "Flowers & Gifts" },
      { name: "Tech Gifts", category: "Electronics" },
      { name: "Sky Lounge", category: "Restaurant" },
      { name: "Velvet Cafe", category: "Cafe" },
    ],
  },
  {
    country: "UAE",
    items: [
      { name: "Premium Gifts", category: "Luxury Gifts" },
      { name: "Perfume Boutique", category: "Perfumes" },
      { name: "Urban Experience", category: "Activities" },
    ],
  },
  {
    country: "Saudi Arabia",
    items: [
      { name: "Elegant Touch", category: "Gift Store" },
      { name: "Majlis Dining", category: "Restaurant" },
      { name: "Desert Escape", category: "Experiences" },
    ],
  },
];

const t = {
  heroTitle: {
    EN: "Get your gift in 60 seconds",
    AR: "احصل على هديتك خلال 60 ثانية",
    FR: "Trouvez votre cadeau en 60 secondes",
    TR: "Hediyeni 60 saniyede bul",
    ES: "Consigue tu regalo en 60 segundos",
  },
  heroSubtitle: {
    EN: "Gift first. Then the best way to make it happen.",
    AR: "الهدية أولًا. ثم أفضل طريقة لتنفيذها.",
    FR: "Le cadeau d'abord. Puis la meilleure façon de le réaliser.",
    TR: "Önce hediye. Sonra bunu gerçekleştirmenin en iyi yolu.",
    ES: "Primero el regalo. Luego la mejor forma de hacerlo realidad.",
  },
  country: {
    EN: "Country",
    AR: "الدولة",
    FR: "Pays",
    TR: "Ülke",
    ES: "País",
  },
  language: {
    EN: "Language",
    AR: "اللغة",
    FR: "Langue",
    TR: "Dil",
    ES: "Idioma",
  },
  start: {
    EN: "Start",
    AR: "ابدأ",
    FR: "Commencer",
    TR: "Başla",
    ES: "Empezar",
  },
  social: {
    EN: "Follow GiftMind",
    AR: "تابع GiftMind",
    FR: "Suivre GiftMind",
    TR: "GiftMind'i Takip Et",
    ES: "Sigue a GiftMind",
  },
  modeTitle: {
    EN: "Choose your direction",
    AR: "اختر اتجاهك",
    FR: "Choisissez votre direction",
    TR: "Yönünü seç",
    ES: "Elige tu dirección",
  },
  modeGiftTitle: {
    EN: "Gift",
    AR: "هدية",
    FR: "Cadeau",
    TR: "Hediye",
    ES: "Regalo",
  },
  modeGiftDesc: {
    EN: "Decide the right gift first, then the right merchant.",
    AR: "قرر الهدية المناسبة أولًا، ثم التاجر المناسب.",
    FR: "Décidez d'abord du bon cadeau, puis du bon marchand.",
    TR: "Önce doğru hediyeyi, sonra doğru satıcıyı seç.",
    ES: "Decide primero el regalo correcto y luego el comercio adecuado.",
  },
  modeExperienceTitle: {
    EN: "Shared Experience",
    AR: "تجربة جماعية",
    FR: "Expérience partagée",
    TR: "Ortak Deneyim",
    ES: "Experiencia compartida",
  },
  modeExperienceDesc: {
    EN: "Choose a place or experience for a group that wants something memorable.",
    AR: "اختر مكانًا أو تجربة لمجموعة تريد شيئًا مميزًا.",
    FR: "Choisissez un lieu ou une expérience pour un groupe qui veut quelque chose de mémorable.",
    TR: "Özel bir şey isteyen grup için mekan veya deneyim seç.",
    ES: "Elige un lugar o experiencia para un grupo que quiere algo memorable.",
  },
  q1Gift: {
    EN: "Who is this gift for?",
    AR: "لمن هذه الهدية؟",
    FR: "Pour qui est ce cadeau ?",
    TR: "Bu hediye kimin için?",
    ES: "¿Para quién es este regalo?",
  },
  q1Experience: {
    EN: "Who is this experience for?",
    AR: "لمن هذه التجربة؟",
    FR: "Pour qui est cette expérience ?",
    TR: "Bu deneyim kimin için?",
    ES: "¿Para quién es esta experiencia?",
  },
  q2Gift: {
    EN: "What is the occasion?",
    AR: "ما المناسبة؟",
    FR: "Quelle est l'occasion ?",
    TR: "Durum nedir?",
    ES: "¿Cuál es la ocasión?",
  },
  q2Experience: {
    EN: "What is the occasion?",
    AR: "ما المناسبة؟",
    FR: "Quelle est l'occasion ?",
    TR: "Durum nedir?",
    ES: "¿Cuál es la ocasión?",
  },
  q3: {
    EN: "What is your budget?",
    AR: "ما ميزانيتك؟",
    FR: "Quel est votre budget ?",
    TR: "Bütçeniz nedir?",
    ES: "¿Cuál es tu presupuesto?",
  },
  q4Gift: {
    EN: "What feeling should this gift deliver?",
    AR: "ما الشعور الذي يجب أن تقدمه هذه الهدية؟",
    FR: "Quel sentiment ce cadeau doit-il transmettre ?",
    TR: "Bu hediye hangi duyguyu vermeli?",
    ES: "¿Qué sentimiento debe transmitir este regalo?",
  },
  q4Experience: {
    EN: "What feeling should this experience deliver?",
    AR: "ما الشعور الذي يجب أن تقدمه هذه التجربة؟",
    FR: "Quel sentiment cette expérience doit-elle transmettre ?",
    TR: "Bu deneyim hangi duyguyu vermeli?",
    ES: "¿Qué sentimiento doit transmettre cette expérience?",
  },
  childType: {
    EN: "Choose child type",
    AR: "اختر نوع الطفل",
    FR: "Choisissez le type d'enfant",
    TR: "Çocuk tipini seç",
    ES: "Elige el tipo de niño",
  },
  childAge: {
    EN: "Choose age",
    AR: "اختر العمر",
    FR: "Choisissez l'âge",
    TR: "Yaşı seç",
    ES: "Elige la edad",
  },
  question: {
    EN: "Question",
    AR: "السؤال",
    FR: "Question",
    TR: "Soru",
    ES: "Pregunta",
  },
  bestMatch: {
    EN: "Best Match",
    AR: "أفضل تطابق",
    FR: "Meilleur choix",
    TR: "En İyi Eşleşme",
    ES: "Mejor opción",
  },
  whyFits: {
    EN: "Why this fits:",
    AR: "لماذا يناسب:",
    FR: "Pourquoi cela convient :",
    TR: "Neden uygun:",
    ES: "Por qué encaja:",
  },
  visitMerchant: {
    EN: "Visit Merchant",
    AR: "زيارة التاجر",
    FR: "Visiter le marchand",
    TR: "Satıcıya Git",
    ES: "Visitar comercio",
  },
  call: {
    EN: "Call",
    AR: "اتصال",
    FR: "Appeler",
    TR: "Ara",
    ES: "Llamar",
  },
  instagram: {
    EN: "Instagram",
    AR: "Instagram",
    FR: "Instagram",
    TR: "Instagram",
    ES: "Instagram",
  },
  tiktok: {
    EN: "TikTok",
    AR: "TikTok",
    FR: "TikTok",
    TR: "TikTok",
    ES: "TikTok",
  },
  askFriend: {
    EN: "Ask a Friend",
    AR: "اسأل صديق",
    FR: "Demander à un ami",
    TR: "Bir Arkadaşa Sor",
    ES: "Preguntar a un amigo",
  },
  onlineOption: {
    EN: "Online Option",
    AR: "خيار Online",
    FR: "Option Online",
    TR: "Online Seçenek",
    ES: "Opción Online",
  },
  onlineSub: {
    EN: "Local first. Online stays as fallback.",
    AR: "المحلي أولًا. Online يبقى كخيار احتياطي.",
    FR: "Le local d'abord. Online reste une option de secours.",
    TR: "Önce yerel. Online yedek seçenek olarak kalır.",
    ES: "Primero local. Online queda como respaldo.",
  },
  restart: {
    EN: "Restart",
    AR: "إعادة",
    FR: "Recommencer",
    TR: "Yeniden Başlat",
    ES: "Reiniciar",
  },
  back: {
    EN: "Back",
    AR: "رجوع",
    FR: "Retour",
    TR: "Geri",
    ES: "Volver",
  },
  selectedCountry: {
    EN: "Selected country",
    AR: "الدولة المختارة",
    FR: "Pays sélectionné",
    TR: "Seçilen ülke",
    ES: "País seleccionado",
  },
  verified: {
    EN: "GiftMind Verified",
    AR: "موثق من GiftMind",
    FR: "Vérifié par GiftMind",
    TR: "GiftMind Onaylı",
    ES: "Verificado por GiftMind",
  },
  yellowSub: {
    EN: "Global Verified Merchants",
    AR: "التجار المعتمدون عالميًا",
    FR: "Marchands vérifiés à l'échelle mondiale",
    TR: "Küresel Doğrulanmış Satıcılar",
    ES: "Comercios verificados globalmente",
  },
  yellowDesc: {
    EN: "Only selected merchants become part of GiftMind Yellow Pages.",
    AR: "فقط التجار المختارون يصبحون جزءًا من GiftMind Yellow Pages.",
    FR: "Seuls les marchands sélectionnés font partie de GiftMind Yellow Pages.",
    TR: "Sadece seçilmiş satıcılar GiftMind Yellow Pages'in parçası olur.",
    ES: "Solo los comercios seleccionados forman parte de GiftMind Yellow Pages.",
  },
};

// =========================
// HELPERS
// =========================
function initialState(): AppState {
  return {
    planType: "gift",
    country: "Jordan",
    language: "EN",
    gift: {
      recipient: "",
      childGender: "",
      childAge: "",
      occasion: "",
      budget: "",
      emotion: "",
    },
    experience: {
      recipient: "",
      occasion: "",
      budget: "",
      emotion: "",
    },
  };
}

function dirFor(lang: Language) {
  return lang === "AR" ? "rtl" : "ltr";
}

function fixUrl(url?: string) {
  if (!url) return "";
  const clean = url.trim();
  if (clean.startsWith("http://") || clean.startsWith("https://")) return clean;
  return `https://${clean}`;
}

function openLink(url: string) {
  const safeUrl = fixUrl(url);
  if (!safeUrl) return;

  if (typeof window !== "undefined") {
    window.open(safeUrl, "_blank", "noopener,noreferrer");
  }
}

async function askFriend(text: string) {
  if (typeof navigator !== "undefined" && navigator.share) {
    try {
      await navigator.share({
        title: "GiftMind",
        text,
      });
      return;
    } catch {}
  }

  if (typeof navigator !== "undefined" && navigator.clipboard) {
    await navigator.clipboard.writeText(text);
    alert("Copied");
  }
}
function getOnlineMerchant(
  country: Country,
  key: "gift" | "luxury" | "tech" | "restaurant" | "cafe" | "activity"
): Merchant {
  let website = "https://www.amazon.com/s?k=gift";

  if (country === "UAE") {
    website = "https://www.noon.com/uae-en/search?q=gift";
  } else if (country === "Saudi Arabia") {
    website = "https://www.noon.com/saudi-en/search?q=gift";
  } else if (country === "Egypt") {
    website = "https://www.noon.com/egypt-en/search?q=gift";
  } else if (country === "Jordan") {
    website = "https://www.amazon.ae/s?k=gift";
  } else if (country === "USA") {
    website = "https://www.amazon.com/s?k=gift";
  } else if (country === "UK") {
    website = "https://www.amazon.co.uk/s?k=gift";
  } else if (country === "Germany") {
    website = "https://www.amazon.de/s?k=geschenk";
  } else if (country === "France") {
    website = "https://www.amazon.fr/s?k=cadeau";
  } else if (country === "Spain") {
    website = "https://www.amazon.es/s?k=regalo";
  } else if (country === "Turkey") {
    website = "https://www.amazon.com.tr/s?k=hediye";
  } else if (country === "Iraq") {
    website = "https://www.amazon.ae/s?k=gift";
  }

  const categoryMap = {
    gift: "Online Gifts",
    luxury: "Online Premium Gifts",
    tech: "Online Tech Store",
    restaurant: "Online Experience Booking",
    cafe: "Online Gift Card",
    activity: "Online Experience",
  } as const;

  return {
    name: "Online Option",
    category: categoryMap[key as keyof typeof categoryMap],
    country,
    city: "Online",
    website,
    instagram: SOCIALS.instagram,
    tiktok: SOCIALS.tiktok,
    verified: true,
    isOnline: true,
  };
}
function merchantBy(country: Country, key: "gift" | "luxury" | "tech" | "restaurant" | "cafe" | "activity"): Merchant {
  const jordan = {
    gift: {
      name: "Luxury Flowers",
      category: "Flowers & Gifts",
      country: "Jordan" as Country,
      city: "Amman",
      phone: "+962790000001",
      website: "https://example.com/luxury-flowers",
      instagram: SOCIALS.instagram,
      tiktok: SOCIALS.tiktok,
      verified: true,
    },
    luxury: {
      name: "Elegant Touch",
      category: "Luxury Gifts",
      country: "Jordan" as Country,
      city: "Amman",
      phone: "+962790000002",
      website: "https://example.com/elegant-touch",
      instagram: SOCIALS.instagram,
      tiktok: SOCIALS.tiktok,
      verified: true,
    },
    tech: {
      name: "Tech Gifts",
      category: "Electronics",
      country: "Jordan" as Country,
      city: "Amman",
      phone: "+962790000003",
      website: "https://example.com/tech-gifts",
      instagram: SOCIALS.instagram,
      tiktok: SOCIALS.tiktok,
      verified: true,
    },
    restaurant: {
      name: "Sky Lounge",
      category: "Restaurant",
      country: "Jordan" as Country,
      city: "Amman",
      phone: "+962790000004",
      website: "https://example.com/sky-lounge",
      instagram: SOCIALS.instagram,
      tiktok: SOCIALS.tiktok,
      verified: true,
    },
    cafe: {
      name: "Velvet Cafe",
      category: "Cafe",
      country: "Jordan" as Country,
      city: "Amman",
      phone: "+962790000005",
      website: "https://example.com/velvet-cafe",
      instagram: SOCIALS.instagram,
      tiktok: SOCIALS.tiktok,
      verified: true,
    },
    activity: {
      name: "Urban Play",
      category: "Activity",
      country: "Jordan" as Country,
      city: "Amman",
      phone: "+962790000006",
      website: "https://example.com/urban-play",
      instagram: SOCIALS.instagram,
      tiktok: SOCIALS.tiktok,
      verified: true,
    },
  };
 
  const uae = {
    gift: {
      name: "Premium Gifts",
      category: "Luxury Gifts",
      country: "UAE" as Country,
      city: "Dubai",
      phone: "+971500000001",
      website: "https://example.com/premium-gifts",
      instagram: SOCIALS.instagram,
      tiktok: SOCIALS.tiktok,
      verified: true,
    },
    luxury: {
      name: "Perfume Boutique",
      category: "Perfumes",
      country: "UAE" as Country,
      city: "Dubai",
      phone: "+971500000002",
      website: "https://example.com/perfume-boutique",
      instagram: SOCIALS.instagram,
      tiktok: SOCIALS.tiktok,
      verified: true,
    },
    tech: {
      name: "Tech World",
      category: "Electronics",
      country: "UAE" as Country,
      city: "Dubai",
      phone: "+971500000003",
      website: "https://example.com/tech-world",
      instagram: SOCIALS.instagram,
      tiktok: SOCIALS.tiktok,
      verified: true,
    },
    restaurant: {
      name: "Marina Dining",
      category: "Restaurant",
      country: "UAE" as Country,
      city: "Dubai",
      phone: "+971500000004",
      website: "https://example.com/marina-dining",
      instagram: SOCIALS.instagram,
      tiktok: SOCIALS.tiktok,
      verified: true,
    },
    cafe: {
      name: "Velvet Corner",
      category: "Cafe",
      country: "UAE" as Country,
      city: "Dubai",
      phone: "+971500000005",
      website: "https://example.com/velvet-corner",
      instagram: SOCIALS.instagram,
      tiktok: SOCIALS.tiktok,
      verified: true,
    },
    activity: {
      name: "Urban Experience",
      category: "Activities",
      country: "UAE" as Country,
      city: "Dubai",
      phone: "+971500000006",
      website: "https://example.com/urban-experience",
      instagram: SOCIALS.instagram,
      tiktok: SOCIALS.tiktok,
      verified: true,
    },
  };

  const saudi = {
    gift: {
      name: "Golden Roses",
      category: "Flowers & Gifts",
      country: "Saudi Arabia" as Country,
      city: "Riyadh",
      phone: "+966500000001",
      website: "https://example.com/golden-roses",
      instagram: SOCIALS.instagram,
      tiktok: SOCIALS.tiktok,
      verified: true,
    },
    luxury: {
      name: "Elegant Touch",
      category: "Gift Store",
      country: "Saudi Arabia" as Country,
      city: "Riyadh",
      phone: "+966500000002",
      website: "https://example.com/elegant-touch-sa",
      instagram: SOCIALS.instagram,
      tiktok: SOCIALS.tiktok,
      verified: true,
    },
    tech: {
      name: "Smart Tech",
      category: "Electronics",
      country: "Saudi Arabia" as Country,
      city: "Riyadh",
      phone: "+966500000003",
      website: "https://example.com/smart-tech",
      instagram: SOCIALS.instagram,
      tiktok: SOCIALS.tiktok,
      verified: true,
    },
    restaurant: {
      name: "Majlis Dining",
      category: "Restaurant",
      country: "Saudi Arabia" as Country,
      city: "Riyadh",
      phone: "+966500000004",
      website: "https://example.com/majlis-dining",
      instagram: SOCIALS.instagram,
      tiktok: SOCIALS.tiktok,
      verified: true,
    },
    cafe: {
      name: "Calm Brew",
      category: "Cafe",
      country: "Saudi Arabia" as Country,
      city: "Riyadh",
      phone: "+966500000005",
      website: "https://example.com/calm-brew",
      instagram: SOCIALS.instagram,
      tiktok: SOCIALS.tiktok,
      verified: true,
    },
    activity: {
      name: "Desert Escape",
      category: "Experiences",
      country: "Saudi Arabia" as Country,
      city: "Riyadh",
      phone: "+966500000006",
      website: "https://example.com/desert-escape",
      instagram: SOCIALS.instagram,
      tiktok: SOCIALS.tiktok,
      verified: true,
    },
  };

const sources: Partial<Record<Country, typeof jordan>> = {
  Jordan: jordan,
  UAE: uae,
  "Saudi Arabia": saudi,
};

const source = sources[country];




const source = sources[country];

return source![key];
}

function getGiftResults(
  gift: GiftAnswers,
  country: Country,
  lang: Language
) {
 const base = {
  symbolic: merchantBy(country, "gift") ?? getOnlineMerchant(country, "gift"),
  experience: merchantBy(country, "restaurant") ?? getOnlineMerchant(country, "restaurant"),
  tangible: merchantBy(country, "luxury") ?? getOnlineMerchant(country, "luxury"),
  tech: merchantBy(country, "tech") ?? getOnlineMerchant(country, "tech"),
  activity: merchantBy(country, "activity") ?? getOnlineMerchant(country, "activity"),
}; 
  // بعده الشروط تبعك
  if (gift.recipient === "partner" && gift.emotion === "emotional") {
    return [
 {
  type: "symbolic" as const,
  title: "Memory Jar with Inside Jokes",
  description: "A personalized jar filled with shared memories and funny moments.",
  reason: "Emotional and personal, it reflects a real shared bond.",
  why: "This gives the person something concrete, memorable, and deeply personal.",
  score: 96,
  merchant: base.symbolic,
}, 
{
  type: "experience" as const,
  title: "Surprise Experience Day Together",
  description: "A planned day filled with light fun and shared moments.",
  reason: "It creates a memory, not just a purchase.",
  why: "Experiences often stay longer in memory than objects.",
  score: 92,
  merchant: base.experience,
},
{
  type: "tangible" as const,
  title: "Custom Fun Gift Box",
  description: "A curated box with small personalized items and playful surprises.",
  reason: "It feels complete, visible, and easy to appreciate instantly.",
  why: "This turns the gift into something real, presentable, and easy to enjoy.",
  score: 88,
  merchant: base.tangible,
},


    ];
  }

  if (gift.recipient === "friend" && gift.emotion === "fun") {
 return [
  {
    type: "symbolic",
    title: "Custom Memory Print from Your Funniest Chat",
    description: "Turn your inside joke into a printed keepsake or framed memory.",
    reason: "Personal and deeply connected to your friendship",
    why: "Shared memories become meaningful when turned into something real",
    score: 94,
    merchant: base.symbolic,
  },
  {
    type: "experience",
    title: "Sunset Dinner at Sky Lounge",
    description: "A relaxed dinner with atmosphere, view, and quality time together.",
    reason: "A shared experience that feels special and alive",
    why: "Experiences often stay longer in memory than objects",
    score: 91,
    merchant: base.experience,
  },
  {
    type: "tangible",
    title: "Curated Fun Gift Box",
    description: "A ready gift box with playful items and a polished presentation.",
    reason: "Clear, enjoyable, and easy to appreciate instantly",
    why: "A visible gift works well when you want fun with real presence",
    score: 87,
    merchant: base.tangible,
  },
];
  }

  if (gift.recipient === "parent" && gift.emotion === "emotional") {
    return [
      {
        type: "symbolic",
        title: "Tell Them What They Mean to You",
        reason: "A sincere message that says thank you in a lasting way.",
        why: "Parents often remember heartfelt recognition more than expensive gifts.",
        score: 96,
        merchant: base.symbolic,
      },
      {
        type: "experience",
        title: "Give Them a Day With You",
        reason: "A calm and meaningful day together becomes the gift itself.",
        why: "Presence can carry more emotional value than price.",
        score: 92,
        merchant: base.experience,
      },
      {
        type: "tangible",
        title: "Make Their Daily Life Easier",
        reason: "A thoughtful gift that improves comfort and routine.",
        why: "Care-based gifts feel like love translated into action.",
        score: 89,
        merchant: base.tangible,
      },
    ];
  }

  if (gift.recipient === "child") {
    const gender = gift.childGender;
    const age = gift.childAge;

    if (gender === "twins") {
      return [
        {
          type: "symbolic",
          title: "A Shared Memory Gift for Both",
          reason: "A coordinated idea that makes both children feel included.",
          why: "Twin gifting works best when it respects togetherness without feeling repetitive.",
          score: 92,
          merchant: base.symbolic,
        },
        {
          type: "experience",
          title: "A Twin-Friendly Shared Experience",
          reason: "A fun outing that works for both together.",
          why: "For twins, a shared moment often lands stronger than a single-object decision.",
          score: 94,
          merchant: base.activity,
        },
        {
          type: "tangible",
          title: "A Matched Pair of Joyful Gifts",
          reason: "Two gifts that feel connected without becoming boring duplicates.",
          why: "Matching with intention is better than copying without thought.",
          score: 89,
          merchant: base.tech,
        },
      ];
    }

    if (age === "0-3") {
      return [
        {
          type: "symbolic",
          title: "A Gentle First-Memory Gift",
          reason: "A soft keepsake that marks the moment beautifully.",
          why: "At this age, the emotional value is often for the family as much as the child.",
          score: 90,
          merchant: base.symbolic,
        },
        {
          type: "experience",
          title: "A Family-Friendly Outing",
          reason: "A light experience that feels easy and joyful for everyone.",
          why: "A calm experience works better than overstimulation at this stage.",
          score: 88,
          merchant: base.activity,
        },
        {
          type: "tangible",
          title: "A Safe Comfort Gift",
          reason: "Something soft, joyful, and suitable for early years.",
          why: "For young children, comfort and safety matter more than complexity.",
          score: 91,
          merchant: base.tangible,
        },
      ];
    }

    if (age === "4-7") {
      return [
        {
          type: "symbolic",
          title: "A Playful Keepsake With Imagination",
          reason: "A gift that feels personal and fun at the same time.",
          why: "At this age, imagination and identity start to matter more.",
          score: 91,
          merchant: base.symbolic,
        },
        {
          type: "experience",
          title: "A Joyful Day Full of Energy",
          reason: "A lively experience that keeps attention and excitement high.",
          why: "A memorable experience often beats another ordinary item.",
          score: 94,
          merchant: base.activity,
        },
        {
          type: "tangible",
          title: "A Gift That Feels Fun Immediately",
          reason: "Something bright, engaging, and easy to love from the first minute.",
          why: "Instant joy matters a lot in this age range.",
          score: 92,
          merchant: base.tech,
        },
      ];
    }

    if (age === "8-12" || age === "13-17") {
      return [
        {
          type: "symbolic",
          title: "A Gift With Personality",
          reason: "A more identity-driven gift that still feels personal.",
          why: "Older children respond better when the gift feels like it understands them.",
          score: 90,
          merchant: base.symbolic,
        },
        {
          type: "experience",
          title: "A High-Energy Experience",
          reason: "A memorable outing or activity with excitement built in.",
          why: "At this stage, strong experiences can outshine standard products.",
          score: 95,
          merchant: base.activity,
        },
        {
          type: "tangible",
          title: "Something They Actually Get Excited About",
          reason: "A practical but exciting choice that fits their age and interests.",
          why: "The best tangible gift here feels relevant, not childish.",
          score: 93,
          merchant: base.tech,
        },
      ];
    }
  }

  if (gift.recipient === "colleague" && gift.emotion === "luxury") {
    return [
      {
        type: "symbolic",
        title: "A Polished Prestige Gesture",
        reason: "A refined choice that feels elevated without becoming too personal.",
        why: "Professional gifting works best when it communicates value with restraint.",
        score: 88,
        merchant: base.symbolic,
      },
      {
        type: "experience",
        title: "A Premium Shared Moment",
        reason: "A polished experience that feels strong and appropriate.",
        why: "Professional impression is often created through atmosphere and tone.",
        score: 91,
        merchant: base.experience,
      },
      {
        type: "tangible",
        title: "A Premium Professional Gift",
        reason: "A high-quality item that signals seriousness and care.",
        why: "A refined gift works when respect is the main signal.",
        score: 93,
        merchant: base.tangible,
      },
    ];
  }

  return [
    {
      type: "symbolic",
      title: "A Simple Meaningful Gesture",
      reason: "A thoughtful choice that still carries intention.",
      why: "Balanced decisions work when the signal matters more than complexity.",
      score: 85,
      merchant: base.symbolic,
    },
    {
      type: "experience",
      title: "A Light Shared Experience",
      reason: "An easy moment together that still feels intentional.",
      why: "Experiences often feel more memorable than objects.",
      score: 83,
      merchant: base.experience,
    },
    {
      type: "tangible",
      title: "A Practical Gift That Works",
      reason: "A useful gift that is easy to appreciate.",
      why: "Practical gifts are safe when direction is still broad.",
      score: 80,
      merchant: base.tangible,
    },
  ];
}

function getExperienceResults(
  exp: ExperienceAnswers,
  country: Country,
  lang: Language
): ResultCard[] {
 const merchants = {
  restaurant: merchantBy(country, "restaurant") ?? getOnlineMerchant(country, "restaurant"),
  cafe: merchantBy(country, "cafe") ?? getOnlineMerchant(country, "cafe"),
  activity: merchantBy(country, "activity") ?? getOnlineMerchant(country, "activity"),
};
  if (exp.recipient === "friends" && exp.emotion === "fun") {
  return [
    {
      type: "symbolic",
      title: getResultTitle(lang, "symbolic", exp.recipient),
      reason: getSmartReason(
        lang,
        "symbolic",
        exp.recipient,
        exp.budget,
        exp.occasion
      ),
      why: getSmartReason(
        lang,
        "symbolic",
        exp.recipient,
        exp.budget,
        exp.occasion
      ),
      score: 86,
      merchant: merchants.cafe,
    },
    {
      type: "experience",
      title: getResultTitle(lang, "experience", exp.recipient),
      reason: getSmartReason(
        lang,
        "experience",
        exp.recipient,
        exp.budget,
        exp.occasion
      ),
      why: getSmartReason(
        lang,
        "experience",
        exp.recipient,
        exp.budget,
        exp.occasion
      ),
      score: 91,
      merchant: merchants.activity,
    },
    {
      type: "tangible",
      title: getResultTitle(lang, "tangible", exp.recipient),
      reason: getSmartReason(
        lang,
        "tangible",
        exp.recipient,
        exp.budget,
        exp.occasion
      ),
      why: getSmartReason(
        lang,
        "tangible",
        exp.recipient,
        exp.budget,
        exp.occasion
      ),
      score: 84,
      merchant: merchants.restaurant,
    },
  ];
}

if (exp.recipient === "family" && exp.emotion === "connection") {
  return [
    {
      type: "restaurant",
      title: "A Warm Family Dinner",
      reason: "A setting that encourages conversation, comfort, and togetherness.",
      why: "Family connection grows more through warmth than spectacle.",
      score: 94,
      merchant: merchants.restaurant,
    },
    {
      type: "cafe",
      title: "A Calm Shared Escape",
      reason: "A simple outing where everyone can breathe and reconnect.",
      why: "Families reconnect best in places that reduce pressure.",
      score: 90,
      merchant: merchants.cafe,
    },
    {
      type: "activity",
      title: getResultTitle(lang, "experience", exp.recipient),
      reason: getSmartReason(
        lang,
        "experience",
        exp.recipient,
        exp.budget,
        exp.occasion
      ),
      why: getSmartReason(
        lang,
        "experience",
        exp.recipient,
        exp.budget,
        exp.occasion
      ),
      score: 87,
      merchant: merchants.activity,
    },
  ];
}

if (exp.recipient === "colleagues" && exp.emotion === "luxury") {
  return [
    {
      type: "restaurant",
      title: getResultTitle(lang, "symbolic", exp.recipient),
      reason: getSmartReason(
        lang,
        "symbolic",
        exp.recipient,
        exp.budget,
        exp.occasion
      ),
      why: getSmartReason(
        lang,
        "symbolic",
        exp.recipient,
        exp.budget,
        exp.occasion
      ),
      score: 95,
      merchant: merchants.restaurant,
    },
    {
      type: "cafe",
      title: getResultTitle(lang, "experience", exp.recipient),
      reason: getSmartReason(
        lang,
        "experience",
        exp.recipient,
        exp.budget,
        exp.occasion
      ),
      why: getSmartReason(
        lang,
        "experience",
        exp.recipient,
        exp.budget,
        exp.occasion
      ),
      score: 89,
      merchant: merchants.cafe,
    },
    {
      type: "activity",
      title: getResultTitle(lang, "tangible", exp.recipient),
      reason: getSmartReason(
        lang,
        "tangible",
        exp.recipient,
        exp.budget,
        exp.occasion
      ),
      why: getSmartReason(
        lang,
        "tangible",
        exp.recipient,
        exp.budget,
        exp.occasion
      ),
      score: 86,
      merchant: merchants.activity,
    },
  ];
}

if (exp.emotion === "relax") {
  return [
    {
      
      type: "cafe",
      title: getResultTitle(lang, "symbolic", exp.recipient),
      reason: getSmartReason(
        lang,
        "symbolic",
        exp.recipient,
        exp.budget,
        exp.occasion
      ),
      why: getSmartReason(
        lang,
        "symbolic",
        exp.recipient,
        exp.budget,
        exp.occasion
      ),
      score: 93,
      merchant: merchants.cafe,
    },
    {
      type: "restaurant",
      title: getResultTitle(lang, "experience", exp.recipient),
      reason: getSmartReason(
        lang,
        "experience",
        exp.recipient,
        exp.budget,
        exp.occasion
      ),
      why: getSmartReason(
        lang,
        "experience",
        exp.recipient,
        exp.budget,
        exp.occasion
      ),
      score: 89,
      merchant: merchants.restaurant,
    },
    {
      type: "activity",
      title: getResultTitle(lang, "tangible", exp.recipient),
      reason: getSmartReason(
        lang,
        "tangible",
        exp.recipient,
        exp.budget,
        exp.occasion
      ),
      why: getSmartReason(
        lang,
        "tangible",
        exp.recipient,
        exp.budget,
        exp.occasion
      ),
      score: 84,
      merchant: merchants.activity,
    },
  ];
}return [
  {
    type: "restaurant",
    title: "Shared Experience",
    reason: "A balanced option that fits many shared occasions.",
    why: "It works well when you want something social and flexible.",
    score: 88,
    merchant: merchants.restaurant,
  },
  {
    type: "cafe",
    title: "Relaxed Outing",
    reason: "A lighter option for connection without pressure.",
    why: "It keeps the experience easy and comfortable.",
    score: 84,
    merchant: merchants.cafe,
  },
  {
    type: "activity",
    title: "Memorable Activity",
    reason: "Adds energy and creates a shared memory.",
    why: "Useful when you want interaction, not just a place.",
    score: 82,
    merchant: merchants.activity,
  },
];
}

// =========================
// APP
// =========================
export default function Page() {
  const [step, setStep] = useState<Step>("landing");
  const [state, setState] = useState<AppState>(initialState());
  const [childOpen, setChildOpen] = useState(false);

  const lang = state.language;
  const isRTL = lang === "AR";

const results = useMemo(() => {
  return state.planType === "gift"
    ? getGiftResults(
        state.gift,
        state.country,
        state.language as Language
      )
    : getExperienceResults(
        state.experience,
        state.country,
        state.language as Language
      );
}, [state]);
  const giftRecipients = [
    { value: "partner", label: { EN: "Partner", AR: "شريك/حبيب", FR: "Partenaire", TR: "Partner", ES: "Pareja" } },
    { value: "friend", label: { EN: "Friend", AR: "صديق", FR: "Ami", TR: "Arkadaş", ES: "Amigo" } },
    { value: "parent", label: { EN: "Parent", AR: "أحد الوالدين", FR: "Parent", TR: "Ebeveyn", ES: "Padre/Madre" } },
    { value: "colleague", label: { EN: "Colleague", AR: "زميل", FR: "Collègue", TR: "İş Arkadaşı", ES: "Colega" } },
    { value: "family", label: { EN: "Family", AR: "العائلة", FR: "Famille", TR: "Aile", ES: "Familia" } },
  ] as const;

  const experienceRecipients = [
    { value: "friends", label: { EN: "Friends", AR: "أصدقاء", FR: "Amis", TR: "Arkadaşlar", ES: "Amigos" } },
    { value: "family", label: { EN: "Family", AR: "العائلة", FR: "Famille", TR: "Aile", ES: "Familia" } },
    { value: "colleagues", label: { EN: "Colleagues", AR: "زملاء", FR: "Collègues", TR: "İş Arkadaşları", ES: "Colegas" } },
  ] as const;

  const giftOccasions = [
    { value: "birthday", label: { EN: "Birthday", AR: "عيد ميلاد", FR: "Anniversaire", TR: "Doğum Günü", ES: "Cumpleaños" } },
    { value: "anniversary", label: { EN: "Anniversary", AR: "ذكرى", FR: "Anniversaire", TR: "Yıldönümü", ES: "Aniversario" } },
    { value: "appreciation", label: { EN: "Appreciation", AR: "تقدير", FR: "Appréciation", TR: "Takdir", ES: "Apreciación" } },
    { value: "graduation", label: { EN: "Graduation", AR: "تخرج", FR: "Remise de diplôme", TR: "Mezuniyet", ES: "Graduación" } },
    { value: "new_baby", label: { EN: "New Baby", AR: "مولود جديد", FR: "Nouveau bébé", TR: "Yeni Bebek", ES: "Nuevo bebé" } },
  ] as const;

  const experienceOccasions = [
    { value: "birthday", label: { EN: "Birthday", AR: "عيد ميلاد", FR: "Anniversaire", TR: "Doğum Günü", ES: "Cumpleaños" } },
    { value: "celebration", label: { EN: "Celebration", AR: "احتفال", FR: "Célébration", TR: "Kutlama", ES: "Celebración" } },
    { value: "appreciation", label: { EN: "Appreciation", AR: "تقدير", FR: "Appréciation", TR: "Takdir", ES: "Apreciación" } },
    { value: "casual", label: { EN: "Casual", AR: "عادي", FR: "Décontracté", TR: "Rahat", ES: "Casual" } },
  ] as const;

  const budgets = [
    { value: "low", label: { EN: "Low", AR: "منخفض", FR: "Faible", TR: "Düşük", ES: "Bajo" } },
    { value: "medium", label: { EN: "Medium", AR: "متوسط", FR: "Moyen", TR: "Orta", ES: "Medio" } },
    { value: "high", label: { EN: "High", AR: "مرتفع", FR: "Élevé", TR: "Yüksek", ES: "Alto" } },
  ] as const;

  const giftEmotions = [
    { value: "emotional", label: { EN: "Emotional", AR: "عاطفي", FR: "Émotionnel", TR: "Duygusal", ES: "Emocional" } },
    { value: "fun", label: { EN: "Fun", AR: "مرح", FR: "Amusant", TR: "Eğlenceli", ES: "Divertido" } },
    { value: "luxury", label: { EN: "Luxury", AR: "فاخر", FR: "Luxe", TR: "Lüks", ES: "Lujo" } },
    { value: "practical", label: { EN: "Practical", AR: "عملي", FR: "Pratique", TR: "Pratik", ES: "Práctico" } },
  ] as const;

  const experienceEmotions = [
    { value: "fun", label: { EN: "Fun", AR: "مرح", FR: "Amusant", TR: "Eğlenceli", ES: "Divertido" } },
    { value: "relax", label: { EN: "Relax", AR: "هدوء", FR: "Détente", TR: "Rahatlık", ES: "Relax" } },
    { value: "luxury", label: { EN: "Luxury", AR: "فاخر", FR: "Luxe", TR: "Lüks", ES: "Lujo" } },
    { value: "connection", label: { EN: "Connection", AR: "تقارب", FR: "Connexion", TR: "Bağlantı", ES: "Conexión" } },
  ] as const;

  function updateCountry(country: Country) {
    setState((prev) => ({ ...prev, country }));
  }

  function updateLanguage(language: Language) {
    setState((prev) => ({ ...prev, language }));
  }

  function startPlan(planType: PlanType) {
    setState((prev) => ({
      ...prev,
      planType,
      gift: {
        recipient: "",
        childGender: "",
        childAge: "",
        occasion: "",
        budget: "",
        emotion: "",
      },
      experience: {
        recipient: "",
        occasion: "",
        budget: "",
        emotion: "",
      },
    }));
    setChildOpen(false);
    setStep("q1");
  }

  function restart() {
    setState((prev) => ({
      ...prev,
      gift: {
        recipient: "",
        childGender: "",
        childAge: "",
        occasion: "",
        budget: "",
        emotion: "",
      },
      experience: {
        recipient: "",
        occasion: "",
        budget: "",
        emotion: "",
      },
    }));
    setChildOpen(false);
    setStep("landing");
  }

  function shareResult(result: ResultCard) {
    const text = `GiftMind
${result.title}
${result.reason}
${result.why}
Merchant: ${result.merchant.name}
Country: ${state.country}`;
    void askFriend(text);
  }

  return (
    <main
      dir={dirFor(lang)}
      className="min-h-screen bg-[#02060c] text-white"
    >
      <div className="mx-auto min-h-screen max-w-md bg-black px-4 py-5 shadow-[0_0_0_1px_rgba(255,255,255,0.03)] sm:max-w-lg sm:px-6">
        {/* HEADER */}
        <div className="mb-5 flex items-start justify-between gap-3">
          <div>
            <div className="mb-2 inline-flex rounded-full border border-yellow-500/30 bg-yellow-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-yellow-300">
              60S DISCOVERY MODE
            </div>
            <h1 className="text-[32px] font-black leading-none">GiftMind</h1>
          </div>

          <button
            onClick={() => setStep("yellow")}
            className="mt-1 rounded-full border border-yellow-500/40 px-3 py-1.5 text-xs font-medium text-yellow-300 transition hover:bg-yellow-500/10"
          >
            Yellow Pages
          </button>
        </div>

        {/* LANDING */}
        {step === "landing" && (
          <section className="space-y-6">
            <div className="space-y-3">
              <h2 className="text-2xl font-black leading-tight">
                {t.heroTitle[lang]}
              </h2>
              <p className="max-w-sm text-sm leading-6 text-white/65">
                {t.heroSubtitle[lang]}
              </p>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-white/5 p-4">
              <div className="grid gap-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-white/70">
                    {t.country[lang]}
                  </label>
                  <select
                    value={state.country}
                    onChange={(e) => updateCountry(e.target.value as Country)}
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none"
                  >
                    {COUNTRIES.map((c) => (
                      <option key={c} value={c} className="text-black">
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-white/70">
                    {t.language[lang]}
                  </label>
                  <select
                    value={state.language}
                    onChange={(e) => updateLanguage(e.target.value as Language)}
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none"
                  >
                    {LANGUAGES.map((l) => (
                      <option key={l} value={l} className="text-black">
                        {l}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={() => setStep("mode")}
                  className="rounded-2xl bg-yellow-500 px-5 py-3 font-bold text-black transition hover:scale-[1.01]"
                >
                  {t.start[lang]}
                </button>
              </div>
            </div>

            <div className="rounded-[28px] border border-yellow-500/20 bg-yellow-500/5 p-4">
              <h3 className="text-lg font-black">
                {lang === "AR"
                  ? "3 قرارات فقط"
                  : lang === "FR"
                  ? "Seulement 3 décisions"
                  : lang === "TR"
                  ? "Sadece 3 karar"
                  : lang === "ES"
                  ? "Solo 3 decisiones"
                  : "Only 3 decisions"}
              </h3>
              <p className="mt-2 text-sm leading-6 text-white/65">
                {lang === "AR"
                  ? "أقل ضوضاء، قرارات أوضح، تنفيذ أسرع."
                  : lang === "FR"
                  ? "Moins de bruit, des décisions plus claires, une action plus rapide."
                  : lang === "TR"
                  ? "Daha az gürültü, daha net kararlar, daha hızlı hareket."
                  : lang === "ES"
                  ? "Menos ruido, decisiones más claras, acción más rápida."
                  : "Less noise, clearer choices, faster action."}
              </p>
            </div>

            <div className="text-center text-sm text-white/55">
              <div>{t.social[lang]}</div>
              <div className="mt-2 flex items-center justify-center gap-5 text-white/80">
                <button onClick={() => openLink(SOCIALS.instagram)}>Instagram</button>
                <button onClick={() => openLink(SOCIALS.tiktok)}>TikTok</button>
              </div>
            </div>
          </section>
        )}

        {/* MODE */}
        {step === "mode" && (
          <section className="space-y-4">
            <div>
              <h2 className="text-2xl font-black">{t.modeTitle[lang]}</h2>
            </div>

            <button
              onClick={() => startPlan("gift")}
              className="block w-full rounded-[28px] border border-yellow-500/30 bg-yellow-500/10 p-5 text-left"
            >
              <div className="text-xs uppercase tracking-[0.25em] text-yellow-300">
                {t.modeGiftTitle[lang]}
              </div>
              <div className="mt-2 text-xl font-black">{t.modeGiftTitle[lang]}</div>
              <p className="mt-2 text-sm leading-6 text-white/65">
                {t.modeGiftDesc[lang]}
              </p>
            </button>

            <button
              onClick={() => startPlan("experience")}
              className="block w-full rounded-[28px] border border-white/10 bg-white/5 p-5 text-left"
            >
              <div className="text-xs uppercase tracking-[0.25em] text-white/45">
                {t.modeExperienceTitle[lang]}
              </div>
              <div className="mt-2 text-xl font-black">
                {t.modeExperienceTitle[lang]}
              </div>
              <p className="mt-2 text-sm leading-6 text-white/65">
                {t.modeExperienceDesc[lang]}
              </p>
            </button>

            <button
              onClick={() => setStep("landing")}
              className="rounded-xl bg-white/10 px-4 py-2"
            >
              {t.back[lang]}
            </button>
          </section>
        )}

        {/* Q1 GIFT */}
        {step === "q1" && state.planType === "gift" && (
          <section className="space-y-4">
            <div className="text-sm text-white/50">
              {t.question[lang]} 1 / 4
            </div>

            <h2 className="text-xl font-black">{t.q1Gift[lang]}</h2>

            <div className="grid gap-3">
              {giftRecipients.map((item) => (
                <button
                  key={item.value}
                  onClick={() => {
                    setState((prev) => ({
                      ...prev,
                      gift: {
                        ...prev.gift,
                        recipient: item.value,
                        childGender: "",
                        childAge: "",
                      },
                    }));
                    setChildOpen(false);
                    setStep("q2");
                  }}
                  className="rounded-2xl border border-white/10 bg-white/5 p-4 text-left"
                >
                  {item.label[lang]}
                </button>
              ))}

              <button
                onClick={() => {
                  setState((prev) => ({
                    ...prev,
                    gift: {
                      ...prev.gift,
                      recipient: "child",
                      childGender: "",
                      childAge: "",
                    },
                  }));
                  setChildOpen(true);
                }}
                className={`rounded-2xl border p-4 text-left transition ${
                  childOpen
                    ? "border-yellow-500 bg-yellow-500/10 text-yellow-300"
                    : "border-white/10 bg-white/5"
                }`}
              >
                {lang === "AR"
                  ? "طفل"
                  : lang === "FR"
                  ? "Enfant"
                  : lang === "TR"
                  ? "Çocuk"
                  : lang === "ES"
                  ? "Niño/Niña"
                  : "Child"}
              </button>

              {childOpen && (
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 space-y-4">
                  <div>
                    <div className="mb-2 text-sm font-medium text-white/70">
                      {t.childType[lang]}
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        {
                          value: "boy",
                          label: { EN: "Boy", AR: "ولد", FR: "Garçon", TR: "Erkek", ES: "Niño" },
                        },
                        {
                          value: "girl",
                          label: { EN: "Girl", AR: "بنت", FR: "Fille", TR: "Kız", ES: "Niña" },
                        },
                        {
                          value: "twins",
                          label: { EN: "Twins", AR: "توأم", FR: "Jumeaux", TR: "İkizler", ES: "Gemelos" },
                        },
                      ].map((item) => {
                        const active = state.gift.childGender === item.value;
                        return (
                          <button
                            key={item.value}
                            onClick={() =>
                              setState((prev) => ({
                                ...prev,
                                gift: { ...prev.gift, childGender: item.value as ChildGender },
                              }))
                            }
                            className={`rounded-xl border px-3 py-2 text-sm transition ${
                              active
                                ? "border-yellow-500 bg-yellow-500 text-black"
                                : "border-white/10 bg-white/10"
                            }`}
                          >
                            {item.label[lang]}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <div className="mb-2 text-sm font-medium text-white/70">
                      {t.childAge[lang]}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {(["0-3", "4-7", "8-12", "13-17"] as ChildAge[]).map((age) => {
                        const disabled = !state.gift.childGender;
                        return (
                          <button
                            key={age}
                            disabled={disabled}
                            onClick={() => {
                              setState((prev) => ({
                                ...prev,
                                gift: { ...prev.gift, childAge: age },
                              }));
                              setStep("q2");
                            }}
                            className={`rounded-xl border px-3 py-2 text-sm transition ${
                              disabled
                                ? "cursor-not-allowed border-white/5 bg-white/5 text-white/30"
                                : "border-white/10 bg-white/10"
                            }`}
                          >
                            {age}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => setStep("mode")}
              className="rounded-xl bg-white/10 px-4 py-2"
            >
              {t.back[lang]}
            </button>
          </section>
        )}

        {/* Q1 EXPERIENCE */}
        {step === "q1" && state.planType === "experience" && (
          <section className="space-y-4">
            <div className="text-sm text-white/50">
              {t.question[lang]} 1 / 4
            </div>

            <h2 className="text-xl font-black">{t.q1Experience[lang]}</h2>

            <div className="grid gap-3">
              {experienceRecipients.map((item) => (
                <button
                  key={item.value}
                  onClick={() => {
                    setState((prev) => ({
                      ...prev,
                      experience: { ...prev.experience, recipient: item.value as ExperienceRecipient },
                    }));
                    setStep("q2");
                  }}
                  className="rounded-2xl border border-white/10 bg-white/5 p-4 text-left"
                >
                  {item.label[lang]}
                </button>
              ))}
            </div>

            <button
              onClick={() => setStep("mode")}
              className="rounded-xl bg-white/10 px-4 py-2"
            >
              {t.back[lang]}
            </button>
          </section>
        )}

        {/* Q2 */}
        {step === "q2" && state.planType === "gift" && (
          <section className="space-y-4">
            <div className="text-sm text-white/50">
              {t.question[lang]} 2 / 4
            </div>
            <h2 className="text-xl font-black">{t.q2Gift[lang]}</h2>

            <div className="grid gap-3">
              {giftOccasions.map((item) => (
                <button
                  key={item.value}
                  onClick={() => {
                    setState((prev) => ({
                      ...prev,
                      gift: { ...prev.gift, occasion: item.value as GiftOccasion },
                    }));
                    setStep("q3");
                  }}
                  className="rounded-2xl border border-white/10 bg-white/5 p-4 text-left"
                >
                  {item.label[lang]}
                </button>
              ))}
            </div>

            <button
              onClick={() => setStep("q1")}
              className="rounded-xl bg-white/10 px-4 py-2"
            >
              {t.back[lang]}
            </button>
          </section>
        )}

        {step === "q2" && state.planType === "experience" && (
          <section className="space-y-4">
            <div className="text-sm text-white/50">
              {t.question[lang]} 2 / 4
            </div>
            <h2 className="text-xl font-black">{t.q2Experience[lang]}</h2>

            <div className="grid gap-3">
              {experienceOccasions.map((item) => (
                <button
                  key={item.value}
                  onClick={() => {
                    setState((prev) => ({
                      ...prev,
                      experience: {
                        ...prev.experience,
                        occasion: item.value as ExperienceOccasion,
                      },
                    }));
                    setStep("q3");
                  }}
                  className="rounded-2xl border border-white/10 bg-white/5 p-4 text-left"
                >
                  {item.label[lang]}
                </button>
              ))}
            </div>

            <button
              onClick={() => setStep("q1")}
              className="rounded-xl bg-white/10 px-4 py-2"
            >
              {t.back[lang]}
            </button>
          </section>
        )}

        {/* Q3 */}
        {step === "q3" && (
          <section className="space-y-4">
            <div className="text-sm text-white/50">
              {t.question[lang]} 3 / 4
            </div>
            <h2 className="text-xl font-black">{t.q3[lang]}</h2>

            <div className="grid gap-3">
              {budgets.map((item) => (
                <button
                  key={item.value}
                  onClick={() => {
                    if (state.planType === "gift") {
                      setState((prev) => ({
                        ...prev,
                        gift: { ...prev.gift, budget: item.value as Budget },
                      }));
                    } else {
                      setState((prev) => ({
                        ...prev,
                        experience: { ...prev.experience, budget: item.value as Budget },
                      }));
                    }
                    setStep("q4");
                  }}
                  className="rounded-2xl border border-white/10 bg-white/5 p-4 text-left"
                >
                  {item.label[lang]}
                </button>
              ))}
            </div>

            <button
              onClick={() => setStep("q2")}
              className="rounded-xl bg-white/10 px-4 py-2"
            >
              {t.back[lang]}
            </button>
          </section>
        )}

        {/* Q4 */}
        {step === "q4" && state.planType === "gift" && (
          <section className="space-y-4">
            <div className="text-sm text-white/50">
              {t.question[lang]} 4 / 4
            </div>
            <h2 className="text-xl font-black">{t.q4Gift[lang]}</h2>

            <div className="grid gap-3">
              {giftEmotions.map((item) => (
                <button
                  key={item.value}
                  onClick={() => {
                    setState((prev) => ({
                      ...prev,
                      gift: { ...prev.gift, emotion: item.value as GiftEmotion },
                    }));
                    setStep("results");
                  }}
                  className="rounded-2xl border border-white/10 bg-white/5 p-4 text-left"
                >
                  {item.label[lang]}
                </button>
              ))}
            </div>

            <button
              onClick={() => setStep("q3")}
              className="rounded-xl bg-white/10 px-4 py-2"
            >
              {t.back[lang]}
            </button>
          </section>
        )}

        {step === "q4" && state.planType === "experience" && (
          <section className="space-y-4">
            <div className="text-sm text-white/50">
              {t.question[lang]} 4 / 4
            </div>
            <h2 className="text-xl font-black">{t.q4Experience[lang]}</h2>

            <div className="grid gap-3">
              {experienceEmotions.map((item) => (
                <button
                  key={item.value}
                  onClick={() => {
                    setState((prev) => ({
                      ...prev,
                      experience: {
                        ...prev.experience,
                        emotion: item.value as ExperienceEmotion,
                      },
                    }));
                    setStep("results");
                  }}
                  className="rounded-2xl border border-white/10 bg-white/5 p-4 text-left"
                >
                  {item.label[lang]}
                </button>
              ))}
            </div>

            <button
              onClick={() => setStep("q3")}
              className="rounded-xl bg-white/10 px-4 py-2"
            >
              {t.back[lang]}
            </button>
          </section>
        )}

        {/* RESULTS */}
        {step === "results" && (
          <section className="space-y-5">
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/65">
              <span className="font-semibold text-white">{t.selectedCountry[lang]}:</span>{" "}
              {state.country}
            </div>

            {results.map((result, index) => (
              <article
                key={`${result.type}-${index}`}
                className={`rounded-[28px] border p-5 transition ${
                  index === 0
                    ? "border-yellow-500/40 bg-yellow-500/10 shadow-[0_0_0_1px_rgba(234,179,8,0.06)]"
                    : "border-white/10 bg-white/5"
                }`}
              >
                <div className="mb-2 text-xs uppercase tracking-[0.22em] text-white/45">
                  {result.type}
                </div>
<div className="mb-3 flex items-start justify-between gap-4">
  <h3 className="text-[28px] font-black leading-tight">
    {result.title}
  </h3>

  <div className="text-right">
    <div className="text-2xl font-black text-yellow-400">
      {result.score}%
    </div>
  </div>
</div>
           {result.description && (
  <p className="mt-3 text-base leading-7 text-white/82">
    {result.description}
  </p>
)}

                <p className="text-base leading-7 text-white/82">{result.reason}</p>

                <div className="mt-4 rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm leading-6 text-white/65">
                  <span className="font-semibold text-white">{t.whyFits[lang]}</span>{" "}
                  {result.why}
                </div>

                {index === 0 && (
                  <div className="mt-4 inline-flex rounded-full border border-yellow-500/30 bg-yellow-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-yellow-300">
                    {t.bestMatch[lang]}
                  </div>
                )}

                {/* Merchant */}
 <div className="mt-5 rounded-[24px] border border-white/10 bg-white/5 p-5">
  <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
    <div>
      <div className="text-[20px] font-black text-white">
        {result.merchant.name}
      </div>
      <div className="text-white/70">
        {result.merchant.category} • {result.merchant.city}, {result.merchant.country}
      </div>
    </div>

    {result.merchant.verified && (
      <div className="inline-flex rounded-full border border-amber-400/20 bg-amber-500/10 px-4 py-2 text-sm font-semibold text-amber-200">
        {t.verified[lang]}
      </div>
    )}
  </div>

  {result.merchant.isOnline && (
    <div className="mb-3 rounded-xl border border-amber-400/20 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
      🌐 {lang === "AR" ? "متوفر أونلاين" : "Available Online"}
    </div>
  )}

  <div className="flex flex-wrap gap-2">
    <a
      href={
        result.merchant.website
          ? result.merchant.website.startsWith("http")
            ? result.merchant.website
            : `https://${result.merchant.website}`
          : `https://www.google.com/maps/search/${encodeURIComponent(
              result.merchant.name || ""
            )}`
      }
      target="_blank"
      rel="noopener noreferrer"
      className="rounded-xl bg-yellow-500 px-4 py-3 text-sm font-semibold text-black"
    >
      {t.visitMerchant[lang]}
    </a>

    {!result.merchant.isOnline && result.merchant.phone && (
      <button
        onClick={() =>
          (window.location.href = `tel:${result.merchant.phone.replace(/\D/g, "")}`)
        }
        className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white"
      >
        {t.call[lang]}
      </button>
    )}

    {!result.merchant.isOnline && result.merchant.instagram && (
      <button
        onClick={() => {
          const raw = result.merchant.instagram.trim();
          const url = raw.startsWith("http")
            ? raw
            : `https://instagram.com/${raw.replace(/^@/, "")}`;
          window.open(url, "_blank");
        }}
        className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white"
      >
        {t.instagram[lang]}
      </button>
    )}

    {!result.merchant.isOnline &&
      typeof result.merchant.tiktok === "string" &&
      result.merchant.tiktok.trim() !== "" && (
        <button
          onClick={() => {
            const raw = result.merchant.tiktok.trim();
            const url = raw.startsWith("http")
              ? raw
              : `https://www.tiktok.com/@${raw.replace(/^@/, "")}`;
            window.open(url, "_blank");
          }}
          className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white"
        >
          {t.tiktok[lang]}
        </button>
      )}
  </div>

  <button
    onClick={() => shareResult(result as ResultCard)}
    className="mt-3 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white"
  >
    {t.askFriend[lang]}
  </button>
</div>            
</article>
))}



{/* Online outside cards */}
<div className="rounded-[24px] border border-yellow-500/20 bg-yellow-500/5 p-4">
  <div className="text-sm text-white/65">{t.onlineSub[lang]}</div>
  <button
    onClick={() => openLink("https://www.amazon.com/s?k=gift ")}
    className="mt-3 w-full rounded-xl border border-yellow-500/40 px-4 py-3 text-sm font-semibold text-yellow-300"
  >
  
    {t.onlineOption[lang]}
  </button>
</div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={restart}
                className="rounded-xl bg-white/10 px-4 py-2"
              >
                {t.restart[lang]}
              </button>

              <button
                onClick={() => setStep("yellow")}
                className="rounded-xl border border-yellow-500/40 px-4 py-2 text-yellow-300"
              >
                Yellow Pages
              </button>
            </div>
          </section>
        )}

        {/* YELLOW PAGES */}
        {step === "yellow" && (
          <section className="space-y-5">
            <div>
              <h2 className="text-3xl font-black">Yellow Pages</h2>
              <p className="mt-2 text-white/80">{t.yellowSub[lang]}</p>
              <p className="mt-1 text-sm leading-6 text-white/55">{t.yellowDesc[lang]}</p>
            </div>

            <div className="space-y-4">
              {YELLOW_PAGES.map((group) => (
                <div
                  key={group.country}
                  className="rounded-[24px] border border-white/10 bg-white/5 p-4"
                >
                  <div className="mb-3 text-lg font-bold text-yellow-300">
                    {group.country}
                  </div>

                  <div className="space-y-2">
                    {group.items.map((item) => (
                      <div
                        key={`${group.country}-${item.name}`}
                        className="flex items-center justify-between gap-4 rounded-xl border border-white/10 bg-black/20 px-4 py-3"
                      >
                        <div className="font-medium">{item.name}</div>
                        <div className="text-sm text-white/55">{item.category}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => setStep("landing")}
              className="rounded-xl bg-white/10 px-4 py-2"
            >
              {t.back[lang]}
            </button>
          </section>
        )}
      </div>
    </main>
  );
}