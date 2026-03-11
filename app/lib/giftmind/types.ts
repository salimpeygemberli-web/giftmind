export type SocialCircle = "intimate" | "close" | "professional" | "casual";
export type Tone = "formal" | "balanced" | "playful";
export type BudgetTier = "low" | "medium" | "high" | "luxury";
export type Urgency = "now" | "today" | "this_week" | "flexible";

export type Occasion =
  | "birthday"
  | "anniversary"
  | "apology"
  | "celebration"
  | "thank_you"
  | "support"
  | "romance"
  | "achievement"
  | "surprise";

export type GiftWorld =
  | "emotional_gifts"
  | "luxury_items"
  | "electronics"
  | "experiences"
  | "kids_fun"
  | "events"
  | "adventure";

export type UserAnswers = {
  country: string;
  occasion: Occasion;
  budget: BudgetTier;
  urgency: Urgency;
  socialCircle: SocialCircle;
  tone: Tone;
};

export type DecisionIntent = {
  emotions: string[];
  preferredWorlds: GiftWorld[];
  styles: string[];
};

export type Merchant = {
  id: string;
  name: string;
  country: string;
  city?: string;

  worlds: GiftWorld[];
  styles: string[];
  budgets: BudgetTier[];
  urgencySupport: Urgency[];

  scoreBoost?: number;
};

export type RankedMerchant = Merchant & {
  score: number;
  matchedWorlds: GiftWorld[];
  matchedStyles: string[];
  why: string[];
};