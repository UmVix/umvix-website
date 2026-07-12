"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { TimezoneSelect } from "@/components/ui/TimezoneSelect";

export function WelcomeForm({
  initialName,
  initialTimezone,
}: {
  initialName: string;
  initialTimezone: string;
}) {
  const router = useRouter();
  const [fullName, setFullName] = useState(initialName);
  const [timezone, setTimezone] = useState(initialTimezone);
  const [password, setPassword] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    setPending(true);
    setError(null);

    const supabase = createClient();
    const { error: authError } = await supabase.auth.updateUser({ password });
    if (authError) {
      setError(authError.message);
      setPending(false);
      return;
    }

    const response = await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fullName, timezone }),
    });
    if (!response.ok) {
      setError("Could not save your profile. Try again.");
      setPending(false);
      return;
    }

    router.replace("/today");
    router.refresh();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-card border border-line bg-surface p-6 shadow-sm"
    >
      <div>
        <label htmlFor="fullName" className="mb-1.5 block text-sm font-medium text-ink">
          Your name
        </label>
        <input
          id="fullName"
          required
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="input"
        />
      </div>

      <div>
        <label htmlFor="timezone" className="mb-1.5 block text-sm font-medium text-ink">
          Timezone
        </label>
        <TimezoneSelect id="timezone" value={timezone} onChange={setTimezone} />
      </div>

      <div>
        <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-ink">
          New password
        </label>
        <input
          id="password"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input"
          placeholder="At least 8 characters"
        />
      </div>

      {error && <p className="text-sm text-danger">{error}</p>}

      <button type="submit" disabled={pending} className="btn-primary w-full">
        {pending && <Loader2 className="h-4 w-4 animate-spin" />}
        Save and continue
      </button>
    </form>
  );
}
