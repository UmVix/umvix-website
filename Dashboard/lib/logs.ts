import type { SupabaseClient } from "@supabase/supabase-js";
import { localDateISO } from "@/lib/timezone";
import type { Profile } from "@/lib/types";

/**
 * Seed today's `pending` log for one platform across every active member —
 * used when a platform is created or restored mid-day so it appears on
 * everyone's Today list without waiting for the next day-roller run.
 */
export async function seedTodayForPlatform(
  admin: SupabaseClient,
  orgId: string,
  platformId: string,
): Promise<void> {
  const { data: users } = await admin
    .from("profiles")
    .select("id, timezone, is_active")
    .eq("org_id", orgId)
    .eq("is_active", true);

  const now = new Date();
  const seeds = ((users ?? []) as Pick<Profile, "id" | "timezone" | "is_active">[]).map(
    (user) => ({
      org_id: orgId,
      user_id: user.id,
      platform_id: platformId,
      scheduled_date: localDateISO(user.timezone, now),
    }),
  );

  if (seeds.length > 0) {
    await admin.from("posting_logs").upsert(seeds, {
      onConflict: "user_id,platform_id,scheduled_date",
      ignoreDuplicates: true,
    });
  }
}

/**
 * Seed today's `pending` logs for one member across every active platform —
 * used when an employee is created or reactivated mid-day.
 */
export async function seedTodayForUser(
  admin: SupabaseClient,
  orgId: string,
  userId: string,
  timezone: string,
): Promise<void> {
  const { data: platforms } = await admin
    .from("platforms")
    .select("id")
    .eq("org_id", orgId)
    .eq("is_active", true);

  const today = localDateISO(timezone, new Date());
  const seeds = ((platforms ?? []) as { id: string }[]).map((platform) => ({
    org_id: orgId,
    user_id: userId,
    platform_id: platform.id,
    scheduled_date: today,
  }));

  if (seeds.length > 0) {
    await admin.from("posting_logs").upsert(seeds, {
      onConflict: "user_id,platform_id,scheduled_date",
      ignoreDuplicates: true,
    });
  }
}
