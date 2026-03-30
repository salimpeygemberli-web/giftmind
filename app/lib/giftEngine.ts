export type Language = "EN" | "AR";

export type AnswerRecipient = "partner" | "parent" | "friend" | "colleague";
export type AnswerOccasion = "birthday" | "anniversary" | "appreciation" | "celebration";
export type AnswerBudget = "low" | "medium" | "high";
export type AnswerStyle = "minimal" | "luxury" | "fun" | "elegant" | "romantic";

export type Emotion = "romantic" | "appreciation" | "friendly" | "formal";
export type GiftType = "symbolic" | "experience" | "tangible";
export type WhyKey =
  | "romantic_symbolic"
  | "romantic_experience"
  | "romantic_tangible"
  | "appreciation_symbolic"
  | "appreciation_experience"
  | "appreciation_tangible"
  | "friendly_symbolic"
  | "friendly_experience"
  | "friendly_tangible"
  | "formal_symbolic"
  | "formal_experience"
  | "formal_tangible";

export type ValidationErrorKey =
  | "incomplete"
  | "colleague_romantic_style"
  | "colleague_anniversary"
  | "colleague_over_personal";

export type MerchantType = "symbolic" | "experience" | "tangible";

export type Merchant = {
  id: string;
  name: string;
  country: string;
  type: MerchantType;
  emotion: Emotion;
  trusted: boolean;
  fastDelivery: boolean;
  phone: string;
  whatsapp: string;
  location: string;
  url: string;
};

export type ScoredMerchant = Merchant & {
  score: number;
};

export type DecisionResult = {
  type: GiftType;
  title: string;
  whyKey: WhyKey;
  merchants: ScoredMerchant[];
};

export type GiftAnswers = {
  recipient: AnswerRecipient;
  occasion: AnswerOccasion;
  budget: AnswerBudget;
  style: AnswerStyle;
};

export type BuildDecisionInput = {
  country: string;
  language: Language;
  answers: Partial<GiftAnswers>;
};

export type BuildDecisionOutput = {
  validationError: ValidationErrorKey | null;
  decisions: DecisionResult[];
};

type CountryItem = {
  code: string;
  name: Record<Language, string>;
};

type GiftCatalogItem = {
  key: string;
  type: GiftType;
  emotion: Emotion;
  title: Record<Language, string>;
  whyKey: WhyKey;
  allowedBudgets: AnswerBudget[];
  preferredStyles: AnswerStyle[];
};

const emotionByRecipient: Record<AnswerRecipient, Emotion> = {
  partner: "romantic",
  parent: "appreciation",
  friend: "friendly",
  colleague: "formal",
};

export const countries: CountryItem[] = [
  { code: "JO", name: { EN: "Jordan", AR: "الأردن" } },
  { code: "AE", name: { EN: "United Arab Emirates", AR: "الإمارات" } },
  { code: "SA", name: { EN: "Saudi Arabia", AR: "السعودية" } },
  { code: "QA", name: { EN: "Qatar", AR: "قطر" } },
  { code: "KW", name: { EN: "Kuwait", AR: "الكويت" } },
  { code: "BH", name: { EN: "Bahrain", AR: "البحرين" } },
  { code: "OM", name: { EN: "Oman", AR: "عُمان" } },
  { code: "EG", name: { EN: "Egypt", AR: "مصر" } },
  { code: "TR", name: { EN: "Turkey", AR: "تركيا" } },
  { code: "FR", name: { EN: "France", AR: "فرنسا" } },
  { code: "DE", name: { EN: "Germany", AR: "ألمانيا" } },
  { code: "UK", name: { EN: "United Kingdom", AR: "المملكة المتحدة" } },
  { code: "US", name: { EN: "United States", AR: "الولايات المتحدة" } },
];

