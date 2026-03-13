"use client";

import { useMemo, useState } from "react";

/* =========================
   Types
========================= */
type Lang = "ar" | "en" | "fr" | "tr" | "es";
type Step = "setup" | "recipient" | "occasion" | "budget" | "style" | "results";

type RecipientKey = "partner" | "friend" | "family" | "colleague" | "child";
type OccasionKey = "birthday" | "anniversary" | "thankyou" | "celebration";
type BudgetKey = "low" | "medium" | "high";
type StyleKey = "elegant" | "romantic" | "fun" | "luxury";

type GiftConcept = {
  id: string;
  titles: Record<Lang, string>;
  category: string;
  recipientFit: RecipientKey[];
  occasionFit: OccasionKey[];
  budgetFit: BudgetKey[];
  styleFit: StyleKey[];
  baseScore: number;
};

type Provider = {
  id: string;
  name: string;
  country: string;
  categories: string[];
  recipientFit: RecipientKey[];
  occasionFit: OccasionKey[];
  budgetFit: BudgetKey[];
  styleFit: StyleKey[];
  qualityScore: number;
  speedScore: number;
  friendBoost: number;
  address: string;
  phone: string;
  website: string;
  description: Partial<Record<Lang, string>>;
};

type ProviderResult = {
  id: string;
  name: string;
  address: string;
  phone: string;
  website: string;
  score: number;
  signal: string;
  description: string;
};

type GiftResult = {
  id: string;
  title: string;
  reason: string;
  providers: ProviderResult[];
};

