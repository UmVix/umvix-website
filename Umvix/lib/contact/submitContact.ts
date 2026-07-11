import type { ContactPayload } from "@/lib/contact/types";

export async function submitContact(payload: ContactPayload) {
  const response = await fetch("/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = (await response.json().catch(() => ({}))) as {
    error?: string;
    ok?: boolean;
  };

  if (!response.ok) {
    throw new Error(data.error || "Something went wrong. Please try again.");
  }

  return data;
}
