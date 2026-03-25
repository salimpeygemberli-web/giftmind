"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Crown,
  ExternalLink,
  Globe,
  Instagram,
  MapPin,
  MessageCircle,
  Phone,
  RefreshCcw,
  Share2,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { selectTopGifts } from "@/app/lib/giftEngine";

type Language = "en" | "ar" | "fr" | "tr" | "es";
type BudgetLevel = "low" | "medium" | "high";
type RecipientKey = "partner" | "parent" | "friend" | "colleague" | "child";
type OccasionKey =
  | "birthday"
  | "anniversary"
  | "wedding"
  | "graduation"
  | "new_baby";
type StyleKey =
  | "minimalist"
  | "luxury"
  | "handmade"
  | "techie"
  | "experience";

type Step = "landing" | "quiz" | "results";

interface Merchant {
  id: string;
  name: string;
  country: string;
  city: string;
  category: string;
  description: string;
  recipientTags: RecipientKey[];
  occasionTags: OccasionKey[];
  styleTags: StyleKey[];
  budgetLevel: BudgetLevel;
  phone: string;
  whatsapp: string;
  instagram?: string;
  tiktok?: string;
  locationQuery: string;
  website: string;
  trusted: boolean;
  subscriptionPlan?: "free" | "pro" | "premium";
  isOnline?: boolean;
}

interface Answers {
  recipient: RecipientKey | "";
  occasion: OccasionKey | "";
  budget: BudgetLevel | "";
  style: StyleKey | "";
 emotion: string; 
}

interface Translation {
  title: string;
  subtitle: string;
  badge: string;
  selectCountry: string;
  selectLanguage: string;
  start: string;
  topMatches: string;
  bestMatch: string;
  trusted: string;
  premium: string;
  visit: string;
  share: string;
  copied: string;
  noMatches: string;
  match: string;
  whyFits: string;
  restart: string;
  back: string;
  questions: {
    recipient: string;
    occasion: string;
    budget: string;
    style: string;
    
  };
  options: {
    recipient: Record<RecipientKey, string>;
    occasion: Record<OccasionKey, string>;
    budget: Record<BudgetLevel, string>;
    style: Record<StyleKey, string>;
  };
  reasons: {
    luxury: string;
    birthday: string;
    budget: string;
    partner: string;
    handmade: string;
    techie: string;
    experience: string;
    minimalist: string;
    trusted: string;
  };
  footer: string;
  shareTitle: string;
  shareText: string;
}
const translations: Partial<Record<Language, Translation>> = {
  en: {
    title: "GiftMind",
    subtitle: "AI-Powered Gift Decision Engine",
    badge: "60S Discovery Mode",
    selectCountry: "Select Country",
    selectLanguage: "Select Language",
    start: "Start Discovery",
    topMatches: "Top 3 Matches",
    bestMatch: "Best Match",
    trusted: "GiftMind Trusted",
    premium: "Premium",
    visit: "Visit Merchant",
    share: "Ask a Friend",
    copied: "Link copied!",
noMatches: "We found a gift idea, but no matching local merchant is available yet. Try another country.",
    match: "Match",
    whyFits: "Why this fits",
    restart: "Restart",
    back: "Back",
    questions: {
      recipient: "Who is the gift for?",
      occasion: "What is the occasion?",
      budget: "What is your budget?",
      style: "What style is preferred?",
      emotion: "What feeling do you want this gift to express?",
    },
 options: {
  recipient: {
    partner: "Partner",
    parent: "Parent",
    friend: "Friend",
    colleague: "Colleague",
    child: "Child",
  },

  occasion: {
    birthday: "Birthday",
    anniversary: "Anniversary",
    wedding: "Wedding",
    graduation: "Graduation",
    new_baby: "New Baby",
  },

  budget: {
    low: "Low",
    medium: "Medium",
    high: "High",
  },

  style: {
    minimalist: "Minimalist",
    luxury: "Luxury",
    handmade: "Handmade",
    techie: "Tech & Gadgets",
    experience: "Experience",
  },

  emotions: {
    love: "Love",
    care: "Care",
    appreciation: "Appreciation",
    surprise: "Surprise",
    support: "Support",
    celebration: "Celebration",
    nostalgia: "Nostalgia",
    respect: "Respect",
  },

    },
    reasons: {
      luxury: "Matches your luxury style.",
      birthday: "Perfect for birthday occasions.",
      budget: "Fits your selected budget.",
      partner: "A strong fit for a partner gift.",
      handmade: "A unique handmade choice.",
      techie: "Perfect for tech lovers.",
      experience: "A memorable experience gift.",
      minimalist: "A clean and minimalist option.",
      trusted: "Chosen from a trusted GiftMind merchant.",
    },
    footer: "GiftMind AI Engine 2026",
    shareTitle: "Check out my GiftMind results!",
    shareText: "I found the perfect gift using GiftMind!",
  },
  ar: {
    title: "GiftMind",
    subtitle: "محرك اتخاذ قرارات الهدايا بالذكاء الاصطناعي",
    badge: "وضع الاكتشاف في 60 ثانية",
    selectCountry: "اختر الدولة",
    selectLanguage: "اختر اللغة",
    start: "ابدأ الاكتشاف",
    topMatches: "أفضل 3 نتائج",
    bestMatch: "الأفضل تطابقاً",
    trusted: "موثوق من GiftMind",
    premium: "مميز",
    visit: "زيارة المتجر",
    share: "اسأل صديق",
    copied: "تم نسخ الرابط!",
   noMatches: "وجدنا فكرة هدية مناسبة، لكن لا يوجد تاجر محلي مناسب حالياً. جرّب دولة أخرى.",
    match: "التطابق",
    whyFits: "لماذا هذا الاختيار",
    restart: "إعادة البدء",
    back: "رجوع",
    questions: {
      recipient: "لمن الهدية؟",
      occasion: "ما هي المناسبة؟",
      budget: "ما هي ميزانيتك؟",
      style: "ما هو الأسلوب المفضل؟",
      emotions: {
  love: "Love",
  care: "Care",
  appreciation: "Appreciation",
  surprise: "Surprise",
  support: "Support",
  celebration: "Celebration",
  nostalgia: "Nostalgia",
  respect: "Respect",
},
},
options: {
      recipient: {
        partner: "الشريك",
        parent: "الوالدين",
        friend: "صديق",
        colleague: "زميل عمل",
        child: "طفل",
      },
      occasion: {
        birthday: "عيد ميلاد",
        anniversary: "ذكرى سنوية",
        wedding: "زفاف",
        graduation: "تخرج",
        new_baby: "مولود جديد",
      },
      budget: {
        low: "اقتصادي",
        medium: "متوسط",
        high: "فاخر",
      },
      style: {
        minimalist: "بسيط",
        luxury: "فاخر",
        handmade: "يدوي الصنع",
        techie: "تقنية وأجهزة",
        experience: "تجربة",
      },
   },
    reasons: {
      luxury: "يتناسب مع ذوقك الفاخر.",
      birthday: "مثالي لمناسبات أعياد الميلاد.",
      budget: "يناسب ميزانيتك المختارة.",
      partner: "اختيار قوي لهدية الشريك.",
      handmade: "اختيار يدوي فريد.",
      techie: "مثالي لمحبي التقنية.",
      experience: "هدية تجربة لا تُنسى.",
      minimalist: "اختيار بسيط وأنيق.",
      trusted: "تم اختياره من تاجر موثوق في GiftMind.",
    },
    footer: "محرك GiftMind 2026",
    shareTitle: "شاهد نتائجي في GiftMind!",
   shareText: "وجدت الهدية المثالية باستخدام GiftMind!"
  }
};

