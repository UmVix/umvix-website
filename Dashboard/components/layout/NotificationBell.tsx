"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { Bell } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { NotificationRow } from "@/lib/types";

/**
 * In-app notification center. Doubles as the fallback channel when the user
 * never granted push permission — every reminder lands here regardless.
 */
export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  const { data } = useQuery({
    queryKey: ["notifications"],
    queryFn: async (): Promise<NotificationRow[]> => {
      const response = await fetch("/api/notifications");
      if (!response.ok) return [];
      const json = (await response.json()) as { notifications: NotificationRow[] };
      return json.notifications;
    },
    refetchInterval: 60_000,
  });

  const notifications = data ?? [];
  const unread = notifications.filter((n) => !n.read_at).length;

  useEffect(() => {
    if (!open) return;
    function onPointerDown(event: PointerEvent) {
      if (!panelRef.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  async function openPanel() {
    setOpen((value) => !value);
    if (!open && unread > 0) {
      await fetch("/api/notifications", { method: "PATCH" });
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    }
  }

  return (
    <div className="relative" ref={panelRef}>
      <button
        onClick={openPanel}
        aria-label={`Notifications${unread ? ` (${unread} unread)` : ""}`}
        className="relative flex h-10 w-10 items-center justify-center rounded-xl text-ink-muted transition hover:bg-surface-raised hover:text-ink"
      >
        <Bell className="h-5 w-5" />
        {unread > 0 && (
          <span className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand-red px-1 text-[10px] font-bold text-white">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-12 z-50 max-h-96 w-80 animate-fade-in overflow-y-auto rounded-card border border-line bg-surface shadow-xl">
          <p className="border-b border-line px-4 py-3 text-sm font-semibold text-ink">
            Notifications
          </p>
          {notifications.length === 0 ? (
            <p className="px-4 py-8 text-center text-sm text-ink-faint">
              Nothing yet — reminders will show up here.
            </p>
          ) : (
            <ul>
              {notifications.map((notification) => (
                <li
                  key={notification.id}
                  className="border-b border-line px-4 py-3 last:border-0"
                >
                  <p className="text-sm font-medium text-ink">
                    {notification.payload.title ?? "Notification"}
                  </p>
                  <p className="mt-0.5 text-sm text-ink-muted">
                    {notification.payload.body}
                  </p>
                  <p className="mt-1 text-xs text-ink-faint">
                    {formatDistanceToNow(new Date(notification.sent_at), { addSuffix: true })}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
