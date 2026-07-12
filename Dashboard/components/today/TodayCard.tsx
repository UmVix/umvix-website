"use client";

import { format } from "date-fns";
import { Check, CloudOff, ExternalLink } from "lucide-react";
import { PlatformLogo } from "@/components/ui/PlatformLogo";
import { StatusChip } from "@/components/ui/StatusChip";
import { cn } from "@/lib/utils";
import type { LogWithPlatform } from "@/lib/types";

export function TodayCard({
  log,
  pastCutoff,
  pendingSync,
  onMark,
}: {
  log: LogWithPlatform;
  pastCutoff: boolean;
  pendingSync: boolean;
  onMark: () => void;
}) {
  const isPosted = log.status === "posted";
  const isMissed = log.status === "missed";

  return (
    <li
      className={cn(
        "flex items-center gap-3 rounded-card border bg-surface p-4 shadow-sm transition",
        isMissed ? "border-danger/40" : "border-line",
      )}
    >
      <PlatformLogo
        name={log.platform.name}
        logoUrl={log.platform.logo_url}
        brandColor={log.platform.brand_color}
        size={44}
      />

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="truncate font-semibold text-ink">{log.platform.name}</p>
          {log.platform.url_template && (
            <a
              href={log.platform.url_template}
              target="_blank"
              rel="noreferrer"
              aria-label={`Open ${log.platform.name}`}
              className="text-ink-faint hover:text-brand-red"
            >
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          )}
        </div>
        <div className="mt-1 flex flex-wrap items-center gap-2">
          <StatusChip status={log.status} markedLate={log.marked_late} />
          {isPosted && log.posted_at && (
            <span className="text-xs text-ink-faint">
              {format(new Date(log.posted_at), "HH:mm")}
            </span>
          )}
          {pendingSync && (
            <span className="inline-flex items-center gap-1 text-xs font-medium text-warning">
              <CloudOff className="h-3 w-3" /> pending sync
            </span>
          )}
        </div>
      </div>

      {isPosted ? (
        <div className="flex h-11 w-11 shrink-0 animate-check-pop items-center justify-center rounded-full bg-success/15">
          <Check className="h-5 w-5 text-success" />
        </div>
      ) : (
        <button
          onClick={onMark}
          className={cn(
            "shrink-0 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition active:scale-[0.97]",
            isMissed
              ? "border border-danger/40 text-danger hover:bg-danger/10"
              : "bg-brand-gradient text-white shadow-[0_6px_18px_rgba(255,31,61,0.3)]",
          )}
        >
          {isMissed ? "Mark late" : pastCutoff ? "Mark late" : "Mark posted"}
        </button>
      )}
    </li>
  );
}
