"use client";

import { CloudOff } from "lucide-react";
import { useSyncExternalStore } from "react";

function subscribe(callback: () => void) {
  window.addEventListener("online", callback);
  window.addEventListener("offline", callback);
  return () => {
    window.removeEventListener("online", callback);
    window.removeEventListener("offline", callback);
  };
}

export function OfflineBanner() {
  const online = useSyncExternalStore(
    subscribe,
    () => navigator.onLine,
    () => true,
  );

  if (online) return null;
  return (
    <div className="flex items-center justify-center gap-2 bg-warning/15 px-4 py-2 text-xs font-medium text-warning">
      <CloudOff className="h-3.5 w-3.5" />
      You&apos;re offline — actions will sync when you reconnect.
    </div>
  );
}
