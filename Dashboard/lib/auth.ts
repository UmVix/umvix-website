import { cache } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Organization, Profile } from "@/lib/types";

export type SessionContext = {
  userId: string;
  email: string;
  profile: Profile;
  org: Organization;
};

/**
 * Resolve the signed-in user's profile + org for Server Components.
 * Redirects to /login when signed out and blocks deactivated accounts.
 *
 * Wrapped in React cache() so the layout and the page share one lookup per
 * request, and the profile+org arrive in a single joined query — the DB may
 * be far away, so round trips are the whole page latency.
 */
export const getSessionContext = cache(async (): Promise<SessionContext> => {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*, org:organizations(*)")
    .eq("id", user.id)
    .single();
  if (!profile) redirect("/login");
  if (!profile.is_active) redirect("/login?deactivated=1");

  const { org, ...profileRow } = profile as Profile & { org: Organization };
  if (!org) redirect("/login");

  return {
    userId: user.id,
    email: user.email ?? "",
    profile: profileRow as Profile,
    org,
  };
});

/** Like getSessionContext, but only admins get through. */
export async function requireAdmin(): Promise<SessionContext> {
  const ctx = await getSessionContext();
  if (ctx.profile.role !== "admin") redirect("/today");
  return ctx;
}
