"use client";

import { Loader2, Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { PlatformLogo } from "@/components/ui/PlatformLogo";
import { Sheet } from "@/components/ui/Sheet";
import { useToast } from "@/components/ui/Toast";
import { createClient } from "@/lib/supabase/client";
import { ALLOWED_LOGO_TYPES, MAX_LOGO_BYTES } from "@/lib/validation";
import type { Platform } from "@/lib/types";

/**
 * Create/edit platform sheet. A new platform appears on every employee's
 * Today checklist immediately — everyone posts on every platform, daily.
 */
export function PlatformSheet({
  open,
  platform,
  onClose,
}: {
  open: boolean;
  platform: Platform | null;
  onClose: () => void;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const fileRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [brandColor, setBrandColor] = useState("#ff1f3d");
  const [urlTemplate, setUrlTemplate] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    setName(platform?.name ?? "");
    setDescription(platform?.description ?? "");
    setBrandColor(platform?.brand_color ?? "#ff1f3d");
    setUrlTemplate(platform?.url_template ?? "");
    setLogoUrl(platform?.logo_url ?? "");
  }, [open, platform]);

  async function uploadLogo(file: File) {
    if (!ALLOWED_LOGO_TYPES.includes(file.type)) {
      toast("Use a JPG, PNG, WebP or SVG file", "error");
      return;
    }
    if (file.size > MAX_LOGO_BYTES) {
      toast("Logo too large — keep it under 1 MB", "error");
      return;
    }
    setUploading(true);
    const supabase = createClient();
    const extension = file.name.split(".").pop() ?? "png";
    const path = `platform-${Date.now()}.${extension}`;
    const { error } = await supabase.storage.from("logos").upload(path, file);
    setUploading(false);
    if (error) {
      toast("Upload failed", "error");
      return;
    }
    const { data } = supabase.storage.from("logos").getPublicUrl(path);
    setLogoUrl(data.publicUrl);
  }

  async function save(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);

    const body = {
      name,
      description,
      brandColor,
      urlTemplate: urlTemplate || "",
      logoUrl: logoUrl || "",
    };
    const response = platform
      ? await fetch(`/api/admin/platforms/${platform.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        })
      : await fetch("/api/admin/platforms", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });

    setSaving(false);
    if (!response.ok) {
      const json = (await response.json().catch(() => null)) as { error?: string } | null;
      toast(json?.error ?? "Could not save", "error");
      return;
    }

    toast(platform ? "Platform updated" : "Platform created — live on everyone's Today list");
    onClose();
    router.refresh();
  }

  return (
    <Sheet
      open={open}
      onOpenChange={(next) => !next && onClose()}
      title={platform ? "Edit platform" : "New platform"}
    >
      <form onSubmit={save} className="space-y-4">
        <div className="flex items-center gap-4">
          <PlatformLogo name={name || "?"} logoUrl={logoUrl || null} brandColor={brandColor} size={56} />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="btn-secondary min-h-10 px-3 text-xs"
          >
            {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
            Upload logo
          </button>
          <input
            ref={fileRef}
            type="file"
            accept={ALLOWED_LOGO_TYPES.join(",")}
            hidden
            onChange={(e) => e.target.files?.[0] && uploadLogo(e.target.files[0])}
          />
        </div>
        <p className="text-xs text-ink-faint">
          No logo? We generate one from the name and brand color automatically.
        </p>

        <div>
          <label htmlFor="pName" className="mb-1.5 block text-sm font-medium text-ink">
            Name
          </label>
          <input id="pName" required maxLength={60} value={name} onChange={(e) => setName(e.target.value)} className="input" />
        </div>
        <div>
          <label htmlFor="pDesc" className="mb-1.5 block text-sm font-medium text-ink">
            Description <span className="font-normal text-ink-faint">(optional)</span>
          </label>
          <input id="pDesc" maxLength={300} value={description} onChange={(e) => setDescription(e.target.value)} className="input" />
        </div>
        <div>
          <label htmlFor="pColor" className="mb-1.5 block text-sm font-medium text-ink">
            Brand color
          </label>
          <div className="flex items-center gap-2">
            <input
              id="pColor"
              type="color"
              value={brandColor}
              onChange={(e) => setBrandColor(e.target.value)}
              className="h-11 w-14 cursor-pointer rounded-xl border border-line bg-surface-sunken"
            />
            <input
              value={brandColor}
              onChange={(e) => setBrandColor(e.target.value)}
              pattern="^#[0-9a-fA-F]{6}$"
              className="input flex-1"
              aria-label="Brand color hex"
            />
          </div>
        </div>
        <div>
          <label htmlFor="pUrl" className="mb-1.5 block text-sm font-medium text-ink">
            Platform URL <span className="font-normal text-ink-faint">(optional)</span>
          </label>
          <input id="pUrl" type="url" value={urlTemplate} onChange={(e) => setUrlTemplate(e.target.value)} className="input" placeholder="https://…" />
        </div>

        <button type="submit" disabled={saving || uploading} className="btn-primary w-full">
          {saving && <Loader2 className="h-4 w-4 animate-spin" />}
          {platform ? "Save changes" : "Create platform"}
        </button>
      </form>
    </Sheet>
  );
}
