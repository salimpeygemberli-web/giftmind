import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// نستخدم مفاتيح السيرفر (service role) فقط هنا
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { data, error } = await supabase
      .from("merchants")
      .insert({
        name: body.name,
        country: body.country,
        city: body.city,
        category: body.category,
        whatsapp: body.whatsapp,
        maps_link: body.maps_link,
        note: body.note,
        status: "pending",
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({
        ok: false,
        error: error.message,
      });
    }

    return NextResponse.json({
      ok: true,
      merchant: data,
    });
  } catch (e: any) {
    return NextResponse.json({
      ok: false,
      error: e.message || "Unexpected error",
    });
  }
}
