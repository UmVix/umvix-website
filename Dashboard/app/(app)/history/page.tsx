import { CalendarCheck2, Flame, History as HistoryIcon, Trophy, XCircle } from "lucide-react";
import { DayStrip, type DayCell } from "@/components/charts/DayStrip";
import { PlatformBars, type PlatformBarRow } from "@/components/charts/PlatformBars";
import { EmptyState } from "@/components/ui/EmptyState";
import { StatusChip } from "@/components/ui/StatusChip";
import { getSessionContext } from "@/lib/auth";
import { computeStreaks, type DayOutcome } from "@/lib/schedule";
import { addDaysISO, localDateISO } from "@/lib/timezone";
import { createClient } from "@/lib/supabase/server";
import type { LogWithPlatform } from "@/lib/types";

export const metadata = { title: "My Stats — Umvix PostPilot" };
export const dynamic = "force-dynamic";

/**
 * Employee stats dashboard: the current 90-day window in detail (activity
 * strip + per-platform chart), all-time totals, streaks and recent days.
 */
export default async function MyStatsPage() {
  const { userId, profile, org } = await getSessionContext();
  const supabase = createClient();

  const today = localDateISO(profile.timezone, new Date());
  const windowStart = addDaysISO(today, -89);

  // All-time logs; small team + a few platforms keeps this cheap.
  const { data } = await supabase
    .from("posting_logs")
    .select("*, platform:platforms(*)")
    .eq("user_id", userId)
    .lte("scheduled_date", today)
    .neq("status", "skipped")
    .order("scheduled_date", { ascending: false });

  const allLogs = (data ?? []) as LogWithPlatform[];
  const windowLogs = allLogs.filter((log) => log.scheduled_date >= windowStart);

  const countsAsDone = (log: LogWithPlatform) =>
    log.status === "posted" && (org.late_counts_for_streaks || !log.marked_late);

  // ── Streaks (all-time history) ──
  const byDateAll = new Map<string, LogWithPlatform[]>();
  for (const log of allLogs) {
    const list = byDateAll.get(log.scheduled_date) ?? [];
    list.push(log);
    byDateAll.set(log.scheduled_date, list);
  }
  const outcomes: DayOutcome[] = [...byDateAll.entries()].map(([date, dayLogs]) => ({
    date,
    scheduled: dayLogs.length,
    completed: dayLogs.filter(countsAsDone).length,
  }));
  const { current, best } = computeStreaks(outcomes, today);

  // ── 90-day activity strip ──
  const cells: DayCell[] = Array.from({ length: 90 }, (_, i) => {
    const date = addDaysISO(windowStart, i);
    const dayLogs = byDateAll.get(date) ?? [];
    if (dayLogs.length === 0) return { date, state: null };
    const posted = dayLogs.filter((log) => log.status === "posted").length;
    const pending = dayLogs.some((log) => log.status === "pending");
    if (pending && date === today) return { date, state: "pending" };
    if (posted === dayLogs.length) return { date, state: "complete" };
    if (posted > 0) return { date, state: "partial" };
    return { date, state: "missed" };
  });

  // ── Per-platform breakdown (90-day window) ──
  const platformRows = new Map<string, PlatformBarRow>();
  for (const log of windowLogs) {
    if (!log.platform) continue;
    const row = platformRows.get(log.platform_id) ?? {
      id: log.platform_id,
      name: log.platform.name,
      logoUrl: log.platform.logo_url,
      brandColor: log.platform.brand_color,
      posted: 0,
      missed: 0,
    };
    if (log.status === "posted") row.posted += 1;
    if (log.status === "missed") row.missed += 1;
    platformRows.set(log.platform_id, row);
  }

  // ── Window + overall totals ──
  const windowDays = [...new Set(windowLogs.map((log) => log.scheduled_date))];
  const fullDays = windowDays.filter((date) => {
    const dayLogs = byDateAll.get(date) ?? [];
    return dayLogs.length > 0 && dayLogs.every((log) => log.status === "posted");
  }).length;
  const windowMissed = windowLogs.filter((log) => log.status === "missed").length;

  const overallPosted = allLogs.filter((log) => log.status === "posted").length;
  const overallMissed = allLogs.filter((log) => log.status === "missed").length;
  const overallDecided = overallPosted + overallMissed;
  const overallRate =
    overallDecided > 0 ? Math.round((overallPosted / overallDecided) * 100) : null;

  const recentDays = [...byDateAll.entries()]
    .sort((a, b) => b[0].localeCompare(a[0]))
    .slice(0, 14);

  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-xl font-bold text-ink">My Stats</h1>
        <p className="mt-0.5 text-sm text-ink-muted">
          Current 90-day window · {windowStart} → {today}
        </p>
      </header>

      {/* ── KPI tiles ── */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatTile icon={<Flame className="h-4 w-4" />} tone="text-brand-red" label="Current streak" value={`${current}`} unit="days" />
        <StatTile icon={<Trophy className="h-4 w-4" />} tone="text-warning" label="Best streak" value={`${best}`} unit="days" />
        <StatTile icon={<CalendarCheck2 className="h-4 w-4" />} tone="text-success" label="Full days (90d)" value={`${fullDays}`} unit={`of ${windowDays.length}`} />
        <StatTile icon={<XCircle className="h-4 w-4" />} tone="text-danger" label="Missed (90d)" value={`${windowMissed}`} unit="posts" />
      </div>

      {allLogs.length === 0 ? (
        <EmptyState
          icon={HistoryIcon}
          title="No history yet"
          body="Once you start marking posts, your charts build up here."
        />
      ) : (
        <>
          {/* ── Charts row (side by side on desktop) ── */}
          <div className="grid gap-4 lg:grid-cols-2">
            <DayStrip cells={cells} title="Last 90 days" />
            <div className="space-y-4">
              {platformRows.size > 0 && (
                <PlatformBars
                  rows={[...platformRows.values()]}
                  title="By platform (90 days)"
                />
              )}
              {/* ── Overall (all-time) ── */}
              <section className="rounded-card border border-line bg-surface p-4">
                <h2 className="mb-3 text-sm font-bold text-ink">Overall — all time</h2>
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div>
                    <p className="text-2xl font-bold text-ink">{overallPosted}</p>
                    <p className="text-xs text-ink-faint">posted</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-ink">{overallMissed}</p>
                    <p className="text-xs text-ink-faint">missed</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-ink">
                      {overallRate === null ? "—" : `${overallRate}%`}
                    </p>
                    <p className="text-xs text-ink-faint">completion</p>
                  </div>
                </div>
              </section>
            </div>
          </div>

          {/* ── Recent days ── */}
          <section>
            <h2 className="mb-2 text-sm font-semibold text-ink-faint">Recent days</h2>
            <ul className="grid gap-3 lg:grid-cols-2">
              {recentDays.map(([date, dayLogs]) => {
                const posted = dayLogs.filter((log) => log.status === "posted").length;
                return (
                  <li key={date} className="rounded-card border border-line bg-surface p-4">
                    <div className="mb-2 flex items-center justify-between">
                      <p className="text-sm font-semibold text-ink">
                        {new Date(`${date}T00:00:00`).toLocaleDateString("en-GB", {
                          weekday: "short",
                          day: "numeric",
                          month: "short",
                        })}
                        {date === today && (
                          <span className="ml-2 text-xs font-medium text-brand-red">Today</span>
                        )}
                      </p>
                      <p className="text-xs font-medium text-ink-muted">
                        {posted}/{dayLogs.length} posted
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {dayLogs.map((log) => (
                        <span
                          key={log.id}
                          className="inline-flex items-center gap-1.5 rounded-full border border-line px-2 py-0.5"
                        >
                          <span
                            className="h-2 w-2 rounded-full"
                            style={{ backgroundColor: log.platform?.brand_color }}
                          />
                          <span className="text-xs text-ink-muted">{log.platform?.name}</span>
                          <StatusChip
                            status={log.status}
                            markedLate={log.marked_late}
                            className="px-1.5 py-0 text-[10px]"
                          />
                        </span>
                      ))}
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>
        </>
      )}
    </div>
  );
}

function StatTile({
  icon,
  tone,
  label,
  value,
  unit,
}: {
  icon: React.ReactNode;
  tone: string;
  label: string;
  value: string;
  unit: string;
}) {
  return (
    <div className="rounded-card border border-line bg-surface p-3.5">
      <div className={`flex items-center gap-1.5 ${tone}`}>
        {icon}
        <span className="text-[11px] font-semibold uppercase tracking-wide">{label}</span>
      </div>
      <p className="mt-1 text-2xl font-bold text-ink">
        {value} <span className="text-xs font-medium text-ink-faint">{unit}</span>
      </p>
    </div>
  );
}