/* =========================
   UI Text
========================= */
const UI = {
  ar: {
    appName: "GiftMind",
    heroTitle: "احصل على هديتك خلال 60 ثانية",
    heroSubtitle:
      "نقترح الهدية أولًا، ثم نعرض أفضل الجهات التي تستطيع توفيرها فعليًا.",
    setupTitle: "ابدأ قرارك",
    country: "الدولة",
    language: "اللغة",
    continue: "ابدأ",
    recipient: "لمن الهدية؟",
    occasion: "ما المناسبة؟",
    budget: "ما الميزانية؟",
    style: "ما النمط المطلوب؟",
    back: "رجوع",
    resultsTitle: "أفضل اقتراحات الهدايا لك",
    resultsSubtitle: "كل هدية معها أفضل الجهات التي تستطيع توفيرها.",
    suggestedGift: "الهدية المقترحة",
    whyGift: "سبب اختيار الهدية",
    availablePlaces: "الجهات المتاحة",
    noProvidersTitle: "لا يوجد مزودون حاليًا في هذه الدولة",
    noProvidersText:
      "يمكنك تجربة التدفق، لكن لا توجد نتائج فعلية لهذه الدولة في الوقت الحالي.",
    go: "اذهب →",
    call: "اتصل",
    askFriend: "✨ استشر صديقًا",
    newSearch: "بحث جديد",
    selectedCountry: "الدولة المختارة",
    fromGiftMind: "Customer from GiftMind",
    availability: "التوفر",
    availabilityYes: "يوجد مزودون متاحون حاليًا في هذه الدولة.",
    availabilityNo: "لا يوجد مزودون متاحون حاليًا في هذه الدولة.",
    socialTitle: "تابع GiftMind",
    top3: "أفضل 3 فقط",
    top3Text: "خيارات أقل، وضوح أكبر، وتنفيذ أسرع.",
    giftFirst: "الهدية أولًا",
    giftFirstText: "نقترح الهدية أولًا ثم نريك أين تحصل عليها.",
    smoothFlow: "تدفق واحد",
    smoothFlowText: "كل شيء يحدث داخل تجربة واحدة حديثة وسريعة.",
    recipients: {
      partner: "شريك",
      friend: "صديق",
      family: "العائلة",
      colleague: "زميل",
      child: "طفل",
    },
    occasions: {
      birthday: "عيد ميلاد",
      anniversary: "ذكرى",
      thankyou: "شكر",
      celebration: "احتفال",
    },
    budgets: {
      low: "منخفضة",
      medium: "متوسطة",
      high: "مرتفعة",
    },
    styles: {
      elegant: "أنيق",
      romantic: "رومانسي",
      fun: "مرح",
      luxury: "فاخر",
    },
  },
  en: {
    appName: "GiftMind",
    heroTitle: "Get your gift in 60 seconds",
    heroSubtitle:
      "Gift first. Then the best places that can actually provide it.",
    setupTitle: "Start your decision",
    country: "Country",
    language: "Language",
    continue: "Start",
    recipient: "Who is the gift for?",
    occasion: "What is the occasion?",
    budget: "What is your budget?",
    style: "What style do you want?",
    back: "Back",
    resultsTitle: "Best gift suggestions for you",
    resultsSubtitle: "Each gift comes with the best places that can provide it.",
    suggestedGift: "Suggested gift",
    whyGift: "Why this gift",
    availablePlaces: "Available places",
    noProvidersTitle: "No providers available in this country right now",
    noProvidersText:
      "You can still explore the flow, but live results are not available for this country at the moment.",
    go: "Go →",
    call: "Call",
    askFriend: "✨ Ask a Friend",
    newSearch: "New Search",
    selectedCountry: "Selected country",
    fromGiftMind: "Customer from GiftMind",
    availability: "Availability",
    availabilityYes: "Providers are currently available in this country.",
    availabilityNo: "No providers are currently available in this country.",
    socialTitle: "Follow GiftMind",
    top3: "Top 3 only",
    top3Text: "Less noise, clearer choices, faster action.",
    giftFirst: "Gift first",
    giftFirstText: "We suggest the gift first, then show where to get it.",
    smoothFlow: "One smooth flow",
    smoothFlowText: "Everything happens in one modern, fast experience.",
    recipients: {
      partner: "Partner",
      friend: "Friend",
      family: "Family",
      colleague: "Colleague",
      child: "Child",
    },
    occasions: {
      birthday: "Birthday",
      anniversary: "Anniversary",
      thankyou: "Thank You",
      celebration: "Celebration",
    },
    budgets: {
      low: "Low",
      medium: "Medium",
      high: "High",
    },
    styles: {
      elegant: "Elegant",
      romantic: "Romantic",
      fun: "Fun",
      luxury: "Luxury",
    },
  },
  fr: {
    appName: "GiftMind",
    heroTitle: "Trouvez votre cadeau en 60 secondes",
    heroSubtitle:
      "D’abord le cadeau, puis les meilleurs endroits pour l’obtenir.",
    setupTitle: "Commencez votre décision",
    country: "Pays",
    language: "Langue",
    continue: "Commencer",
    recipient: "À qui est destiné le cadeau ?",
    occasion: "Quelle est l'occasion ?",
    budget: "Quel est votre budget ?",
    style: "Quel style souhaitez-vous ?",
    back: "Retour",
    resultsTitle: "Meilleures suggestions de cadeaux",
    resultsSubtitle:
      "Chaque cadeau est accompagné des meilleurs endroits pour l’obtenir.",
    suggestedGift: "Cadeau suggéré",
    whyGift: "Pourquoi ce cadeau",
    availablePlaces: "Lieux disponibles",
    noProvidersTitle: "Aucun prestataire disponible dans ce pays",
    noProvidersText:
      "Vous pouvez parcourir l’expérience, mais il n’y a pas encore de résultats réels pour ce pays.",
    go: "Go →",
    call: "Appeler",
    askFriend: "✨ Demander à un ami",
    newSearch: "Nouvelle recherche",
    selectedCountry: "Pays sélectionné",
    fromGiftMind: "Customer from GiftMind",
    availability: "Disponibilité",
    availabilityYes: "Des prestataires sont disponibles dans ce pays.",
    availabilityNo: "Aucun prestataire n’est disponible dans ce pays.",
    socialTitle: "Suivre GiftMind",
    top3: "Top 3 seulement",
    top3Text: "Moins de bruit, plus de clarté, action plus rapide.",
    giftFirst: "Le cadeau d’abord",
    giftFirstText: "Nous suggérons d’abord le cadeau, puis où l’obtenir.",
    smoothFlow: "Un seul parcours",
    smoothFlowText: "Tout se passe dans une expérience moderne et rapide.",
    recipients: {
      partner: "Partenaire",
      friend: "Ami",
      family: "Famille",
      colleague: "Collègue",
      child: "Enfant",
    },
    occasions: {
      birthday: "Anniversaire",
      anniversary: "Anniversaire de couple",
      thankyou: "Remerciement",
      celebration: "Célébration",
    },
    budgets: {
      low: "Faible",
      medium: "Moyen",
      high: "Élevé",
    },
    styles: {
      elegant: "Élégant",
      romantic: "Romantique",
      fun: "Ludique",
      luxury: "Luxe",
    },
  },
  tr: {
    appName: "GiftMind",
    heroTitle: "Hediyenizi 60 saniyede bulun",
    heroSubtitle:
      "Önce hediye fikri, sonra onu sağlayabilecek en iyi yerler.",
    setupTitle: "Kararına başla",
    country: "Ülke",
    language: "Dil",
    continue: "Başla",
    recipient: "Hediye kimin için?",
    occasion: "Durum nedir?",
    budget: "Bütçeniz nedir?",
    style: "Nasıl bir stil istiyorsunuz?",
    back: "Geri",
    resultsTitle: "Sizin için en iyi hediye önerileri",
    resultsSubtitle: "Her hediye için en iyi uygun yerler gösterilir.",
    suggestedGift: "Önerilen hediye",
    whyGift: "Neden bu hediye",
    availablePlaces: "Uygun yerler",
    noProvidersTitle: "Bu ülkede şu anda sağlayıcı yok",
    noProvidersText:
      "Akışı görebilirsiniz, ancak bu ülke için canlı sonuç henüz yok.",
    go: "Go →",
    call: "Ara",
    askFriend: "✨ Bir Arkadaşa Sor",
    newSearch: "Yeni Arama",
    selectedCountry: "Seçilen ülke",
    fromGiftMind: "Customer from GiftMind",
    availability: "Uygunluk",
    availabilityYes: "Bu ülkede sağlayıcılar mevcut.",
    availabilityNo: "Bu ülkede şu anda sağlayıcı yok.",
    socialTitle: "GiftMind'ı takip et",
    top3: "Sadece Top 3",
    top3Text: "Daha az karmaşa, daha net seçimler, daha hızlı hareket.",
    giftFirst: "Önce hediye",
    giftFirstText: "Önce hediyeyi önerir, sonra nereden alacağını gösteririz.",
    smoothFlow: "Tek akış",
    smoothFlowText: "Her şey tek, modern ve hızlı deneyimde olur.",
    recipients: {
      partner: "Partner",
      friend: "Arkadaş",
      family: "Aile",
      colleague: "İş Arkadaşı",
      child: "Çocuk",
    },
    occasions: {
      birthday: "Doğum Günü",
      anniversary: "Yıldönümü",
      thankyou: "Teşekkür",
      celebration: "Kutlama",
    },
    budgets: {
      low: "Düşük",
      medium: "Orta",
      high: "Yüksek",
    },
    styles: {
      elegant: "Zarif",
      romantic: "Romantik",
      fun: "Eğlenceli",
      luxury: "Lüks",
    },
  },
  es: {
    appName: "GiftMind",
    heroTitle: "Consigue tu regalo en 60 segundos",
    heroSubtitle:
      "Primero el regalo, luego los mejores lugares para conseguirlo.",
    setupTitle: "Empieza tu decisión",
    country: "País",
    language: "Idioma",
    continue: "Empezar",
    recipient: "¿Para quién es el regalo?",
    occasion: "¿Cuál es la ocasión?",
    budget: "¿Cuál es tu presupuesto?",
    style: "¿Qué estilo quieres?",
    back: "Volver",
    resultsTitle: "Mejores sugerencias de regalos",
    resultsSubtitle: "Cada regalo muestra los mejores lugares para conseguirlo.",
    suggestedGift: "Regalo sugerido",
    whyGift: "Por qué este regalo",
    availablePlaces: "Lugares disponibles",
    noProvidersTitle: "No hay proveedores disponibles en este país",
    noProvidersText:
      "Puedes explorar el flujo, pero todavía no hay resultados reales para este país.",
    go: "Go →",
    call: "Llamar",
    askFriend: "✨ Preguntar a un amigo",
    newSearch: "Nueva búsqueda",
    selectedCountry: "País seleccionado",
    fromGiftMind: "Customer from GiftMind",
    availability: "Disponibilidad",
    availabilityYes: "Hay proveedores disponibles en este país.",
    availabilityNo: "No hay proveedores disponibles en este país.",
    socialTitle: "Sigue a GiftMind",
    top3: "Solo Top 3",
    top3Text: "Menos ruido, decisiones más claras, acción más rápida.",
    giftFirst: "Primero el regalo",
    giftFirstText: "Sugerimos primero el regalo y luego dónde conseguirlo.",
    smoothFlow: "Un solo flujo",
    smoothFlowText: "Todo ocurre en una experiencia moderna y rápida.",
    recipients: {
      partner: "Pareja",
      friend: "Amigo",
      family: "Familia",
      colleague: "Colega",
      child: "Niño",
    },
    occasions: {
      birthday: "Cumpleaños",
      anniversary: "Aniversario",
      thankyou: "Agradecimiento",
      celebration: "Celebración",
    },
    budgets: {
      low: "Bajo",
      medium: "Medio",
      high: "Alto",
    },
    styles: {
      elegant: "Elegante",
      romantic: "Romántico",
      fun: "Divertido",
      luxury: "Lujo",
    },
  },
} as const;

