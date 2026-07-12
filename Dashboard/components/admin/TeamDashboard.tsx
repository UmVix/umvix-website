"use client";

import { Check, Clock, Flame, Minus, Users, X } from "lucide-react";
import { useState } from "react";
import { PlatformBars, type PlatformBarRow } from "@/components/charts/PlatformBars";
import { TrendColumns, type TrendPoint } from "@/components/charts/TrendColumns";
import { PlatformLogo } from "@/components/ui/PlatformLogo";
import { cn, initials } from "@/lib/utils";
import type { LogStatus, Role } from "@/lib/types";

type Cell = { status: LogStatus | null; markedLate: boolean };

export type TeamMemberRow = {
  id: string;
  name: string;
  avatarUrl: string | null;
  role: Role;
  streak: number;
  weekCompliance: number | null;
  cells: Cell[];
};

type PlatformCol = { id: string; name: string; logoUrl: string | null; brandColor: string };

function CellBadge({ cell }: { cell: Cell }) {
  if (cell.status === null)
    return <Minus className="h-4 w-4 text-ink-faint/50" aria-label="Not scheduled" />;
  if (cell.status === "posted")
    return (
      <span
        className={cn(
          "flex h-7 w-7 items-center justify-center rounded-full",
          cell.markedLate ? "bg-warning/15" : "bg-success/15",
        )}
        aria-label={cell.markedLate ? "Posted late" : "Posted"}
      >
        <Check className={cn("h-4 w-4", cell.markedLate ? "text-warning" : "text-success")} />
      </span>
    );
  if (cell.status === "missed")
    return (
      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-danger/15" aria-label="Missed">
        <X className="h-4 w-4 text-danger" />
      </span>
    );
  return (
    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-warning/10" aria-label="Pending">
      <Clock className="h-4 w-4 text-warning" />
    </span>
  );
}

