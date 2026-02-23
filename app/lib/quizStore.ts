// app/lib/quizStore.ts

export type QuizState = {
  country?: string;
  lang?: string;
  recipient?: string;

  budget?: number; // ✅ لازم رقم لأنك تستخدم slider

  personality?: string;
  occasion?: string;
  style?: string;
  goal?: string;
};

const KEY = "giftmind.quiz.v1";

export function readQuiz(): QuizState {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(KEY); // ✅ نفس المفتاح
    return raw ? (JSON.parse(raw) as QuizState) : {};
  } catch {
    return {};
  }
}

export function writeQuiz(patch: QuizState) {
  if (typeof window === "undefined") return;
  try {
    const current = readQuiz();
    const next: QuizState = { ...current, ...patch }; // ✅ merge حتى ما تضيع البيانات
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
