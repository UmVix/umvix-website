import { NextResponse } from "next/server";
import { z } from "zod";
import { parseBody, requireApiUser } from "@/lib/api";
import { seedTodayForUser } from "@/lib/logs";
import { createAdminClient } from "@/lib/supabase/admin";
import { isValidTimezone } from "@/lib/timezone";

export const runtime = "nodejs";

const createEmployeeSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters").max(72),
  fullName: z.string().trim().min(1).max(120),
  role: z.enum(["admin", "employee"]).default("employee"),
  timezone: z.string().min(1).max(64),
});

/**
 * Create a team member directly with a password — no invite email needed.
 * The admin hands the credentials to the employee, who can sign in
 * immediately. The auth trigger creates the profile from the metadata.
 */
export async function POST(request: Request) {
  const ctx = await requireApiUser({ admin: true });
  if (ctx instanceof NextResponse) return ctx;

  const parsed = await parseBody(request, createEmployeeSchema);
  if ("response" in parsed) return parsed.response;
  const { email, password, fullName, role, timezone } = parsed.data;

  if (!isValidTimezone(timezone)) {
    return NextResponse.json({ error: "Invalid timezone" }, { status: 400 });
  }

  const admin = createAdminClient();
  const { data, error } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: fullName, role, timezone },
  });

  if (error) {
    if (error.message.toLowerCase().includes("already")) {
      return NextResponse.json(
        { error: "This email is already a member." },
        { status: 409 },
      );
    }
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  // Their Today checklist starts right now, not at the next day-roller run.
  if (data.user) {
    await seedTodayForUser(admin, ctx.org.id, data.user.id, timezone);
  }

  return NextResponse.json({ ok: true, userId: data.user?.id });
}
