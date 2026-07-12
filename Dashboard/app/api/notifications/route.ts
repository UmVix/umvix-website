import { NextResponse } from "next/server";
import { requireApiUser } from "@/lib/api";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

/** In-app notification center: latest 50 for the bell dropdown. */
export async function GET() {
  const ctx = await requireApiUser();
  if (ctx instanceof NextResponse) return ctx;

  const supabase = createClient();
  const { data } = await supabase
    .from("notifications_log")
    .select("id, type, payload, ref_date, sent_at, read_at")
    .eq("user_id", ctx.userId)
    .order("sent_at", { ascending: false })
    .limit(50);

  return NextResponse.json({ notifications: data ?? [] });
}

/** Mark all of the caller's notifications as read. */
export async function PATCH() {
  const ctx = await requireApiUser();
  if (ctx instanceof NextResponse) return ctx;

  const supabase = createClient();
  await supabase
    .from("notifications_log")
    .update({ read_at: new Date().toISOString() })
    .eq("user_id", ctx.userId)
    .is("read_at", null);

  return NextResponse.json({ ok: true });
}
