"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/platforms", label: "Platforms" },
  { href: "/admin/employees", label: "Employees" },
  { href: "/admin/settings", label: "Settings" },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="-mx-4 overflow-x-auto px-4">
      <div className="flex w-max gap-1 rounded-xl bg-surface-raised p-1">
        {LINKS.map(({ href, label }) => {
          const active = href === "/admin" ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "whitespace-nowrap rounded-lg px-3.5 py-2 text-sm font-medium transition",
                active
                  ? "bg-brand-gradient text-white shadow"
                  : "text-ink-muted hover:text-ink",
              )}
            >
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
