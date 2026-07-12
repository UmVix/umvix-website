import { describe, expect, it } from "vitest";
import { planDayRoller, planEodSweep, planMidday } from "@/lib/cron/plan";
import type { Organization, Profile } from "@/lib/types";

/** Fixtures — 2026-07-12 is a Sunday. */

function org(overrides: Partial<Organization> = {}): Organization {
  return {
    id: "org1",
    name: "Umvix",
    default_timezone: "Asia/Karachi",
    eod_cutoff_time: "21:00:00",
    reminder_time: "15:00:00",
    late_counts_for_streaks: false,
    send_positive_digest: true,
    allow_notification_optout: false,
    created_at: "",
    ...overrides,
  };
}

function user(id: string, overrides: Partial<Profile> = {}): Profile {
  return {
    id,
    org_id: "org1",
    role: "employee",
    full_name: id,
    avatar_url: null,
    timezone: "Asia/Karachi",
    is_active: true,
    notification_prefs: {},
    created_at: "",
    ...overrides,
  };
}

const PLATFORM_NAMES = { p1: "Instagram", p2: "LinkedIn" };

describe("planDayRoller", () => {
  // 10:00 in Karachi on Sunday 2026-07-12
  const now = new Date("2026-07-12T05:00:00Z");

  it("seeds every active user × every active platform for their local date", () => {
    const seeds = planDayRoller({
      now,
      orgId: "org1",
      users: [user("ali"), user("sara")],
      platforms: [
        { id: "p1", is_active: true },
        { id: "p2", is_active: true },
      ],
    });
    expect(seeds).toHaveLength(4);
    expect(seeds).toContainEqual({
      org_id: "org1", user_id: "ali", platform_id: "p2", scheduled_date: "2026-07-12",
    });
    expect(seeds).toContainEqual({
      org_id: "org1", user_id: "sara", platform_id: "p1", scheduled_date: "2026-07-12",
    });
  });

  it("skips inactive users and archived platforms", () => {
    const seeds = planDayRoller({
      now,
      orgId: "org1",
      users: [user("ali", { is_active: false }), user("sara")],
      platforms: [
        { id: "p1", is_active: false }, // archived
        { id: "p2", is_active: true },
      ],
    });
    expect(seeds).toEqual([
      { org_id: "org1", user_id: "sara", platform_id: "p2", scheduled_date: "2026-07-12" },
    ]);
  });

  it("uses each user's own local date across timezones", () => {
    // 20:30 UTC: Karachi already on July 13, New York still July 12
    const lateNow = new Date("2026-07-12T20:30:00Z");
    const seeds = planDayRoller({
      now: lateNow,
      orgId: "org1",
      users: [user("karachi"), user("nyc", { timezone: "America/New_York" })],
      platforms: [{ id: "p1", is_active: true }],
    });
    expect(seeds.find((s) => s.user_id === "karachi")?.scheduled_date).toBe("2026-07-13");
    expect(seeds.find((s) => s.user_id === "nyc")?.scheduled_date).toBe("2026-07-12");
  });
});

describe("planMidday", () => {
  // 15:30 in Karachi
  const now = new Date("2026-07-12T10:30:00Z");

  it("reminds users past reminder time with pending items", () => {
    const messages = planMidday({
      now,
      org: org(),
      users: [user("ali")],
      pendingLogs: [
        { id: "l1", user_id: "ali", platform_id: "p1", scheduled_date: "2026-07-12" },
        { id: "l2", user_id: "ali", platform_id: "p2", scheduled_date: "2026-07-12" },
      ],
      platformNames: PLATFORM_NAMES,
    });
    expect(messages).toHaveLength(1);
    expect(messages[0].payload.body).toBe(
      "You still have 2 platforms to post on today: Instagram, LinkedIn.",
    );
  });

  it("stays silent before the reminder time, after cutoff, and with nothing pending", () => {
    const base = {
      org: org(),
      users: [user("ali")],
      pendingLogs: [
        { id: "l1", user_id: "ali", platform_id: "p1", scheduled_date: "2026-07-12" },
      ],
      platformNames: PLATFORM_NAMES,
    };
    // 14:00 Karachi — before reminder
    expect(planMidday({ ...base, now: new Date("2026-07-12T09:00:00Z") })).toHaveLength(0);
    // 21:30 Karachi — past cutoff, EOD sweep owns it
    expect(planMidday({ ...base, now: new Date("2026-07-12T16:30:00Z") })).toHaveLength(0);
    // nothing pending
    expect(planMidday({ ...base, pendingLogs: [], now })).toHaveLength(0);
  });

  it("respects a per-user reminder time override", () => {
    const messages = planMidday({
      now, // 15:30 Karachi
      org: org(),
      users: [user("ali", { notification_prefs: { reminder_time: "18:00" } })],
      pendingLogs: [
        { id: "l1", user_id: "ali", platform_id: "p1", scheduled_date: "2026-07-12" },
      ],
      platformNames: PLATFORM_NAMES,
    });
    expect(messages).toHaveLength(0);
  });
});

