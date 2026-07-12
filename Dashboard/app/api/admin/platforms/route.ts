import { NextResponse } from "next/server";
import { parseBody, requireApiUser } from "@/lib/api";
import { seedTodayForPlatform } from "@/lib/logs";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { platformReorderSchema, platformSchema } from "@/lib/validation";

export const runtime = "nodejs";

/** Create a platform. Duplicate names surface as a clear 409. */
export async function POST(request: Request) {
  const ctx = await requireApiUser({ admin: true });
  if (ctx instanceof NextResponse) return ctx;

  const parsed = await parseBody(request, platformSchema);
  if ("response" in parsed) return parsed.response;
  const { name, description, brandColor, urlTemplate, logoUrl } = parsed.data;

  const supabase = createClient();
  const { data: maxRow } = await supabase
    .from("platforms")
    .select("sort_order")
    .eq("org_id", ctx.org.id)
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();

  const { data: platform, error } = await supabase
    .from("platforms")
    .insert({
      org_id: ctx.org.id,
      name,
      description,
      brand_color: brandColor,
      url_template: urlTemplate || null,
      logo_url: logoUrl || null,
      sort_order: (maxRow?.sort_order ?? -1) + 1,
      created_by: ctx.userId,
    })
    .select("*")
    .single();

  if (error) {
    if (error.code === "23505") {
      return NextResponse.json(
        { error: `A platform named “${name}” already exists.` },
        { status: 409 },
      );
    }
    return NextResponse.json({ error: "Could not create platform" }, { status: 500 });
  }

  // Everyone posts on every platform — put it on today's checklists now.
  await seedTodayForPlatform(createAdminClient(), ctx.org.id, platform.id);

  return NextResponse.json({ ok: true, platform });
}

/** Persist a drag-to-reorder: body is the full ordered list of platform ids. */
export async function PATCH(request: Request) {
  const ctx = await requireApiUser({ admin: true });
  if (ctx instanceof NextResponse) return ctx;

  const parsed = await parseBody(request, platformReorderSchema);
  if ("response" in parsed) return parsed.response;

  const supabase = createClient();
  await Promise.all(
    parsed.data.order.map((id, index) =>
      supabase
        .from("platforms")
        .update({ sort_order: index })
        .eq("id", id)
        .eq("org_id", ctx.org.id),
    ),
  );
  return NextResponse.json({ ok: true });
}
