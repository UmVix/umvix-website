import { formatInTimeZone } from "date-fns-tz";

/**
 * Per-user timezone math. Vercel Cron fires in UTC; every decision about
 * "today", reminder times and cutoffs happens in the user's own timezone.
 * All functions take an explicit `now` so tests can pin the clock.
 */

/** The user's current local calendar date, "yyyy-MM-dd". */
export function localDateISO(timezone: string, now: Date): string {
  return formatInTimeZone(now, timezone, "yyyy-MM-dd");
}

/** The user's current local wall-clock time, "HH:mm". */
export function localTimeHHmm(timezone: string, now: Date): string {
  return formatInTimeZone(now, timezone, "HH:mm");
}

/** ISO weekday (1=Mon … 7=Sun) of the user's current local date. */
export function localIsoWeekday(timezone: string, now: Date): number {
  return Number(formatInTimeZone(now, timezone, "i"));
}

/** Normalize Postgres `time` values ("15:00:00") to "HH:mm" for comparison. */
export function toHHmm(time: string): string {
  return time.slice(0, 5);
}

/**
 * Whether local wall-clock time has reached a target "HH:mm".
 * String comparison works because both are zero-padded 24h times.
 */
export function isAtOrPast(timezone: string, now: Date, targetHHmm: string): boolean {
  return localTimeHHmm(timezone, now) >= toHHmm(targetHHmm);
}

/** Shift a "yyyy-MM-dd" date string by whole days (calendar math, TZ-free). */
export function addDaysISO(dateISO: string, days: number): string {
  const [y, m, d] = dateISO.split("-").map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

/** Validate an IANA timezone name (e.g. from a profile form). */
export function isValidTimezone(tz: string): boolean {
  try {
    new Intl.DateTimeFormat("en-US", { timeZone: tz });
    return true;
  } catch {
    return false;
  }
}