const countries = [
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
];

const languages: { code: Language; name: string }[] = [
  { code: "en", name: "English" },
  { code: "ar", name: "العربية" },
  { code: "fr", name: "Français" },
  { code: "tr", name: "Türkçe" },
  { code: "es", name: "Español" },
];

const merchants: Merchant[] = [
  {
    id: "1",
    name: "Luxe Gifts Amman",
    country: "Jordan",
    city: "Amman",
    category: "Luxury Gifts",
    description: "Premium luxury gift boutique with curated selections.",
    recipientTags: ["partner", "parent", "colleague"],
    occasionTags: ["anniversary", "birthday", "wedding"],
    styleTags: ["luxury", "minimalist"],
    budgetLevel: "high",
    phone: "+962791234567",
    whatsapp: "+962791234567",
   instagram: "nike",
    tiktok: "luxegiftsamman",
    locationQuery: "Luxe Gifts Amman Jordan",
   website: "https://google.com",
trusted: true,
    subscriptionPlan: "premium",
  },
  {
    id: "2",
    name: "Handmade Haven",
    country: "Jordan",
    city: "Amman",
    category: "Artisan Crafts",
    description: "Unique handcrafted gifts made by local artisans.",
    recipientTags: ["friend", "parent", "partner"],
    occasionTags: ["birthday", "graduation", "new_baby"],
    styleTags: ["handmade", "minimalist"],
    budgetLevel: "medium",
    phone: "+962797654321",
    whatsapp: "+962797654321",
    instagram: "handmadehaven_jo",
    locationQuery: "Handmade Haven Amman Jordan",
    website: "https://handmadehaven.jo",
    trusted: true,
    subscriptionPlan: "pro",
  },
  {
    id: "3",
    name: "Tech Treasures",
    country: "Jordan",
    city: "Amman",
    category: "Technology",
    description: "Latest gadgets and tech gifts for all ages.",
    recipientTags: ["child", "friend", "colleague"],
    occasionTags: ["birthday", "graduation"],
    styleTags: ["techie"],
    budgetLevel: "medium",
    phone: "+962781112233",
    whatsapp: "+962781112233",
    instagram: "techtreasures_jo",
    tiktok: "techtreasuresjo",
    locationQuery: "Tech Treasures Amman Jordan",
    website: "https://techtreasures.jo",
    trusted: false,
    subscriptionPlan: "free",
  },
  {
    id: "4",
    name: "Experience Arabia",
    country: "UAE",
    city: "Dubai",
    category: "Experiences",
    description: "Unforgettable experience gifts across the Emirates.",
    recipientTags: ["partner", "friend", "parent"],
    occasionTags: ["anniversary", "birthday", "wedding"],
    styleTags: ["experience", "luxury"],
    budgetLevel: "high",
    phone: "+971501234567",
    whatsapp: "+971501234567",
    instagram: "experiencearabia",
    tiktok: "experiencearabia",
    locationQuery: "Experience Arabia Dubai UAE",
    website: "https://experiencearabia.ae",
    trusted: true,
    subscriptionPlan: "premium",
  },
  {
    id: "5",
    name: "Baby Bliss UAE",
    country: "UAE",
    city: "Abu Dhabi",
    category: "Baby & Kids",
    description: "Premium baby gifts and nursery essentials.",
    recipientTags: ["child", "parent"],
    occasionTags: ["new_baby", "birthday"],
    styleTags: ["minimalist", "luxury"],
    budgetLevel: "high",
    phone: "+971509876543",
    whatsapp: "+971509876543",
    instagram: "babyblissuae",
    locationQuery: "Baby Bliss Abu Dhabi UAE",
    website: "https://babybliss.ae",
    trusted: true,
    subscriptionPlan: "pro",
  },
  {
    id: "6",
    name: "Saudi Luxe Collection",
    country: "Saudi Arabia",
    city: "Riyadh",
    category: "Luxury Gifts",
    description: "Exclusive luxury gift collection for special occasions.",
    recipientTags: ["partner", "parent", "colleague"],
    occasionTags: ["wedding", "anniversary", "graduation"],
    styleTags: ["luxury"],
    budgetLevel: "high",
    phone: "+966501234567",
    whatsapp: "+966501234567",
    instagram: "saudiluxe",
    tiktok: "saudiluxecollection",
    locationQuery: "Saudi Luxe Collection Riyadh Saudi Arabia",
    website: "https://saudiluxe.sa",
    trusted: true,
    subscriptionPlan: "premium",
  },
  {
    id: "7",
    name: "Riyadh Crafts",
    country: "Saudi Arabia",
    city: "Riyadh",
    category: "Handmade",
    description: "Traditional Saudi handmade crafts and gifts.",
    recipientTags: ["friend", "parent", "colleague"],
    occasionTags: ["birthday", "graduation"],
    styleTags: ["handmade"],
    budgetLevel: "low",
    phone: "+966559876543",
    whatsapp: "+966559876543",
    instagram: "riyadhcrafts",
    locationQuery: "Riyadh Crafts Saudi Arabia",
    website: "https://riyadhcrafts.sa",
    trusted: false,
    subscriptionPlan: "free",
  },
  {
    id: "8",
    name: "Qatar Premium Gifts",
    country: "Qatar",
    city: "Doha",
    category: "Premium Gifts",
    description: "High-end gift solutions for discerning tastes.",
    recipientTags: ["partner", "colleague", "parent"],
    occasionTags: ["anniversary", "wedding", "birthday"],
    styleTags: ["luxury", "minimalist"],
    budgetLevel: "high",
    phone: "+97433001234",
    whatsapp: "+97433001234",
    instagram: "qatarpremiumgifts",
    locationQuery: "Qatar Premium Gifts Doha",
    website: "https://qatarpremium.qa",
    trusted: true,
    subscriptionPlan: "premium",
  },
  {
    id: "9",
    name: "Kuwait Gift House",
    country: "Kuwait",
    city: "Kuwait City",
    category: "Gift Shop",
    description: "One-stop shop for all occasions.",
    recipientTags: ["friend", "child", "partner"],
    occasionTags: ["birthday", "new_baby", "graduation"],
    styleTags: ["minimalist", "techie"],
    budgetLevel: "medium",
    phone: "+96599001234",
    whatsapp: "+96599001234",
    instagram: "kuwaitgifthouse",
    locationQuery: "Kuwait Gift House Kuwait City",
    website: "https://kuwaitgifthouse.kw",
    trusted: true,
    subscriptionPlan: "pro",
  },
  {
    id: "10",
    name: "Bahrain Artisans",
    country: "Bahrain",
    city: "Manama",
    category: "Artisan Crafts",
    description: "Local artisan products and handmade gifts.",
    recipientTags: ["friend", "parent"],
    occasionTags: ["birthday", "anniversary"],
    styleTags: ["handmade"],
    budgetLevel: "low",
    phone: "+97333001234",
    whatsapp: "+97333001234",
    instagram: "bahrainartisans",
    locationQuery: "Bahrain Artisans Manama",
    website: "https://bahrainartisans.bh",
    trusted: false,
    subscriptionPlan: "free",
  },
  {
    id: "11",
    name: "Oman Traditions",
    country: "Oman",
    city: "Muscat",
    category: "Traditional Gifts",
    description: "Authentic Omani traditional gifts and souvenirs.",
    recipientTags: ["parent", "friend", "colleague"],
    occasionTags: ["birthday", "wedding"],
    styleTags: ["handmade", "luxury"],
    budgetLevel: "medium",
    phone: "+96899001234",
    whatsapp: "+96899001234",
    instagram: "omantraditions",
    locationQuery: "Oman Traditions Muscat",
    website: "https://omantraditions.om",
    trusted: true,
    subscriptionPlan: "pro",
  },
  {
    id: "12",
    name: "Istanbul Delights",
    country: "Turkey",
    city: "Istanbul",
    category: "Specialty Gifts",
    description: "Turkish delights and specialty gift items.",
    recipientTags: ["friend", "parent", "partner"],
    occasionTags: ["birthday", "anniversary"],
    styleTags: ["handmade", "experience"],
    budgetLevel: "medium",
    phone: "+905321234567",
    whatsapp: "+905321234567",
    instagram: "istanbuldelights",
    tiktok: "istanbuldelights",
    locationQuery: "Istanbul Delights Grand Bazaar Turkey",
    website: "https://istanbuldelights.com.tr",
    trusted: true,
    subscriptionPlan: "premium",
  },
  {
    id: "13",
    name: "Turkish Tech Hub",
    country: "Turkey",
    city: "Ankara",
    category: "Technology",
    description: "Latest tech gadgets and electronic gifts.",
    recipientTags: ["child", "friend", "colleague"],
    occasionTags: ["birthday", "graduation"],
    styleTags: ["techie"],
    budgetLevel: "medium",
    phone: "+905559876543",
    whatsapp: "+905559876543",
    instagram: "turkishtechhub",
    locationQuery: "Turkish Tech Hub Ankara",
    website: "https://turkishtechhub.com.tr",
    trusted: false,
    subscriptionPlan: "free",
  },
  {
    id: "14",
    name: "Cairo Treasures",
    country: "Egypt",
    city: "Cairo",
    category: "Antiques & Gifts",
    description: "Egyptian treasures and unique gift items.",
    recipientTags: ["parent", "friend", "colleague"],
    occasionTags: ["birthday", "anniversary", "wedding"],
    styleTags: ["handmade", "luxury"],
    budgetLevel: "medium",
    phone: "+201001234567",
    whatsapp: "+201001234567",
    instagram: "cairotreasures",
    locationQuery: "Cairo Treasures Khan El Khalili Egypt",
    website: "https://cairotreasures.eg",
    trusted: true,
    subscriptionPlan: "pro",
  },
  {
    id: "15",
    name: "Paris Élégance",
    country: "France",
    city: "Paris",
    category: "Luxury Gifts",
    description: "French elegance in every gift selection.",
    recipientTags: ["partner", "parent"],
    occasionTags: ["anniversary", "wedding", "birthday"],
    styleTags: ["luxury", "minimalist"],
    budgetLevel: "high",
    phone: "+33123456789",
    whatsapp: "+33123456789",
    instagram: "pariselegance",
    tiktok: "pariselegancegifts",
    locationQuery: "Paris Elegance Champs Elysees France",
    website: "https://pariselegance.fr",
    trusted: true,
    subscriptionPlan: "premium",
  },
  {
    id: "16",
    name: "Berlin Makers",
    country: "Germany",
    city: "Berlin",
    category: "Handmade",
    description: "German craftsmanship and handmade gifts.",
    recipientTags: ["friend", "colleague", "parent"],
    occasionTags: ["birthday", "graduation"],
    styleTags: ["handmade", "minimalist"],
    budgetLevel: "medium",
    phone: "+4930123456",
    whatsapp: "+4930123456",
    instagram: "berlinmakers",
    locationQuery: "Berlin Makers Germany",
    website: "https://berlinmakers.de",
    trusted: true,
    subscriptionPlan: "pro",
  },
  {
    id: "17",
    name: "London Luxe",
    country: "UK",
    city: "London",
    category: "Luxury Gifts",
    description: "Premium British luxury gift experiences.",
    recipientTags: ["partner", "parent", "colleague"],
    occasionTags: ["anniversary", "wedding", "birthday"],
    styleTags: ["luxury", "experience"],
    budgetLevel: "high",
    phone: "+442012345678",
    whatsapp: "+442012345678",
    instagram: "londonluxegifts",
    tiktok: "londonluxe",
    locationQuery: "London Luxe Mayfair UK",
    website: "https://londonluxe.co.uk",
    trusted: true,
    subscriptionPlan: "premium",
  },
  {
    id: "18",
    name: "NYC Gift Co",
    country: "USA",
    city: "New York",
    category: "Gift Shop",
    description: "Trendy gifts from the heart of New York.",
    recipientTags: ["friend", "child", "partner"],
    occasionTags: ["birthday", "graduation", "new_baby"],
    styleTags: ["techie", "minimalist", "experience"],
    budgetLevel: "medium",
    phone: "+12125551234",
    whatsapp: "+12125551234",
    instagram: "nycgiftco",
    tiktok: "nycgiftco",
    locationQuery: "NYC Gift Co Manhattan USA",
    website: "https://nycgiftco.com",
    trusted: true,
    subscriptionPlan: "premium",
  },
  {
    id: "19",
    name: "Budget Gifts JO",
    country: "Jordan",
    city: "Amman",
    category: "Affordable Gifts",
    description: "Quality gifts that don't break the bank.",
    recipientTags: ["friend", "child", "colleague"],
    occasionTags: ["birthday", "graduation"],
    styleTags: ["minimalist"],
    budgetLevel: "low",
    phone: "+962795551234",
    whatsapp: "+962795551234",
    instagram: "budgetgiftsjo",
    locationQuery: "Budget Gifts Downtown Amman Jordan",
    website: "https://budgetgifts.jo",
    trusted: false,
    subscriptionPlan: "free",
  },
  {
    id: "20",
    name: "Dubai Experience Hub",
    country: "UAE",
    city: "Dubai",
    category: "Experiences",
    description: "Adventure and luxury experiences in Dubai.",
    recipientTags: ["partner", "friend"],
    occasionTags: ["anniversary", "birthday"],
    styleTags: ["experience", "luxury"],
    budgetLevel: "high",
    phone: "+971504445566",
    whatsapp: "+971504445566",
    instagram: "dubaiexperiencehub",
    tiktok: "dubaiexphub",
    locationQuery: "Dubai Experience Hub UAE",
    website: "https://dubaiexperiencehub.ae",
    trusted: true,
    subscriptionPlan: "premium",
  },
{
  id: "kids-zone-jo",
  name: "Kids Fun Zone",
  country: "Jordan",
  city: "Amman",
  category: "Experience",
  description: "Indoor playground & birthday party packages for kids",
  recipientTags: ["child"],
  occasionTags: ["birthday"],
  styleTags: ["fun", "experience"],
  budgetLevel: "medium",
  phone: "+962790000000",
  whatsapp: "+962790000000",
  instagram: "kidszone.jo",
  locationQuery: "kids play area amman",
  trusted: true,
  subscriptionPlan: "premium"
},
{
  id: "elite-1",
  name: "Elite Luxury",
  country: "Jordan",
  city: "Amman",
  category: "Luxury Gifts",
  description: "Premium luxury gift store in Amman.",
  recipientTags: ["partner", "friend"],
  occasionTags: ["birthday", "anniversary"],
  styleTags: ["luxury"],
  budgetLevel: "high",
  phone: "+962700000000",
  whatsapp: "+962700000000",
  instagram: "elite.luxury",
  tiktok: "elite.luxury",
  locationQuery: "Luxury Gifts Amman Jordan",
  website: "https://google.com",
  trusted: true,
  subscriptionPlan: "premium",
},
{
  id: "online-1",
  name: "Global Gift Store",
  country: "Global",
  city: "Online",
  category: "Luxury Gifts",
  description: "Online curated gifts worldwide.",
  recipientTags: ["partner", "friend", "parent", "colleague"],
  occasionTags: ["birthday", "anniversary", "wedding", "graduation"],
  styleTags: ["luxury", "minimalist"],
  budgetLevel: "medium",
  phone: "",
  whatsapp: "",
  instagram: "globalgiftstore",
  tiktok: "",
  locationQuery: "Online Gift Store",
  website: "https://google.com",
  trusted: true,
  subscriptionPlan: "premium",
  isOnline: true,
},
];

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z" />
    </svg>
  );
}

