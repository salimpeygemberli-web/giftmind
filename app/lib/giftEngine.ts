export type UserInput = {
  recipient: string;
  occasion: string;
  budget: "low" | "medium" | "high";
  vibe: "fun" | "romantic" | "elegant" | "warm" | "casual" | "minimal";
  goal?: string;
  context?: string;
};



export type GiftCategory = "experience" | "physical" | "mixed" | "symbolic";

export type GiftConcept = {
  id: string;
  title: string;
  description: string;
  category: string;
  fit: {
    recipient: string[];
    occasion: string[];
    vibe: string[];
    goal: string[];
    budget: string[];
  };
  tags: string[];
  why: string[];
};

export type ScoredGiftConcept = GiftConcept & {
  score: number;
};

export const GIFT_CONCEPTS: GiftConcept[] = [
  {
    id: "memory_box",
    title: "Memory Gift Box",
    description: "A personalized box with photos, notes, and shared memories",
    category: "symbolic",
    fit: {
      recipient: ["partner", "family"],
      occasion: ["birthday", "farewell", "anniversary"],
      vibe: ["warm", "romantic"],
      goal: ["support", "celebrate"],
      budget: ["low", "medium"],
    },
    tags: ["memory", "emotional"],
    why: [
      "Feels personal and meaningful",
      "Great for warm emotional moments",
      "Works well for shared memories",
    ],
  },
    {
    id: "handmade_gift",
    title: "Handmade Gift",
    description: "A handmade item with a personal and authentic touch",
    category: "symbolic",
    fit: {
      recipient: ["partner", "friend", "family"],
      occasion: ["birthday", "anniversary", "appreciation", "farewell"],
      vibe: ["warm", "minimal", "romantic"],
      goal: ["support", "celebrate", "impress"],
      budget: ["low", "medium"],
    },
    tags: ["handmade", "authentic"],
    why: [
      "Feels personal and authentic",
      "Adds a human touch to the gesture",
      "Strong fit for thoughtful gifting",
    ],
  },
  {
    id: "surprise_kit",
    title: "Surprise Kit",
    description: "A playful box with small gifts, notes, and fun elements",
    category: "mixed",
    fit: {
      recipient: ["friend", "partner", "child"],
      occasion: ["birthday", "celebration"],
      vibe: ["fun", "warm", "romantic"],
      goal: ["celebrate", "surprise"],
      budget: ["low", "medium", "high"],
    },
    tags: ["surprise", "bundle"],
    why: [
      "Creates a fun surprise effect",
      "Combines multiple gift elements",
      "Works well for cheerful occasions",
    ],
  },
  {
    id: "romantic_setup",
    title: "Romantic Setup",
    description: "A curated romantic arrangement with candles, flowers, and details",
    category: "mixed",
    fit: {
      recipient: ["partner"],
      occasion: ["anniversary", "birthday", "celebration"],
      vibe: ["romantic", "warm"],
      goal: ["impress", "celebrate"],
      budget: ["medium", "high"],
    },
    tags: ["romantic", "setup"],
    why: [
      "Creates a strong emotional atmosphere",
      "Feels intimate and memorable",
      "Perfect for romantic occasions",
    ],
  },
  {
    id: "practical_premium",
    title: "Practical Premium Gift",
    description: "A useful but elevated gift with quality and lasting value",
    category: "physical",
    fit: {
      recipient: ["family", "friend", "partner", "colleague"],
      occasion: ["birthday", "celebration", "farewell"],
      vibe: ["minimal", "warm"],
      goal: ["support", "impress"],
      budget: ["medium", "high"],
    },
    tags: ["practical", "premium"],
    why: [
      "Useful without feeling boring",
      "Balances quality with practicality",
      "A safe but thoughtful premium choice",
    ],
  },
  {
    id: "comfort_package",
    title: "Comfort Care Package",
    description: "Snacks, cozy items, and a heartfelt letter",
    category: "mixed",
    fit: {
      recipient: ["friend", "family"],
      occasion: ["moving", "farewell", "hard_time"],
      vibe: ["warm"],
      goal: ["support"],
      budget: ["low", "medium"],
    },
    tags: ["comfort", "care"],
    why: [
      "Creates comfort during stressful times",
      "Shows emotional support clearly",
      "Fits a warm and caring vibe",
    ],
  },
  {
    id: "experience_day",
    title: "Experience Day",
    description: "A fun activity like dinner, escape room, or adventure",
    category: "experience",
    fit: {
      recipient: ["friend", "partner"],
      occasion: ["birthday", "celebration"],
      vibe: ["fun"],
      goal: ["celebrate"],
      budget: ["medium", "high"],
    },
    tags: ["experience", "fun"],
    why: [
      "Creates memories instead of just objects",
      "Perfect for celebration energy",
      "Strong match for fun occasions",
    ],
  },
  {
    id: "treasure_hunt",
    title: "Treasure Hunt Experience",
    description: "A custom adventure with clues and a final surprise gift",
    category: "experience",
    fit: {
      recipient: ["child", "friend"],
      occasion: ["birthday"],
      vibe: ["fun"],
      goal: ["surprise", "celebrate"],
      budget: ["medium"],
    },
    tags: ["interactive", "creative"],
    why: [
      "Interactive and exciting for birthdays",
      "Feels playful and memorable",
      "Very strong fit for child + fun + celebrate",
    ],
  },
  {
    id: "personalized_item",
    title: "Personalized Gift",
    description: "Custom item like engraved jewelry or printed photo item",
   category: "Luxury Gifts",
fit: {
   
      recipient: ["partner", "friend", "family"],
      occasion: ["anniversary", "birthday"],
      vibe: ["romantic", "warm"],
      goal: ["impress", "celebrate"],
      budget: ["medium", "high"],
    },
    tags: ["personal", "unique"],
    why: [
      "Feels unique and thoughtful",
      "Strong choice for emotional impact",
      "Good fit for romantic or warm gifting",
    ],
  },
  {
  id: "baby_gift_set",
  title: "New Baby Gift Set",
  description: "A curated set of baby essentials, clothes, and keepsakes",
  category: "physical",
  fit: {
   recipient: ["parent", "family", "child"],
    occasion: ["new_baby"],
    vibe: ["warm", "minimal"],
    goal: ["celebrate", "support"],
    budget: ["medium", "high"],
  },
  tags: ["baby", "care"],
  why: [
    "Perfect for welcoming a newborn",
    "Supports the parents with useful items",
    "Fits warm and caring occasions",
  ],
},

];

