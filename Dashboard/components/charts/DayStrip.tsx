import { cn } from "@/lib/utils";

export type DayCell = {
  date: string;
  /** null = nothing scheduled that day. */
  state: "complete" | "partial" | "missed" | "pending" | null;
};

const STATE_LABEL: Record<NonNullable<DayCell["state"]>, string> = {
  complete: "all posted",
  partial: "partly posted",
  missed: "missed",
  pending: "in progress",
};

/**
 * Activity strip — one cell per day, most recent last. State is also in the
 * tooltip and the legend below, so it never rides on color alone.
 */
export function DayStrip({ cells, title }: { cells: DayCell[]; title: string }) {
  return (
    <section className="rounded-card border border-line bg-surface p-4">
      <h2 className="mb-3 text-sm font-bold text-ink">{title}</h2>
      <div className="grid grid-cols-[repeat(15,1fr)] gap-1">
        {cells.map((cell) => (
          <span
            key={cell.date}
            title={`${cell.date}${cell.state ? ` — ${STATE_LABEL[cell.state]}` : ""}`}
            className={cn(
              "aspect-square rounded-[3px]",
              cell.state === null && "bg-surface-sunken",
              cell.state === "pending" && "border border-warning bg-warning/20",
            )}
            style={
              cell.state === "complete"
                ? { background: "rgb(var(--chart-posted))" }
                : cell.state === "partial"
                  ? { background: "rgb(var(--chart-posted) / 0.35)" }
                  : cell.state === "missed"
                    ? { background: "rgb(var(--chart-missed))" }
                    : undefined
            }
          />
        ))}
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-ink-muted">
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-[3px]" style={{ background: "rgb(var(--chart-posted))" }} />
          All posted
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-[3px]" style={{ background: "rgb(var(--chart-posted) / 0.35)" }} />
          Partial
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-[3px]" style={{ background: "rgb(var(--chart-missed))" }} />
          Missed
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-[3px] border border-warning bg-warning/20" />
          Today
        </span>
      </div>
    </section>
  );
}
