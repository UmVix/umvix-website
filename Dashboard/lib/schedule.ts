import type { Schedule } from "@/lib/types";

/**
 * Pure scheduling logic — no I/O, fully unit-tested.
 * ISO weekday numbering throughout: 1 = Monday … 7 = Sunday.
 */

/** Whether an assignment's schedule includes the given ISO weekday. */
export function isScheduledOnWeekday(schedule: Schedule, isoWeekday: number): boolean {
  if (isoWeekday < 1 || isoWeekday > 7) throw new RangeError(`Invalid ISO weekday: ${isoWeekday}`);
  switch (schedule.type) {
    case "daily":
      return true;
    case "weekdays":
      return schedule.days.includes(isoWeekday);
    case "weekly_quota":
      // v2: quota schedules are evaluated at week end, not per-day.
      return false;
  }
}

/** ISO weekday (1=Mon … 7=Sun) for a "yyyy-MM-dd" date string. */
export function isoWeekdayOfDate(dateISO: string): number {
  const [y, m, d] = dateISO.split("-").map(Number);
  // Date.UTC avoids the host machine's timezone shifting the weekday.
  const jsDay = new Date(Date.UTC(y, m - 1, d)).getUTCDay(); // 0=Sun … 6=Sat
  return jsDay === 0 ? 7 : jsDay;
}

/** Whether the schedule fires on the given local calendar date. */
export function isScheduledOnDate(schedule: Schedule, dateISO: string): boolean {
  return isScheduledOnWeekday(schedule, isoWeekdayOfDate(dateISO));
}

export function describeSchedule(schedule: Schedule): string {
  const DAY_NAMES = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  switch (schedule.type) {
    case "daily":
      return "Every day";
    case "weekdays":
      return [...schedule.days]
        .sort((a, b) => a - b)
        .map((d) => DAY_NAMES[d - 1])
        .join(", ") || "Never";
    case "weekly_quota":
      return `${schedule.count}× per week`;
  }
}

// ── Streaks ────────────────────────────────────────────────────────────────

export type DayOutcome = {
  date: string; // "yyyy-MM-dd"
  scheduled: number;
  /** Count of logs that count as completed for streak purposes. */
  completed: number;
};

/**
 * Current and best streaks over a day-by-day history.
 *
 * A day counts toward a streak when everything scheduled that day was
 * completed. Days with nothing scheduled don't break the streak — they're
 * simply skipped. The current streak is counted from the most recent day
 * backwards; an incomplete `today` (still in progress) does not break it,
 * but a fully complete today extends it.
 */
export function computeStreaks(
  history: DayOutcome[],
  todayISO: string,
): { current: number; best: number } {
  const days = [...history].sort((a, b) => a.date.localeCompare(b.date));

  let best = 0;
  let run = 0;
  for (const day of days) {
    if (day.scheduled === 0) continue;
    if (day.completed >= day.scheduled) {
      run += 1;
      if (run > best) best = run;
    } else if (day.date === todayISO) {
      // Today isn't over — an unfinished today neither breaks nor extends.
      continue;
    } else {
      run = 0;
    }
  }

  let current = 0;
  for (let i = days.length - 1; i >= 0; i--) {
    const day = days[i];
    if (day.scheduled === 0) continue;
    if (day.completed >= day.scheduled) {
      current += 1;
    } else if (day.date === todayISO) {
      continue;
    } else {
      break;
    }
  }

  return { current, best };
}