const giftCatalog: GiftCatalogItem[] = [
  {
    key: "romantic_symbolic",
    type: "symbolic",
    emotion: "romantic",
    title: { EN: "Meaningful Keepsake", AR: "تذكار بمعنى عاطفي" },
    whyKey: "romantic_symbolic",
    allowedBudgets: ["low", "medium", "high"],
    preferredStyles: ["minimal", "elegant", "romantic", "luxury"],
  },
  {
    key: "romantic_experience",
    type: "experience",
    emotion: "romantic",
    title: { EN: "Private Shared Experience", AR: "تجربة خاصة مشتركة" },
    whyKey: "romantic_experience",
    allowedBudgets: ["medium", "high"],
    preferredStyles: ["romantic", "luxury", "elegant"],
  },
  {
    key: "romantic_tangible",
    type: "tangible",
    emotion: "romantic",
    title: { EN: "Premium Personal Gift", AR: "هدية شخصية فاخرة" },
    whyKey: "romantic_tangible",
    allowedBudgets: ["medium", "high"],
    preferredStyles: ["luxury", "romantic", "elegant"],
  },
  {
    key: "appreciation_symbolic",
    type: "symbolic",
    emotion: "appreciation",
    title: { EN: "Gratitude Gift Set", AR: "هدية امتنان معبّرة" },
    whyKey: "appreciation_symbolic",
    allowedBudgets: ["low", "medium", "high"],
    preferredStyles: ["minimal", "elegant", "luxury"],
  },
  {
    key: "appreciation_experience",
    type: "experience",
    emotion: "appreciation",
    title: { EN: "Wellness Appreciation Experience", AR: "تجربة تقدير وراحة" },
    whyKey: "appreciation_experience",
    allowedBudgets: ["medium", "high"],
    preferredStyles: ["elegant", "luxury", "minimal"],
  },
  {
    key: "appreciation_tangible",
    type: "tangible",
    emotion: "appreciation",
    title: { EN: "Practical Premium Gift", AR: "هدية عملية راقية" },
    whyKey: "appreciation_tangible",
    allowedBudgets: ["medium", "high"],
    preferredStyles: ["minimal", "elegant", "luxury"],
  },
  {
    key: "friendly_symbolic",
    type: "symbolic",
    emotion: "friendly",
    title: { EN: "Playful Thoughtful Token", AR: "لفتة مرحة وذكية" },
    whyKey: "friendly_symbolic",
    allowedBudgets: ["low", "medium", "high"],
    preferredStyles: ["fun", "minimal", "elegant"],
  },
  {
    key: "friendly_experience",
    type: "experience",
    emotion: "friendly",
    title: { EN: "Fun Shared Activity", AR: "تجربة ممتعة مشتركة" },
    whyKey: "friendly_experience",
    allowedBudgets: ["medium", "high"],
    preferredStyles: ["fun", "elegant", "minimal"],
  },
  {
    key: "friendly_tangible",
    type: "tangible",
    emotion: "friendly",
    title: { EN: "Useful Lifestyle Gift", AR: "هدية عملية وعصرية" },
    whyKey: "friendly_tangible",
    allowedBudgets: ["low", "medium", "high"],
    preferredStyles: ["fun", "minimal", "elegant", "luxury"],
  },
  {
    key: "formal_symbolic",
    type: "symbolic",
    emotion: "formal",
    title: { EN: "Professional Gesture Gift", AR: "هدية مهنية راقية" },
    whyKey: "formal_symbolic",
    allowedBudgets: ["low", "medium", "high"],
    preferredStyles: ["minimal", "elegant", "luxury"],
  },
  {
    key: "formal_experience",
    type: "experience",
    emotion: "formal",
    title: { EN: "Refined Business Experience", AR: "تجربة رسمية أنيقة" },
    whyKey: "formal_experience",
    allowedBudgets: ["medium", "high"],
    preferredStyles: ["elegant", "luxury", "minimal"],
  },
  {
    key: "formal_tangible",
    type: "tangible",
    emotion: "formal",
    title: { EN: "Executive Desk Gift", AR: "هدية تنفيذية عملية" },
    whyKey: "formal_tangible",
    allowedBudgets: ["medium", "high"],
    preferredStyles: ["minimal", "elegant", "luxury"],
  },
];

