"use client";

import { Download, Share, X } from "lucide-react";
import { useEffect, useState } from "react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

const DISMISS_KEY = "pp-install-dismissed";

function isIos(): boolean {
  return /iphone|ipad|ipod/i.test(navigator.userAgent);
}

function isStandalone(): boolean {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}

/**
 * Custom install banner: uses `beforeinstallprompt` on Android/desktop and
 * step-by-step instructions on iOS Safari (which has no install API).
 */
export function InstallPrompt() {
  const [installEvent, setInstallEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [showIosSteps, setShowIosSteps] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isStandalone() || localStorage.getItem(DISMISS_KEY)) return;

    if (isIos()) {
      setVisible(true);
      return;
    }
    const onPrompt = (event: Event) => {
      event.preventDefault();
      setInstallEvent(event as BeforeInstallPromptEvent);
      setVisible(true);
    };
    window.addEventListener("beforeinstallprompt", onPrompt);
    return () => window.removeEventListener("beforeinstallprompt", onPrompt);
  }, []);

  function dismiss() {
    localStorage.setItem(DISMISS_KEY, "1");
    setVisible(false);
    setShowIosSteps(false);
  }

  async function install() {
    if (installEvent) {
      await installEvent.prompt();
      const choice = await installEvent.userChoice;
      if (choice.outcome === "accepted") setVisible(false);
    } else {
      setShowIosSteps(true);
    }
  }

  if (!visible) return null;

  return (
    <>
      <div className="fixed inset-x-4 bottom-20 z-50 mx-auto max-w-md animate-slide-up rounded-card border border-line bg-surface p-4 shadow-xl md:bottom-6">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-red/10">
            <Download className="h-5 w-5 text-brand-red" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-ink">Install PostPilot</p>
            <p className="mt-0.5 text-xs text-ink-muted">
              Add it to your home screen for one-tap access and reminders.
            </p>
            <div className="mt-3 flex gap-2">
              <button onClick={install} className="btn-primary min-h-9 px-3 py-1.5 text-xs">
                Install app
              </button>
              <button onClick={dismiss} className="btn-ghost min-h-9 px-3 py-1.5 text-xs">
                Not now
              </button>
            </div>
          </div>
          <button onClick={dismiss} aria-label="Dismiss" className="text-ink-faint">
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {showIosSteps && (
        <div
          className="fixed inset-0 z-[60] flex items-end justify-center bg-black/50 md:items-center"
          onClick={dismiss}
        >
          <div
            className="w-full max-w-md animate-slide-up rounded-t-card border border-line bg-surface p-6 md:rounded-card"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-base font-bold text-ink">Install on iPhone</h2>
            <ol className="mt-4 space-y-3 text-sm text-ink-muted">
              <li className="flex items-center gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-red/10 text-xs font-bold text-brand-red">1</span>
                Tap the <Share className="inline h-4 w-4 text-brand-red" /> Share button in Safari
              </li>
              <li className="flex items-center gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-red/10 text-xs font-bold text-brand-red">2</span>
                Scroll down and tap “Add to Home Screen”
              </li>
              <li className="flex items-center gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-red/10 text-xs font-bold text-brand-red">3</span>
                Open PostPilot from your home screen
              </li>
            </ol>
            <p className="mt-4 rounded-xl bg-surface-sunken p-3 text-xs text-ink-faint">
              Push notifications need iOS 16.4+ and the app installed to the home
              screen.
            </p>
            <button onClick={dismiss} className="btn-secondary mt-4 w-full">
              Got it
            </button>
          </div>
        </div>
      )}
    </>
  );
}
