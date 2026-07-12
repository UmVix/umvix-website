import { PlatformLogo } from "@/components/ui/PlatformLogo";
import { PostedMissedLegend } from "./ChartLegend";

export type PlatformBarRow = {
  id: string;
  name: string;
  logoUrl: string | null;
  brandColor: string;
  posted: number;
  missed: number;
};

/**
 * Per-platform posted/missed — horizontal stacked bars.
 * Marks ≤24px thick, 4px rounded data-end, 2px surface gap between segments,
 * counts direct-labeled at the bar end, legend on top (2 series).
 */
export function PlatformBars({ rows, title }: { rows: PlatformBarRow[]; title: string }) {
  const max = Math.max(1, ...rows.map((row) => row.posted + row.missed));

  return (
    <section className="rounded-card border border-line bg-surface p-4">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-sm font-bold text-ink">{title}</h2>
        <PostedMissedLegend />
      </div>
      <div className="space-y-3">
        {rows.map((row) => {
          const total = row.posted + row.missed;
          const postedPct = (row.posted / max) * 100;
          const missedPct = (row.missed / max) * 100;
          return (
            <div key={row.id} className="flex items-center gap-3">
              <div className="flex w-28 shrink-0 items-center gap-2 sm:w-36">
                <PlatformLogo
                  name={row.name}
                  logoUrl={row.logoUrl}
                  brandColor={row.brandColor}
                  size={22}
                />
                <span className="truncate text-xs font-medium text-ink">{row.name}</span>
              </div>
              <div
                className="flex h-4 flex-1 items-center"
                title={`${row.name}: ${row.posted} posted, ${row.missed} missed`}
              >
                {row.posted > 0 && (
                  <span
                    className="h-4 rounded-r-[4px]"
                    style={{
                      width: `${postedPct}%`,
                      background: "rgb(var(--chart-posted))",
                      borderRadius: row.missed > 0 ? "0" : "0 4px 4px 0",
                    }}
                  />
                )}
                {row.posted > 0 && row.missed > 0 && (
                  <span className="h-4 w-0.5 shrink-0 bg-surface" />
                )}
                {row.missed > 0 && (
                  <span
                    className="h-4 rounded-r-[4px]"
                    style={{ width: `${missedPct}%`, background: "rgb(var(--chart-missed))" }}
                  />
                )}
                <span className="ml-2 text-xs tabular-nums text-ink-muted">
                  {total > 0 ? `${row.posted}/${total}` : "—"}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
