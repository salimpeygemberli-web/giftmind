export type QuizState = {
  country?: string;
  lang?: string;
  recipient?: string;
  budget?: string;
  occasion?: string;
  style?: string;
  goal?: string; // ✅ ضيفها
};


const KEY = "giftmind.quiz.v1";

export function readQuiz(): QuizState {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return {};
    return JSON.parse(raw) as QuizState;
  } catch {
    return {};
  }
}

export function writeQuiz(next: QuizState) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // ignore
  }
}

export function clearQuiz() {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(KEY);
  } catch {
    // ignore
  }
}
