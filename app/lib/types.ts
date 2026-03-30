export type Language = "EN" | "AR" | "FR" | "TR" | "ES";

export type CountryCode =
  | "JO"
  | "AE"
  | "SA"
  | "QA"
  | "KW"
  | "BH"
  | "OM"
  | "TR"
  | "EG"
  | "FR"
  | "DE"
  | "UK"
  | "US";

export type Recipient = "partner" | "friend" | "parent" | "child" | "colleague";

export type Occasion =
  | "birthday"
  | "anniversary"
  | "appreciation"
  | "graduation"
  | "celebration";

export type Budget = "low" | "medium" | "high";

export type Vibe =
  | "fun"
  | "warm"
  | "elegant"
  | "luxury"
  | "minimal"
  | "modern"
  | "romantic";

export type ExpressionType = "symbolic" | "experience" | "tangible";

export type EmotionalGoal =
  | "memory"
  | "closeness"
  | "gratitude"
  | "joy"
  | "bond"
  | "emotional"
  | "unique"
  | "connection"
  | "comfort"
  | "growth"
  | "light_appreciation"
  | "respect"
  | "impression"
  | "utility"
  | "aesthetic"
  | "balance"
  | "surprise"
  | "celebrate_bond";

export type Step =
  | "landing"
  | "recipient"
  | "occasion"
  | "budget"
  | "vibe"
  | "results";

export interface GiftItem {
  id: string;
  expressionType: ExpressionType;
  title: Record<Language, string>;
  shortLabel: Record<Language, string>;
  recipientFit: Recipient[];
  occasionFit: Occasion[];
  emotionalGoals: EmotionalGoal[];
  vibeFit: Vibe[];
  budgetFit: Budget[];
  avoidFor?: Recipient[];
  reasonTemplate: Record<Language, string>;
  merchantCategories: string[];
  searchTags: string[];
}

export interface Merchant {
  id: string;
  name: string;
  country: CountryCode;
  city: string;
  categories: string[];
  vibes: Vibe[];
  budgets: Budget[];
  trusted: boolean;
  featured?: boolean;
  website?: string;
  instagram?: string;
  phone?: string;
  whatsapp?: string;
  address: string;
  locationQuery: string;
}

export interface Answers {
  country: CountryCode;
  language: Language;
  recipient: Recipient | null;
  occasion: Occasion | null;
  budget: Budget | null;
  vibe: Vibe | null;
}

export interface ResultCard {
  type: ExpressionType;
  title: string;
  reason: string;
  score: number;
  gift: GiftItem;
  merchant: Merchant | null;
}