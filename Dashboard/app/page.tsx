import { redirect } from "next/navigation";
import { getSessionContext } from "@/lib/auth";

/** Role-based landing: admins open on the team dashboard, employees on Today. */
export default async function RootPage() {
  const { profile } = await getSessionContext();
  redirect(profile.role === "admin" ? "/admin" : "/today");
}
