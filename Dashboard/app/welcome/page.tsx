import { getSessionContext } from "@/lib/auth";
import { WelcomeForm } from "./WelcomeForm";

export const metadata = { title: "Welcome — Umvix PostPilot" };

/** First-login screen for invited employees: set a password, confirm name/timezone. */
export default async function WelcomePage() {
  const { profile, email } = await getSessionContext();

  return (
    <main className="flex min-h-dvh items-center justify-center bg-surface-sunken px-4">
      <div className="w-full max-w-sm">
        <h1 className="mb-1 text-center font-headline text-2xl font-bold text-ink">
          Welcome to <span className="text-brand-red">PostPilot</span>
        </h1>
        <p className="mb-6 text-center text-sm text-ink-muted">
          You&apos;re signed in as {email}. Set a password to finish setting up.
        </p>
        <WelcomeForm initialName={profile.full_name} initialTimezone={profile.timezone} />
      </div>
    </main>
  );
}
