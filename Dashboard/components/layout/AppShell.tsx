"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BarChart3,
  LayoutGrid,
  ListChecks,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
  UserRound,
} from "lucide-react";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { cn, initials } from "@/lib/utils";
import type { Role } from "@/lib/types";
import { NotificationBell } from "./NotificationBell";
import { ThemeToggle } from "./ThemeToggle";
import { InstallPrompt } from "@/components/pwa/InstallPrompt";
import { OfflineBanner } from "@/components/pwa/OfflineBanner";

const ADMIN_TABS = [
  { href: "/admin", label: "Dashboard", icon: LayoutGrid },
  { href: "/today", label: "Today", icon: ListChecks },
  { href: "/history", label: "My Stats", icon: BarChart3 },
  { href: "/profile", label: "Profile", icon: UserRound },
] as const;

const EMPLOYEE_TABS = [
  { href: "/today", label: "Today", icon: ListChecks },
  { href: "/history", label: "My Stats", icon: BarChart3 },
  { href: "/profile", label: "Profile", icon: UserRound },
] as const;

export function AppShell({
  role,
  userName,
  avatarUrl,
  children,
}: {
  role: Role;
  userName: string;
  avatarUrl: string | null;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const tabs = role === "admin" ? ADMIN_TABS : EMPLOYEE_TABS;

  const [collapsed, setCollapsed] = useState(false);
  useEffect(() => {
    setCollapsed(localStorage.getItem("pp-sidebar") === "collapsed");
  }, []);

  function toggleSidebar() {
    setCollapsed((current) => {
      const next = !current;
      localStorage.setItem("pp-sidebar", next ? "collapsed" : "open");
      return next;
    });
  }

  async function signOut() {
    await createClient().auth.signOut();
    router.replace("/login");
    router.refresh();
  }

  return (
    <div className="min-h-dvh md:flex">
      {/* ── Desktop sidebar (collapsible) ── */}
      <aside
        className={cn(
          "sticky top-0 hidden h-dvh shrink-0 flex-col border-r border-line bg-surface transition-[width] duration-200 md:flex",
          collapsed ? "w-[76px]" : "w-60",
        )}
      >
        <div className={cn("flex items-center gap-2.5 py-6", collapsed ? "justify-center px-0" : "px-5")}>
          <Image
            src="/icons/logo-small.png"
            alt="Umvix"
            width={36}
            height={36}
            className="shrink-0 rounded-xl"
          />
          {!collapsed && (
            <div className="leading-tight">
              <p className="font-headline text-sm font-bold text-ink">Umvix</p>
              <p className="text-xs font-semibold text-brand-red">PostPilot</p>
            </div>
          )}
        </div>

        <nav className="flex-1 space-y-1 px-3">
          {tabs.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || pathname.startsWith(`${href}/`);
            return (
              <Link
                key={href}
                href={href}
                title={collapsed ? label : undefined}
                className={cn(
                  "relative flex items-center gap-3 rounded-xl py-2.5 text-sm font-medium transition",
                  collapsed ? "justify-center px-0" : "px-3",
                  active
                    ? "bg-brand-red/10 text-brand-red"
                    : "text-ink-muted hover:bg-surface-raised hover:text-ink",
                )}
              >
                {active && (
                  <span className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-brand-red" />
                )}
                <Icon className="h-[18px] w-[18px] shrink-0" />
                {!collapsed && label}
              </Link>
            );
          })}
        </nav>

        <div className="space-y-1 border-t border-line p-3">
          <button
            onClick={toggleSidebar}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className={cn(
              "flex w-full items-center gap-3 rounded-xl py-2.5 text-sm font-medium text-ink-muted transition hover:bg-surface-raised hover:text-ink",
              collapsed ? "justify-center px-0" : "px-3",
            )}
          >
            {collapsed ? (
              <PanelLeftOpen className="h-[18px] w-[18px] shrink-0" />
            ) : (
              <PanelLeftClose className="h-[18px] w-[18px] shrink-0" />
            )}
            {!collapsed && "Collapse"}
          </button>
          <button
            onClick={signOut}
            title={collapsed ? "Sign out" : undefined}
            className={cn(
              "flex w-full items-center gap-3 rounded-xl py-2.5 text-sm font-medium text-ink-muted transition hover:bg-surface-raised hover:text-ink",
              collapsed ? "justify-center px-0" : "px-3",
            )}
          >
            <LogOut className="h-[18px] w-[18px] shrink-0" />
            {!collapsed && "Sign out"}
          </button>
        </div>
      </aside>

      <div className="flex min-h-dvh min-w-0 flex-1 flex-col">
        {/* ── Top bar ── */}
        <header className="pt-safe sticky top-0 z-40 border-b border-line bg-surface/90 backdrop-blur">
          <div className="flex h-14 items-center justify-between px-4 md:px-8">
            <div className="flex items-center gap-2.5 md:hidden">
              <Image
                src="/icons/logo-small.png"
                alt="Umvix"
                width={30}
                height={30}
                className="rounded-lg"
              />
              <span className="font-headline text-sm font-bold text-ink">
                Post<span className="text-brand-red">Pilot</span>
              </span>
            </div>
            <p className="hidden text-sm text-ink-muted md:block">
              Welcome back, <span className="font-semibold text-ink">{userName}</span>
            </p>
            <div className="flex items-center gap-1.5">
              <ThemeToggle />
              <NotificationBell />
              <div className="ml-1 flex items-center gap-2">
                <div
                  className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-brand-gradient text-xs font-bold text-white"
                  title={userName}
                >
                  {avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={avatarUrl} alt={userName} className="h-full w-full object-cover" />
                  ) : (
                    initials(userName)
                  )}
                </div>
                <span className="hidden text-sm font-medium text-ink lg:block">{userName}</span>
              </div>
            </div>
          </div>
        </header>

        <OfflineBanner />

        {/* ── Page content: full width on desktop ── */}
        <main className="mx-auto w-full max-w-[1440px] flex-1 px-4 pb-28 pt-5 md:px-8 md:pb-10 md:pt-7">
          {children}
        </main>

        <InstallPrompt />

        {/* ── Mobile bottom tabs ── */}
        <nav className="pb-safe fixed inset-x-0 bottom-0 z-40 border-t border-line bg-surface/95 backdrop-blur md:hidden">
          <div className="flex">
            {tabs.map(({ href, label, icon: Icon }) => {
              const active = pathname === href || pathname.startsWith(`${href}/`);
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "flex min-h-[56px] flex-1 flex-col items-center justify-center gap-0.5 text-[11px] font-medium transition",
                    active ? "text-brand-red" : "text-ink-faint active:text-ink",
                  )}
                >
                  <Icon className="h-5 w-5" />
                  {label}
                </Link>
              );
            })}
          </div>
        </nav>
      </div>
    </div>
  );
}
