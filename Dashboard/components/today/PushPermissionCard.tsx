"use client";

import { BellRing, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/Toast";
import { enablePush } from "@/lib/pushClient";

const DISMISS_KEY = "pp-push-dismissed";

/**
 * Friendly explainer shown before ever requesting notification permission —
 * the browser prompt only fires after the user taps "Enable reminders".
 */
export function PushPermissionCard() {
  const { toast } = useToast();
  const [visible, setVisible] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const supported = "Notification" in window && "serviceWorker" in navigator && "PushManager" in window;
    if (!supported) return;
    if (Notification.permission !== "default") return;
    if (localStorage.getItem(DISMISS_KEY)) return;
    setVisible(true);
  }, []);

  async function enable() {
    setBusy(true);
    const result = await enablePush();
    setBusy(false);
    if (result.ok) {
      setVisible(false);
      toast("Reminders enabled 🔔");
    } else if (result.reason === "denied") {
      setVisible(false);
      toast("Notifications blocked — reminders will show in the bell instead", "error");
    } else {
      toast("Could not enable reminders. Try again.", "error");
    }
  }

  function dismiss() {
    localStorage.setItem(DISMISS_KEY, "1");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="flex items-start gap-3 rounded-card border border-line bg-surface p-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-red/10">
        <BellRing className="h-5 w-5 text-brand-red" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-ink">Never miss a posting day</p>
        <p className="mt-0.5 text-xs text-ink-muted">
          Get a nudge during the day if something&apos;s still unposted. No spam — only
          your own checklist.
        </p>
        <div className="mt-3 flex gap-2">
          <button onClick={enable} disabled={busy} className="btn-primary min-h-9 px-3 py-1.5 text-xs">
            Enable reminders
          </button>
          <button onClick={dismiss} className="btn-ghost min-h-9 px-3 py-1.5 text-xs">
            Maybe later
          </button>
        </div>
      </div>
      <button onClick={dismiss} aria-label="Dismiss" className="text-ink-faint">
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
