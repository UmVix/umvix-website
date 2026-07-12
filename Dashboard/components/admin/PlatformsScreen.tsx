"use client";

import { Archive, ArchiveRestore, GripVertical, Pencil, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { PlatformLogo } from "@/components/ui/PlatformLogo";
import { useToast } from "@/components/ui/Toast";
import { cn } from "@/lib/utils";
import type { Platform } from "@/lib/types";
import { PlatformSheet } from "./PlatformSheet";

export function PlatformsScreen({ platforms }: { platforms: Platform[] }) {
  const router = useRouter();
  const { toast } = useToast();
  const [editing, setEditing] = useState<Platform | null>(null);
  const [creating, setCreating] = useState(false);
  const [order, setOrder] = useState(platforms.map((p) => p.id));
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  const active = order
    .map((id) => platforms.find((p) => p.id === id))
    .filter((p): p is Platform => !!p && p.is_active);
  const archived = platforms.filter((p) => !p.is_active);

  async function persistOrder(nextOrder: string[]) {
    setOrder(nextOrder);
    const response = await fetch("/api/admin/platforms", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ order: nextOrder }),
    });
    if (!response.ok) {
      toast("Could not save the new order", "error");
      setOrder(platforms.map((p) => p.id));
    } else {
      router.refresh();
    }
  }

  function moveTo(from: number, to: number) {
    if (from === to) return;
    const activeIds = active.map((p) => p.id);
    const [moved] = activeIds.splice(from, 1);
    activeIds.splice(to, 0, moved);
    void persistOrder([...activeIds, ...archived.map((p) => p.id)]);
  }

  async function toggleArchive(platform: Platform) {
    const response = await fetch(`/api/admin/platforms/${platform.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !platform.is_active }),
    });
    if (response.ok) {
      toast(platform.is_active ? "Platform archived — history kept" : "Platform restored");
      router.refresh();
    } else {
      toast("Could not update", "error");
    }
  }

  return (
    <div className="space-y-5">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-ink">Platforms</h1>
          <p className="mt-0.5 text-sm text-ink-muted">Drag to reorder</p>
        </div>
        <button onClick={() => setCreating(true)} className="btn-primary min-h-10 px-3.5 text-sm">
          <Plus className="h-4 w-4" /> New
        </button>
      </header>

      <ul className="space-y-2">
        {active.map((platform, index) => (
          <li
            key={platform.id}
            draggable
            onDragStart={() => setDragIndex(index)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => {
              if (dragIndex !== null) moveTo(dragIndex, index);
              setDragIndex(null);
            }}
            className={cn(
              "flex items-center gap-3 rounded-card border border-line bg-surface p-3.5",
              dragIndex === index && "opacity-50",
            )}
          >
            <GripVertical className="h-4 w-4 shrink-0 cursor-grab text-ink-faint" />
            <PlatformLogo
              name={platform.name}
              logoUrl={platform.logo_url}
              brandColor={platform.brand_color}
              size={40}
            />
            <div className="min-w-0 flex-1">
              <p className="truncate font-semibold text-ink">{platform.name}</p>
              {platform.description && (
                <p className="truncate text-xs text-ink-faint">{platform.description}</p>
              )}
            </div>
            <button
              onClick={() => setEditing(platform)}
              aria-label={`Edit ${platform.name}`}
              className="btn-ghost min-h-9 px-2.5"
            >
              <Pencil className="h-4 w-4" />
            </button>
            <button
              onClick={() => toggleArchive(platform)}
              aria-label={`Archive ${platform.name}`}
              className="btn-ghost min-h-9 px-2.5"
            >
              <Archive className="h-4 w-4" />
            </button>
          </li>
        ))}
      </ul>

      {archived.length > 0 && (
        <section>
          <h2 className="mb-2 text-sm font-semibold text-ink-faint">Archived</h2>
          <ul className="space-y-2">
            {archived.map((platform) => (
              <li
                key={platform.id}
                className="flex items-center gap-3 rounded-card border border-dashed border-line bg-surface p-3.5 opacity-70"
              >
                <PlatformLogo
                  name={platform.name}
                  logoUrl={platform.logo_url}
                  brandColor={platform.brand_color}
                  size={40}
                  className="grayscale"
                />
                <p className="flex-1 truncate font-medium text-ink-muted">{platform.name}</p>
                <button
                  onClick={() => toggleArchive(platform)}
                  className="btn-ghost min-h-9 px-2.5 text-xs"
                >
                  <ArchiveRestore className="h-4 w-4" /> Restore
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}

      <PlatformSheet
        open={creating || !!editing}
        platform={editing}
        onClose={() => {
          setCreating(false);
          setEditing(null);
        }}
      />
    </div>
  );
}
