import { Resend } from "resend";
import type {
  ContactPayload,
  FormContactPayload,
  HeroContactPayload,
} from "@/lib/contact/types";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function row(label: string, value: string) {
  return `
    <tr>
      <td style="padding:10px 0;color:#9ca3af;font-size:13px;width:140px;vertical-align:top;">${escapeHtml(label)}</td>
      <td style="padding:10px 0;color:#ffffff;font-size:14px;white-space:pre-wrap;">${escapeHtml(value)}</td>
    </tr>
  `;
}

function buildEmailContent(payload: ContactPayload) {
  if (payload.source === "hero") {
    const subject = `New contact (Let's Connect): ${payload.name}`;
    const text = [
      "New submission from Let's Connect",
      "",
      `Name: ${payload.name}`,
      `Email: ${payload.email}`,
      "",
      "Project:",
      payload.project,
    ].join("\n");

    const html = `
      <div style="font-family:system-ui,sans-serif;background:#0a0a0a;color:#fff;padding:32px;">
        <h2 style="margin:0 0 8px;font-size:20px;">Let's Connect</h2>
        <p style="margin:0 0 24px;color:#9ca3af;font-size:14px;">New submission from the contact hero</p>
        <table style="width:100%;border-collapse:collapse;">
          ${row("Name", payload.name)}
          ${row("Email", payload.email)}
          ${row("Project", payload.project)}
        </table>
      </div>
    `;

    return { subject, text, html, replyTo: payload.email };
  }

  const subject = `New contact (Send Message): ${payload.subject}`;
  const text = [
    "New submission from Send Us a Message",
    "",
    `Name: ${payload.name}`,
    `Email: ${payload.email}`,
    payload.company ? `Company: ${payload.company}` : null,
    `Subject: ${payload.subject}`,
    "",
    "Message:",
    payload.message,
  ]
    .filter(Boolean)
    .join("\n");

  const html = `
    <div style="font-family:system-ui,sans-serif;background:#0a0a0a;color:#fff;padding:32px;">
      <h2 style="margin:0 0 8px;font-size:20px;">Send Us a Message</h2>
      <p style="margin:0 0 24px;color:#9ca3af;font-size:14px;">New submission from the contact form</p>
      <table style="width:100%;border-collapse:collapse;">
        ${row("Name", payload.name)}
        ${row("Email", payload.email)}
        ${payload.company ? row("Company", payload.company) : ""}
        ${row("Subject", payload.subject)}
        ${row("Message", payload.message)}
      </table>
    </div>
  `;

  return { subject, text, html, replyTo: payload.email };
}

export function validateContactPayload(body: unknown): ContactPayload | null {
  if (!body || typeof body !== "object") return null;

  const source = (body as { source?: string }).source;

  if (source === "hero") {
    const { name, email, project } = body as HeroContactPayload;
    if (
      typeof name !== "string" ||
      name.trim().length < 2 ||
      typeof email !== "string" ||
      !EMAIL_PATTERN.test(email.trim()) ||
      typeof project !== "string" ||
      project.trim().length < 8
    ) {
      return null;
    }

    return {
      source: "hero",
      name: name.trim(),
      email: email.trim(),
      project: project.trim(),
    };
  }

  if (source === "form") {
    const { name, email, company, subject, message } = body as FormContactPayload;
    if (
      typeof name !== "string" ||
      name.trim().length < 2 ||
      typeof email !== "string" ||
      !EMAIL_PATTERN.test(email.trim()) ||
      typeof subject !== "string" ||
      subject.trim().length < 2 ||
      typeof message !== "string" ||
      message.trim().length < 8
    ) {
      return null;
    }

    return {
      source: "form",
      name: name.trim(),
      email: email.trim(),
      company: typeof company === "string" && company.trim() ? company.trim() : undefined,
      subject: subject.trim(),
      message: message.trim(),
    };
  }

  return null;
}

export async function sendContactEmail(payload: ContactPayload) {
  const to = process.env.CONTACT_TO_EMAIL?.trim();
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from =
    process.env.CONTACT_FROM_EMAIL?.trim() ||
    "Umvix Website <onboarding@resend.dev>";

  if (!to) {
    throw new Error("CONTACT_TO_EMAIL is not configured.");
  }

  if (!apiKey) {
    throw new Error("RESEND_API_KEY is not configured.");
  }

  const resend = new Resend(apiKey);
  const { subject, text, html, replyTo } = buildEmailContent(payload);

  const { error } = await resend.emails.send({
    from,
    to: [to],
    replyTo,
    subject,
    text,
    html,
  });

  if (error) {
    throw new Error(error.message || "Failed to send email.");
  }
}
