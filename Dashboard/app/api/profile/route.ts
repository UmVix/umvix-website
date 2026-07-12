import { NextResponse } from "next/server";
import { parseBody, requireApiUser } from "@/lib/api";
import { createClient } from "@/lib/supabase/server";
import { isValidTimezone } from "@/lib/timezone";
import { profileUpdateSchema } from "@/lib/validation";

export const runtime = "nodejs";

/** Update the caller's own profile (name, timezone, avatar, notification prefs). */
export async function PATCH(request: Request) {
  const ctx = await requireApiUser();
  if (ctx instanceof NextResponse) return ctx;

  const parsed = await parseBody(request, profileUpdateSchema);
  if ("response" in parsed) return parsed.response;
  const { fullName, timezone, avatarUrl, notificationPrefs } = parsed.data;

  if (timezone && !isValidTimezone(timezone)) {
    return NextResponse.json({ error: "Invalid timezone" }, { status: 400 });
  }

  // Employees may only disable accountability (EOD) notifications when the
  // org allows it; the midday reminder is always theirs to configure.
  let prefs = notificationPrefs;
  if (prefs?.eod_enabled === false && !ctx.org.allow_notification_optout) {
    prefs = { ...prefs, eod_enabled: true };
  }

  const supabase = createClient();
  const { error } = await supabase
    .from("profiles")
    .update({
      ...(fullName !== undefined && { full_name: fullName }),
      ...(timezone !== undefined && { timezone }),
      ...(avatarUrl !== undefined && { avatar_url: avatarUrl }),
      ...(prefs !== undefined && {
        notification_prefs: { ...ctx.profile.notification_prefs, ...prefs },
      }),
    })
    .eq("id", ctx.userId);

  if (error) return NextResponse.json({ error: "Could not update" }, { status: 500 });
  return NextResponse.json({ ok: true });
}
