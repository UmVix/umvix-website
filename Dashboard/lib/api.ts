import { NextResponse } from "next/server";
import type { ZodSchema } from "zod";
import { createClient } from "@/lib/supabase/server";
import type { Organization, Profile } from "@/lib/types";

/** Shared plumbing for Route Handlers. */

export type ApiContext = {
  userId: string;
  profile: Profile;
  org: Organization;
};

/** Resolve the caller or return a 401/403 response. */
export async function requireApiUser(
  options: { admin?: boolean } = {},
): Promise<ApiContext | NextResponse> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

  // Profile + org in one round trip — the DB may be far away.
  const { data } = await supabase
    .from("profiles")
    .select("*, org:organizations(*)")
    .eq("id", user.id)
    .single();
  if (!data || !data.is_active) {
    return NextResponse.json({ error: "Account inactive" }, { status: 403 });
  }
  if (options.admin && data.role !== "admin") {
    return NextResponse.json({ error: "Admin only" }, { status: 403 });
  }

  const { org, ...profile } = data as Profile & { org: Organization | null };
  if (!org) return NextResponse.json({ error: "No organization" }, { status: 500 });

  return { userId: user.id, profile: profile as Profile, org };
}

/** Parse + validate a JSON body; returns a 400 response on failure. */
export async function parseBody<T>(
  request: Request,
  schema: ZodSchema<T>,
): Promise<{ data: T } | { response: NextResponse }> {
  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return { response: NextResponse.json({ error: "Invalid JSON" }, { status: 400 }) };
  }
  const parsed = schema.safeParse(raw);
  if (!parsed.success) {
    return {
      response: NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid input" },
        { status: 400 },
      ),
    };
  }
  return { data: parsed.data };
}

/** Guard for cron routes: Vercel sends `Authorization: Bearer <CRON_SECRET>`. */
export function verifyCronSecret(request: Request): NextResponse | null {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "CRON_SECRET not configured" }, { status: 500 });
  }
  const header = request.headers.get("authorization");
  if (header !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}
