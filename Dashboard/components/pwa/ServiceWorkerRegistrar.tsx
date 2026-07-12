"use client";

import { useEffect } from "react";
import { flushOutbox } from "@/lib/offline/outbox";

/** Registers the service worker and flushes queued offline actions on reconnect. */
export function ServiceWorkerRegistrar() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;
    navigator.serviceWorker.register("/sw.js", { scope: "/" }).catch(() => {
      // Registration failing (e.g. private browsing) must never break the app.
    });

    const onOnline = () => void flushOutbox();
    window.addEventListener("online", onOnline);
    // Also flush on load in case the app was closed while offline.
    void flushOutbox();
    return () => window.removeEventListener("online", onOnline);
  }, []);

  return null;
}
