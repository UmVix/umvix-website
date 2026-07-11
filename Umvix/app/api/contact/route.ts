import { NextRequest } from "next/server";
import {
  sendContactEmail,
  validateContactPayload,
} from "@/lib/contact/sendContactEmail";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const payload = validateContactPayload(body);

    if (!payload) {
      return Response.json(
        { error: "Please check your details and try again." },
        { status: 400 }
      );
    }

    await sendContactEmail(payload);

    return Response.json({ ok: true });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to send your message.";

    const isConfigError =
      message.includes("CONTACT_TO_EMAIL") ||
      message.includes("RESEND_API_KEY");

    console.error("[contact]", message);

    return Response.json(
      {
        error: isConfigError
          ? "Contact email is not configured yet. Please try again later."
          : message,
      },
      { status: isConfigError ? 503 : 500 }
    );
  }
}
