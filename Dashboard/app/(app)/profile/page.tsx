import { getSessionContext } from "@/lib/auth";
import { ProfileScreen } from "@/components/profile/ProfileScreen";

export const metadata = { title: "Profile — Umvix PostPilot" };
export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const { profile, org, email } = await getSessionContext();

  return (
    <ProfileScreen
      profile={profile}
      email={email}
      orgReminderTime={org.reminder_time.slice(0, 5)}
      allowOptout={org.allow_notification_optout}
    />
  );
}
