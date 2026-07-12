import { requireAdmin } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/lib/types";
import { EmployeesScreen } from "@/components/admin/EmployeesScreen";

export const metadata = { title: "Employees — Umvix PostPilot" };
export const dynamic = "force-dynamic";

export default async function AdminEmployeesPage() {
  const { org, userId } = await requireAdmin();
  const supabase = createClient();

  const { data: profiles } = await supabase
    .from("profiles")
    .select("*")
    .eq("org_id", org.id)
    .order("full_name");

  // Emails live in auth.users, not in profiles — service role maps them.
  const emails = new Map<string, string>();
  try {
    const admin = createAdminClient();
    const { data } = await admin.auth.admin.listUsers({ perPage: 1000 });
    for (const user of data?.users ?? []) {
      if (user.email) emails.set(user.id, user.email);
    }
  } catch {
    // Without a service key (local dev) the list still renders, minus emails.
  }

  const members = ((profiles ?? []) as Profile[]).map((profile) => ({
    profile,
    email: emails.get(profile.id) ?? "",
  }));

  return (
    <EmployeesScreen
      members={members}
      selfId={userId}
      orgTimezone={org.default_timezone}
    />
  );
}
