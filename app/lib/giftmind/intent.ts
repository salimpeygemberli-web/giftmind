import { DecisionIntent, GiftWorld, Occasion, SocialCircle, Tone, UserAnswers } from "./types";

function worlds(...items: GiftWorld[]): GiftWorld[] {
  return items;
}

function unique<T>(arr: T[]): T[] {
  return [...new Set(arr)];
}

function getOccasionWorlds(occasion: Occasion): GiftWorld[] {
  switch (occasion) {
    case "romance":
      return worlds("experiences", "emotional_gifts", "luxury_items");

    case "anniversary":
      return worlds("experiences", "luxury_items", "emotional_gifts");

    case "apology":
      return worlds("emotional_gifts", "experiences", "luxury_items");

    case "birthday":
      return worlds("experiences", "electronics", "emotional_gifts");

    case "celebration":
      return worlds("events", "experiences", "luxury_items");

    case "thank_you":
      return worlds("luxury_items", "emotional_gifts", "experiences");

    case "support":
      return worlds("emotional_gifts", "experiences");

    case "achievement":
      return worlds("luxury_items", "electronics", "experiences");

    case "surprise":
      return worlds("experiences", "adventure", "events", "electronics");

    default:
      return worlds("experiences", "emotional_gifts");
  }
}

function getCircleWorlds(circle: SocialCircle): GiftWorld[] {
  switch (circle) {
    case "intimate":
      return worlds("experiences", "emotional_gifts", "luxury_items");

    case "close":
      return worlds("experiences", "electronics", "emotional_gifts");

    case "professional":
      return worlds("luxury_items", "experiences");

    case "casual":
      return worlds("emotional_gifts", "electronics", "experiences");

    default:
      return worlds("experiences");
  }
}

function getToneStyles(tone: Tone): string[] {
  switch (tone) {
    case "formal":
      return ["formal", "elegant", "classic"];

    case "balanced":
      return ["balanced", "warm", "refined"];

    case "playful":
      return ["playful", "fun", "surprising"];

    default:
      return ["balanced"];
  }
}

function getCircleStyles(circle: SocialCircle): string[] {
  switch (circle) {
    case "intimate":
      return ["romantic", "warm", "personal"];

    case "close":
      return ["fun", "friendly", "warm"];

    case "professional":
      return ["formal", "elegant", "respectful"];

    case "casual":
      return ["simple", "safe", "friendly"];

    default:
      return ["balanced"];
  }
}

function getOccasionEmotions(occasion: Occasion): string[] {
  switch (occasion) {
    case "romance":
      return ["romance", "affection"];

    case "anniversary":
      return ["romance", "memory", "celebration"];

    case "apology":
      return ["apology", "care", "repair"];

    case "birthday":
      return ["joy", "celebration"];

    case "celebration":
      return ["celebration", "excitement"];

    case "thank_you":
      return ["gratitude", "appreciation"];

    case "support":
      return ["care", "comfort", "support"];

    case "achievement":
      return ["pride", "respect", "success"];

    case "surprise":
      return ["surprise", "excitement"];

    default:
      return ["care"];
  }
}

function mergeWorldsByPriority(a: GiftWorld[], b: GiftWorld[]): GiftWorld[] {
  return unique([...a, ...b]);
}

export function buildIntent(answers: UserAnswers): DecisionIntent {
  const occasionWorlds = getOccasionWorlds(answers.occasion);
  const circleWorlds = getCircleWorlds(answers.socialCircle);

  const emotions = getOccasionEmotions(answers.occasion);
  const styles = unique([
    ...getToneStyles(answers.tone),
    ...getCircleStyles(answers.socialCircle),
  ]);

  return {
    emotions,
    preferredWorlds: mergeWorldsByPriority(occasionWorlds, circleWorlds),
    styles,
  };
}