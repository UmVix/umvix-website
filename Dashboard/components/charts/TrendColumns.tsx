export type TrendPoint = {
  date: string; // "yyyy-MM-dd"
  posted: number;
  scheduled: number;
};

/**
 * Daily completion trend — single-series columns in the brand hue (no legend:
 * the title names the series). Columns ≤24px, 4px rounded caps, hairline
 * baseline, native tooltip per column.
 */
export function TrendColumns({ points, title }: { points: TrendPoint[]; title: string }) {
  return (
    <section className="rounded-card border border-line bg-surface p-4">
      <h2 className="mb-4 text-sm font-bold text-ink">{title}</h2>
      <div className="flex h-32 items-end gap-1.5 border-b border-line pb-px">
        {points.map((point) => {
          const pct = point.scheduled > 0 ? point.posted / point.scheduled : 0;
          const day = point.date.slice(8); // "dd"
          return (
            <div
              key={point.date}
              className="group relative flex h-full flex-1 flex-col items-center justify-end"
              title={`${point.date}: ${point.posted}/${point.scheduled} posted`}
            >
              <span
                className="w-full max-w-6 rounded-t-[4px] transition-opacity group-hover:opacity-80"
                style={{
                  height: point.scheduled === 0 ? "2px" : `${Math.max(4, pct * 100)}%`,
                  background:
                    point.scheduled === 0
                      ? "rgb(var(--line))"
                      : "rgb(var(--brand-red))",
                  opacity: point.scheduled === 0 ? 1 : 0.35 + 0.65 * pct,
                }}
              />
              <span className="mt-1.5 text-[10px] tabular-nums text-ink-faint">{day}</span>
            </div>
          );
        })}
      </div>
      <p className="mt-2 text-right text-[10px] text-ink-faint">
        Column height = share of that day&apos;s posts completed
      </p>
    </section>
  );
}
