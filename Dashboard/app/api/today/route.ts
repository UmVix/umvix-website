import { NextResponse } from "next/server";
import { requireApiUser } from "@/lib/api";
import { seedTodayForUser } from "@/lib/logs";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { isAtOrPast, localDateISO } from "@/lib/timezone";

export const runtime = "nodejs";

/**
 * The Today checklist. A plain GET so the service worker can cache it and
 * the screen still renders offline with last-known data.
 *
 * Self-healing: if the hourly day-roller hasn't created this user's rows for
 * their new local day yet (fresh midnight, missed cron run, local dev where
 * no cron runs at all), seed them right here — the upsert is idempotent, so
 * this can never duplicate or reset anything the roller already did.
 */
export async function GET() {
  const ctx = await requireApiUser();
  if (ctx instanceof NextResponse) return ctx;

  const now = new Date();
  const today = localDateISO(ctx.profile.timezone, now);

  const supabase = createClient();
  const fetchToday = () =>
    supabase
      .from("posting_logs")
      .select("*, platform:platforms(*)")
      .eq("user_id", ctx.userId)
      .eq("scheduled_date", today)
      .neq("status", "skipped")
      .order("created_at");

  let { data: logs } = await fetchToday();

  if (!logs || logs.length === 0) {
    await seedTodayForUser(createAdminClient(), ctx.org.id, ctx.userId, ctx.profile.timezone);
    ({ data: logs } = await fetchToday());
  }

  const sorted = (logs ?? []).sort(
    (a, b) => (a.platform?.sort_order ?? 0) - (b.platform?.sort_order ?? 0),
  );

  return NextResponse.json({
    date: today,
    pastCutoff: isAtOrPast(ctx.profile.timezone, now, ctx.org.eod_cutoff_time),
    cutoff: ctx.org.eod_cutoff_time.slice(0, 5),
    logs: sorted,
  });
}