/* =========================
   Countries
========================= */
const COUNTRIES = [
  "Jordan",
  "United Arab Emirates",
  "Saudi Arabia",
  "Qatar",
  "Kuwait",
  "Bahrain",
  "Oman",
  "Turkey",
  "Egypt",
  "Iraq",
  "Lebanon",
  "United Kingdom",
  "United States",
];

/* =========================
   Gift Concepts
========================= */
const GIFT_CONCEPTS: GiftConcept[] = [
  {
    id: "fine-dining",
    titles: {
      ar: "تجربة عشاء راقية",
      en: "Fine Dining Experience",
      fr: "Expérience gastronomique",
      tr: "Seçkin Akşam Yemeği Deneyimi",
      es: "Experiencia gastronómica premium",
    },
    category: "dining",
    recipientFit: ["partner", "friend", "family", "colleague"],
    occasionFit: ["birthday", "anniversary", "celebration", "thankyou"],
    budgetFit: ["medium", "high"],
    styleFit: ["elegant", "romantic", "luxury"],
    baseScore: 9,
  },
  {
    id: "luxury-flowers",
    titles: {
      ar: "تنسيق زهور فاخر",
      en: "Luxury Flower Arrangement",
      fr: "Composition florale de luxe",
      tr: "Lüks Çiçek Aranjmanı",
      es: "Arreglo floral de lujo",
    },
    category: "flowers",
    recipientFit: ["partner", "friend", "family"],
    occasionFit: ["birthday", "anniversary", "thankyou", "celebration"],
    budgetFit: ["low", "medium"],
    styleFit: ["elegant", "romantic", "luxury"],
    baseScore: 8,
  },
  {
    id: "spa-retreat",
    titles: {
      ar: "هدية سبا واسترخاء",
      en: "Spa & Relaxation Gift",
      fr: "Cadeau spa et détente",
      tr: "Spa ve Rahatlama Hediyesi",
      es: "Regalo de spa y relajación",
    },
    category: "spa",
    recipientFit: ["partner", "friend", "family"],
    occasionFit: ["birthday", "thankyou", "celebration"],
    budgetFit: ["medium", "high"],
    styleFit: ["elegant", "luxury"],
    baseScore: 7,
  },
  {
    id: "premium-chocolate",
    titles: {
      ar: "علبة شوكولاتة فاخرة",
      en: "Premium Chocolate Gift Box",
      fr: "Coffret de chocolat premium",
      tr: "Premium Çikolata Hediye Kutusu",
      es: "Caja premium de chocolates",
    },
    category: "chocolate",
    recipientFit: ["partner", "friend", "family", "colleague", "child"],
    occasionFit: ["birthday", "thankyou", "celebration"],
    budgetFit: ["low", "medium"],
    styleFit: ["fun", "elegant", "romantic"],
    baseScore: 7,
  },
  {
    id: "designer-perfume",
    titles: {
      ar: "هدية عطر مصمم",
      en: "Designer Perfume Gift",
      fr: "Cadeau parfum de créateur",
      tr: "Tasarımcı Parfüm Hediyesi",
      es: "Regalo de perfume de diseñador",
    },
    category: "perfume",
    recipientFit: ["partner", "friend", "family"],
    occasionFit: ["birthday", "anniversary", "celebration"],
    budgetFit: ["medium", "high"],
    styleFit: ["elegant", "romantic", "luxury"],
    baseScore: 8,
  },
  {
    id: "gift-box",
    titles: {
      ar: "صندوق هدايا مخصص",
      en: "Personalised Gift Box",
      fr: "Coffret cadeau personnalisé",
      tr: "Kişiselleştirilmiş Hediye Kutusu",
      es: "Caja de regalo personalizada",
    },
    category: "giftbox",
    recipientFit: ["partner", "friend", "family", "colleague", "child"],
    occasionFit: ["birthday", "thankyou", "celebration"],
    budgetFit: ["low", "medium"],
    styleFit: ["fun", "elegant"],
    baseScore: 6,
  },
  {
    id: "jewellery",
    titles: {
      ar: "قطعة مجوهرات أنيقة",
      en: "Elegant Jewellery Piece",
      fr: "Bijou élégant",
      tr: "Zarif Takı Parçası",
      es: "Joya elegante",
    },
    category: "jewellery",
    recipientFit: ["partner", "family"],
    occasionFit: ["birthday", "anniversary", "celebration"],
    budgetFit: ["high"],
    styleFit: ["elegant", "romantic", "luxury"],
    baseScore: 9,
  },
];

