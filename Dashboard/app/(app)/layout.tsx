import { getSessionContext } from "@/lib/auth";
import { AppShell } from "@/components/layout/AppShell";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const { profile } = await getSessionContext();

  return (
    <AppShell
      role={profile.role}
      userName={profile.full_name}
      avatarUrl={profile.avatar_url}
    >
      {children}
    </AppShell>
  );
}