describe("planEodSweep", () => {
  // 21:30 in Karachi on 2026-07-12
  const pastCutoff = new Date("2026-07-12T16:30:00Z");

  it("marks today's pending logs missed and notifies the employee", () => {
    const plan = planEodSweep({
      now: pastCutoff,
      org: org(),
      users: [user("ali"), user("boss", { role: "admin" })],
      pendingLogs: [
        { id: "l1", user_id: "ali", platform_id: "p1", scheduled_date: "2026-07-12" },
        { id: "l2", user_id: "ali", platform_id: "p2", scheduled_date: "2026-07-12" },
      ],
      missedLogs: [],
      platformNames: PLATFORM_NAMES,
      userNames: { ali: "Ali", boss: "Boss" },
    });

    expect(plan.markMissed).toEqual(["l1", "l2"]);
    expect(plan.employeeNotices).toHaveLength(1);
    expect(plan.employeeNotices[0].payload.body).toBe(
      "You missed posting on: Instagram, LinkedIn today.",
    );
    expect(plan.adminDigests).toHaveLength(1);
    expect(plan.adminDigests[0].payload.body).toBe(
      "Today's missed posts — Ali: Instagram, LinkedIn.",
    );
  });

  it("does nothing before the cutoff", () => {
    const beforeCutoff = new Date("2026-07-12T15:00:00Z"); // 20:00 Karachi
    const plan = planEodSweep({
      now: beforeCutoff,
      org: org(),
      users: [user("ali")],
      pendingLogs: [
        { id: "l1", user_id: "ali", platform_id: "p1", scheduled_date: "2026-07-12" },
      ],
      missedLogs: [],
      platformNames: PLATFORM_NAMES,
      userNames: { ali: "Ali" },
    });
    expect(plan.markMissed).toEqual([]);
    expect(plan.employeeNotices).toEqual([]);
    expect(plan.adminDigests).toEqual([]);
  });

  it("sweeps stale pending logs from previous days without re-notifying", () => {
    const plan = planEodSweep({
      now: pastCutoff,
      org: org(),
      users: [user("ali")],
      pendingLogs: [
        { id: "old", user_id: "ali", platform_id: "p1", scheduled_date: "2026-07-10" },
      ],
      missedLogs: [],
      platformNames: PLATFORM_NAMES,
      userNames: { ali: "Ali" },
    });
    expect(plan.markMissed).toEqual(["old"]);
    // No "missed today" notice — the old log isn't from today.
    expect(plan.employeeNotices).toEqual([]);
  });

  it("holds the admin digest until users in earlier timezones finish their day", () => {
    // 21:30 Karachi, but New York is only 12:30 with items still pending.
    const plan = planEodSweep({
      now: pastCutoff,
      org: org(),
      users: [
        user("ali"),
        user("nyc", { timezone: "America/New_York" }),
        user("boss", { role: "admin" }),
      ],
      pendingLogs: [
        { id: "l1", user_id: "nyc", platform_id: "p1", scheduled_date: "2026-07-12" },
      ],
      missedLogs: [],
      platformNames: PLATFORM_NAMES,
      userNames: { ali: "Ali", nyc: "NYC", boss: "Boss" },
    });
    expect(plan.markMissed).toEqual([]); // NYC still mid-day
    expect(plan.adminDigests).toEqual([]); // digest waits
  });

  it("includes logs already missed in earlier runs in the digest", () => {
    const plan = planEodSweep({
      now: pastCutoff,
      org: org(),
      users: [user("ali"), user("boss", { role: "admin" })],
      pendingLogs: [],
      missedLogs: [
        { id: "m1", user_id: "ali", platform_id: "p2", scheduled_date: "2026-07-12" },
      ],
      platformNames: PLATFORM_NAMES,
      userNames: { ali: "Ali", boss: "Boss" },
    });
    expect(plan.adminDigests).toHaveLength(1);
    expect(plan.adminDigests[0].payload.body).toBe("Today's missed posts — Ali: LinkedIn.");
  });

  it("sends the positive digest on clean days, unless disabled", () => {
    const base = {
      now: pastCutoff,
      users: [user("ali"), user("boss", { role: "admin" as const })],
      pendingLogs: [],
      missedLogs: [],
      platformNames: PLATFORM_NAMES,
      userNames: { ali: "Ali", boss: "Boss" },
    };
    const happy = planEodSweep({ ...base, org: org() });
    expect(happy.adminDigests).toHaveLength(1);
    expect(happy.adminDigests[0].payload.body).toBe("All posts completed today ✅");

    const muted = planEodSweep({ ...base, org: org({ send_positive_digest: false }) });
    expect(muted.adminDigests).toEqual([]);
  });

  it("skips the employee notice when opted out — only if the org allows it", () => {
    const optedOut = user("ali", { notification_prefs: { eod_enabled: false } });
    const pending = [
      { id: "l1", user_id: "ali", platform_id: "p1", scheduled_date: "2026-07-12" },
    ];
    const base = {
      now: pastCutoff,
      users: [optedOut],
      pendingLogs: pending,
      missedLogs: [],
      platformNames: PLATFORM_NAMES,
      userNames: { ali: "Ali" },
    };

    const forbidden = planEodSweep({ ...base, org: org() });
    expect(forbidden.employeeNotices).toHaveLength(1); // org forbids opt-out

    const allowed = planEodSweep({ ...base, org: org({ allow_notification_optout: true }) });
    expect(allowed.employeeNotices).toEqual([]); // opt-out honored
    expect(allowed.markMissed).toEqual(["l1"]); // still marked missed
  });

  it("never notifies deactivated users", () => {
    const plan = planEodSweep({
      now: pastCutoff,
      org: org(),
      users: [user("ali", { is_active: false }), user("boss", { role: "admin" })],
      pendingLogs: [
        { id: "l1", user_id: "ali", platform_id: "p1", scheduled_date: "2026-07-12" },
      ],
      missedLogs: [],
      platformNames: PLATFORM_NAMES,
      userNames: { ali: "Ali", boss: "Boss" },
    });
    expect(plan.markMissed).toEqual([]);
    expect(plan.employeeNotices).toEqual([]);
  });
});
