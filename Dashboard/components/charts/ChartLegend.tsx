/** Two-series legend for the posted/missed charts (identity never color-alone). */
export function PostedMissedLegend() {
  return (
    <div className="flex items-center gap-4 text-xs text-ink-muted">
      <span className="flex items-center gap-1.5">
        <span className="h-2.5 w-2.5 rounded-sm" style={{ background: "rgb(var(--chart-posted))" }} />
        Posted
      </span>
      <span className="flex items-center gap-1.5">
        <span className="h-2.5 w-2.5 rounded-sm" style={{ background: "rgb(var(--chart-missed))" }} />
        Missed
      </span>
    </div>
  );
}
