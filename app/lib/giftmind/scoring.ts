import { buildIntent } from "./intent";
import { Merchant, RankedMerchant, UserAnswers } from "./types";

function intersect<T>(a: T[], b: T[]): T[] {
  return a.filter((item) => b.includes(item));
}

export function hardFilter(merchant: Merchant, answers: UserAnswers) {
  if (merchant.country !== answers.country) return false;
  if (!merchant.budgets.includes(answers.budget)) return false;
  if (!merchant.urgencySupport.includes(answers.urgency)) return false;
  return true;
}

export function scoreMerchant(merchant: Merchant, answers: UserAnswers): RankedMerchant {
  const intent = buildIntent(answers);

  const matchedWorlds = intersect(merchant.worlds, intent.preferredWorlds);
  const matchedStyles = intersect(merchant.styles, intent.styles);

  let score = 0;
  const why: string[] = [];

  if (matchedWorlds.length > 0) {
    score += matchedWorlds.length * 25;
    why.push(`Matches gift world: ${matchedWorlds.join(", ")}`);
  }

  if (matchedStyles.length > 0) {
    score += matchedStyles.length * 12;
    why.push(`Matches style: ${matchedStyles.join(", ")}`);
  }

  if (merchant.urgencySupport.includes(answers.urgency)) {
    score += 10;
    why.push(`Supports urgency: ${answers.urgency}`);
  }

  if (merchant.budgets.includes(answers.budget)) {
    score += 8;
    why.push(`Fits budget: ${answers.budget}`);
  }

  score += merchant.scoreBoost ?? 0;

  return {
    ...merchant,
    score,
    matchedWorlds,
    matchedStyles,
    why,
  };
}

export function getTopMerchants(
  answers: UserAnswers,
  merchants: Merchant[],
  limit = 3
): RankedMerchant[] {
  return merchants
    .filter((merchant) => hardFilter(merchant, answers))
    .map((merchant) => scoreMerchant(merchant, answers))
    .filter((merchant) => merchant.matchedWorlds.length > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}