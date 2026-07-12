"use client";

import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Switch } from "@/components/ui/Switch";
import { TimezoneSelect } from "@/components/ui/TimezoneSelect";
import { useToast } from "@/components/ui/Toast";
import type { Organization } from "@/lib/types";

export function SettingsScreen({ org }: { org: Organization }) {
  const router = useRouter();
  const { toast } = useToast();

  const [defaultTimezone, setDefaultTimezone] = useState(org.default_timezone);
  const [eodCutoffTime, setEodCutoffTime] = useState(org.eod_cutoff_time.slice(0, 5));
  const [reminderTime, setReminderTime] = useState(org.reminder_time.slice(0, 5));
  const [lateCounts, setLateCounts] = useState(org.late_counts_for_streaks);
  const [positiveDigest, setPositiveDigest] = useState(org.send_positive_digest);
  const [allowOptout, setAllowOptout] = useState(org.allow_notification_optout);
  const [saving, setSaving] = useState(false);

  async function save(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    const response = await fetch("/api/admin/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        defaultTimezone,
        eodCutoffTime,
        reminderTime,
        lateCountsForStreaks: lateCounts,
        sendPositiveDigest: positiveDigest,
        allowNotificationOptout: allowOptout,
      }),
    });
    setSaving(false);
    if (response.ok) {
      toast("Settings saved");
      router.refresh();
    } else {
      toast("Could not save", "error");
    }
  }

  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-xl font-bold text-ink">Settings</h1>
        <p className="mt-0.5 text-sm text-ink-muted">{org.name} · organization defaults</p>
      </header>

      <form onSubmit={save} className="space-y-5">
        <section className="space-y-4 rounded-card border border-line bg-surface p-5">
          <h2 className="text-sm font-bold text-ink">Times</h2>
          <div>
            <label htmlFor="sTz" className="mb-1.5 block text-sm font-medium text-ink">
              Default timezone
            </label>
            <TimezoneSelect id="sTz" value={defaultTimezone} onChange={setDefaultTimezone} />
            <p className="mt-1 text-xs text-ink-faint">
              Used for new members and the admin digest. Each member&apos;s own timezone
              drives their reminders.
            </p>
          </div>
          <div className="flex gap-3">
            <div className="flex-1">
              <label htmlFor="sReminder" className="mb-1.5 block text-sm font-medium text-ink">
                Reminder time
              </label>
              <input
                id="sReminder"
                type="time"
                value={reminderTime}
                onChange={(e) => setReminderTime(e.target.value)}
                className="input"
              />
            </div>
            <div className="flex-1">
              <label htmlFor="sCutoff" className="mb-1.5 block text-sm font-medium text-ink">
                End-of-day cutoff
              </label>
              <input
                id="sCutoff"
                type="time"
                value={eodCutoffTime}
                onChange={(e) => setEodCutoffTime(e.target.value)}
                className="input"
              />
            </div>
          </div>
        </section>

        <section className="space-y-4 rounded-card border border-line bg-surface p-5">
          <h2 className="text-sm font-bold text-ink">Behavior</h2>
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-ink">Late posts count toward streaks</p>
              <p className="text-xs text-ink-faint">
                If off, a post marked after cutoff breaks the streak for that day
              </p>
            </div>
            <Switch checked={lateCounts} onCheckedChange={setLateCounts} ariaLabel="Late counts for streaks" />
          </div>
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-ink">“All done ✅” digest</p>
              <p className="text-xs text-ink-faint">Send admins the positive digest on clean days</p>
            </div>
            <Switch checked={positiveDigest} onCheckedChange={setPositiveDigest} ariaLabel="Positive digest" />
          </div>
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-ink">Employees may mute missed-post alerts</p>
              <p className="text-xs text-ink-faint">
                If off, the end-of-day accountability notification can&apos;t be disabled
              </p>
            </div>
            <Switch checked={allowOptout} onCheckedChange={setAllowOptout} ariaLabel="Allow notification opt-out" />
          </div>
        </section>

        <button type="submit" disabled={saving} className="btn-primary w-full">
          {saving && <Loader2 className="h-4 w-4 animate-spin" />}
          Save settings
        </button>
      </form>
    </div>
  );
}
