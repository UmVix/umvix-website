import webpush from "web-push";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { NotificationType, PushSubscriptionRow } from "@/lib/types";

/**
 * Web Push delivery. Every notification is also written to
 * notifications_log first (the in-app bell is the source of truth); push is
 * best-effort on top. Dead subscriptions (404/410) are pruned.
 */

let vapidConfigured = false;

function ensureVapid(): boolean {
  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;
  if (!publicKey || !privateKey) return false;
  if (!vapidConfigured) {
    webpush.setVapidDetails(
      process.env.VAPID_SUBJECT ?? "mailto:admin@example.com",
      publicKey,
      privateKey,
    );
    vapidConfigured = true;
  }
  return true;
}

export type PushPayload = {
  title: string;
  body: string;
  /** Deep link opened when the notification is tapped. */
  url: string;
};

/**
 * Log + deliver a notification to one user, idempotently.
 *
 * The unique constraint on (user_id, type, ref_date) makes retried cron runs
 * safe: if the log row already exists, nothing is sent again.
 * Returns true when this call actually created (and attempted to send) it.
 */
export async function notifyUser(
  admin: SupabaseClient,
  userId: string,
  type: NotificationType,
  refDate: string,
  payload: PushPayload,
): Promise<boolean> {
  const { data: logged, error } = await admin
    .from("notifications_log")
    .insert({ user_id: userId, type, ref_date: refDate, payload })
    .select("id")
    .maybeSingle();

  if (error) {
    // 23505 = unique_violation → already sent for this user/type/date.
    if (error.code === "23505") return false;
    throw error;
  }
  if (!logged) return false;

  const delivered = await sendPushToUser(admin, userId, payload);
  if (delivered) {
    await admin.from("notifications_log").update({ delivered: true }).eq("id", logged.id);
  }
  return true;
}

/** Push the payload to every device the user has registered. */
async function sendPushToUser(
  admin: SupabaseClient,
  userId: string,
  payload: PushPayload,
): Promise<boolean> {
  if (!ensureVapid()) return false;

  const { data: subs } = await admin
    .from("push_subscriptions")
    .select("*")
    .eq("user_id", userId);

  if (!subs?.length) return false;

  let anyDelivered = false;
  await Promise.all(
    (subs as PushSubscriptionRow[]).map(async (sub) => {
      try {
        await webpush.sendNotification(
          { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
          JSON.stringify(payload),
        );
        anyDelivered = true;
      } catch (err) {
        const statusCode = (err as { statusCode?: number }).statusCode;
        if (statusCode === 404 || statusCode === 410) {
          await admin.from("push_subscriptions").delete().eq("id", sub.id);
        }
      }
    }),
  );
  return anyDelivered;
}
