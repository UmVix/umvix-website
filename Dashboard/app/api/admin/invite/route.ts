import { NextResponse } from "next/server";
import { parseBody, requireApiUser } from "@/lib/api";
import { createAdminClient } from "@/lib/supabase/admin";
import { isValidTimezone } from "@/lib/timezone";
import { inviteSchema } from "@/lib/validation";

export const runtime = "nodejs";

/**
 * Invite a teammate by email (invite-only app — public signup is disabled
 * in Supabase). Re-inviting an existing address resends the invite email;
 * inviting a deactivated member is rejected with a hint to reactivate.
 */
export async function POST(request: Request) {
  const ctx = await requireApiUser({ admin: true });
  if (ctx instanceof NextResponse) return ctx;

  const parsed = await parseBody(request, inviteSchema);
  if ("response" in parsed) return parsed.response;
  const { email, fullName, role, timezone } = parsed.data;

  if (!isValidTimezone(timezone)) {
    return NextResponse.json({ error: "Invalid timezone" }, { status: 400 });
  }

  const admin = createAdminClient();
  const redirectTo = `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback?next=/welcome`;

  const { error } = await admin.auth.admin.inviteUserByEmail(email, {
    data: { full_name: fullName, role, timezone },
    redirectTo,
  });

  if (error) {
    // Already registered → offer a resend via magic link instead.
    if (error.message.toLowerCase().includes("already")) {
      const { data: userList } = await admin.auth.admin.listUsers();
      const user = userList?.users.find(
        (u) => u.email?.toLowerCase() === email.toLowerCase(),
      );
      if (user) {
        const { data: profile } = await admin
          .from("profiles")
          .select("is_active")
          .eq("id", user.id)
          .single();
        if (profile && !profile.is_active) {
          return NextResponse.json(
            { error: "This person was deactivated. Reactivate them from the Employees list instead." },
            { status: 409 },
          );
        }
        // Active existing user → resend a sign-in link.
        await admin.auth.admin.generateLink({ type: "magiclink", email });
        return NextResponse.json({ ok: true, resent: true });
      }
    }
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
