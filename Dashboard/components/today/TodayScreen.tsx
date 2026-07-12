"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { PartyPopper, Send } from "lucide-react";
import { useEffect, useState } from "react";
import { EmptyState } from "@/components/ui/EmptyState";
import { useToast } from "@/components/ui/Toast";
import { flushOutbox, pendingOutboxIds, queueMarkPosted } from "@/lib/offline/outbox";
import type { LogWithPlatform } from "@/lib/types";
import { MarkPostedSheet } from "./MarkPostedSheet";
import { ProgressRing } from "./ProgressRing";
import { PushPermissionCard } from "./PushPermissionCard";
import { TodayCard } from "./TodayCard";

type TodayResponse = {
  date: string;
  pastCutoff: boolean;
  cutoff: string;
  logs: LogWithPlatform[];
};

export function TodayScreen() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [selected, setSelected] = useState<LogWithPlatform | null>(null);
  const [queuedIds, setQueuedIds] = useState<Set<string>>(new Set());

  const { data, isLoading } = useQuery({
    queryKey: ["today"],
    queryFn: async (): Promise<TodayResponse> => {
      const response = await fetch("/api/today");
      if (!response.ok) throw new Error("Failed to load");
      return response.json();
    },
  });

  useEffect(() => {
    void pendingOutboxIds().then(setQueuedIds);
  }, [data]);

  const markPosted = useMutation({
    mutationFn: async (input: { logId: string; postUrl?: string; note?: string }) => {
      if (!navigator.onLine) {
        await queueMarkPosted({ id: input.logId, ...input });
        return { queued: true as const };
      }
      const response = await fetch("/api/logs/mark-posted", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      if (!response.ok) {
        const body = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(body?.error ?? "Could not mark as posted");
      }
      return { queued: false as const };
    },
    // Optimistic flip with rollback on failure.
    onMutate: async (input) => {
      await queryClient.cancelQueries({ queryKey: ["today"] });
      const previous = queryClient.getQueryData<TodayResponse>(["today"]);
      queryClient.setQueryData<TodayResponse>(["today"], (current) =>
        current
          ? {
              ...current,
              logs: current.logs.map((log) =>
                log.id === input.logId
                  ? {
                      ...log,
                      status: "posted",
                      posted_at: new Date().toISOString(),
                      marked_late: log.status === "missed" || current.pastCutoff,
                    }
                  : log,
              ),
            }
          : current,
      );
      return { previous };
    },
    onError: (error, _input, context) => {
      if (context?.previous) queryClient.setQueryData(["today"], context.previous);
      toast(error.message, "error");
    },
    onSuccess: async (result) => {
      setSelected(null);
      if (result.queued) {
        setQueuedIds(await pendingOutboxIds());
        toast("Saved — will sync when you're back online");
      } else {
        toast("Marked as posted 🎉");
      }
      queryClient.invalidateQueries({ queryKey: ["today"] });
    },
  });

  // When we come back online, flush and refresh.
  useEffect(() => {
    async function onOnline() {
      const flushed = await flushOutbox();
      if (flushed > 0) {
        setQueuedIds(await pendingOutboxIds());
        queryClient.invalidateQueries({ queryKey: ["today"] });
        toast(`Synced ${flushed} queued post${flushed === 1 ? "" : "s"}`);
      }
    }
    window.addEventListener("online", onOnline);
    return () => window.removeEventListener("online", onOnline);
  }, [queryClient, toast]);

  const logs = data?.logs ?? [];
  const posted = logs.filter((log) => log.status === "posted").length;

  return (
    <div className="space-y-5">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-ink">Today</h1>
          <p className="mt-0.5 text-sm text-ink-muted">
            {data ? format(new Date(`${data.date}T00:00:00`), "EEEE, d MMMM") : " "}
          </p>
        </div>
        <ProgressRing total={logs.length} done={posted} />
      </header>

      <PushPermissionCard />

      {isLoading ? (
        <div className="space-y-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="skeleton h-[76px] w-full" />
          ))}
        </div>
      ) : logs.length === 0 ? (
        <EmptyState
          icon={Send}
          title="Nothing scheduled today"
          body="No platforms assigned for today — ask your admin, or enjoy the day off."
        />
      ) : (
        <>
          {posted === logs.length && (
            <div className="flex items-center gap-3 rounded-card border border-success/25 bg-success/10 p-4">
              <PartyPopper className="h-5 w-5 shrink-0 text-success" />
              <p className="text-sm font-medium text-ink">
                All done for today — every platform is posted. 🔥
              </p>
            </div>
          )}
          <ul className="grid gap-3 lg:grid-cols-2">
            {logs.map((log) => (
              <TodayCard
                key={log.id}
                log={log}
                pastCutoff={data?.pastCutoff ?? false}
                pendingSync={queuedIds.has(log.id)}
                onMark={() => setSelected(log)}
              />
            ))}
          </ul>
          {data?.pastCutoff && logs.some((log) => log.status === "missed") && (
            <p className="text-center text-xs text-ink-faint">
              Past the {data.cutoff} cutoff — late posts are recorded but flagged.
            </p>
          )}
        </>
      )}

      <MarkPostedSheet
        log={selected}
        onClose={() => setSelected(null)}
        onSubmit={(input) => markPosted.mutate(input)}
        submitting={markPosted.isPending}
      />
    </div>
  );
}
