import { NextResponse } from "next/server";
import { verifyCronSecret } from "@/lib/api";
import { runEodSweep } from "@/lib/cron/run";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const denied = verifyCronSecret(request);
  if (denied) return denied;

  try {
    const result = await runEodSweep(createAdminClient(), new Date());
    return NextResponse.json({ ok: true, ...result });
  } catch (error) {
    console.error("[eod-sweep]", error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