const DiscoverButtonTimer = () => {
  const [timeLeft, setTimeLeft] = useState(60);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const percentage = (timeLeft / 60) * 100;

  const getColor = () => {
    if (timeLeft > 30) return "#22c55e";
    if (timeLeft > 10) return "#eab308";
    return "#ef4444";
  };

  return (
    <div className="flex justify-center mt-6">
      <div className="relative flex items-center justify-center w-24 h-24 rounded-full bg-slate-950/70 border border-white/5 shadow-inner">
        <svg className="absolute inset-0 w-full h-full -rotate-90">
          <circle
            cx="48"
            cy="48"
            r="38"
            stroke="currentColor"
            strokeWidth="3"
            fill="transparent"
            className="text-white/10"
          />
          <motion.circle
            cx="48"
            cy="48"
            r="38"
            stroke={getColor()}
            strokeWidth="4"
            strokeLinecap="round"
            fill="transparent"
            strokeDasharray="238.6"
            animate={{ strokeDashoffset: 238.6 - (238.6 * percentage) / 100 }}
            transition={{ duration: 0.5 }}
          />
        </svg>

        <div className="text-3xl font-black text-white">{timeLeft}s</div>
      </div>
    </div>
  );
};
function buildWhy(concept: any, answers: any) {
  const reasons: string[] = [];

  if (answers.emotion === "care") {
    reasons.push("Supports a warm and caring emotional intention");
  }

  if (answers.emotion === "love") {
    reasons.push("Aligned with a romantic connection");
  }

  if (answers.emotion === "surprise") {
    reasons.push("Designed to create a surprise effect");
  }

  if (answers.recipient === "partner") {
    reasons.push("Highly suitable for partner relationships");
  }

  if (answers.recipient === "friend") {
    reasons.push("Fits well for friendly gifting");
  }

  if (answers.occasion === "birthday") {
    reasons.push("Perfect for birthday occasions");
  }

  if (answers.occasion === "anniversary") {
    reasons.push("Great match for anniversary moments");
  }

  if (concept.budget === answers.budget) {
    reasons.push("Matches your selected budget");
  }

  if (concept.vibe?.includes(answers.style)) {
    reasons.push("Aligned with your preferred style");
  }

  return reasons;
}
export default function GiftMindPage() {
  const [step, setStep] = useState<Step>("landing");
  const [country, setCountry] = useState("Jordan");
  const [language, setLanguage] = useState<Language>("en");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>({
    recipient: "",
    occasion: "",
    budget: "",
    style: "",
     emotion: "", 
  });
  const [mode, setMode] = useState<"normal" | "alternative">("normal");
  const [fallbackMessage, setFallbackMessage] = useState("");
  const [notification, setNotification] = useState("");
const t = translations[language] ?? translations.en!;
 const isRTL = language === "ar";

  useEffect(() => {
    if (!notification) return;
    const timer = window.setTimeout(() => setNotification(""), 2500);
    return () => window.clearTimeout(timer);
  }, [notification]);
const questions = [
  {
    key: "recipient" as const,
    title: t.questions.recipient,
    options: [
      { key: "partner" as RecipientKey, label: t.options.recipient.partner },
      { key: "parent" as RecipientKey, label: t.options.recipient.parent },
      { key: "friend" as RecipientKey, label: t.options.recipient.friend },
      { key: "colleague" as RecipientKey, label: t.options.recipient.colleague },
      { key: "child" as RecipientKey, label: t.options.recipient.child },
    ],
  },
  {
    key: "occasion" as const,
    title: t.questions.occasion,
    options: [
      { key: "birthday" as OccasionKey, label: t.options.occasion.birthday },
      { key: "anniversary" as OccasionKey, label: t.options.occasion.anniversary },
      { key: "wedding" as OccasionKey, label: t.options.occasion.wedding },
      { key: "graduation" as OccasionKey, label: t.options.occasion.graduation },
      { key: "new_baby" as OccasionKey, label: t.options.occasion.new_baby },
    ],
  },
  {
    key: "budget" as const,
    title: t.questions.budget,
    options: [
      { key: "low" as BudgetLevel, label: t.options.budget.low },
      { key: "medium" as BudgetLevel, label: t.options.budget.medium },
      { key: "high" as BudgetLevel, label: t.options.budget.high },
    ],
  },
  {
    key: "style" as const,
    title: t.questions.style,
    options: [
      { key: "minimalist" as StyleKey, label: t.options.style.minimalist },
      { key: "luxury" as StyleKey, label: t.options.style.luxury },
      { key: "handmade" as StyleKey, label: t.options.style.handmade },
      { key: "techie" as StyleKey, label: t.options.style.techie },
      { key: "experience" as StyleKey, label: t.options.style.experience },
    ],
  },
  {
    key: "emotion" as const,
    title:
      language === "ar"
        ? "ما هو الشعور الذي تريد إيصاله؟"
        : "What feeling do you want this gift to express?",
    options: [
      { key: "love" as EmotionKey, label: language === "ar" ? "حب" : "Love" },
      { key: "care" as EmotionKey, label: language === "ar" ? "اهتمام" : "Care" },
      { key: "appreciation" as EmotionKey, label: language === "ar" ? "تقدير" : "Appreciation" },
      { key: "surprise" as EmotionKey, label: language === "ar" ? "مفاجأة" : "Surprise" },
      { key: "support" as EmotionKey, label: language === "ar" ? "دعم" : "Support" },
      { key: "celebration" as EmotionKey, label: language === "ar" ? "احتفال" : "Celebration" },
      { key: "nostalgia" as EmotionKey, label: language === "ar" ? "ذكرى" : "Nostalgia" },
      { key: "respect" as EmotionKey, label: language === "ar" ? "احترام" : "Respect" },
    ],
  },
];
const topGiftConcepts = useMemo(() => {
  if (
    !answers.recipient ||
    !answers.occasion ||
    !answers.budget ||
    !answers.emotion
  ) {
    return [];
  }

  const recipientMap = {
    partner: "partner",
    parent: "family",
    friend: "friend",
    colleague: "friend",
    child: "child",
  } as const;

  const occasionMap = {
    birthday: "birthday",
    anniversary: "anniversary",
    wedding: "anniversary",
    graduation: "celebration",
    new_baby: "celebration",
  } as const;

  const emotionToVibeMap = {
    comfort: "warm",
    appreciation: "elegant",
    love: "romantic",
    fun: "fun",
    celebration: "casual",
  } as const;

  const emotionToGoalMap = {
    comfort: "support",
    appreciation: "appreciate",
    love: "romance",
    fun: "celebrate",
    celebration: "celebrate",
  } as const;

  const results = selectTopGifts({
    
    recipient:
      recipientMap[answers.recipient as keyof typeof recipientMap] ?? "friend",
    occasion:
      occasionMap[answers.occasion as keyof typeof occasionMap] ?? "birthday",
    budget: answers.budget as "low" | "medium" | "high",
    vibe:
      emotionToVibeMap[answers.emotion as keyof typeof emotionToVibeMap] ??
      "casual",
    goal:
      emotionToGoalMap[answers.emotion as keyof typeof emotionToGoalMap] ??
      "celebrate",
  });

  if (!Array.isArray(results)) return [];
// 🛡 Social Risk Filter
const safeResults = results.filter((concept) => {
  // ❌ Romantic / Emotional gifts for colleague
  if (
    answers.recipient === "colleague" &&
    concept.tags.includes("emotional")
  ) {
    return false;
  }

  // ❌ Luxury overkill for child
  if (
    answers.recipient === "child" &&
    concept.category === "luxury"
  ) {
    return false;
  }

  // ❌ Too personal for formal relationships
  if (
    answers.recipient === "colleague" &&
    concept.tags.includes("memory")
  ) {
    return false;
  }

  return true;
});
 const boostedResults = safeResults.map((concept) => {
  let bonus = 0;

  // 🔥 Emotion Boost (موجود عندك)
  if (answers.emotion === "love" && concept.category === "luxury") {
    bonus += 20;
  }

  if (answers.emotion === "fun" && concept.category === "experience") {
    bonus += 20;
  }

  if (answers.emotion === "appreciation") {
    bonus += 15;
  }

  if (answers.emotion === "celebration") {
    bonus += 15;
  }

  // 🧠 NEW: Smart Reason Generator
  const reason = `${
    answers.recipient === "partner"
      ? "This feels personal and meaningful"
      : answers.recipient === "friend"
      ? "Perfect for a fun and memorable moment"
      : answers.recipient === "parent"
      ? "Shows care and appreciation"
      : "A safe and thoughtful choice"
  } for a ${
    answers.occasion
  }, especially when you want to express ${
    answers.emotion
  }.`;

  return {
    ...concept,
    score: concept.score + bonus,
    reason, // 👈 هذا المهم
  };
});

  const uniqueResults = boostedResults.filter(
    (concept, index, self) =>
      index === self.findIndex((item) => item.id === concept.id)
  );

 const sortedResults = uniqueResults.sort((a, b) => b.score - a.score);

if (mode === "alternative") {
  return sortedResults.slice(1, 4);
}

return sortedResults.slice(0, 3);
}, [answers, mode]);
  const primaryConcept = topGiftConcepts[0];
  const alternativeConcepts = topGiftConcepts.slice(1, 3);
const onlineSearchQuery = `
${answers.occasion} ${answers.style} gift for ${answers.recipient}
`.replace(/\s+/g, " ").trim();

const getOnlineLink = () => {
  const q = encodeURIComponent(onlineSearchQuery);

  if (country === "UAE") {
    return `https://www.amazon.ae/s?k=${q}`;
  }

  if (country === "Saudi Arabia") {
    return `https://www.amazon.sa/s?k=${q}`;
  }

  if (country === "Jordan") {
    return `https://www.google.com/search?tbm=shop&q=${q}`;
  }

  if (country === "France" || country === "Germany") {
    return `https://www.etsy.com/search?q=${q}`;
  }

  return `https://www.google.com/search?q=${q}`;
};
const topMerchants = useMemo(() => {
  if (!topGiftConcepts.length) return [];

  const getMerchantCategory = (conceptCategory: string) => {
    if (conceptCategory === "symbolic") return "Artisan Crafts";
    if (conceptCategory === "experience") return "Experience";
    if (conceptCategory === "mixed") return "Luxury Gifts";
    if (conceptCategory === "Luxury Gifts") return "Luxury Gifts";
    return "General";
  };

  for (const concept of topGiftConcepts) {
    const selectedGift = {
      category: getMerchantCategory(concept.category),
    };

    const categoryMatchedMerchants = merchants.filter(
      (m) =>
        (!country || m.country === country) &&
        (!selectedGift.category || m.category === selectedGift.category)
    );

    const conceptMerchants = categoryMatchedMerchants
      .filter(
        (m) => !answers.recipient || m.recipientTags.includes(answers.recipient)
      )
      .filter(
        (m) => !answers.occasion || m.occasionTags.includes(answers.occasion)
      )
      .map((merchant) => {
        let score = 0;

        if (
          answers.recipient &&
          merchant.recipientTags.includes(answers.recipient)
        ) {
          score += 30;
        }

        if (
          answers.occasion &&
          merchant.occasionTags.includes(answers.occasion)
        ) {
          score += 25;
        }

        if (merchant.budgetLevel === answers.budget) {
          score += 25;
        }

        if (merchant.trusted) {
          score += 5;
        }

        if (merchant.category === selectedGift.category) {
          score += 20;
        }

        return {
          ...merchant,
          score,
          matchedConceptId: concept.id,
          matchedConceptTitle: concept.title,
        };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);

    if (conceptMerchants.length > 0) {
      return conceptMerchants;
    }
  }

  return [];
}, [answers, country, topGiftConcepts]);
 const startDiscovery = () => {
  setQuestionIndex(0);
  setAnswers({
    recipient: "",
    occasion: "",
    budget: "",
    style: "",
    emotion: "",
  });
  setStep("quiz");
};

 const handleAnswer = (
  key: keyof Answers,
  value: RecipientKey | OccasionKey | BudgetLevel | StyleKey | string,
) => {
  setAnswers((prev) => ({ ...prev, [key]: value }));
  if (questionIndex < questions.length - 1) {
    setQuestionIndex((prev) => prev + 1);
  } else {
    setStep("results");
  }
};

  const handleBack = () => {
    if (step === "results") {
      setStep("quiz");
      setQuestionIndex(questions.length - 1);
      return;
    }

    if (questionIndex > 0) {
      setQuestionIndex((prev) => prev - 1);
    } else {
      setStep("landing");
    }
  };

  const handleShare = async () => {
    const params = new URLSearchParams({
      c: country,
      l: language,
      r: answers.recipient,
      o: answers.occasion,
      b: answers.budget,
      s: answers.style,
    });

    const url = `${window.location.origin}${window.location.pathname}?${params.toString()}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: t.shareTitle,
          text: t.shareText,
          url,
        });
        return;
      } catch {
        return;
      }
    }

    await navigator.clipboard.writeText(url);
    setNotification(t.copied);
  };

  const startOver = () => {
    setStep("landing");
    setQuestionIndex(0);
  setAnswers({
  recipient: "",
  occasion: "",
  budget: "",
  style: "",
  emotion: "",
});
  };

  return (
    <main dir={isRTL ? "rtl" : "ltr"} className="min-h-screen bg-[#071827] text-white">
      {notification && (
        <div className="fixed left-1/2 top-4 z-50 -translate-x-1/2 rounded-lg bg-cyan-500 px-4 py-2 font-medium text-slate-900 shadow-lg shadow-cyan-500/20">
          {notification}
        </div>
      )}

      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(14,165,233,0.18),_transparent_40%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,_rgba(37,99,235,0.16),_transparent_40%)]" />
      </div>

      <div className="relative mx-auto max-w-md px-4 py-10">
        <header className="mb-8 text-center">
          <div className="mb-5 flex justify-center gap-2 overflow-x-auto">
            {languages.map((item) => (
              <button
                key={item.code}
                onClick={() => setLanguage(item.code)}
                className={`rounded-full border px-3 py-1 text-[10px] uppercase transition-all ${
                  language === item.code
                    ? "border-white bg-white text-black"
                    : "border-white/10 text-slate-500"
                }`}
              >
                {item.code.toUpperCase()}
              </button>
            ))}
          </div>

          <div className="mb-4 flex justify-center">
            <div className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-5 py-2 text-cyan-400 shadow-[0_0_30px_rgba(6,182,212,0.18)]">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                <span className="text-sm font-semibold">{t.badge}</span>
              </div>
            </div>
          </div>

          <div className="mb-3 flex justify-center">
            <Sparkles className="h-14 w-14 text-cyan-400" />
          </div>

          <h1 className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-6xl font-black tracking-tight text-transparent">
            {t.title}
          </h1>
          <p className="mt-3 text-xl text-slate-300">{t.subtitle}</p>
        </header>

        {step === "landing" && (
          <section className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-5">
            <div className="rounded-3xl border border-slate-800 bg-slate-900/40 p-5">
              <label className="mb-2 block text-sm font-semibold text-slate-300">
                {t.selectCountry}
              </label>
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-4 text-white outline-none"
              >
                {countries.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <DiscoverButtonTimer />

            <button
              onClick={startDiscovery}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-4 font-bold text-white transition-all hover:scale-[1.01]"
            >
              {t.start}
              <ChevronRight className="h-5 w-5" />
            </button>
          </section>
        )}

        {step === "quiz" && (
          <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="mb-4 flex items-center justify-between">
              <button
                onClick={handleBack}
                className="rounded-xl border border-slate-700 bg-slate-900/70 p-3 text-cyan-400 transition-all hover:bg-cyan-500 hover:text-black"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>

              <div className="text-sm text-slate-400">
                {questionIndex + 1} / {questions.length}
              </div>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-900/40 p-5">
              <h2 className="mb-5 text-xl font-bold text-white">
                {questions[questionIndex].title}
              </h2>

              <div className="grid gap-3">
                {questions[questionIndex].options.map((option) => (
                  <button
                    key={option.key}
                    onClick={() =>
                      handleAnswer(
                        questions[questionIndex].key,
                       option.key as RecipientKey | OccasionKey | BudgetLevel | StyleKey | string
                      )
                    }
                    className="rounded-2xl border border-slate-700 bg-slate-950/70 px-4 py-4 text-start text-white transition-all hover:border-cyan-500/40 hover:bg-slate-800"
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </section>
        )}

        {step === "results" && (
          <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="mb-6 flex items-center justify-between">
              <button
                onClick={handleBack}
                className="rounded-xl border border-slate-700 bg-slate-900/70 p-3 text-cyan-400 transition-all hover:bg-cyan-500 hover:text-black"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>

              <div className="text-sm font-semibold text-cyan-400">{t.topMatches}</div>

              <button
                onClick={startOver}
                className="rounded-xl border border-slate-700 bg-slate-900/70 p-3 text-cyan-400 transition-all hover:bg-cyan-500 hover:text-black"
              >
                <RefreshCcw className="h-5 w-5" />
              </button>
            </div>
{primaryConcept && (
  <div className="mb-6 space-y-3">
    <div
      className="rounded-2xl border border-cyan-500/40 bg-cyan-500/5 p-4"
    >
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-lg font-bold text-white">
            {primaryConcept.title}
          </div>

          <div className="mt-1 text-xs uppercase tracking-wider text-cyan-400">
            {primaryConcept.category}
          </div>
        </div>

        <div className="rounded-xl bg-slate-950/60 px-3 py-2 text-center">
          <div className="text-lg font-black text-cyan-400">
            {primaryConcept.score}
          </div>

          <div className="text-[10px] uppercase tracking-widest text-slate-400">
            AI
          </div>
        </div>
      </div>

      <div className="mt-4 text-sm leading-7 text-white/80">
        {primaryConcept.reason}
      </div>
    </div>
  </div>
)}
  


<div className="space-y-5">
 {topMerchants.length === 0 && (
  <div className="rounded-3xl border border-slate-800 bg-slate-900/40 px-5 py-10 text-center text-slate-300 space-y-4">
    
    <div className="text-base font-semibold text-white">
      وجدنا فكرة مناسبة 🎯
    </div>

    <div className="text-sm text-slate-400">
      لكن لا يوجد تاجر محلي مطابق حالياً
    </div>

    <div className="text-sm text-slate-400">
      يمكنك تنفيذ هذه الفكرة عبر:
    </div>

    <div className="flex flex-wrap justify-center gap-2 mt-2">
   <button
  onClick={() => {
    if (topGiftConcepts.length <= 1) {
      setFallbackMessage("لا توجد بدائل قريبة أكثر حالياً");
      return;
    }
    setMode("alternative");
    setFallbackMessage("");
  }}
  className="px-3 py-1 rounded-full bg-slate-800 text-xs"
>
  بدائل قريبة
</button>
    <button
  onClick={() => window.open(getOnlineLink(), "_blank")}
  className="px-3 py-1 rounded-full bg-slate-800 text-xs"
>
  متاجر أونلاين
</button>
      <span className="px-3 py-1 rounded-full bg-slate-800 text-xs">
        تجارب وخدمات
      </span>
    </div>
{fallbackMessage && (
  <div className="mt-3 text-xs text-slate-400 text-center">
    {fallbackMessage}
  </div>
)}
  </div>
)}
 {topMerchants.map((merchant, index) => {
    const mapLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      merchant.locationQuery,
    )}`;

    const cleanInstagram = merchant.instagram?.replace(/^@/, "").trim();
    const cleanWebsite = merchant.website?.trim();
const merchantUrl = cleanWebsite
  ? cleanWebsite.startsWith("http")
    ? cleanWebsite
    : `https://${cleanWebsite}`
  : cleanInstagram
    ? `https://instagram.com/${cleanInstagram}`
   

    return (
      <div
        key={merchant.id}
        className={`relative overflow-hidden rounded-[2rem] border ${
          index === 0
            ? "border-cyan-500/40 bg-slate-900/80 shadow-[0_0_30px_rgba(6,182,212,0.12)]"
            : "border-slate-700 bg-slate-900/60"
        } p-5`}
      >
        {index === 0 && (
          <div className="absolute start-4 top-0 -translate-y-1/2 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-1 text-xs font-bold text-white">
            {t.bestMatch}
          </div>
        )}

        <div className="mb-4 flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-2xl font-black">{merchant.name}</h3>

            <p className="mt-2 text-sm text-slate-300">
              {language === "ar"
                ? "لماذا هذا الاختيار؟ مناسب تماماً للمناسبة والأسلوب والميزانية المختارة"
                : "Why this fits: Perfect for the selected occasion, style, and budget"}
            </p>

            <div className="mt-1 flex items-center gap-1 text-sm text-slate-400">
              <MapPin className="h-4 w-4 shrink-0" />
              <span className="truncate">
                {merchant.city}, {merchant.country}
              </span>
            </div>
          </div>

          <div className="rounded-2xl bg-slate-950/60 px-4 py-3 text-center">
            <div className="text-3xl font-black text-cyan-400">{merchant.score}%</div>
            <div className="text-xs uppercase tracking-widest text-slate-500">
              {t.match}
            </div>
          </div>
        </div>

        <p className="mb-4 text-base leading-relaxed text-slate-300">
          {merchant.description}
        </p>

        <div className="mb-4 flex flex-wrap gap-2">
          <span className="rounded-full bg-slate-700/70 px-3 py-1 text-sm text-slate-200">
            {merchant.category}
          </span>

          {merchant.trusted && (
            <span className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-3 py-1 text-sm text-emerald-400">
              <CheckCircle2 className="h-4 w-4" />
              {t.trusted}
            </span>
          )}

          {merchant.subscriptionPlan === "premium" && (
            <span className="flex items-center gap-1 rounded-full bg-amber-500/10 px-3 py-1 text-sm text-amber-400">
              <Crown className="h-4 w-4" />
              {t.premium}
            </span>
          )}
        </div>

        <div className="mb-4 rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-4">
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-cyan-400">
            <Sparkles className="h-4 w-4" />
            {t.whyFits}
          </div>
          <p className="text-sm text-slate-200">{merchant.reason}</p>
        </div>

        <div className="mb-2 text-xs font-semibold text-cyan-400">
          Customer from GiftMind
        </div>

        <div className="mb-4 flex gap-2 overflow-x-auto pb-1">
          <a
            href={`tel:${merchant.phone}`}
            className="rounded-xl bg-slate-800/70 p-3 text-slate-300 transition-colors hover:text-cyan-400"
          >
            <Phone className="h-5 w-5" />
          </a>

          {merchant.whatsapp && (
            <a
              href={`https://wa.me/${merchant.whatsapp.replace(/\D/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl bg-slate-800/70 p-3 text-slate-300 transition-colors hover:text-cyan-400"
            >
              <MessageCircle className="h-5 w-5" />
            </a>
          )}

          <a
            href={mapLink}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-xl bg-slate-800/70 p-3 text-slate-300 transition-colors hover:text-cyan-400"
          >
            <MapPin className="h-5 w-5" />
          </a>

          {merchant.instagram && (
            <a
              href={`https://instagram.com/${merchant.instagram.replace(/^@/, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl bg-slate-800/70 p-3 text-slate-300 transition-colors hover:text-cyan-400"
            >
              <Instagram className="h-5 w-5" />
            </a>
          )}

          {merchant.tiktok && (
            <a
              href={`https://tiktok.com/@${merchant.tiktok.replace(/^@/, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl bg-slate-800/70 p-3 text-slate-300 transition-colors hover:text-cyan-400"
            >
              <TikTokIcon className="h-5 w-5" />
            </a>
          )}
        </div>

        <div className="grid gap-2">
          <button
            onClick={handleShare}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-800 px-4 py-4 text-sm font-bold text-white transition-all hover:bg-slate-700"
          >
            <Share2 className="h-4 w-4" />
            {t.share}
          </button>

        {merchantUrl ? (
  <a
  href={merchantUrl ? (merchantUrl.startsWith("http") ? merchantUrl : `https://${merchantUrl}`) : "#"}
    target="_blank"
    rel="noopener noreferrer"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 py-3 font-semibold text-white"
            >
              <Globe className="h-4 w-4" />
              {t.visit}
              <ExternalLink className="h-4 w-4" />
              
            </a>
          ) : (
            <button
              disabled
              className="flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-xl bg-slate-700 py-3 font-semibold text-slate-400"
            >
              <Globe className="h-4 w-4" />
              {t.visit}
              <ExternalLink className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    );
  })}
</div>
            <button
              onClick={startOver}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-700 bg-slate-900/60 px-4 py-4 text-sm font-bold text-slate-300 transition-all hover:text-white"
            >
              <RefreshCcw className="h-4 w-4" />
              {t.restart}
            </button>
          </section>
        )}

        <footer className="mt-14 text-center opacity-30">
          <p className="text-[11px] font-bold uppercase tracking-wide">{t.footer}</p>
        </footer>
      </div>
    </main>
  );
}