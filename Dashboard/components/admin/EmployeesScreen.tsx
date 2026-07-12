"use client";

import { Loader2, UserPlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Sheet } from "@/components/ui/Sheet";
import { TimezoneSelect } from "@/components/ui/TimezoneSelect";
import { useToast } from "@/components/ui/Toast";
import { cn, initials } from "@/lib/utils";
import type { Profile } from "@/lib/types";

type Member = { profile: Profile; email: string };

export function EmployeesScreen({
  members,
  selfId,
  orgTimezone,
}: {
  members: Member[];
  selfId: string;
  orgTimezone: string;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [inviteOpen, setInviteOpen] = useState(false);
  const [editing, setEditing] = useState<Member | null>(null);

  // Add-member form state
  const [mode, setMode] = useState<"password" | "invite">("password");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState<"admin" | "employee">("employee");
  const [timezone, setTimezone] = useState(orgTimezone);
  const [inviting, setInviting] = useState(false);
  const [created, setCreated] = useState<{ email: string; password: string } | null>(null);

  function resetForm() {
    setEmail("");
    setPassword("");
    setFullName("");
    setRole("employee");
  }

  async function invite(event: React.FormEvent) {
    event.preventDefault();
    setInviting(true);
    const response =
      mode === "password"
        ? await fetch("/api/admin/employees", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password, fullName, role, timezone }),
          })
        : await fetch("/api/admin/invite", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, fullName, role, timezone }),
          });
    setInviting(false);
    const json = (await response.json().catch(() => null)) as
      | { error?: string; resent?: boolean }
      | null;
    if (response.ok) {
      if (mode === "password") {
        setCreated({ email, password });
        toast(`${fullName} added`);
      } else {
        toast(json?.resent ? "Already a member — sign-in link sent" : `Invite sent to ${email}`);
        setInviteOpen(false);
      }
      resetForm();
      router.refresh();
    } else {
      toast(json?.error ?? "Could not add member", "error");
    }
  }

  async function patchMember(id: string, body: Record<string, unknown>, message: string) {
    const response = await fetch(`/api/admin/employees/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const json = (await response.json().catch(() => null)) as { error?: string } | null;
    if (response.ok) {
      toast(message);
      setEditing(null);
      router.refresh();
    } else {
      toast(json?.error ?? "Could not update", "error");
    }
  }

  async function deleteMember(id: string) {
    const response = await fetch(`/api/admin/employees/${id}`, { method: "DELETE" });
    const json = (await response.json().catch(() => null)) as { error?: string } | null;
    if (response.ok) {
      toast("Member deleted permanently — email is free to re-use");
      setEditing(null);
      router.refresh();
    } else {
      toast(json?.error ?? "Could not delete", "error");
    }
  }

  return (
    <div className="space-y-5">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-ink">Employees</h1>
          <p className="mt-0.5 text-sm text-ink-muted">Invite-only access</p>
        </div>
        <button onClick={() => setInviteOpen(true)} className="btn-primary min-h-10 px-3.5 text-sm">
          <UserPlus className="h-4 w-4" /> Invite
        </button>
      </header>

      <ul className="space-y-2">
        {members.map(({ profile, email: memberEmail }) => (
          <li
            key={profile.id}
            className={cn(
              "flex items-center gap-3 rounded-card border border-line bg-surface p-3.5",
              !profile.is_active && "opacity-60",
            )}
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-brand-gradient text-sm font-bold text-white">
              {profile.avatar_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={profile.avatar_url} alt="" className="h-full w-full object-cover" />
              ) : (
                initials(profile.full_name)
              )}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate font-semibold text-ink">
                {profile.full_name}
                {profile.id === selfId && (
                  <span className="ml-1.5 text-xs font-normal text-ink-faint">(you)</span>
                )}
              </p>
              <p className="truncate text-xs text-ink-faint">{memberEmail || profile.timezone}</p>
            </div>
            <span
              className={cn(
                "rounded-full px-2.5 py-0.5 text-xs font-semibold",
                profile.role === "admin"
                  ? "bg-brand-red/10 text-brand-red"
                  : "bg-surface-sunken text-ink-muted",
              )}
            >
              {profile.role}
            </span>
            {!profile.is_active && (
              <span className="rounded-full bg-danger/10 px-2.5 py-0.5 text-xs font-semibold text-danger">
                inactive
              </span>
            )}
            <button
              onClick={() => setEditing({ profile, email: memberEmail })}
              className="btn-ghost min-h-9 px-3 text-xs"
            >
              Manage
            </button>
          </li>
        ))}
      </ul>

      {/* ── Add member sheet ── */}
      <Sheet
        open={inviteOpen}
        onOpenChange={(open) => {
          if (!open) {
            setInviteOpen(false);
            setCreated(null);
          }
        }}
        title="Add a teammate"
      >
        {created ? (
          <div className="space-y-4">
            <div className="rounded-xl border border-success/30 bg-success/10 p-4">
              <p className="text-sm font-semibold text-ink">Account ready ✅</p>
              <p className="mt-1 text-xs text-ink-muted">
                Share these sign-in details with them (they can change the password later
                from their profile):
              </p>
              <div className="mt-3 space-y-1 rounded-lg bg-surface p-3 font-mono text-sm text-ink">
                <p>Email: {created.email}</p>
                <p>Password: {created.password}</p>
              </div>
            </div>
            <button
              onClick={() => {
                navigator.clipboard
                  .writeText(`Email: ${created.email}\nPassword: ${created.password}`)
                  .then(() => toast("Copied to clipboard"));
              }}
              className="btn-secondary w-full"
            >
              Copy credentials
            </button>
            <button onClick={() => setCreated(null)} className="btn-primary w-full">
              Add another member
            </button>
          </div>
        ) : (
          <form onSubmit={invite} className="space-y-4">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setMode("password")}
                className={cn(
                  "flex-1 rounded-xl border px-3 py-2 text-sm font-medium transition",
                  mode === "password"
                    ? "border-brand-red bg-brand-red/10 text-brand-red"
                    : "border-line text-ink-muted",
                )}
              >
                Set password now
              </button>
              <button
                type="button"
                onClick={() => setMode("invite")}
                className={cn(
                  "flex-1 rounded-xl border px-3 py-2 text-sm font-medium transition",
                  mode === "invite"
                    ? "border-brand-red bg-brand-red/10 text-brand-red"
                    : "border-line text-ink-muted",
                )}
              >
                Email invite
              </button>
            </div>
            <p className="text-xs text-ink-faint">
              {mode === "password"
                ? "You create the account and hand them the credentials — they can sign in right away."
                : "They get an email link to set their own password. (Needs email delivery configured in Supabase.)"}
            </p>
            <div>
              <label htmlFor="invEmail" className="mb-1.5 block text-sm font-medium text-ink">Email</label>
              <input id="invEmail" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="input" placeholder="teammate@company.com" />
            </div>
            <div>
              <label htmlFor="invName" className="mb-1.5 block text-sm font-medium text-ink">Full name</label>
              <input id="invName" required value={fullName} onChange={(e) => setFullName(e.target.value)} className="input" />
            </div>
            {mode === "password" && (
              <div>
                <label htmlFor="invPass" className="mb-1.5 block text-sm font-medium text-ink">Password</label>
                <input
                  id="invPass"
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input"
                  placeholder="At least 8 characters"
                />
              </div>
            )}
            <div>
              <label htmlFor="invRole" className="mb-1.5 block text-sm font-medium text-ink">Role</label>
              <select id="invRole" value={role} onChange={(e) => setRole(e.target.value as "admin" | "employee")} className="input">
                <option value="employee">Employee</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div>
              <label htmlFor="invTz" className="mb-1.5 block text-sm font-medium text-ink">Timezone</label>
              <TimezoneSelect id="invTz" value={timezone} onChange={setTimezone} />
            </div>
            <button type="submit" disabled={inviting} className="btn-primary w-full">
              {inviting && <Loader2 className="h-4 w-4 animate-spin" />}
              {mode === "password" ? "Create account" : "Send invite"}
            </button>
          </form>
        )}
      </Sheet>

      {/* ── Manage sheet ── */}
      {editing && (
        <ManageMemberSheet
          member={editing}
          isSelf={editing.profile.id === selfId}
          onClose={() => setEditing(null)}
          onSave={patchMember}
          onDelete={deleteMember}
        />
      )}
    </div>
  );
}

function ManageMemberSheet({
  member,
  isSelf,
  onClose,
  onSave,
  onDelete,
}: {
  member: Member;
  isSelf: boolean;
  onClose: () => void;
  onSave: (id: string, body: Record<string, unknown>, message: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}) {
  const [fullName, setFullName] = useState(member.profile.full_name);
  const [role, setRole] = useState(member.profile.role);
  const [timezone, setTimezone] = useState(member.profile.timezone);
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  return (
    <Sheet open onOpenChange={(open) => !open && onClose()} title={member.profile.full_name}>
      <form
        onSubmit={async (event) => {
          event.preventDefault();
          setSaving(true);
          await onSave(member.profile.id, { fullName, role, timezone }, "Member updated");
          setSaving(false);
        }}
        className="space-y-4"
      >
        <div>
          <label htmlFor="mName" className="mb-1.5 block text-sm font-medium text-ink">Name</label>
          <input id="mName" required value={fullName} onChange={(e) => setFullName(e.target.value)} className="input" />
        </div>
        <div>
          <label htmlFor="mRole" className="mb-1.5 block text-sm font-medium text-ink">Role</label>
          <select
            id="mRole"
            value={role}
            onChange={(e) => setRole(e.target.value as "admin" | "employee")}
            disabled={isSelf}
            className="input disabled:opacity-60"
          >
            <option value="employee">Employee</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <div>
          <label htmlFor="mTz" className="mb-1.5 block text-sm font-medium text-ink">Timezone</label>
          <TimezoneSelect id="mTz" value={timezone} onChange={setTimezone} />
        </div>
        <button type="submit" disabled={saving} className="btn-primary w-full">
          {saving && <Loader2 className="h-4 w-4 animate-spin" />}
          Save
        </button>
        {!isSelf && (
          <>
            <button
              type="button"
              onClick={() =>
                onSave(
                  member.profile.id,
                  { isActive: !member.profile.is_active },
                  member.profile.is_active
                    ? "Deactivated — history kept, no more reminders"
                    : "Reactivated",
                )
              }
              className={cn(
                "w-full rounded-xl border px-4 py-2.5 text-sm font-semibold transition",
                member.profile.is_active
                  ? "border-warning/50 text-warning hover:bg-warning/10"
                  : "border-success/40 text-success hover:bg-success/10",
              )}
            >
              {member.profile.is_active
                ? "Deactivate (pause — history kept)"
                : "Reactivate account"}
            </button>

            {confirmDelete ? (
              <div className="space-y-2 rounded-xl border border-danger/40 bg-danger/10 p-3">
                <p className="text-xs font-medium text-danger">
                  This permanently deletes {member.profile.full_name}&apos;s account,
                  posting history and stats. It cannot be undone.
                </p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={async () => {
                      setSaving(true);
                      await onDelete(member.profile.id);
                      setSaving(false);
                    }}
                    disabled={saving}
                    className="flex-1 rounded-xl bg-danger px-4 py-2.5 text-sm font-semibold text-white transition active:scale-[0.98] disabled:opacity-60"
                  >
                    Yes, delete forever
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmDelete(false)}
                    className="flex-1 rounded-xl border border-line px-4 py-2.5 text-sm font-medium text-ink"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmDelete(true)}
                className="w-full rounded-xl border border-danger/40 px-4 py-2.5 text-sm font-semibold text-danger transition hover:bg-danger/10"
              >
                Delete permanently
              </button>
            )}
          </>
        )}
      </form>
    </Sheet>
  );
}
