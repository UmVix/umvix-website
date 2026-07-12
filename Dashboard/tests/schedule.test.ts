import { describe, expect, it } from "vitest";
import {
  computeStreaks,
  describeSchedule,
  isScheduledOnDate,
  isScheduledOnWeekday,
  isoWeekdayOfDate,
} from "@/lib/schedule";

describe("isoWeekdayOfDate", () => {
  it("maps known dates to ISO weekdays", () => {
    expect(isoWeekdayOfDate("2026-07-13")).toBe(1); // Monday
    expect(isoWeekdayOfDate("2026-07-12")).toBe(7); // Sunday
    expect(isoWeekdayOfDate("2026-07-17")).toBe(5); // Friday
  });
});

describe("isScheduledOnWeekday", () => {
  it("daily fires every day", () => {
    for (let day = 1; day <= 7; day++) {
      expect(isScheduledOnWeekday({ type: "daily" }, day)).toBe(true);
    }
  });

  it("weekdays fires only on listed days", () => {
    const schedule: import("@/lib/types").Schedule = { type: "weekdays", days: [1, 3, 5] };
    expect(isScheduledOnWeekday(schedule, 1)).toBe(true);
    expect(isScheduledOnWeekday(schedule, 2)).toBe(false);
    expect(isScheduledOnWeekday(schedule, 5)).toBe(true);
    expect(isScheduledOnWeekday(schedule, 7)).toBe(false);
  });

  it("weekly quota never fires per-day (v2 shape)", () => {
    expect(isScheduledOnWeekday({ type: "weekly_quota", count: 3 }, 1)).toBe(false);
  });

  it("rejects invalid weekday numbers", () => {
    expect(() => isScheduledOnWeekday({ type: "daily" }, 0)).toThrow(RangeError);
    expect(() => isScheduledOnWeekday({ type: "daily" }, 8)).toThrow(RangeError);
  });
});

describe("isScheduledOnDate", () => {
  it("resolves the date's weekday before matching", () => {
    // 2026-07-13 is a Monday
    expect(isScheduledOnDate({ type: "weekdays", days: [1] }, "2026-07-13")).toBe(true);
    expect(isScheduledOnDate({ type: "weekdays", days: [2] }, "2026-07-13")).toBe(false);
  });
});

describe("describeSchedule", () => {
  it("labels schedules for the UI", () => {
    expect(describeSchedule({ type: "daily" })).toBe("Every day");
    expect(describeSchedule({ type: "weekdays", days: [5, 1, 3] })).toBe("Mon, Wed, Fri");
  });
});

describe("computeStreaks", () => {
  it("counts consecutive fully-completed days", () => {
    const history = [
      { date: "2026-07-08", scheduled: 2, completed: 2 },
      { date: "2026-07-09", scheduled: 2, completed: 2 },
      { date: "2026-07-10", scheduled: 3, completed: 3 },
    ];
    expect(computeStreaks(history, "2026-07-10")).toEqual({ current: 3, best: 3 });
  });

  it("a missed day resets the current streak but keeps the best", () => {
    const history = [
      { date: "2026-07-06", scheduled: 1, completed: 1 },
      { date: "2026-07-07", scheduled: 1, completed: 1 },
      { date: "2026-07-08", scheduled: 1, completed: 0 }, // missed
      { date: "2026-07-09", scheduled: 1, completed: 1 },
    ];
    expect(computeStreaks(history, "2026-07-09")).toEqual({ current: 1, best: 2 });
  });

  it("an unfinished today neither breaks nor extends the streak", () => {
    const history = [
      { date: "2026-07-10", scheduled: 1, completed: 1 },
      { date: "2026-07-11", scheduled: 1, completed: 1 },
      { date: "2026-07-12", scheduled: 2, completed: 1 }, // today, in progress
    ];
    expect(computeStreaks(history, "2026-07-12")).toEqual({ current: 2, best: 2 });
  });

  it("days with nothing scheduled don't break streaks", () => {
    const history = [
      { date: "2026-07-10", scheduled: 1, completed: 1 },
      { date: "2026-07-11", scheduled: 0, completed: 0 }, // day off
      { date: "2026-07-12", scheduled: 1, completed: 1 },
    ];
    expect(computeStreaks(history, "2026-07-12")).toEqual({ current: 2, best: 2 });
  });
});