const merchants: Merchant[] = [
  {
    id: "jo-symbolic-romantic-1",
    name: "Velvet Keepsakes Amman",
    country: "JO",
    type: "symbolic",
    emotion: "romantic",
    trusted: true,
    fastDelivery: true,
    phone: "+962790000101",
    whatsapp: "962790000101",
    location: "https://maps.google.com/?q=Velvet+Keepsakes+Amman",
    url: "https://giftmind.app/merchant/velvet-keepsakes-amman",
  },
  {
    id: "jo-experience-romantic-1",
    name: "Moonlight Dining Jordan",
    country: "JO",
    type: "experience",
    emotion: "romantic",
    trusted: true,
    fastDelivery: false,
    phone: "+962790000102",
    whatsapp: "962790000102",
    location: "https://maps.google.com/?q=Moonlight+Dining+Jordan",
    url: "https://giftmind.app/merchant/moonlight-dining-jordan",
  },
  {
    id: "jo-tangible-romantic-1",
    name: "Maison Luxe Gifts Jordan",
    country: "JO",
    type: "tangible",
    emotion: "romantic",
    trusted: true,
    fastDelivery: true,
    phone: "+962790000103",
    whatsapp: "962790000103",
    location: "https://maps.google.com/?q=Maison+Luxe+Gifts+Jordan",
    url: "https://giftmind.app/merchant/maison-luxe-gifts-jordan",
  },
  {
    id: "jo-symbolic-appreciation-1",
    name: "Grace Notes Amman",
    country: "JO",
    type: "symbolic",
    emotion: "appreciation",
    trusted: true,
    fastDelivery: true,
    phone: "+962790000104",
    whatsapp: "962790000104",
    location: "https://maps.google.com/?q=Grace+Notes+Amman",
    url: "https://giftmind.app/merchant/grace-notes-amman",
  },
  {
    id: "jo-experience-appreciation-1",
    name: "Serene Escape Jordan",
    country: "JO",
    type: "experience",
    emotion: "appreciation",
    trusted: true,
    fastDelivery: false,
    phone: "+962790000105",
    whatsapp: "962790000105",
    location: "https://maps.google.com/?q=Serene+Escape+Jordan",
    url: "https://giftmind.app/merchant/serene-escape-jordan",
  },
  {
    id: "jo-tangible-appreciation-1",
    name: "Signature Home Jordan",
    country: "JO",
    type: "tangible",
    emotion: "appreciation",
    trusted: false,
    fastDelivery: true,
    phone: "+962790000106",
    whatsapp: "962790000106",
    location: "https://maps.google.com/?q=Signature+Home+Jordan",
    url: "https://giftmind.app/merchant/signature-home-jordan",
  },
  {
    id: "jo-symbolic-friendly-1",
    name: "Bright Token Studio",
    country: "JO",
    type: "symbolic",
    emotion: "friendly",
    trusted: false,
    fastDelivery: true,
    phone: "+962790000107",
    whatsapp: "962790000107",
    location: "https://maps.google.com/?q=Bright+Token+Studio+Jordan",
    url: "https://giftmind.app/merchant/bright-token-studio",
  },
  {
    id: "jo-experience-friendly-1",
    name: "Pulse Adventure Jordan",
    country: "JO",
    type: "experience",
    emotion: "friendly",
    trusted: true,
    fastDelivery: false,
    phone: "+962790000108",
    whatsapp: "962790000108",
    location: "https://maps.google.com/?q=Pulse+Adventure+Jordan",
    url: "https://giftmind.app/merchant/pulse-adventure-jordan",
  },
  {
    id: "jo-tangible-friendly-1",
    name: "NextThing Jordan",
    country: "JO",
    type: "tangible",
    emotion: "friendly",
    trusted: true,
    fastDelivery: true,
    phone: "+962790000109",
    whatsapp: "962790000109",
    location: "https://maps.google.com/?q=NextThing+Jordan",
    url: "https://giftmind.app/merchant/nextthing-jordan",
  },
  {
    id: "jo-symbolic-formal-1",
    name: "Civic Signature Gifts",
    country: "JO",
    type: "symbolic",
    emotion: "formal",
    trusted: true,
    fastDelivery: true,
    phone: "+962790000110",
    whatsapp: "962790000110",
    location: "https://maps.google.com/?q=Civic+Signature+Gifts+Jordan",
    url: "https://giftmind.app/merchant/civic-signature-gifts",
  },
  {
    id: "jo-experience-formal-1",
    name: "Executive Lounge Jordan",
    country: "JO",
    type: "experience",
    emotion: "formal",
    trusted: false,
    fastDelivery: false,
    phone: "+962790000111",
    whatsapp: "962790000111",
    location: "https://maps.google.com/?q=Executive+Lounge+Jordan",
    url: "https://giftmind.app/merchant/executive-lounge-jordan",
  },
  {
    id: "jo-tangible-formal-1",
    name: "DeskLine Premium",
    country: "JO",
    type: "tangible",
    emotion: "formal",
    trusted: true,
    fastDelivery: true,
    phone: "+962790000112",
    whatsapp: "962790000112",
    location: "https://maps.google.com/?q=DeskLine+Premium+Jordan",
    url: "https://giftmind.app/merchant/deskline-premium",
  },

  {
    id: "ae-symbolic-romantic-1",
    name: "Luna Keeps Dubai",
    country: "AE",
    type: "symbolic",
    emotion: "romantic",
    trusted: true,
    fastDelivery: true,
    phone: "+971500000101",
    whatsapp: "971500000101",
    location: "https://maps.google.com/?q=Luna+Keeps+Dubai",
    url: "https://giftmind.app/merchant/luna-keeps-dubai",
  },
  {
    id: "ae-experience-romantic-1",
    name: "Skyline Moments Dubai",
    country: "AE",
    type: "experience",
    emotion: "romantic",
    trusted: true,
    fastDelivery: false,
    phone: "+971500000102",
    whatsapp: "971500000102",
    location: "https://maps.google.com/?q=Skyline+Moments+Dubai",
    url: "https://giftmind.app/merchant/skyline-moments-dubai",
  },
  {
    id: "ae-tangible-romantic-1",
    name: "Velour House UAE",
    country: "AE",
    type: "tangible",
    emotion: "romantic",
    trusted: true,
    fastDelivery: true,
    phone: "+971500000103",
    whatsapp: "971500000103",
    location: "https://maps.google.com/?q=Velour+House+UAE",
    url: "https://giftmind.app/merchant/velour-house-uae",
  },
  {
    id: "ae-symbolic-appreciation-1",
    name: "Golden Note UAE",
    country: "AE",
    type: "symbolic",
    emotion: "appreciation",
    trusted: true,
    fastDelivery: true,
    phone: "+971500000104",
    whatsapp: "971500000104",
    location: "https://maps.google.com/?q=Golden+Note+UAE",
    url: "https://giftmind.app/merchant/golden-note-uae",
  },
  {
    id: "ae-experience-appreciation-1",
    name: "Calm Retreat UAE",
    country: "AE",
    type: "experience",
    emotion: "appreciation",
    trusted: true,
    fastDelivery: false,
    phone: "+971500000105",
    whatsapp: "971500000105",
    location: "https://maps.google.com/?q=Calm+Retreat+UAE",
    url: "https://giftmind.app/merchant/calm-retreat-uae",
  },
  {
    id: "ae-tangible-appreciation-1",
    name: "Modern Living UAE",
    country: "AE",
    type: "tangible",
    emotion: "appreciation",
    trusted: true,
    fastDelivery: true,
    phone: "+971500000106",
    whatsapp: "971500000106",
    location: "https://maps.google.com/?q=Modern+Living+UAE",
    url: "https://giftmind.app/merchant/modern-living-uae",
  },
  {
    id: "ae-symbolic-friendly-1",
    name: "Hello Token UAE",
    country: "AE",
    type: "symbolic",
    emotion: "friendly",
    trusted: false,
    fastDelivery: true,
    phone: "+971500000107",
    whatsapp: "971500000107",
    location: "https://maps.google.com/?q=Hello+Token+UAE",
    url: "https://giftmind.app/merchant/hello-token-uae",
  },
  {
    id: "ae-experience-friendly-1",
    name: "Play Mode UAE",
    country: "AE",
    type: "experience",
    emotion: "friendly",
    trusted: true,
    fastDelivery: false,
    phone: "+971500000108",
    whatsapp: "971500000108",
    location: "https://maps.google.com/?q=Play+Mode+UAE",
    url: "https://giftmind.app/merchant/play-mode-uae",
  },
  {
    id: "ae-tangible-friendly-1",
    name: "Urban Gadgets UAE",
    country: "AE",
    type: "tangible",
    emotion: "friendly",
    trusted: true,
    fastDelivery: true,
    phone: "+971500000109",
    whatsapp: "971500000109",
    location: "https://maps.google.com/?q=Urban+Gadgets+UAE",
    url: "https://giftmind.app/merchant/urban-gadgets-uae",
  },
  {
    id: "ae-symbolic-formal-1",
    name: "Protocol Gifts UAE",
    country: "AE",
    type: "symbolic",
    emotion: "formal",
    trusted: true,
    fastDelivery: true,
    phone: "+971500000110",
    whatsapp: "971500000110",
    location: "https://maps.google.com/?q=Protocol+Gifts+UAE",
    url: "https://giftmind.app/merchant/protocol-gifts-uae",
  },
  {
    id: "ae-experience-formal-1",
    name: "Boardroom Moments UAE",
    country: "AE",
    type: "experience",
    emotion: "formal",
    trusted: true,
    fastDelivery: false,
    phone: "+971500000111",
    whatsapp: "971500000111",
    location: "https://maps.google.com/?q=Boardroom+Moments+UAE",
    url: "https://giftmind.app/merchant/boardroom-moments-uae",
  },
  {
    id: "ae-tangible-formal-1",
    name: "Atlas Desk UAE",
    country: "AE",
    type: "tangible",
    emotion: "formal",
    trusted: true,
    fastDelivery: true,
    phone: "+971500000112",
    whatsapp: "971500000112",
    location: "https://maps.google.com/?q=Atlas+Desk+UAE",
    url: "https://giftmind.app/merchant/atlas-desk-uae",
  },

  {
    id: "sa-symbolic-romantic-1",
    name: "Rose Mark Riyadh",
    country: "SA",
    type: "symbolic",
    emotion: "romantic",
    trusted: true,
    fastDelivery: true,
    phone: "+966500000101",
    whatsapp: "966500000101",
    location: "https://maps.google.com/?q=Rose+Mark+Riyadh",
    url: "https://giftmind.app/merchant/rose-mark-riyadh",
  },
  {
    id: "sa-experience-romantic-1",
    name: "Evening Escape Saudi",
    country: "SA",
    type: "experience",
    emotion: "romantic",
    trusted: true,
    fastDelivery: false,
    phone: "+966500000102",
    whatsapp: "966500000102",
    location: "https://maps.google.com/?q=Evening+Escape+Saudi",
    url: "https://giftmind.app/merchant/evening-escape-saudi",
  },
  {
    id: "sa-tangible-romantic-1",
    name: "SilkLine Saudi",
    country: "SA",
    type: "tangible",
    emotion: "romantic",
    trusted: true,
    fastDelivery: true,
    phone: "+966500000103",
    whatsapp: "966500000103",
    location: "https://maps.google.com/?q=SilkLine+Saudi",
    url: "https://giftmind.app/merchant/silkline-saudi",
  },
  {
    id: "sa-symbolic-appreciation-1",
    name: "Honor Note Saudi",
    country: "SA",
    type: "symbolic",
    emotion: "appreciation",
    trusted: true,
    fastDelivery: true,
    phone: "+966500000104",
    whatsapp: "966500000104",
    location: "https://maps.google.com/?q=Honor+Note+Saudi",
    url: "https://giftmind.app/merchant/honor-note-saudi",
  },
  {
    id: "sa-experience-appreciation-1",
    name: "Calma Spa Saudi",
    country: "SA",
    type: "experience",
    emotion: "appreciation",
    trusted: false,
    fastDelivery: false,
    phone: "+966500000105",
    whatsapp: "966500000105",
    location: "https://maps.google.com/?q=Calma+Spa+Saudi",
    url: "https://giftmind.app/merchant/calma-spa-saudi",
  },
  {
    id: "sa-tangible-appreciation-1",
    name: "Practical Luxe Saudi",
    country: "SA",
    type: "tangible",
    emotion: "appreciation",
    trusted: true,
    fastDelivery: true,
    phone: "+966500000106",
    whatsapp: "966500000106",
    location: "https://maps.google.com/?q=Practical+Luxe+Saudi",
    url: "https://giftmind.app/merchant/practical-luxe-saudi",
  },
  {
    id: "sa-symbolic-friendly-1",
    name: "Mood Token Saudi",
    country: "SA",
    type: "symbolic",
    emotion: "friendly",
    trusted: false,
    fastDelivery: true,
    phone: "+966500000107",
    whatsapp: "966500000107",
    location: "https://maps.google.com/?q=Mood+Token+Saudi",
    url: "https://giftmind.app/merchant/mood-token-saudi",
  },
  {
    id: "sa-experience-friendly-1",
    name: "Joy Club Saudi",
    country: "SA",
    type: "experience",
    emotion: "friendly",
    trusted: true,
    fastDelivery: false,
    phone: "+966500000108",
    whatsapp: "966500000108",
    location: "https://maps.google.com/?q=Joy+Club+Saudi",
    url: "https://giftmind.app/merchant/joy-club-saudi",
  },
  {
    id: "sa-tangible-friendly-1",
    name: "GearUp Saudi",
    country: "SA",
    type: "tangible",
    emotion: "friendly",
    trusted: true,
    fastDelivery: true,
    phone: "+966500000109",
    whatsapp: "966500000109",
    location: "https://maps.google.com/?q=GearUp+Saudi",
    url: "https://giftmind.app/merchant/gearup-saudi",
  },
  {
    id: "sa-symbolic-formal-1",
    name: "Formal Mark Saudi",
    country: "SA",
    type: "symbolic",
    emotion: "formal",
    trusted: true,
    fastDelivery: true,
    phone: "+966500000110",
    whatsapp: "966500000110",
    location: "https://maps.google.com/?q=Formal+Mark+Saudi",
    url: "https://giftmind.app/merchant/formal-mark-saudi",
  },
  {
    id: "sa-experience-formal-1",
    name: "Prime Meeting Saudi",
    country: "SA",
    type: "experience",
    emotion: "formal",
    trusted: false,
    fastDelivery: false,
    phone: "+966500000111",
    whatsapp: "966500000111",
    location: "https://maps.google.com/?q=Prime+Meeting+Saudi",
    url: "https://giftmind.app/merchant/prime-meeting-saudi",
  },
  {
    id: "sa-tangible-formal-1",
    name: "Axis Executive Saudi",
    country: "SA",
    type: "tangible",
    emotion: "formal",
    trusted: true,
    fastDelivery: true,
    phone: "+966500000112",
    whatsapp: "966500000112",
    location: "https://maps.google.com/?q=Axis+Executive+Saudi",
    url: "https://giftmind.app/merchant/axis-executive-saudi",
  },
];

