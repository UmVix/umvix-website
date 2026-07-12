import { NextResponse } from "next/server";
import { parseBody, requireApiUser } from "@/lib/api";
import { createClient } from "@/lib/supabase/server";
import { pushSubscribeSchema } from "@/lib/validation";
import { z } from "zod";

export const runtime = "nodejs";

/** Register this device for Web Push (a user can have several devices). */
export async function POST(request: Request) {
  const ctx = await requireApiUser();
  if (ctx instanceof NextResponse) return ctx;

  const parsed = await parseBody(request, pushSubscribeSchema);
  if ("response" in parsed) return parsed.response;
  const { endpoint, keys, userAgent } = parsed.data;

  const supabase = createClient();
  const { error } = await supabase.from("push_subscriptions").upsert(
    {
      user_id: ctx.userId,
      endpoint,
      p256dh: keys.p256dh,
      auth: keys.auth,
      user_agent: userAgent ?? null,
    },
    { onConflict: "endpoint" },
  );

  if (error) return NextResponse.json({ error: "Could not save" }, { status: 500 });
  return NextResponse.json({ ok: true });
}

/** Remove this device's subscription (e.g. user turned reminders off). */
export async function DELETE(request: Request) {
  const ctx = await requireApiUser();
  if (ctx instanceof NextResponse) return ctx;

  const parsed = await parseBody(request, z.object({ endpoint: z.string().url() }));
  if ("response" in parsed) return parsed.response;

  const supabase = createClient();
  await supabase
    .from("push_subscriptions")
    .delete()
    .eq("user_id", ctx.userId)
    .eq("endpoint", parsed.data.endpoint);

  return NextResponse.json({ ok: true });
}