export function selectTopGifts(input: UserInput): ScoredGiftConcept[] {
  const ranked = GIFT_CONCEPTS
    .map((concept) => {
      let score = 0;
const effectiveRecipient =
  input.occasion === "new_baby" && input.recipient === "child"
    ? "parent"
    : input.recipient;
     const recipientMatch = concept.fit.recipient.includes(effectiveRecipient);
     const normalize = (str: string) => str.toLowerCase().replace(/[_\s]/g, "");

const occasionMatch = concept.fit.occasion
  .map(normalize)
  .includes(normalize(input.occasion));
      const vibeMatch = concept.fit.vibe.includes(input.vibe);
      const goalMatch = input.goal ? concept.fit.goal.includes(input.goal) : false;
      const budgetMatch = concept.fit.budget.includes(input.budget);

      if (recipientMatch) score += 30;
      if (occasionMatch) score += 25;
      if (vibeMatch) score += 20;
      if (goalMatch) score += 15;
      if (budgetMatch) score += 10;

      if (!recipientMatch) {
        return { ...concept, score: 0 };
      }

      if (!occasionMatch) {
        return { ...concept, score: 0 };
      }

      if (!budgetMatch) {
        score -= 15;
      }

      return { ...concept, score: Math.max(score, 0) };
    })
    .filter((concept) => concept.score > 0)
    .sort((a, b) => b.score - a.score);
if (input.occasion === "new_baby") {
  return ranked
    .filter((concept) =>
      concept.fit.occasion.includes("new_baby")
    )
    .slice(0, 3);
}
  return ranked.slice(0, 3);
}

export function explainGift(concept: GiftConcept, input: UserInput) {
  return `This gift fits because it matches a ${input.vibe} vibe and supports the goal of ${input.goal ?? "your occasion"}. It is suitable for a ${input.recipient} on a ${input.occasion}.`;
}