/* =========================
   Providers
========================= */
const PROVIDERS: Provider[] = [
  {
    id: "p1",
    name: "La Maison Lounge",
    country: "Jordan",
    categories: ["dining"],
    recipientFit: ["partner", "friend", "family", "colleague"],
    occasionFit: ["birthday", "anniversary", "celebration", "thankyou"],
    budgetFit: ["medium", "high"],
    styleFit: ["elegant", "romantic", "luxury"],
    qualityScore: 9,
    speedScore: 6,
    friendBoost: 8,
    address: "Amman, Abdoun",
    phone: "+962790000111",
    website: "https://example.com/la-maison-lounge",
    description: {
      ar: "عشاء أنيق بأجواء وتقديم فاخر.",
      en: "Elegant dining with premium atmosphere and presentation.",
      fr: "Restaurant élégant avec une présentation premium.",
      tr: "Premium atmosferli şık yemek deneyimi.",
      es: "Cena elegante con ambiente y presentación premium.",
    },
  },
  {
    id: "p2",
    name: "Bloom Gallery",
    country: "Jordan",
    categories: ["flowers"],
    recipientFit: ["partner", "friend", "family"],
    occasionFit: ["birthday", "anniversary", "thankyou", "celebration"],
    budgetFit: ["low", "medium"],
    styleFit: ["elegant", "romantic", "luxury"],
    qualityScore: 8,
    speedScore: 8,
    friendBoost: 8,
    address: "Amman, Sweifieh",
    phone: "+962790000222",
    website: "https://example.com/bloom-gallery",
    description: {
      ar: "تنسيقات زهور راقية مع جاهزية محلية قوية.",
      en: "Refined floral arrangements with strong local readiness.",
      fr: "Compositions florales raffinées et rapides.",
      tr: "Hızlı ve zarif çiçek düzenlemeleri.",
      es: "Arreglos florales refinados y rápidos.",
    },
  },
  {
    id: "p3",
    name: "Aura Spa",
    country: "Jordan",
    categories: ["spa"],
    recipientFit: ["partner", "friend", "family"],
    occasionFit: ["birthday", "thankyou", "celebration"],
    budgetFit: ["medium", "high"],
    styleFit: ["elegant", "luxury"],
    qualityScore: 8,
    speedScore: 5,
    friendBoost: 7,
    address: "Amman, Dabouq",
    phone: "+962790000333",
    website: "https://example.com/aura-spa",
    description: {
      ar: "خيار عناية واسترخاء بأسلوب فاخر.",
      en: "Wellness-focused gift option with premium treatment style.",
      fr: "Option bien-être avec une touche premium.",
      tr: "Premium dokunuşlu rahatlama seçeneği.",
      es: "Opción wellness con toque premium.",
    },
  },
  {
    id: "p4",
    name: "Maison Cacao",
    country: "Jordan",
    categories: ["chocolate"],
    recipientFit: ["partner", "friend", "family", "colleague", "child"],
    occasionFit: ["birthday", "thankyou", "celebration"],
    budgetFit: ["low", "medium"],
    styleFit: ["fun", "elegant", "romantic"],
    qualityScore: 7,
    speedScore: 9,
    friendBoost: 9,
    address: "Amman, Khalda",
    phone: "+962790000444",
    website: "https://example.com/maison-cacao",
    description: {
      ar: "شوكولاتة فاخرة مع تقديم جاهز للإهداء.",
      en: "Premium chocolates with gifting-ready presentation.",
      fr: "Chocolats premium prêts à offrir.",
      tr: "Hediye sunumuna hazır premium çikolatalar.",
      es: "Chocolates premium listos para regalar.",
    },
  },
  {
    id: "p5",
    name: "Velour Perfumes",
    country: "Jordan",
    categories: ["perfume"],
    recipientFit: ["partner", "friend", "family"],
    occasionFit: ["birthday", "anniversary", "celebration"],
    budgetFit: ["medium", "high"],
    styleFit: ["elegant", "romantic", "luxury"],
    qualityScore: 9,
    speedScore: 7,
    friendBoost: 7,
    address: "Amman, Boulevard",
    phone: "+962790000555",
    website: "https://example.com/velour-perfumes",
    description: {
      ar: "هدايا عطور مع تغليف فاخر.",
      en: "Designer fragrance gifting with premium packaging.",
      fr: "Parfums de créateur avec packaging premium.",
      tr: "Premium ambalajlı tasarımcı parfümler.",
      es: "Perfumes de diseñador con empaque premium.",
    },
  },
  {
    id: "p6",
    name: "Curated Box Studio",
    country: "Jordan",
    categories: ["giftbox"],
    recipientFit: ["partner", "friend", "family", "colleague", "child"],
    occasionFit: ["birthday", "thankyou", "celebration"],
    budgetFit: ["low", "medium"],
    styleFit: ["fun", "elegant"],
    qualityScore: 6,
    speedScore: 8,
    friendBoost: 9,
    address: "Amman, Gardens",
    phone: "+962790000666",
    website: "https://example.com/curated-box-studio",
    description: {
      ar: "صناديق هدايا مرنة لفئات متعددة.",
      en: "Flexible gift box options for many recipient types.",
      fr: "Coffrets cadeaux flexibles pour plusieurs profils.",
      tr: "Birçok alıcı tipi için esnek hediye kutuları.",
      es: "Cajas de regalo flexibles para varios perfiles.",
    },
  },
  {
    id: "p7",
    name: "Golden Table",
    country: "United Arab Emirates",
    categories: ["dining"],
    recipientFit: ["partner", "friend", "family", "colleague"],
    occasionFit: ["birthday", "anniversary", "celebration", "thankyou"],
    budgetFit: ["medium", "high"],
    styleFit: ["elegant", "romantic", "luxury"],
    qualityScore: 10,
    speedScore: 6,
    friendBoost: 8,
    address: "Dubai, Downtown",
    phone: "+971500000111",
    website: "https://example.com/golden-table",
    description: {
      ar: "تجربة عشاء فاخرة مصممة لهدية لا تُنسى.",
      en: "Luxury dining experience designed for memorable gifting.",
      fr: "Expérience gastronomique de luxe pour offrir.",
      tr: "Unutulmaz hediye için lüks yemek deneyimi.",
      es: "Experiencia gastronómica de lujo para regalar.",
    },
  },
  {
    id: "p8",
    name: "Rose Atelier",
    country: "United Arab Emirates",
    categories: ["flowers"],
    recipientFit: ["partner", "friend", "family"],
    occasionFit: ["birthday", "anniversary", "thankyou", "celebration"],
    budgetFit: ["low", "medium"],
    styleFit: ["elegant", "romantic", "luxury"],
    qualityScore: 9,
    speedScore: 8,
    friendBoost: 8,
    address: "Dubai, Jumeirah",
    phone: "+971500000222",
    website: "https://example.com/rose-atelier",
    description: {
      ar: "هدايا زهور راقية مع تقديم فاخر.",
      en: "High-end floral gifting with premium presentation.",
      fr: "Fleurs premium avec belle présentation.",
      tr: "Premium sunumlu üst düzey çiçek hediyeleri.",
      es: "Regalos florales de alto nivel.",
    },
  },
  {
    id: "p9",
    name: "Silk Spa House",
    country: "United Arab Emirates",
    categories: ["spa"],
    recipientFit: ["partner", "friend", "family"],
    occasionFit: ["birthday", "thankyou", "celebration"],
    budgetFit: ["medium", "high"],
    styleFit: ["elegant", "luxury"],
    qualityScore: 9,
    speedScore: 5,
    friendBoost: 7,
    address: "Dubai, Marina",
    phone: "+971500000333",
    website: "https://example.com/silk-spa-house",
    description: {
      ar: "هدايا سبا فاخرة مع تجربة راقية.",
      en: "Premium spa gifting with luxurious customer experience.",
      fr: "Spa premium avec expérience luxueuse.",
      tr: "Lüks deneyim sunan premium spa.",
      es: "Spa premium con experiencia lujosa.",
    },
  },
  {
    id: "p10",
    name: "Luna Fragrance",
    country: "United Arab Emirates",
    categories: ["perfume"],
    recipientFit: ["partner", "friend", "family"],
    occasionFit: ["birthday", "anniversary", "celebration"],
    budgetFit: ["medium", "high"],
    styleFit: ["elegant", "romantic", "luxury"],
    qualityScore: 10,
    speedScore: 7,
    friendBoost: 7,
    address: "Dubai, City Walk",
    phone: "+971500000444",
    website: "https://example.com/luna-fragrance",
    description: {
      ar: "دار عطور فاخرة مع تقديم مناسب للهدايا.",
      en: "Luxury perfume house with gift-worthy presentation.",
      fr: "Maison de parfum de luxe pour offrir.",
      tr: "Hediye için uygun lüks parfüm evi.",
      es: "Casa de perfumes de lujo para regalar.",
    },
    },
{
  id: "j1",
  name: "Fakhreldin Restaurant",
  country: "Jordan",
  categories: ["dining"],

  recipientFit: ["partner", "friend", "family", "colleague"],
  occasionFit: ["birthday", "anniversary", "celebration", "thankyou"],
  budgetFit: ["medium", "high"],
  styleFit: ["elegant", "romantic", "luxury"],
  qualityScore: 9,
  speedScore: 6,
  friendBoost: 8,
  address: "Amman, Jabal Amman",
  phone: "+96264651555",
  website: "https://fakhreldinrestaurant.com",
  description: {
    ar: "مطعم شرقي فاخر مناسب لتجارب العشاء الراقية والهدايا المميزة.",
    en: "Luxury oriental restaurant ideal for premium dining gifts."
  }
},
{
  id: "j2",
  name: "Sufra Restaurant",
  country: "Jordan",
  categories: ["dining"],
  recipientFit: ["partner", "friend", "family", "colleague"],
  occasionFit: ["birthday", "anniversary", "celebration", "thankyou"],
  budgetFit: ["medium", "high"],
  styleFit: ["elegant", "romantic"],
  qualityScore: 8,
  speedScore: 7,
  friendBoost: 7,
  address: "Amman, Rainbow Street",
  phone: "+96264614688",
  website: "https://sufrarestaurant.com",
  description: {
    ar: "تجربة طعام أردنية تراثية بأجواء راقية ومناسبة للهدايا.",
    en: "Authentic Jordanian dining experience in an elegant atmosphere."
  }
},
{
  id: "j3",
  name: "Vivel Patisserie",
  country: "Jordan",
  categories: ["chocolate"],
  recipientFit: ["partner", "friend", "family", "colleague", "child"],
  occasionFit: ["birthday", "thankyou", "celebration"],
  budgetFit: ["low", "medium"],
  styleFit: ["fun", "elegant", "romantic"],
  qualityScore: 8,
  speedScore: 8,
  friendBoost: 8,
  address: "Amman, Abdali",
  phone: "+96265666660",
  website: "https://vivel.me",
  description: {
    ar: "حلويات أوروبية فاخرة وتغليف أنيق مناسب للهدايا.",
    en: "Premium European patisserie with elegant gift-ready presentation."
  }
},

];

