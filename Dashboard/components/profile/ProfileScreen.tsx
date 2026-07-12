"use client";

import { BellOff, BellRing, Camera, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Switch } from "@/components/ui/Switch";
import { TimezoneSelect } from "@/components/ui/TimezoneSelect";
import { useToast } from "@/components/ui/Toast";
import { disablePush, enablePush, pushStatus } from "@/lib/pushClient";
import { createClient } from "@/lib/supabase/client";
import { initials } from "@/lib/utils";
import type { Profile } from "@/lib/types";

export function ProfileScreen({
  profile,
  email,
  orgReminderTime,
  allowOptout,
}: {
  profile: Profile;
  email: string;
  orgReminderTime: string;
  allowOptout: boolean;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [fullName, setFullName] = useState(profile.full_name);
  const [timezone, setTimezone] = useState(profile.timezone);
  const [avatarUrl, setAvatarUrl] = useState(profile.avatar_url);
  const [reminderTime, setReminderTime] = useState(
    profile.notification_prefs.reminder_time ?? orgReminderTime,
  );
  const [middayEnabled, setMiddayEnabled] = useState(
    profile.notification_prefs.midday_enabled !== false,
  );
  const [eodEnabled, setEodEnabled] = useState(
    profile.notification_prefs.eod_enabled !== false,
  );
  const [saving, setSaving] = useState(false);
  const [push, setPush] = useState<ReturnType<typeof pushStatus>>("unsupported");
  const [pushBusy, setPushBusy] = useState(false);

  useEffect(() => setPush(pushStatus()), []);

  async function uploadAvatar(file: File) {
    if (file.size > 2 * 1024 * 1024) {
      toast("Image too large — keep it under 2 MB", "error");
      return;
    }
    const supabase = createClient();
    const path = `${profile.id}/avatar-${Date.now()}`;
    const { error } = await supabase.storage.from("avatars").upload(path, file, { upsert: true });
    if (error) {
      toast("Upload failed", "error");
      return;
    }
    const { data } = supabase.storage.from("avatars").getPublicUrl(path);
    setAvatarUrl(data.publicUrl);
    await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ avatarUrl: data.publicUrl }),
    });
    toast("Avatar updated");
    router.refresh();
  }

  async function save() {
    setSaving(true);
    const response = await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fullName,
        timezone,
        notificationPrefs: {
          reminder_time: reminderTime,
          midday_enabled: middayEnabled,
          eod_enabled: eodEnabled,
        },
      }),
    });
    setSaving(false);
    if (response.ok) {
      toast("Profile saved");
      router.refresh();
    } else {
      const body = (await response.json().catch(() => null)) as { error?: string } | null;
      toast(body?.error ?? "Could not save", "error");
    }
  }

  async function togglePush() {
    setPushBusy(true);
    if (push === "enabled") {
      await disablePush();
      setPush(pushStatus() === "enabled" ? "default" : pushStatus());
      toast("Push disabled on this device");
    } else {
      const result = await enablePush();
      if (result.ok) toast("Push enabled 🔔");
      else if (result.reason === "denied")
        toast("Blocked by the browser — allow notifications in settings", "error");
      else toast("Could not enable push", "error");
      setPush(pushStatus());
    }
    setPushBusy(false);
  }

  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-xl font-bold text-ink">Profile</h1>
        <p className="mt-0.5 text-sm text-ink-muted">{email}</p>
      </header>

      {/* ── Avatar + identity ── */}
      <section className="rounded-card border border-line bg-surface p-5">
        <div className="mb-5 flex items-center gap-4">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="group relative h-16 w-16 overflow-hidden rounded-full bg-brand-gradient"
            aria-label="Change avatar"
          >
            {avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={avatarUrl} alt="" className="h-full w-full object-cover" />
            ) : (
              <span className="flex h-full w-full items-center justify-center text-xl font-bold text-white">
                {initials(fullName)}
              </span>
            )}
            <span className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition group-hover:opacity-100">
              <Camera className="h-5 w-5 text-white" />
            </span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            hidden
            onChange={(e) => e.target.files?.[0] && uploadAvatar(e.target.files[0])}
          />
          <div>
            <p className="font-semibold text-ink">{fullName}</p>
            <p className="text-xs capitalize text-ink-faint">{profile.role}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label htmlFor="fullName" className="mb-1.5 block text-sm font-medium text-ink">
              Name
            </label>
            <input
              id="fullName"
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
            <p className="mt-1 text-xs text-ink-faint">
              Your “today”, reminders and cutoff all follow this timezone.
            </p>
          </div>
        </div>
      </section>

      {/* ── Notifications ── */}
      <section className="rounded-card border border-line bg-surface p-5">
        <h2 className="mb-4 text-sm font-bold text-ink">Notifications</h2>

        <div className="mb-4 flex items-center justify-between gap-4 rounded-xl bg-surface-sunken p-3">
          <div className="flex items-center gap-3">
            {push === "enabled" ? (
              <BellRing className="h-5 w-5 text-brand-red" />
            ) : (
              <BellOff className="h-5 w-5 text-ink-faint" />
            )}
            <div>
              <p className="text-sm font-medium text-ink">Push on this device</p>
              <p className="text-xs text-ink-faint">
                {push === "enabled"
                  ? "Enabled"
                  : push === "denied"
                    ? "Blocked in browser settings"
                    : push === "unsupported"
                      ? "Not supported here — the bell still shows everything"
                      : "Off"}
              </p>
            </div>
          </div>
          {(push === "enabled" || push === "default") && (
            <button onClick={togglePush} disabled={pushBusy} className="btn-secondary min-h-9 px-3 py-1.5 text-xs">
              {pushBusy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : push === "enabled" ? "Disable" : "Enable"}
            </button>
          )}
        </div>

        <div className="space-y-4">
          <div>
            <label htmlFor="reminderTime" className="mb-1.5 block text-sm font-medium text-ink">
              Daily reminder time
            </label>
            <input
              id="reminderTime"
              type="time"
              value={reminderTime}
              onChange={(e) => setReminderTime(e.target.value)}
              className="input"
            />
          </div>
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-ink">Midday reminder</p>
              <p className="text-xs text-ink-faint">A nudge when platforms are still unposted</p>
            </div>
            <Switch checked={middayEnabled} onCheckedChange={setMiddayEnabled} ariaLabel="Midday reminder" />
          </div>
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-ink">End-of-day summary</p>
              <p className="text-xs text-ink-faint">
                {allowOptout ? "What you missed today" : "Required by your organization"}
              </p>
            </div>
            <Switch
              checked={eodEnabled}
              onCheckedChange={setEodEnabled}
              disabled={!allowOptout}
              ariaLabel="End-of-day summary"
            />
          </div>
        </div>
      </section>

      <button onClick={save} disabled={saving} className="btn-primary w-full">
        {saving && <Loader2 className="h-4 w-4 animate-spin" />}
        Save changes
      </button>

      <ChangePasswordSection />
    </div>
  );
}

function ChangePasswordSection() {
  const { toast } = useToast();
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  async function change(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    const { error } = await createClient().auth.updateUser({ password });
    setBusy(false);
    if (error) {
      toast(error.message, "error");
    } else {
      toast("Password changed");
      setPassword("");
    }
  }

  return (
    <section className="rounded-card border border-line bg-surface p-5">
      <h2 className="mb-4 text-sm font-bold text-ink">Change password</h2>
      <form onSubmit={change} className="flex gap-2">
        <input
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input flex-1"
          placeholder="New password (min 8 chars)"
          aria-label="New password"
        />
        <button type="submit" disabled={busy} className="btn-secondary shrink-0 px-4">
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : "Update"}
        </button>
      </form>
    </section>
  );
}
