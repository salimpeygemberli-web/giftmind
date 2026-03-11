"use client";

import { MERCHANTS } from "@/app/lib/giftmind/merchants";
import { getTopMerchants } from "@/app/lib/giftmind/scoring";
import { UserAnswers } from "@/app/lib/giftmind/types";

export default function TestGiftMindPage() {
  const answers: UserAnswers = {
    country: "UAE",
    occasion: "apology",
    budget: "high",
    urgency: "today",
    socialCircle: "intimate",
    tone: "balanced",
  };

  const results = getTopMerchants(answers, MERCHANTS);

  return (
    <main style={{ padding: 40 }}>
      <h1>🎁 GiftMind Test Results</h1>

      {results.map((item) => (
        <div
          key={item.id}
          style={{
            border: "1px solid #ccc",
            borderRadius: 12,
            padding: 16,
            marginTop: 16,
          }}
        >
          <h2>{item.name}</h2>
          <p>Score: {item.score}</p>

          <strong>Why selected:</strong>
          <ul>
            {item.why.map((reason) => (
              <li key={reason}>{reason}</li>
            ))}
          </ul>
        </div>
      ))}

      {results.length === 0 && <p>No matches found.</p>}
    </main>
  );
}