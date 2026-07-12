import { isAtOrPast, localDateISO, toHHmm } from "@/lib/timezone";
import type {
  NotificationPrefs,
  Organization,
  Platform,
  Profile,
} from "@/lib/types";

/**
 * Cron planners — pure functions that turn a snapshot of the database into
 * a list of actions. The API routes fetch the snapshot, call the planner,
 * then execute the actions. Keeping decisions pure makes the highest-risk
 * code (timezone + sweep logic) unit-testable without a database.
 *
 * Idempotency comes from two layers: these planners only propose actions
 * that are currently applicable, and the executors rely on unique
 * constraints (posting_logs upsert, notifications_log insert-once).
 */

export type PendingLog = {
  id: string;
  user_id: string;
  platform_id: string;
  scheduled_date: string;
};

export type PushMessage = {
  userId: string;
  refDate: string;
  payload: { title: string; body: string; url: string };
};

// ── Day roller ─────────────────────────────────────────────────────────────
// Every active employee posts on every active platform, every day — there is
// no assignment or scheduling concept.

export type RollerInput = {
  now: Date;
  users: Profile[];
  platforms: Pick<Platform, "id" | "is_active">[];
  orgId: string;
};

export type LogSeed = {
  org_id: string;
  user_id: string;
  platform_id: string;
  scheduled_date: string;
};

/** Rows to upsert as `pending` for each user's current local date. */
export function planDayRoller(input: RollerInput): LogSeed[] {
  const seeds: LogSeed[] = [];
  for (const user of input.users) {
    if (!user.is_active) continue;
    const today = localDateISO(user.timezone, input.now);
    for (const platform of input.platforms) {
      if (!platform.is_active) continue;
      seeds.push({
        org_id: input.orgId,
        user_id: user.id,
        platform_id: platform.id,
        scheduled_date: today,
      });
    }
  }
  return seeds;
}

// ── Midday reminder ────────────────────────────────────────────────────────

export type MiddayInput = {
  now: Date;
  org: Organization;
  users: Profile[];
  pendingLogs: PendingLog[];
  platformNames: Record<string, string>;
};

function prefs(user: Profile): NotificationPrefs {
  return user.notification_prefs ?? {};
}

export function effectiveReminderTime(org: Organization, user: Profile): string {
  return toHHmm(prefs(user).reminder_time ?? org.reminder_time);
}

export function planMidday(input: MiddayInput): PushMessage[] {
  const messages: PushMessage[] = [];
  for (const user of input.users) {
    if (!user.is_active) continue;
    if (prefs(user).midday_enabled === false) continue;

    const reminderAt = effectiveReminderTime(input.org, user);
    const cutoff = toHHmm(input.org.eod_cutoff_time);
    if (!isAtOrPast(user.timezone, input.now, reminderAt)) continue;
    if (isAtOrPast(user.timezone, input.now, cutoff)) continue; // EOD sweep owns it now

    const today = localDateISO(user.timezone, input.now);
    const pending = input.pendingLogs.filter(
      (log) => log.user_id === user.id && log.scheduled_date === today,
    );
    if (pending.length === 0) continue;

    const names = pending
      .map((log) => input.platformNames[log.platform_id] ?? "a platform")
      .sort();
    messages.push({
      userId: user.id,
      refDate: today,
      payload: {
        title: "Posting reminder",
        body: `You still have ${pending.length} platform${pending.length === 1 ? "" : "s"} to post on today: ${names.join(", ")}.`,
        url: "/today",
      },
    });
  }
  return messages;
}

// ── End-of-day sweep ───────────────────────────────────────────────────────

export type SweepInput = {
  now: Date;
  org: Organization;
  users: Profile[];
  pendingLogs: PendingLog[];
  /**
   * Logs already flipped to `missed` for the org's current date by earlier
   * hourly runs (users in earlier timezones). Needed so the admin digest —
   * which fires once, when the last user's day closes — still lists them.
   */
  missedLogs: PendingLog[];
  platformNames: Record<string, string>;
  userNames: Record<string, string>;
};