/* =========================
   Helpers
========================= */
function scoreConcept(
  concept: GiftConcept,
  recipient: RecipientKey,
  occasion: OccasionKey,
  budget: BudgetKey,
  style: StyleKey
) {
  let score = concept.baseScore;
  if (concept.recipientFit.includes(recipient)) score += 30;
  if (concept.occasionFit.includes(occasion)) score += 25;
  if (concept.budgetFit.includes(budget)) score += 20;
  if (concept.styleFit.includes(style)) score += 25;
  return score;
}

function scoreProvider(
  provider: Provider,
  recipient: RecipientKey,
  occasion: OccasionKey,
  budget: BudgetKey,
  style: StyleKey
) {
  let score = 0;
  if (provider.recipientFit.includes(recipient)) score += 24;
  if (provider.occasionFit.includes(occasion)) score += 22;
  if (provider.budgetFit.includes(budget)) score += 18;
  if (provider.styleFit.includes(style)) score += 18;
  score += provider.qualityScore * 2;
  score += provider.speedScore;
  if (recipient === "friend") score += provider.friendBoost;
  return score;
}

function clampScore(n: number) {
  return Math.max(60, Math.min(98, Math.round(n)));
}

function buildGiftReason(
  lang: Lang,
  recipient: RecipientKey,
  occasion: OccasionKey,
  budget: BudgetKey,
  style: StyleKey
) {
  const t = UI[lang];
  if (lang === "ar") {
    return `هذه الهدية مناسبة لـ ${t.recipients[recipient]} في ${t.occasions[occasion]} ضمن ميزانية ${t.budgets[budget]} وبنمط ${t.styles[style]}.`;
  }
  if (lang === "fr") {
    return `Ce cadeau convient bien à ${t.recipients[recipient].toLowerCase()} pour ${t.occasions[occasion].toLowerCase()} avec un budget ${t.budgets[budget].toLowerCase()} et un style ${t.styles[style].toLowerCase()}.`;
  }
  if (lang === "tr") {
    return `${t.recipients[recipient]} için ${t.occasions[occasion].toLowerCase()} bağlamında, ${t.budgets[budget].toLowerCase()} bütçe ve ${t.styles[style].toLowerCase()} stil için güçlü bir seçim.`;
  }
  if (lang === "es") {
    return `Este regalo encaja bien para ${t.recipients[recipient].toLowerCase()} en ${t.occasions[occasion].toLowerCase()} con presupuesto ${t.budgets[budget].toLowerCase()} y estilo ${t.styles[style].toLowerCase()}.`;
  }
  return `This gift fits a ${t.recipients[recipient].toLowerCase()} for ${t.occasions[occasion].toLowerCase()} with a ${t.budgets[budget].toLowerCase()} budget and a ${t.styles[style].toLowerCase()} style.`;
}