function isCompleteAnswers(answers: Partial<GiftAnswers>): answers is GiftAnswers {
  return Boolean(answers.recipient && answers.occasion && answers.budget && answers.style);
}

function validateAnswers(answers: Partial<GiftAnswers>): ValidationErrorKey | null {
  if (!isCompleteAnswers(answers)) {
    return "incomplete";
  }

  if (answers.recipient === "colleague" && answers.style === "romantic") {
    return "colleague_romantic_style";
  }

  if (answers.recipient === "colleague" && answers.occasion === "anniversary") {
    return "colleague_anniversary";
  }

  if (
    answers.recipient === "colleague" &&
    (answers.style === "luxury" || answers.style === "romantic") &&
    answers.occasion === "celebration"
  ) {
    return "colleague_over_personal";
  }

  return null;
}

function scoreGiftItem(item: GiftCatalogItem, answers: GiftAnswers): number {
  const budgetScore = item.allowedBudgets.includes(answers.budget) ? 25 : 0;
  const styleScore = item.preferredStyles.includes(answers.style) ? 25 : 0;

  const occasionBoost =
    (answers.occasion === "anniversary" && item.emotion === "romantic") ||
    (answers.occasion === "appreciation" && item.emotion === "appreciation") ||
    (answers.occasion === "birthday" && item.emotion === "friendly") ||
    (answers.occasion === "celebration" && item.emotion === "formal")
      ? 10
      : 0;

  return budgetScore + styleScore + occasionBoost;
}

