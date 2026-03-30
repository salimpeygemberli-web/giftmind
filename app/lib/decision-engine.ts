function buildIntent(a: any) {
  const intent: string[] = [];

  if (a.recipient === "friend") {
    intent.push("bond", "shared-history");
  }

  if (a.occasion === "birthday") {
    intent.push("celebration", "joy");
  }

  if (a.vibe === "fun") {
    intent.push("playful", "inside-joke");
  }

  return intent;
}

export function getTopResults(answers: any) {
  const intent = buildIntent(answers);
  const intentText = intent.join(" ").toLowerCase();

  console.log("INTENT:", intentText);

  // 💥 الحالة الأساسية
  if (
    intentText.includes("bond") &&
    intentText.includes("celebration") &&
    intentText.includes("playful")
  ) {
    return [
      {
        type: "symbolic",
        title: "Printed Screenshot of Your Funniest Chat",
        reason:
          "A real shared moment that instantly brings laughter and emotional connection.",
        score: 95,
        merchant: null,
      },
      {
        type: "experience",
        title: "Private Karaoke Night",
        reason:
          "A fun, high-energy experience that creates new memories instantly.",
        score: 92,
        merchant: null,
      },
      {
        type: "tangible",
        title: "Custom Inside Joke T-Shirt",
        reason:
          "A wearable joke that keeps your friendship alive daily.",
        score: 89,
        merchant: null,
      },
    ];
  }

  // fallback
  return [
    {
      type: "symbolic",
      title: "Thoughtful Gift",
      reason: "A meaningful option based on your input.",
      score: 80,
      merchant: null,
    },
  ];
}