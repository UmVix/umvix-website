import { requireAdmin } from "@/lib/auth";
import { computeStreaks, type DayOutcome } from "@/lib/schedule";
import { addDaysISO, localDateISO } from "@/lib/timezone";
import { createClient } from "@/lib/supabase/server";
import type { Platform, PostingLog, Profile } from "@/lib/types";
import { TeamDashboard, type TeamMemberRow } from "@/components/admin/TeamDashboard";

export const metadata = { title: "Team — Umvix PostPilot" };
export const dynamic = "force-dynamic";

/** Admin team dashboard: today's grid, weekly stats, streak leaderboard. */
export default async function AdminTeamPage() {
  const { org } = await requireAdmin();
  const supabase = createClient();
  const now = new Date();

  const [{ data: profilesData }, { data: platformsData }] = await Promise.all([
    supabase.from("profiles").select("*").eq("org_id", org.id).order("full_name"),
    supabase
      .from("platforms")
      .select("*")
      .eq("org_id", org.id)
      .eq("is_active", true)
      .order("sort_order"),
  ]);

  const profiles = ((profilesData ?? []) as Profile[]).filter((p) => p.is_active);
  const platforms = (platformsData ?? []) as Platform[];

  const orgToday = localDateISO(org.default_timezone, now);
  const weekAgo = addDaysISO(orgToday, -6);
  const streakFrom = addDaysISO(orgToday, -59);

  const { data: logsData } = await supabase
    .from("posting_logs")
    .select("*")
    .eq("org_id", org.id)
    .gte("scheduled_date", streakFrom)
    .neq("status", "skipped");

  const logs = (logsData ?? []) as PostingLog[];

  const rows: TeamMemberRow[] = profiles.map((profile) => {
    const userToday = localDateISO(profile.timezone, now);
    const userLogs = logs.filter((log) => log.user_id === profile.id);
    const todayLogs = userLogs.filter((log) => log.scheduled_date === userToday);
    const weekLogs = userLogs.filter((log) => log.scheduled_date >= weekAgo);

    const countsAsDone = (log: PostingLog) =>
      log.status === "posted" && (org.late_counts_for_streaks || !log.marked_late);

    const byDate = new Map<string, PostingLog[]>();
    for (const log of userLogs) {
      const list = byDate.get(log.scheduled_date) ?? [];
      list.push(log);
      byDate.set(log.scheduled_date, list);
    }
    const outcomes: DayOutcome[] = [...byDate.entries()].map(([date, dayLogs]) => ({
      date,
      scheduled: dayLogs.length,
      completed: dayLogs.filter(countsAsDone).length,
    }));
    const { current } = computeStreaks(outcomes, userToday);

    const weekDone = weekLogs.filter((log) => log.status === "posted").length;

    return {
      id: profile.id,
      name: profile.full_name,
      avatarUrl: profile.avatar_url,
      role: profile.role,
      streak: current,
      weekCompliance: weekLogs.length > 0 ? Math.round((weekDone / weekLogs.length) * 100) : null,
      cells: platforms.map((platform) => {
        const log = todayLogs.find((l) => l.platform_id === platform.id);
        return log
          ? { status: log.status, markedLate: log.marked_late }
          : { status: null, markedLate: false };
      }),
    };
  });

  const todayAll = logs.filter((log) =>
    profiles.some(
      (p) => p.id === log.user_id && log.scheduled_date === localDateISO(p.timezone, now),
    ),
  );
  const weekAll = logs.filter((log) => log.scheduled_date >= weekAgo);

  const stats = {
    todayDone: todayAll.filter((log) => log.status === "posted").length,
    todayTotal: todayAll.length,
    weekRate:
      weekAll.length > 0
        ? Math.round((weekAll.filter((l) => l.status === "posted").length / weekAll.length) * 100)
        : null,
    weekMissed: weekAll.filter((log) => log.status === "missed").length,
    members: profiles.length,
  };

  // ── 14-day completion trend (org timezone) ──
  const trend = Array.from({ length: 14 }, (_, i) => {
    const date = addDaysISO(orgToday, i - 13);
    const dayLogs = logs.filter((log) => log.scheduled_date === date);
    return {
      date,
      posted: dayLogs.filter((log) => log.status === "posted").length,
      scheduled: dayLogs.length,
    };
  });

  // ── Per-platform posted/missed (last 14 days) ──
  const platformBars = platforms.map((platform) => {
    const platformLogs = logs.filter(
      (log) =>
        log.platform_id === platform.id &&
        log.scheduled_date >= addDaysISO(orgToday, -13),
    );
    return {
      id: platform.id,
      name: platform.name,
      logoUrl: platform.logo_url,
      brandColor: platform.brand_color,
      posted: platformLogs.filter((log) => log.status === "posted").length,
      missed: platformLogs.filter((log) => log.status === "missed").length,
    };
  });

  return (
    <TeamDashboard
      platforms={platforms.map((p) => ({
        id: p.id,
        name: p.name,
        logoUrl: p.logo_url,
        brandColor: p.brand_color,
      }))}
      rows={rows}
      stats={stats}
      trend={trend}
      platformBars={platformBars}
    />
  );
}