function pickGiftTitle(language: Language, emotion: Emotion, type: GiftType, answers: GiftAnswers): string {
  const candidates = giftCatalog
    .filter((item) => item.emotion === emotion && item.type === type)
    .sort((a, b) => scoreGiftItem(b, answers) - scoreGiftItem(a, answers));

  return candidates[0]?.title[language] ?? "";
}

function pickWhyKey(emotion: Emotion, type: GiftType): WhyKey {
  const item = giftCatalog.find((entry) => entry.emotion === emotion && entry.type === type);
  return item?.whyKey ?? "friendly_symbolic";
}

function scoreMerchant(merchant: Merchant, type: GiftType, emotion: Emotion): number {
  const typeMatch = merchant.type === type ? 40 : 0;
  const emotionMatch = merchant.emotion === emotion ? 30 : 0;
  const trusted = merchant.trusted ? 20 : 0;
  const fastDelivery = merchant.fastDelivery ? 10 : 0;
  return typeMatch + emotionMatch + trusted + fastDelivery;
}

function topMerchants(country: string, type: GiftType, emotion: Emotion): ScoredMerchant[] {
  return merchants
    .filter((merchant) => merchant.country === country)
    .map((merchant) => ({
      ...merchant,
      score: scoreMerchant(merchant, type, emotion),
    }))
    .filter((merchant) => merchant.score > 0)
    .sort((a, b) => b.score - a.score || a.name.localeCompare(b.name))
    .slice(0, 3);
}

export function buildDecisions(input: BuildDecisionInput): BuildDecisionOutput {
  const validationError = validateAnswers(input.answers);

  if (validationError) {
    return {
      validationError,
      decisions: [],
    };
  }

  const answers = input.answers as GiftAnswers;
  const emotion = emotionByRecipient[answers.recipient];

  const types: GiftType[] = ["symbolic", "experience", "tangible"];

  const decisions: DecisionResult[] = types.map((type) => ({
    type,
    title: pickGiftTitle(input.language, emotion, type, answers),
    whyKey: pickWhyKey(emotion, type),
    merchants: topMerchants(input.country, type, emotion),
  }));

  return {
    validationError: null,
    decisions,
  };
}

export function getBestMerchant(result: DecisionResult): ScoredMerchant | null {
  return result.merchants[0] ?? null;
}