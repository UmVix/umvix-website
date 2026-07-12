import type { SupabaseClient } from "@supabase/supabase-js";
import { notifyUser } from "@/lib/push";
import { localDateISO } from "@/lib/timezone";
import type { Organization, Platform, Profile } from "@/lib/types";
import { planDayRoller, planEodSweep, planMidday, type PendingLog } from "./plan";

/**
 * Cron runners: fetch a snapshot, hand it to the pure planners, execute the
 * resulting actions. All writes are idempotent (upserts / unique constraints)
 * so Vercel retrying a cron invocation is harmless.
 */

type OrgSnapshot = {
  org: Organization;
  users: Profile[];
  platformNames: Record<string, string>;
};

async function loadOrgs(admin: SupabaseClient): Promise<OrgSnapshot[]> {
  const [{ data: orgs }, { data: users }, { data: platforms }] = await Promise.all([
    admin.from("organizations").select("*"),
    admin.from("profiles").select("*"),
    admin.from("platforms").select("id, org_id, name"),
  ]);

  return (orgs ?? []).map((org: Organization) => ({
    org,
    users: ((users ?? []) as Profile[]).filter((u) => u.org_id === org.id),
    platformNames: Object.fromEntries(
      ((platforms ?? []) as Pick<Platform, "id" | "org_id" | "name">[])
        .filter((p) => p.org_id === org.id)
        .map((p) => [p.id, p.name]),
    ),
  }));
}

async function loadPendingLogs(
  admin: SupabaseClient,
  orgId: string,
): Promise<PendingLog[]> {
  const { data } = await admin
    .from("posting_logs")
    .select("id, user_id, platform_id, scheduled_date")
    .eq("org_id", orgId)
    .eq("status", "pending");
  return (data ?? []) as PendingLog[];
}

/** Generate today's `pending` rows for every user's local date. */
export async function runDayRoller(admin: SupabaseClient, now: Date) {
  const snapshots = await loadOrgs(admin);
  let created = 0;

  for (const { org, users } of snapshots) {
    const { data: platforms } = await admin
      .from("platforms")
      .select("id, is_active")
      .eq("org_id", org.id)
      .eq("is_active", true);

    const seeds = planDayRoller({
      now,
      orgId: org.id,
      users,
      platforms: (platforms ?? []) as Pick<Platform, "id" | "is_active">[],
    });

    if (seeds.length > 0) {
      // Upsert + ignoreDuplicates keeps reruns from touching existing rows
      // (a log already marked `posted` must never be reset to `pending`).
      const { error, count } = await admin
        .from("posting_logs")
        .upsert(seeds, {
          onConflict: "user_id,platform_id,scheduled_date",
          ignoreDuplicates: true,
          count: "exact",
        });
      if (error) throw error;
      created += count ?? 0;
    }
  }
  return { created };
}

/** Send "you still have N to post" reminders at each user's reminder time. */
export async function runMiddayReminder(admin: SupabaseClient, now: Date) {
  const snapshots = await loadOrgs(admin);
  let sent = 0;

  for (const { org, users, platformNames } of snapshots) {
    const pendingLogs = await loadPendingLogs(admin, org.id);
    const messages = planMidday({ now, org, users, pendingLogs, platformNames });
    for (const message of messages) {
      const delivered = await notifyUser(
        admin,
        message.userId,
        "midday_reminder",
        message.refDate,
        message.payload,
      );
      if (delivered) sent += 1;
    }
  }
  return { sent };
}

/** Flip overdue logs to `missed`, notify employees, then digest the admins. */
export async function runEodSweep(admin: SupabaseClient, now: Date) {
  const snapshots = await loadOrgs(admin);
  let missed = 0;
  let notices = 0;
  let digests = 0;

  for (const { org, users, platformNames } of snapshots) {
    const orgDate = localDateISO(org.default_timezone, now);
    const pendingLogs = await loadPendingLogs(admin, org.id);
    const { data: missedRows } = await admin
      .from("posting_logs")
      .select("id, user_id, platform_id, scheduled_date")
      .eq("org_id", org.id)
      .eq("status", "missed")
      .eq("scheduled_date", orgDate);

    const plan = planEodSweep({
      now,
      org,
      users,
      pendingLogs,
      missedLogs: (missedRows ?? []) as PendingLog[],
      platformNames,
      userNames: Object.fromEntries(users.map((u) => [u.id, u.full_name])),
    });

    if (plan.markMissed.length > 0) {
      // `.eq("status", "pending")` makes the flip race-safe: a user marking
      // posted at the same moment wins and the sweep skips that row.
      const { error, count } = await admin
        .from("posting_logs")
        .update({ status: "missed" }, { count: "exact" })
        .in("id", plan.markMissed)
        .eq("status", "pending");
      if (error) throw error;
      missed += count ?? 0;
    }

    for (const notice of plan.employeeNotices) {
      const delivered = await notifyUser(
        admin,
        notice.userId,
        "eod_missed",
        notice.refDate,
        notice.payload,
      );
      if (delivered) notices += 1;
    }

    for (const digest of plan.adminDigests) {
      const delivered = await notifyUser(
        admin,
        digest.userId,
        "admin_digest",
        digest.refDate,
        digest.payload,
      );
      if (delivered) digests += 1;
    }
  }
  return { missed, notices, digests };
}
