import { NextResponse } from "next/server";

let clicks: any[] = []; // مؤقتاً في الذاكرة

export async function GET() {
  // يعرض آخر 50 ضغطة
  return NextResponse.json({ clicks: clicks.slice(-50).reverse() });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const record = {
      merchantId: String(body?.merchantId || ""),
      merchantName: String(body?.merchantName || ""),
      country: String(body?.country || ""),
      goal: String(body?.goal || ""),
      time: new Date().toISOString(),
    };

    if (!record.merchantId || !record.merchantName) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    clicks.push(record);
    console.log("GiftMind Click:", record);

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Failed" }, { status: 500 });
  }
}
