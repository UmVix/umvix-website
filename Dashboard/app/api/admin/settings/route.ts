import { NextResponse } from "next/server";
import { parseBody, requireApiUser } from "@/lib/api";
import { createClient } from "@/lib/supabase/server";
import { isValidTimezone } from "@/lib/timezone";
import { orgSettingsSchema } from "@/lib/validation";

export const runtime = "nodejs";

/** Update organization-wide settings (admin only). */
export async function PATCH(request: Request) {
  const ctx = await requireApiUser({ admin: true });
  if (ctx instanceof NextResponse) return ctx;

  const parsed = await parseBody(request, orgSettingsSchema);
  if ("response" in parsed) return parsed.response;
  const {
    defaultTimezone,
    eodCutoffTime,
    reminderTime,
    lateCountsForStreaks,
    sendPositiveDigest,
    allowNotificationOptout,
  } = parsed.data;

  if (defaultTimezone && !isValidTimezone(defaultTimezone)) {
    return NextResponse.json({ error: "Invalid timezone" }, { status: 400 });
  }

  const supabase = createClient();
  const { error } = await supabase
    .from("organizations")
    .update({
      ...(defaultTimezone !== undefined && { default_timezone: defaultTimezone }),
      ...(eodCutoffTime !== undefined && { eod_cutoff_time: eodCutoffTime }),
      ...(reminderTime !== undefined && { reminder_time: reminderTime }),
      ...(lateCountsForStreaks !== undefined && { late_counts_for_streaks: lateCountsForStreaks }),
      ...(sendPositiveDigest !== undefined && { send_positive_digest: sendPositiveDigest }),
      ...(allowNotificationOptout !== undefined && { allow_notification_optout: allowNotificationOptout }),
    })
    .eq("id", ctx.org.id);

  if (error) return NextResponse.json({ error: "Could not update" }, { status: 500 });
  return NextResponse.json({ ok: true });
}
