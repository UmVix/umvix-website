import { NextResponse } from "next/server";
import { z } from "zod";
import { parseBody, requireApiUser } from "@/lib/api";
import { seedTodayForUser } from "@/lib/logs";
import { createAdminClient } from "@/lib/supabase/admin";
import { isValidTimezone } from "@/lib/timezone";

export const runtime = "nodejs";

const employeeUpdateSchema = z.object({
  fullName: z.string().trim().min(1).max(120).optional(),
  role: z.enum(["admin", "employee"]).optional(),
  timezone: z.string().min(1).max(64).optional(),
  isActive: z.boolean().optional(),
});

/**
 * Admin edits a team member. Deactivation cancels today's pending logs and
 * stops future generation + notifications; history stays visible
 * (spec edge case 6).
 */
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } },
) {
  const ctx = await requireApiUser({ admin: true });
  if (ctx instanceof NextResponse) return ctx;

  const parsed = await parseBody(request, employeeUpdateSchema);
  if ("response" in parsed) return parsed.response;
  const { fullName, role, timezone, isActive } = parsed.data;

  if (timezone && !isValidTimezone(timezone)) {
    return NextResponse.json({ error: "Invalid timezone" }, { status: 400 });
  }
  if (params.id === ctx.userId && (isActive === false || role === "employee")) {
    return NextResponse.json(
      { error: "You can't deactivate or demote yourself." },
      { status: 400 },
    );
  }

  const admin = createAdminClient();
  const { data: target } = await admin
    .from("profiles")
    .select("org_id")
    .eq("id", params.id)
    .single();
  if (!target || target.org_id !== ctx.org.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const { error } = await admin
    .from("profiles")
    .update({
      ...(fullName !== undefined && { full_name: fullName }),
      ...(role !== undefined && { role }),
      ...(timezone !== undefined && { timezone }),
      ...(isActive !== undefined && { is_active: isActive }),
    })
    .eq("id", params.id);

  if (error) return NextResponse.json({ error: "Could not update" }, { status: 500 });

  if (isActive === false) {
    await admin
      .from("posting_logs")
      .update({ status: "skipped" })
      .eq("user_id", params.id)
      .eq("status", "pending");
  } else if (isActive === true) {
    const { data: reactivated } = await admin
      .from("profiles")
      .select("timezone")
      .eq("id", params.id)
      .single();
    if (reactivated) {
      await seedTodayForUser(admin, ctx.org.id, params.id, reactivated.timezone);
    }
  }

  return NextResponse.json({ ok: true });
}

/**
 * Permanently delete a member: removes the auth account and, via FK
 * cascades, their profile, posting history, assignments, subscriptions and
 * notifications. Frees the email address for re-use. Irreversible —
 * use deactivate instead to keep history.
 */
export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } },
) {
  const ctx = await requireApiUser({ admin: true });
  if (ctx instanceof NextResponse) return ctx;

  if (params.id === ctx.userId) {
    return NextResponse.json({ error: "You can't delete yourself." }, { status: 400 });
  }

  const admin = createAdminClient();
  const { data: target } = await admin
    .from("profiles")
    .select("org_id")
    .eq("id", params.id)
    .single();
  if (!target || target.org_id !== ctx.org.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const { error } = await admin.auth.admin.deleteUser(params.id);
  if (error) {
    return NextResponse.json({ error: "Could not delete" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
