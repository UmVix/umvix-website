import { z } from "zod";

/** Zod schemas for every API input. */

export const scheduleSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("daily") }),
  z.object({
    type: z.literal("weekdays"),
    days: z.array(z.number().int().min(1).max(7)).min(1).max(7),
  }),
]);

export const markPostedSchema = z.object({
  logId: z.string().uuid(),
  postUrl: z.string().url().max(2048).optional().or(z.literal("")),
  note: z.string().max(500).optional(),
});

export const pushSubscribeSchema = z.object({
  endpoint: z.string().url(),
  keys: z.object({ p256dh: z.string().min(1), auth: z.string().min(1) }),
  userAgent: z.string().max(512).optional(),
});

export const platformSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(60),
  description: z.string().max(300).default(""),
  brandColor: z.string().regex(/^#[0-9a-fA-F]{6}$/, "Invalid color"),
  urlTemplate: z.string().url().max(2048).optional().or(z.literal("")),
  logoUrl: z.string().url().max(2048).optional().or(z.literal("")),
});

export const platformReorderSchema = z.object({
  order: z.array(z.string().uuid()).min(1),
});

export const inviteSchema = z.object({
  email: z.string().email(),
  fullName: z.string().trim().min(1).max(120),
  role: z.enum(["admin", "employee"]).default("employee"),
  timezone: z.string().min(1).max(64),
});

export const assignmentSchema = z.object({
  platformId: z.string().uuid(),
  userId: z.string().uuid(),
  schedule: scheduleSchema,
});

export const profileUpdateSchema = z.object({
  fullName: z.string().trim().min(1).max(120).optional(),
  timezone: z.string().min(1).max(64).optional(),
  avatarUrl: z.string().url().max(2048).optional(),
  notificationPrefs: z
    .object({
      reminder_time: z.string().regex(/^\d{2}:\d{2}$/).optional(),
      midday_enabled: z.boolean().optional(),
      eod_enabled: z.boolean().optional(),
    })
    .optional(),
});

export const orgSettingsSchema = z.object({
  defaultTimezone: z.string().min(1).max(64).optional(),
  eodCutoffTime: z.string().regex(/^\d{2}:\d{2}$/).optional(),
  reminderTime: z.string().regex(/^\d{2}:\d{2}$/).optional(),
  lateCountsForStreaks: z.boolean().optional(),
  sendPositiveDigest: z.boolean().optional(),
  allowNotificationOptout: z.boolean().optional(),
});

export const MAX_LOGO_BYTES = 1024 * 1024; // 1 MB
export const ALLOWED_LOGO_TYPES = ["image/jpeg", "image/png", "image/webp", "image/svg+xml"];
