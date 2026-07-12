import { NextResponse } from "next/server";
import { parseBody, requireApiUser } from "@/lib/api";
import { createClient } from "@/lib/supabase/server";
import { isAtOrPast, localDateISO } from "@/lib/timezone";
import { markPostedSchema } from "@/lib/validation";
import type { PostingLog } from "@/lib/types";

export const runtime = "nodejs";

/**
 * Mark a posting log as posted. Handles:
 * - double-taps (already posted → 200, no change)
 * - posting after cutoff or after the sweep marked it missed → posted wins,
 *   flagged `marked_late` (spec edge cases 3, 4 and 10).
 */
export async function POST(request: Request) {
  const ctx = await requireApiUser();
  if (ctx instanceof NextResponse) return ctx;

  const parsed = await parseBody(request, markPostedSchema);
  if ("response" in parsed) return parsed.response;
  const { logId, postUrl, note } = parsed.data;

  const supabase = createClient();
  const { data: log } = await supabase
    .from("posting_logs")
    .select("*")
    .eq("id", logId)
    .eq("user_id", ctx.userId) // RLS enforces this too; explicit for clarity
    .single();

  if (!log) return NextResponse.json({ error: "Log not found" }, { status: 404 });

  const typedLog = log as PostingLog;
  if (typedLog.status === "posted") {
    return NextResponse.json({ ok: true, log: typedLog });
  }
  if (typedLog.status === "skipped") {
    return NextResponse.json({ error: "This item was cancelled" }, { status: 409 });
  }

  const now = new Date();
  const localToday = localDateISO(ctx.profile.timezone, now);
  const isLate =
    typedLog.status === "missed" ||
    typedLog.scheduled_date < localToday ||
    (typedLog.scheduled_date === localToday &&
      isAtOrPast(ctx.profile.timezone, now, ctx.org.eod_cutoff_time));

  const { data: updated, error } = await supabase
    .from("posting_logs")
    .update({
      status: "posted",
      posted_at: now.toISOString(),
      post_url: postUrl || null,
      note: note || null,
      marked_late: isLate,
    })
    .eq("id", logId)
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ error: "Could not update" }, { status: 500 });
  }
  return NextResponse.json({ ok: true, log: updated });
}
