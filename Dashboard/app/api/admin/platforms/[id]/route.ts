import { NextResponse } from "next/server";
import { z } from "zod";
import { parseBody, requireApiUser } from "@/lib/api";
import { seedTodayForPlatform } from "@/lib/logs";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { platformSchema } from "@/lib/validation";

export const runtime = "nodejs";

const updateSchema = platformSchema.partial().extend({
  isActive: z.boolean().optional(),
});

/**
 * Edit / archive / unarchive a platform.
 * Archiving cancels today's still-pending logs (status → skipped) while
 * keeping all history (spec edge case 5).
 */
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } },
) {
  const ctx = await requireApiUser({ admin: true });
  if (ctx instanceof NextResponse) return ctx;

  const parsed = await parseBody(request, updateSchema);
  if ("response" in parsed) return parsed.response;
  const { name, description, brandColor, urlTemplate, logoUrl, isActive } = parsed.data;

  const supabase = createClient();
  const { data: platform, error } = await supabase
    .from("platforms")
    .update({
      ...(name !== undefined && { name }),
      ...(description !== undefined && { description }),
      ...(brandColor !== undefined && { brand_color: brandColor }),
      ...(urlTemplate !== undefined && { url_template: urlTemplate || null }),
      ...(logoUrl !== undefined && { logo_url: logoUrl || null }),
      ...(isActive !== undefined && {
        is_active: isActive,
        archived_at: isActive ? null : new Date().toISOString(),
      }),
    })
    .eq("id", params.id)
    .eq("org_id", ctx.org.id)
    .select("*")
    .single();

  if (error) {
    if (error.code === "23505") {
      return NextResponse.json({ error: "That name is already taken." }, { status: 409 });
    }
    return NextResponse.json({ error: "Could not update platform" }, { status: 500 });
  }

  if (isActive === false) {
    // Service role: pending logs belong to employees, not the admin.
    await createAdminClient()
      .from("posting_logs")
      .update({ status: "skipped" })
      .eq("platform_id", params.id)
      .eq("status", "pending");
  } else if (isActive === true) {
    // Restored mid-day — back onto everyone's Today list immediately.
    await seedTodayForPlatform(createAdminClient(), ctx.org.id, params.id);
  }

  return NextResponse.json({ ok: true, platform });
}
