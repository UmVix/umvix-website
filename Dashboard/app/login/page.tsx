import Image from "next/image";
import { LoginForm } from "./LoginForm";

export const metadata = { title: "Sign in — Umvix PostPilot" };

export default function LoginPage({
  searchParams,
}: {
  searchParams: { deactivated?: string };
}) {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-surface-sunken px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center gap-3">
          <Image
            src="/icons/logo-small.png"
            alt="Umvix"
            width={64}
            height={64}
            className="rounded-2xl"
            priority
          />
          <h1 className="font-headline text-2xl font-bold text-ink">
            Umvix <span className="text-brand-red">PostPilot</span>
          </h1>
          <p className="text-center text-sm text-ink-muted">
            Track the team&apos;s daily posting — sign in to continue.
          </p>
        </div>

        {searchParams.deactivated && (
          <div className="mb-4 rounded-xl border border-danger/30 bg-danger/10 p-3 text-sm text-danger">
            Your account has been deactivated. Contact your admin.
          </div>
        )}

        <LoginForm />

        <p className="mt-6 text-center text-xs text-ink-faint">
          Invite-only — ask your admin for access.
        </p>
      </div>
    </main>
  );
}