export type SweepPlan = {
  /** posting_log ids to flip pending → missed. */
  markMissed: string[];
  /** "You missed posting on …" pushes to employees. */
  employeeNotices: PushMessage[];
  /** Digest to every admin; empty when the org's day isn't finished yet. */
  adminDigests: PushMessage[];
};

export function planEodSweep(input: SweepInput): SweepPlan {
  const { now, org, users, pendingLogs, missedLogs, platformNames, userNames } = input;
  const cutoff = toHHmm(org.eod_cutoff_time);
  const optoutAllowed = org.allow_notification_optout;

  const markMissed: string[] = [];
  const employeeNotices: PushMessage[] = [];
  /** user ids whose local day (for their own "today") is fully swept. */
  const sweptUsers = new Set<string>();

  for (const user of users) {
    if (!user.is_active) continue;
    const localToday = localDateISO(user.timezone, now);
    const pastCutoff = isAtOrPast(user.timezone, now, cutoff);
    if (pastCutoff) sweptUsers.add(user.id);

    const missedToday: string[] = [];
    for (const log of pendingLogs) {
      if (log.user_id !== user.id) continue;
      const overdue =
        log.scheduled_date < localToday ||
        (log.scheduled_date === localToday && pastCutoff);
      if (!overdue) continue;
      markMissed.push(log.id);
      if (log.scheduled_date === localToday) {
        missedToday.push(platformNames[log.platform_id] ?? "a platform");
      }
    }

    if (missedToday.length > 0) {
      const eodDisabled = prefs(user).eod_enabled === false && optoutAllowed;
      if (!eodDisabled) {
        employeeNotices.push({
          userId: user.id,
          refDate: localToday,
          payload: {
            title: "Missed posts today",
            body: `You missed posting on: ${missedToday.sort().join(", ")} today.`,
            url: "/today",
          },
        });
      }
    }
  }

  // ── Admin digest: only once the whole org's day is really over ─────────
  const orgDate = localDateISO(org.default_timezone, now);
  const adminDigests: PushMessage[] = [];

  const orgDayDone =
    isAtOrPast(org.default_timezone, now, cutoff) &&
    users
      .filter((u) => u.is_active)
      .every(
        (u) =>
          sweptUsers.has(u.id) ||
          // A user in an earlier timezone may still be mid-day; wait for them
          // only if they still have anything pending for the org date.
          !pendingLogs.some(
            (log) => log.user_id === u.id && log.scheduled_date === orgDate,
          ),
      );

  if (orgDayDone) {
    const newlyMissed = new Set(markMissed);
    const missedForOrgDate = [
      ...pendingLogs.filter(
        (log) => log.scheduled_date === orgDate && newlyMissed.has(log.id),
      ),
      ...missedLogs.filter((log) => log.scheduled_date === orgDate),
    ];

    const byUser = new Map<string, string[]>();
    for (const log of missedForOrgDate) {
      const list = byUser.get(log.user_id) ?? [];
      list.push(platformNames[log.platform_id] ?? "a platform");
      byUser.set(log.user_id, list);
    }

    let body: string | null;
    if (byUser.size > 0) {
      const parts = [...byUser.entries()]
        .map(([userId, platforms]) => `${userNames[userId] ?? "Someone"}: ${platforms.sort().join(", ")}`)
        .sort();
      body = `Today's missed posts — ${parts.join("; ")}.`;
    } else {
      body = org.send_positive_digest ? "All posts completed today ✅" : null;
    }

    if (body !== null) {
      for (const admin of users) {
        if (!admin.is_active || admin.role !== "admin") continue;
        adminDigests.push({
          userId: admin.id,
          refDate: orgDate,
          payload: { title: "Team posting digest", body, url: "/admin" },
        });
      }
    }
  }

  return { markMissed, employeeNotices, adminDigests };
}