function providerSignal(lang: Lang, p: Provider) {
  const premium = p.qualityScore >= 9;
  const fast = p.speedScore >= 8;

  if (lang === "ar") {
    if (premium && fast) return "فاخر وسريع";
    if (premium) return "تقديم فاخر";
    if (fast) return "جاهزية سريعة";
    return "خيار متوازن";
  }
  if (lang === "fr") {
    if (premium && fast) return "Premium et rapide";
    if (premium) return "Présentation premium";
    if (fast) return "Rapide";
    return "Équilibré";
  }
  if (lang === "tr") {
    if (premium && fast) return "Premium ve hızlı";
    if (premium) return "Premium sunum";
    if (fast) return "Hızlı";
    return "Dengeli";
  }
  if (lang === "es") {
    if (premium && fast) return "Premium y rápido";
    if (premium) return "Presentación premium";
    if (fast) return "Rápido";
    return "Equilibrado";
  }
  if (premium && fast) return "Premium and fast";
  if (premium) return "Premium presentation";
  if (fast) return "Fast local availability";
  return "Balanced option";
}

function buildResults(params: {
  lang: Lang;
  country: string;
  recipient: RecipientKey;
  occasion: OccasionKey;
  budget: BudgetKey;
  style: StyleKey;
}): GiftResult[] {
  const { lang, country, recipient, occasion, budget, style } = params;

  const countryProviders = PROVIDERS.filter((p) => p.country === country);
  if (countryProviders.length === 0) return [];

  const rankedConcepts = GIFT_CONCEPTS.map((concept) => ({
    concept,
    score: scoreConcept(concept, recipient, occasion, budget, style),
  }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  return rankedConcepts
    .map(({ concept, score: conceptScore }) => {
      const matchingProviders = countryProviders
        .filter((p) => p.categories.includes(concept.category))
        .filter((p) => p.budgetFit.includes(budget))
        .map((p) => {
          const score = clampScore(
            conceptScore * 0.4 + scoreProvider(p, recipient, occasion, budget, style) * 0.6
          );
          return {
            id: p.id,
            name: p.name,
            address: p.address,
            phone: p.phone,
            website: p.website,
            score,
            signal: providerSignal(lang, p),
         description: p.description[lang] ?? "",
          };
        })
        .sort((a, b) => b.score - a.score)
        .slice(0, 3);

      return {
        id: concept.id,
        title: concept.titles[lang],
        reason: buildGiftReason(lang, recipient, occasion, budget, style),
        providers: matchingProviders,
      };
    })
    .filter((r) => r.providers.length > 0);
}

/* =========================
   Component
========================= */
export default function GiftMindPage() {
  const [lang, setLang] = useState<Lang>("ar");
  const [country, setCountry] = useState("Jordan");
  const [step, setStep] = useState<Step>("setup");

  const [recipient, setRecipient] = useState<RecipientKey | null>(null);
  const [occasion, setOccasion] = useState<OccasionKey | null>(null);
  const [budget, setBudget] = useState<BudgetKey | null>(null);
  const [style, setStyle] = useState<StyleKey | null>(null);

  const t = UI[lang];
  const isRtl = lang === "ar";

  const hasProviders = useMemo(
    () => PROVIDERS.some((p) => p.country === country),
    [country]
  );

  const results = useMemo(() => {
    if (!recipient || !occasion || !budget || !style) return [];
    return buildResults({ lang, country, recipient, occasion, budget, style });
  }, [lang, country, recipient, occasion, budget, style]);

  const progress =
    step === "setup"
      ? 0
      : step === "recipient"
      ? 25
      : step === "occasion"
      ? 50
      : step === "budget"
      ? 75
      : step === "style"
      ? 90
      : 100;

  const resetAll = () => {
    setStep("setup");
    setRecipient(null);
    setOccasion(null);
    setBudget(null);
    setStyle(null);
  };

  const openExternal = (url: string) => {
    if (!url) return;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleAskFriend = async () => {
    const shareText =
      lang === "ar"
        ? `شوف GiftMind وساعدني أختار هدية مناسبة في ${country}`
        : `Check GiftMind and help me choose a suitable gift in ${country}`;

    const shareUrl = window.location.href;

    try {
      if (navigator.share) {
        await navigator.share({
          title: "GiftMind",
          text: shareText,
          url: shareUrl,
        });
        return;
      }

      await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
      alert(lang === "ar" ? "تم نسخ الرابط للمشاركة" : "Link copied for sharing");
    } catch (error) {
      console.error("Share failed:", error);
    }
  };

  const recipientOptions: { key: RecipientKey; label: string }[] = [
    { key: "partner", label: t.recipients.partner },
    { key: "friend", label: t.recipients.friend },
    { key: "family", label: t.recipients.family },
    { key: "colleague", label: t.recipients.colleague },
    { key: "child", label: t.recipients.child },
  ];

  const occasionOptions: { key: OccasionKey; label: string }[] = [
    { key: "birthday", label: t.occasions.birthday },
    { key: "anniversary", label: t.occasions.anniversary },
    { key: "thankyou", label: t.occasions.thankyou },
    { key: "celebration", label: t.occasions.celebration },
  ];

  const budgetOptions: { key: BudgetKey; label: string }[] = [
    { key: "low", label: t.budgets.low },
    { key: "medium", label: t.budgets.medium },
    { key: "high", label: t.budgets.high },
  ];

  const styleOptions: { key: StyleKey; label: string }[] = [
    { key: "elegant", label: t.styles.elegant },
    { key: "romantic", label: t.styles.romantic },
    { key: "fun", label: t.styles.fun },
    { key: "luxury", label: t.styles.luxury },
  ];

  return (
    <main
      dir={isRtl ? "rtl" : "ltr"}
      className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_12%_18%,rgba(0,196,255,0.18),transparent_22%),radial-gradient(circle_at_86%_16%,rgba(168,85,247,0.18),transparent_24%),linear-gradient(135deg,#08111f_0%,#0c1f38_45%,#132d4b_100%)] text-white"
    >
      <div className="mx-auto max-w-7xl px-5 py-6 md:px-8 md:py-8">
        <div className="overflow-hidden rounded-[34px] border border-white/12 bg-white/[0.05] shadow-[0_28px_80px_rgba(0,0,0,0.45)] backdrop-blur-2xl">
          <div className="grid min-h-[84vh] lg:grid-cols-[1.02fr_0.98fr]">
            {/* Left / Brand side */}
            <section className="border-b border-white/10 p-6 md:p-8 lg:border-b-0 lg:border-r lg:p-10">
              <div className="flex items-center justify-between">
                <div className="inline-flex rounded-full border border-white/12 bg-white/[0.06] px-4 py-2 text-xs uppercase tracking-[0.35em] text-[#d7c79e]">
                  {t.appName}
                </div>

                <div className="hidden md:flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-3 py-2 text-xs text-white/65">
                  <span className="h-2 w-2 rounded-full bg-emerald-300" />
                  <span>Decision Engine</span>
                </div>
              </div>

              <div className="mt-8">
                <h1
                  className={`max-w-2xl font-bold leading-[1.05] ${
                    isRtl ? "text-4xl md:text-5xl" : "text-4xl md:text-6xl"
                  }`}
                >
                  {t.heroTitle}
                </h1>
                <p className="mt-4 max-w-xl text-base leading-7 text-white/72 md:text-lg">
                  {t.heroSubtitle}
                </p>
              </div>

              <div className="mt-8 h-2 w-full overflow-hidden rounded-full bg-white/8">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-cyan-300 via-sky-300 to-violet-300 transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <div className="mt-8 grid gap-4 md:grid-cols-3">
                <InfoCard title={t.smoothFlow} text={t.smoothFlowText} />
                <InfoCard title={t.giftFirst} text={t.giftFirstText} />
                <InfoCard title={t.top3} text={t.top3Text} />
              </div>

              <div className="mt-8 rounded-[24px] border border-white/10 bg-black/10 p-5">
                <div className="text-xs uppercase tracking-[0.25em] text-white/45">
                  {t.availability}
                </div>
                <div
                  className={`mt-3 text-sm leading-6 ${
                    hasProviders ? "text-emerald-200" : "text-amber-200"
                  }`}
                >
                  {hasProviders ? t.availabilityYes : t.availabilityNo}
                </div>
              </div>

              <div className="mt-8 rounded-[24px] border border-white/10 bg-black/10 p-5">
                <div className="text-xs uppercase tracking-[0.25em] text-white/45">
                  {t.socialTitle}
                </div>

                <div className="mt-4 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      openExternal(
                        "https://www.instagram.com/giftmind2026?igsh=MXhucjdneHBibm02bQ=="
                      )
                    }
                    className="rounded-full border border-white/12 bg-white/[0.06] px-4 py-2 text-sm text-white/85 transition hover:bg-white/[0.10]"
                  >
                    Instagram
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      openExternal(
                        "https://www.tiktok.com/@salimpeygemberli?_r=1&_t=ZS-94WsRGneA9X"
                      )
                    }
                    className="rounded-full border border-white/12 bg-white/[0.06] px-4 py-2 text-sm text-white/85 transition hover:bg-white/[0.10]"
                  >
                    TikTok
                  </button>
                </div>
              </div>
            </section>

            {/* Right / Flow side */}
            <section className="p-6 md:p-8 lg:p-10">
              {step === "setup" && (
                <div className="mx-auto max-w-xl">
                  <div className="mb-5 text-sm uppercase tracking-[0.3em] text-white/45">
                    {t.setupTitle}
                  </div>

                  <div className="space-y-5">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-white/82">
                        {t.country}
                      </label>
                      <div className="rounded-[22px] border border-white/10 bg-white/95 px-4 py-1 shadow-xl">
                        <select
                          value={country}
                          onChange={(e) => setCountry(e.target.value)}
                          className="h-14 w-full bg-transparent text-[15px] font-medium text-[#0d1d2f] outline-none"
                        >
                          {COUNTRIES.map((item) => (
                            <option key={item} value={item}>
                              {item}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-white/82">
                        {t.language}
                      </label>
                      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
                        {(["ar", "en", "fr", "tr", "es"] as Lang[]).map((item) => (
                          <button
                            key={item}
                            type="button"
                            onClick={() => setLang(item)}
                            className={`rounded-[20px] border px-4 py-3 text-sm font-semibold transition ${
                              lang === item
                                ? "border-transparent bg-gradient-to-br from-white to-[#d8f0ff] text-[#0d1b2f] shadow-[0_10px_28px_rgba(173,221,255,0.28)]"
                                : "border-white/12 bg-white/[0.06] text-white hover:bg-white/[0.10]"
                            }`}
                          >
                            {item.toUpperCase()}
                          </button>
                        ))}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setStep("recipient")}
                      className="w-full rounded-[22px] bg-gradient-to-r from-[#67e8f9] via-[#8ec5ff] to-[#d5b7ff] px-5 py-4 text-base font-bold text-[#0b1b2b] shadow-[0_16px_40px_rgba(116,205,255,0.30)] transition duration-200 hover:-translate-y-0.5"
                    >
                      {t.continue}
                    </button>
                  </div>
                </div>
              )}

              {step === "recipient" && (
                <AutoQuestionBlock
                  title={t.recipient}
                  backText={t.back}
                  onBack={() => setStep("setup")}
                  options={recipientOptions}
                  selected={recipient}
                  onSelect={(value) => {
                    setRecipient(value as RecipientKey);
                    setStep("occasion");
                  }}
                />
              )}

              {step === "occasion" && (
                <AutoQuestionBlock
                  title={t.occasion}
                  backText={t.back}
                  onBack={() => setStep("recipient")}
                  options={occasionOptions}
                  selected={occasion}
                  onSelect={(value) => {
                    setOccasion(value as OccasionKey);
                    setStep("budget");
                  }}
                />
              )}

              {step === "budget" && (
                <AutoQuestionBlock
                  title={t.budget}
                  backText={t.back}
                  onBack={() => setStep("occasion")}
                  options={budgetOptions}
                  selected={budget}
                  onSelect={(value) => {
                    setBudget(value as BudgetKey);
                    setStep("style");
                  }}
                />
              )}

              {step === "style" && (
                <AutoQuestionBlock
                  title={t.style}
                  backText={t.back}
                  onBack={() => setStep("budget")}
                  options={styleOptions}
                  selected={style}
                  onSelect={(value) => {
                    setStyle(value as StyleKey);
                    setStep("results");
                  }}
                />
              )}

              {step === "results" && (
                <div className="mx-auto max-w-xl">
                  <div className="text-sm uppercase tracking-[0.3em] text-white/45">
                    Results
                  </div>

                  <h2 className="mt-3 text-3xl font-bold leading-tight md:text-4xl">
                    {t.resultsTitle}
                  </h2>
                  <p className="mt-3 text-white/72">{t.resultsSubtitle}</p>

                  <div className="mt-4 rounded-[22px] border border-white/10 bg-black/10 px-4 py-3 text-sm text-white/78">
                    {t.selectedCountry}:{" "}
                    <span className="font-semibold text-white">{country}</span>
                  </div>

                  {!hasProviders || results.length === 0 ? (
                    <div className="mt-6 rounded-[24px] border border-amber-300/20 bg-amber-300/10 p-5">
                      <div className="text-lg font-bold text-amber-100">
                        {t.noProvidersTitle}
                      </div>
                      <p className="mt-2 text-sm leading-6 text-white/80">
                        {t.noProvidersText}
                      </p>
                    </div>
                  ) : (
                    <div className="mt-6 space-y-5">
                      {results.map((gift, index) => (
                        <div
                          key={gift.id}
                          className={`rounded-[26px] border p-5 shadow-xl ${
                            index === 0
                              ? "border-cyan-200/30 bg-gradient-to-br from-white/[0.16] to-cyan-200/[0.08]"
                              : "border-white/10 bg-white/[0.06]"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <div className="text-sm uppercase tracking-[0.18em] text-white/45">
                                {t.suggestedGift}
                              </div>
                              <div className="mt-2 text-2xl font-bold leading-tight">
                                {gift.title}
                              </div>
                            </div>

                            {index === 0 && (
                              <div className="rounded-full bg-gradient-to-r from-cyan-300 to-violet-300 px-3 py-1 text-xs font-bold text-[#0c1b2c]">
                            Best Match
                              </div>
                            )}
                          </div>

                          <div className="mt-5 rounded-[20px] border border-white/10 bg-black/10 p-4">
                            <div className="text-xs uppercase tracking-[0.15em] text-white/45">
                              {t.whyGift}
                            </div>
                            <p className="mt-2 text-sm leading-6 text-white/80">
                              {gift.reason}
                            </p>
                          </div>

                          <div className="mt-5">
                            <div className="text-sm font-semibold text-white/90">
                              {t.availablePlaces}
                            </div>

                            <div className="mt-3 space-y-3">
                              {gift.providers.map((provider) => (
                                <div
                                  key={provider.id}
                                  className="rounded-[20px] border border-white/10 bg-white/[0.05] p-4"
                                >
                                  <div className="flex items-start justify-between gap-3">
                                    <div>
                                      <div className="text-lg font-bold">
                                        {provider.name}
                                      </div>
                                      <div className="mt-1 text-sm text-white/70">
                                        {provider.address}
                                      </div>
                                      <div className="mt-1 text-sm text-white/70">
                                        {provider.phone}
                                      </div>
                                    </div>

                                    <div className="flex flex-col items-end gap-2">
                                      <div className="rounded-full border border-white/12 bg-white/[0.08] px-3 py-1 text-xs text-white/85">
                                        {provider.signal}
                                      </div>
                                      <div className="rounded-full border border-white/12 bg-white/[0.08] px-3 py-1 text-sm font-semibold">
                         90% Score
                                      </div>
                                    </div>
                                  </div>

<div className="mt-3 flex flex-col sm:flex-row gap-2">

                                    <div className="rounded-full border border-white/12 bg-white/[0.08] px-3 py-2 text-xs text-white/90">
                                      {t.fromGiftMind}
                                    </div>
                                  </div>

                                  <p className="mt-3 text-sm leading-6 text-white/78">
                                    {provider.description}
                                  </p>

<div className="mt-4 flex flex-wrap gap-2">
  <a
    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      `${provider.name} ${provider.address}`
    )}`}
    target="_blank"
    rel="noreferrer"
    className="rounded-[16px] bg-gradient-to-r from-[#67e8f9] via-[#8ec5ff] to-[#d5b7ff] px-4 py-2.5 text-sm font-bold text-[#0b1b2b]"
  >
    {t.go}
  </a>

  <a
    href={`tel:${provider.phone}`}
    className="rounded-[16px] border border-white/12 bg-white/[0.06] px-4 py-2.5 text-sm font-medium text-white"
  >
    {t.call}
  </a>

  <a
    href={`https://wa.me/${provider.phone.replace(/\D/g, "")}`}
    target="_blank"
    rel="noreferrer"
    className="rounded-[16px] border border-white/12 bg-white/[0.06] px-4 py-2.5 text-sm font-medium text-white"
  >
    WhatsApp
  </a>
</div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                    <button
                      type="button"
                      onClick={() => setStep("style")}
                      className="flex-1 rounded-[20px] border border-white/12 bg-white/[0.06] px-4 py-3 font-medium text-white"
                    >
                      {t.back}
                    </button>

                    <button
                      type="button"
                      onClick={resetAll}
                      className="flex-1 rounded-[20px] bg-gradient-to-r from-[#67e8f9] via-[#8ec5ff] to-[#d5b7ff] px-4 py-3 font-bold text-[#0b1b2b]"
                    >
                      {t.newSearch}
                    </button>
                  </div>

                  <div className="mt-8 text-center">
                    <button
                      type="button"
                      onClick={handleAskFriend}
                      className="rounded-full border border-white/12 bg-white/[0.06] px-5 py-3 text-sm text-white/90 transition hover:bg-white/[0.10]"
                    >
                      {t.askFriend}
                    </button>
                  </div>
                </div>
              )}
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
/* =========================
   Small Components
========================= */
function InfoCard({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-[24px] border border-white/10 bg-black/10 p-5">
      <div className="text-xs uppercase tracking-[0.25em] text-white/45">
        {title}
      </div>
      <div className="mt-3 text-sm leading-6 text-white/80">{text}</div>
    </div>
  );
}

function AutoQuestionBlock<T extends string>({
  title,
  options,
  selected,
  onSelect,
  onBack,
  backText,
}: {
  title: string;
  options: { key: T; label: string }[];
  selected: T | null;
  onSelect: (key: T) => void;
  onBack: () => void;
  backText: string;
}) {
  return (
    <div className="mx-auto max-w-xl">
      <h2 className="text-3xl font-bold leading-tight md:text-4xl">{title}</h2>
      <p className="mt-3 text-white/72">
        {/* intentional simple line */}
      </p>

      <div className="mt-6 grid gap-3">
        {options.map((option) => {
          const active = selected === option.key;
          return (
            <button
              key={option.key}
              type="button"
              onClick={() => onSelect(option.key)}
              className={`w-full rounded-[22px] border px-4 py-4 text-start transition duration-200 ${
                active
                  ? "border-transparent bg-gradient-to-br from-[#ffffff] to-[#dbeeff] text-[#0c1b2c] shadow-[0_14px_34px_rgba(148,204,255,0.30)]"
                  : "border-white/12 bg-white/[0.06] text-white hover:bg-white/[0.10]"
              }`}
            >
              <div className="text-base font-semibold">{option.label}</div>
            </button>
          );
        })}
      </div>

      <div className="mt-6">
        <button
          type="button"
          onClick={onBack}
          className="w-full rounded-[20px] border border-white/12 bg-white/[0.06] px-4 py-3 font-medium text-white sm:w-auto sm:min-w-[180px]"
        >
          {backText}
        </button>
      </div>
    </div>
  );
}