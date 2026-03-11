"use client";

import { useRouter } from "next/navigation";

export default function Q2Page() {
  const router = useRouter();

  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl">
        <div className="text-sm uppercase tracking-[0.3em] text-white/50">
          Question 2
        </div>

        <h1 className="mt-3 text-2xl font-bold">What is your budget?</h1>

        <div className="mt-6 space-y-3">
          <button className="w-full rounded-2xl border border-white/15 px-4 py-3 text-left">
            Under $50
          </button>
          <button className="w-full rounded-2xl border border-white/15 px-4 py-3 text-left">
            $50 - $150
          </button>
          <button className="w-full rounded-2xl border border-white/15 px-4 py-3 text-left">
            $150+
          </button>
        </div>

        <div className="mt-8 flex gap-3">
          <button
            onClick={() => router.push("/quiz/q1")}
            className="flex-1 rounded-2xl border border-white/15 px-4 py-3"
          >
            Back
          </button>

          <button
            onClick={() => router.push("/quiz/q3")}
            className="flex-1 rounded-2xl bg-white px-4 py-3 font-semibold text-black"
          >
            Next
          </button>
        </div>
      </div>
    </main>
  );
}