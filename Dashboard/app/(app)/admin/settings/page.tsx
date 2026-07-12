import { requireAdmin } from "@/lib/auth";
import { SettingsScreen } from "@/components/admin/SettingsScreen";

export const metadata = { title: "Settings — Umvix PostPilot" };
export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const { org } = await requireAdmin();
  return <SettingsScreen org={org} />;
}
