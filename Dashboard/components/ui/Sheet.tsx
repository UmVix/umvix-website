"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";

/** Bottom sheet on mobile, centered dialog on desktop. */
export function Sheet({
  open,
  onOpenChange,
  title,
  children,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 animate-fade-in bg-black/50" />
        <Dialog.Content className="fixed inset-x-0 bottom-0 z-50 max-h-[88dvh] animate-slide-up overflow-y-auto rounded-t-card border border-line bg-surface p-5 pb-8 shadow-2xl focus:outline-none md:inset-x-auto md:left-1/2 md:top-1/2 md:bottom-auto md:w-full md:max-w-md md:-translate-x-1/2 md:-translate-y-1/2 md:rounded-card md:pb-5">
          <div className="mb-4 flex items-center justify-between">
            <Dialog.Title className="text-base font-bold text-ink">{title}</Dialog.Title>
            <Dialog.Close
              aria-label="Close"
              className="flex h-9 w-9 items-center justify-center rounded-xl text-ink-faint transition hover:bg-surface-raised hover:text-ink"
            >
              <X className="h-4 w-4" />
            </Dialog.Close>
          </div>
          {children}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
