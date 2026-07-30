"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/league", label: "Overview" },
  { href: "/league/schedule", label: "Schedule" },
  { href: "/league/standings", label: "Standings" },
  { href: "/league/players", label: "Players" },
  { href: "/league/rosters", label: "Rosters" },
  { href: "/league/members", label: "Members" },
  { href: "/admin", label: "Admin" },
];

export function LeagueNav() {
  const pathname = usePathname();

  return (
    <nav className="border-b border-[#0066FF]/20 bg-black">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-1 px-6 py-3">
        {links.map((link) => {
          const active =
            pathname === link.href ||
            (link.href !== "/league" && pathname.startsWith(link.href));

          return (
            <Link
              key={link.href}
              href={link.href}
              className={[
                "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                active
                  ? "bg-[#0066FF] text-white"
                  : "text-white/60 hover:bg-white/5 hover:text-white",
              ].join(" ")}
            >
              {link.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
