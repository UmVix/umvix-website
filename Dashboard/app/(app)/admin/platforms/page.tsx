import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import type { Platform } from "@/lib/types";
import { PlatformsScreen } from "@/components/admin/PlatformsScreen";

export const metadata = { title: "Platforms — Umvix PostPilot" };
export const dynamic = "force-dynamic";

export default async function AdminPlatformsPage() {
  const { org } = await requireAdmin();
  const supabase = createClient();

  const { data: platforms } = await supabase
    .from("platforms")
    .select("*")
    .eq("org_id", org.id)
    .order("sort_order");

  return <PlatformsScreen platforms={(platforms ?? []) as Platform[]} />;
}