export function TeamDashboard({
  platforms,
  rows,
  stats,
  trend,
  platformBars,
}: {
  platforms: PlatformCol[];
  rows: TeamMemberRow[];
  stats: {
    todayDone: number;
    todayTotal: number;
    weekRate: number | null;
    weekMissed: number;
    members: number;
  };
  trend: TrendPoint[];
  platformBars: PlatformBarRow[];
}) {
  const [memberFilter, setMemberFilter] = useState("all");
  const [platformFilter, setPlatformFilter] = useState("all");

  const visibleRows = rows.filter((row) => memberFilter === "all" || row.id === memberFilter);
  const visiblePlatformIdx = platforms
    .map((platform, index) => ({ platform, index }))
    .filter(({ platform }) => platformFilter === "all" || platform.id === platformFilter);

  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-xl font-bold text-ink">Dashboard</h1>
        <p className="mt-0.5 text-sm text-ink-muted">The whole team at a glance</p>
      </header>

      {/* ── Summary stats ── */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-card border border-line bg-surface p-3.5">
          <p className="text-xs font-medium text-ink-faint">Today</p>
          <p className="mt-1 text-xl font-bold text-ink">
            {stats.todayDone}
            <span className="text-sm font-medium text-ink-faint">/{stats.todayTotal}</span>
          </p>
        </div>
        <div className="rounded-card border border-line bg-surface p-3.5">
          <p className="text-xs font-medium text-ink-faint">This week</p>
          <p className="mt-1 text-xl font-bold text-ink">
            {stats.weekRate === null ? "—" : `${stats.weekRate}%`}
          </p>
        </div>
        <div className="rounded-card border border-line bg-surface p-3.5">
          <p className="text-xs font-medium text-ink-faint">Missed (7d)</p>
          <p className={cn("mt-1 text-xl font-bold", stats.weekMissed > 0 ? "text-danger" : "text-ink")}>
            {stats.weekMissed}
          </p>
        </div>
        <div className="rounded-card border border-line bg-surface p-3.5">
          <p className="flex items-center gap-1 text-xs font-medium text-ink-faint">
            <Users className="h-3 w-3" /> Team
          </p>
          <p className="mt-1 text-xl font-bold text-ink">{stats.members}</p>
        </div>
      </div>

      {/* ── Charts row: trend + team workload ── */}
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <TrendColumns points={trend} title="Completion — last 14 days" />
        </div>

        {/* Team workload — 7d compliance per member */}
        <section className="rounded-card border border-line bg-surface p-4">
          <h2 className="mb-4 text-sm font-bold text-ink">Team — last 7 days</h2>
          <div className="space-y-4">
            {rows.map((row) => {
              const pct = row.weekCompliance;
              const barColor =
                pct === null
                  ? "rgb(var(--line))"
                  : pct >= 80
                    ? "rgb(var(--chart-posted))"
                    : pct >= 50
                      ? "rgb(var(--warning))"
                      : "rgb(var(--chart-missed))";
              return (
                <div key={row.id} className="flex items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-brand-gradient text-[11px] font-bold text-white">
                    {row.avatarUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={row.avatarUrl} alt="" className="h-full w-full object-cover" />
                    ) : (
                      initials(row.name)
                    )}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="truncate text-sm font-medium text-ink">{row.name}</p>
                      <p className="text-xs font-semibold tabular-nums text-ink-muted">
                        {pct === null ? "—" : `${pct}%`}
                      </p>
                    </div>
                    <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-surface-sunken">
                      <div
                        className="h-full rounded-full transition-[width] duration-500"
                        style={{ width: `${pct ?? 0}%`, background: barColor }}
                      />
                    </div>
                    {row.streak > 0 && (
                      <p className="mt-1 flex items-center gap-1 text-[11px] text-brand-red">
                        <Flame className="h-3 w-3" /> {row.streak} days without a miss
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
            {rows.length === 0 && (
              <p className="text-sm text-ink-faint">No team members yet.</p>
            )}
          </div>
        </section>
      </div>

      {/* ── Platform breakdown + today grid ── */}
      <div className="grid gap-4 lg:grid-cols-3">
        {platformBars.length > 0 && (
          <div className="lg:order-2">
            <PlatformBars rows={platformBars} title="By platform (14 days)" />
          </div>
        )}
        <div className="space-y-3 lg:order-1 lg:col-span-2">
          {/* ── Filters ── */}
          <div className="flex gap-2">
            <select
              value={memberFilter}
              onChange={(e) => setMemberFilter(e.target.value)}
              className="input h-10 flex-1 py-0 text-sm"
              aria-label="Filter by employee"
            >
              <option value="all">All employees</option>
              {rows.map((row) => (
                <option key={row.id} value={row.id}>
                  {row.name}
                </option>
              ))}
            </select>
            <select
              value={platformFilter}
              onChange={(e) => setPlatformFilter(e.target.value)}
              className="input h-10 flex-1 py-0 text-sm"
              aria-label="Filter by platform"
            >
              <option value="all">All platforms</option>
              {platforms.map((platform) => (
                <option key={platform.id} value={platform.id}>
                  {platform.name}
                </option>
              ))}
            </select>
          </div>

          {/* ── Today grid ── */}
          <div className="overflow-x-auto rounded-card border border-line bg-surface">
        <table className="w-full min-w-[520px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-line">
              <th className="px-4 py-3 text-left text-xs font-semibold text-ink-faint">Member</th>
              {visiblePlatformIdx.map(({ platform }) => (
                <th key={platform.id} className="px-2 py-3">
                  <div className="flex justify-center" title={platform.name}>
                    <PlatformLogo
                      name={platform.name}
                      logoUrl={platform.logoUrl}
                      brandColor={platform.brandColor}
                      size={26}
                    />
                  </div>
                </th>
              ))}
              <th className="px-3 py-3 text-right text-xs font-semibold text-ink-faint">7d</th>
            </tr>
          </thead>
          <tbody>
            {visibleRows.map((row) => (
              <tr key={row.id} className="border-b border-line last:border-0">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-brand-gradient text-[11px] font-bold text-white">
                      {row.avatarUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={row.avatarUrl} alt="" className="h-full w-full object-cover" />
                      ) : (
                        initials(row.name)
                      )}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate font-medium text-ink">{row.name}</p>
                      {row.streak > 0 && (
                        <p className="flex items-center gap-1 text-xs text-brand-red">
                          <Flame className="h-3 w-3" /> {row.streak}-day streak
                        </p>
                      )}
                    </div>
                  </div>
                </td>
                {visiblePlatformIdx.map(({ platform, index }) => (
                  <td key={platform.id} className="px-2 py-3">
                    <div className="flex justify-center">
                      <CellBadge cell={row.cells[index]} />
                    </div>
                  </td>
                ))}
                <td className="px-3 py-3 text-right text-xs font-semibold text-ink-muted">
                  {row.weekCompliance === null ? "—" : `${row.weekCompliance}%`}
                </td>
              </tr>
            ))}
          </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
