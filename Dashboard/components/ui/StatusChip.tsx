import { cn } from "@/lib/utils";
import type { LogStatus } from "@/lib/types";

const STYLES: Record<LogStatus, string> = {
  pending: "bg-warning/15 text-warning",
  posted: "bg-success/15 text-success",
  missed: "bg-danger/15 text-danger",
  skipped: "bg-ink-faint/15 text-ink-faint",
};

const LABELS: Record<LogStatus, string> = {
  pending: "Pending",
  posted: "Posted",
  missed: "Missed",
  skipped: "Skipped",
};

export function StatusChip({
  status,
  markedLate,
  className,
}: {
  status: LogStatus;
  markedLate?: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
        STYLES[status],
        className,
      )}
    >
      {LABELS[status]}
      {status === "posted" && markedLate ? " · late" : ""}
    </span>
  );
}
