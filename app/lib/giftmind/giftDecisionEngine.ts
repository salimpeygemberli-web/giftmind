import { buildIntent } from "./intent";
import { UserAnswers } from "./types";

export type GiftConcept = {
  id: string;
  title: string;
  category: "experience" | "physical" | "symbolic" | "mixed";
  worlds: string[];
  styles: string[];
  budgets: string[];
  urgencySupport: string[];
};

export type RankedGiftConcept = GiftConcept & {
  score: number;
  why: string[];
  matchedWorlds: string[];
  matchedStyles: string[];
};

function intersect<T>(a: T[], b: T[]): T[] {
  return a.filter((item) => b.includes(item));
}

// 🎁 Gift Concepts (نقدر نوسعها لاحقًا)
export const giftConcepts: GiftConcept[] = [
  {
    id: "romantic_dinner",
    title: "Romantic Dinner",
    category: "experience",
    worlds: ["romantic", "dining", "experience"],
    styles: ["elegant", "warm"],
    budgets: ["medium", "high"],
    urgencySupport: ["today", "this_week", "flexible"],
  },
  {
    id: "spa",
    title: "Spa Experience",
    category: "experience",
    worlds: ["wellness", "selfcare"],
    styles: ["luxury", "warm"],
    budgets: ["medium", "high"],
    urgencySupport: ["this_week", "flexible"],
  },
  {
    id: "perfume",
    title: "Premium Perfume",
    category: "physical",
    worlds: ["luxury", "beauty"],
    styles: ["elegant", "classic"],
    budgets: ["medium", "high"],
    urgencySupport: ["today", "this_week"],
  },
  {
    id: "flowers",
    title: "Flowers + Chocolate",
    category: "mixed",
    worlds: ["romantic", "sweet"],
    styles: ["warm", "classic"],
    budgets: ["low", "medium"],
    urgencySupport: ["today", "this_week"],
  },
  {
    id: "memory",
    title: "Memory Gift",
    category: "symbolic",
    worlds: ["emotional", "memory"],
    styles: ["romantic", "warm"],
    budgets: ["low", "medium"],
    urgencySupport: ["flexible"],
  },
];

// 🧠 scoring
function scoreConcept(
  concept: GiftConcept,
  answers: UserAnswers,
  previous: string[] = [],
  avoid: string[] = [],
  novelty: "safe" | "balanced" | "unique" = "balanced"
): RankedGiftConcept {
  const intent = buildIntent(answers);

  const matchedWorlds = intersect(concept.worlds, intent.preferredWorlds);
  const matchedStyles = intersect(concept.styles, intent.styles);

  let score = 0;
  const why: string[] = [];

  // ❌ avoid
  if (avoid.includes(concept.id)) {
    return {
      ...concept,
      score: -999,
      why: ["Excluded by preference"],
      matchedWorlds: [],
      matchedStyles: [],
    };
  }

  // 🌍 worlds
  if (matchedWorlds.length > 0) {
    score += matchedWorlds.length * 25;
    why.push(`Matches world: ${matchedWorlds.join(", ")}`);
  }

  // 🎨 styles
  if (matchedStyles.length > 0) {
    score += matchedStyles.length * 12;
    why.push(`Matches style: ${matchedStyles.join(", ")}`);
  }

  // ⚡ urgency
  if (concept.urgencySupport.includes(answers.urgency)) {
    score += 10;
    why.push("Fits urgency");
  }

  // 💰 budget
  if (concept.budgets.includes(answers.budget)) {
    score += 8;
    why.push("Fits budget");
  }

  // 🔁 anti repetition
  if (previous.includes(concept.id)) {
    score -= 15;
    why.push("Avoiding repetition");
  }

  // 🧠 novelty
  if (novelty === "unique" && concept.category === "symbolic") {
    score += 6;
    why.push("Boosted for unique choice");
  }

  if (novelty === "safe" && concept.category === "physical") {
    score += 4;
    why.push("Safe option boost");
  }

  return {
    ...concept,
    score,
    why,
    matchedWorlds,
    matchedStyles,
  };
}

// 🎯 diversity (أهم شي)
function pickTopDiverse(results: RankedGiftConcept[], limit = 3) {
  const selected: RankedGiftConcept[] = [];
  const used = new Set<string>();

  for (let r of results) {
    if (r.score < 0) continue;

    if (selected.length === 0) {
      selected.push(r);
      used.add(r.category);
      continue;
    }

    if (!used.has(r.category)) {
      selected.push(r);
      used.add(r.category);
    }

    if (selected.length === limit) break;
  }

  let i = 0;
  while (selected.length < limit && i < results.length) {
    const r = results[i];
    if (!selected.find((s) => s.id === r.id) && r.score >= 0) {
      selected.push(r);
    }
    i++;
  }

  return selected;
}

// 🚀 MAIN FUNCTION
export function getTopGiftConcepts(
  answers: UserAnswers,
  options?: {
    previous?: string[];
    avoid?: string[];
    novelty?: "safe" | "balanced" | "unique";
    limit?: number;
  }
): RankedGiftConcept[] {
  const { previous = [], avoid = [], novelty = "balanced", limit = 3 } = options || {};

  const ranked = giftConcepts
    .map((c) => scoreConcept(c, answers, previous, avoid, novelty))
   .filter((c) => c.score > 0) 
    .sort((a, b) => b.score - a.score);

  return pickTopDiverse(ranked, limit);
}