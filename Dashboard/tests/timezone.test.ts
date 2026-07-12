import { describe, expect, it } from "vitest";
import {
  addDaysISO,
  isAtOrPast,
  isValidTimezone,
  localDateISO,
  localTimeHHmm,
  toHHmm,
} from "@/lib/timezone";

// 2026-07-12 20:30 UTC → Karachi (UTC+5) 2026-07-13 01:30, New York (UTC-4) 16:30
const NOW = new Date("2026-07-12T20:30:00Z");

describe("localDateISO", () => {
  it("gives each user their own local calendar date", () => {
    expect(localDateISO("Asia/Karachi", NOW)).toBe("2026-07-13");
    expect(localDateISO("America/New_York", NOW)).toBe("2026-07-12");
    expect(localDateISO("UTC", NOW)).toBe("2026-07-12");
  });
});

describe("localTimeHHmm", () => {
  it("converts to local wall-clock time", () => {
    expect(localTimeHHmm("Asia/Karachi", NOW)).toBe("01:30");
    expect(localTimeHHmm("America/New_York", NOW)).toBe("16:30");
  });
});

describe("isAtOrPast", () => {
  it("compares against a local target time", () => {
    // New York is at 16:30
    expect(isAtOrPast("America/New_York", NOW, "15:00")).toBe(true);
    expect(isAtOrPast("America/New_York", NOW, "16:30")).toBe(true);
    expect(isAtOrPast("America/New_York", NOW, "21:00")).toBe(false);
    // Karachi already rolled into the next day at 01:30
    expect(isAtOrPast("Asia/Karachi", NOW, "21:00")).toBe(false);
  });

  it("accepts Postgres time strings with seconds", () => {
    expect(toHHmm("21:00:00")).toBe("21:00");
    expect(isAtOrPast("America/New_York", NOW, "16:30:00")).toBe(true);
  });
});

describe("addDaysISO", () => {
  it("does plain calendar math across month ends", () => {
    expect(addDaysISO("2026-07-31", 1)).toBe("2026-08-01");
    expect(addDaysISO("2026-07-01", -1)).toBe("2026-06-30");
    expect(addDaysISO("2026-07-12", 7)).toBe("2026-07-19");
  });
});

describe("isValidTimezone", () => {
  it("accepts IANA names and rejects junk", () => {
    expect(isValidTimezone("Asia/Karachi")).toBe(true);
    expect(isValidTimezone("Not/AZone")).toBe(false);
  });
});
