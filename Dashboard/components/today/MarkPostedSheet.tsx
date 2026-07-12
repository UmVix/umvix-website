"use client";

import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { PlatformLogo } from "@/components/ui/PlatformLogo";
import { Sheet } from "@/components/ui/Sheet";
import type { LogWithPlatform } from "@/lib/types";

export function MarkPostedSheet({
  log,
  onClose,
  onSubmit,
  submitting,
}: {
  log: LogWithPlatform | null;
  onClose: () => void;
  onSubmit: (input: { logId: string; postUrl?: string; note?: string }) => void;
  submitting: boolean;
}) {
  const [postUrl, setPostUrl] = useState("");
  const [note, setNote] = useState("");

  useEffect(() => {
    if (log) {
      setPostUrl("");
      setNote("");
    }
  }, [log]);

  if (!log) return null;

  return (
    <Sheet open={!!log} onOpenChange={(open) => !open && onClose()} title="Mark as posted">
      <div className="mb-4 flex items-center gap-3">
        <PlatformLogo
          name={log.platform.name}
          logoUrl={log.platform.logo_url}
          brandColor={log.platform.brand_color}
          size={40}
        />
        <div>
          <p className="font-semibold text-ink">{log.platform.name}</p>
          <p className="text-xs text-ink-muted">
            {log.status === "missed"
              ? "Marking late — it stays flagged for today's stats."
              : "Nice one! Add the link if you have it."}
          </p>
        </div>
      </div>

      <form
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit({
            logId: log.id,
            postUrl: postUrl.trim() || undefined,
            note: note.trim() || undefined,
          });
        }}
        className="space-y-4"
      >
        <div>
          <label htmlFor="postUrl" className="mb-1.5 block text-sm font-medium text-ink">
            Post URL <span className="font-normal text-ink-faint">(optional)</span>
          </label>
          <input
            id="postUrl"
            type="url"
            inputMode="url"
            value={postUrl}
            onChange={(e) => setPostUrl(e.target.value)}
            className="input"
            placeholder="https://…"
          />
        </div>
        <div>
          <label htmlFor="note" className="mb-1.5 block text-sm font-medium text-ink">
            Note <span className="font-normal text-ink-faint">(optional)</span>
          </label>
          <textarea
            id="note"
            rows={2}
            maxLength={500}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="input resize-none"
            placeholder="Anything worth remembering about this post"
          />
        </div>
        <button type="submit" disabled={submitting} className="btn-primary w-full">
          {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
          Mark as posted
        </button>
      </form>
    </Sheet>
  );
}
