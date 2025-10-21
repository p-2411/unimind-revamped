"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { JSX } from "react";

type NavItem = {
  label: string;
  href: string;
  icon: JSX.Element;
};

const userStub = {
  name: "Alex Rivers",
  role: "Pro Learner",
};

const navItems: NavItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: (
      <svg aria-hidden className="size-4" viewBox="0 0 24 24" fill="none">
        <path
          d="M4 12.5V5a1 1 0 0 1 1-1h6v8.5H4Zm9 0V4h6a1 1 0 0 1 1 1v7.5h-7Zm-9 2H11V20H5a1 1 0 0 1-1-1v-4.5Zm9 0h7V19a1 1 0 0 1-1 1h-6v-5.5Z"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    label: "My Subjects",
    href: "/subjects",
    icon: (
      <svg aria-hidden className="size-4" viewBox="0 0 24 24" fill="none">
        <path
          d="M5 5.5A1.5 1.5 0 0 1 6.5 4h11A1.5 1.5 0 0 1 19 5.5v13l-4.25-2L10.5 18l-5.5-2.75v-9.75Z"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    label: "Settings",
    href: "/settings",
    icon: (
      <svg aria-hidden className="size-4" viewBox="0 0 24 24" fill="none">
        <path
          d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7ZM20 13.8v-3.6l-1.94-.33a5.5 5.5 0 0 0-.6-1.45l1.11-1.61-2.55-2.55-1.6 1.11a5.5 5.5 0 0 0-1.45-.6L12 3h-3.6l-.33 1.94a5.5 5.5 0 0 0-1.45.6l-1.61-1.11-2.55 2.55 1.11 1.6c-.26.46-.47.95-.6 1.45L3 10.2v3.6l1.94.33c.13.5.34.99.6 1.45l-1.11 1.61 2.55 2.55 1.6-1.11c.46.26.95.47 1.45.6L8.4 21H12l.33-1.94c.5-.13.99-.34 1.45-.6l1.61 1.11 2.55-2.55-1.11-1.6c.26-.46.47-.95.6-1.45L20 13.8Z"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
];

function Avatar() {
  const initials = userStub.name
    .split(" ")
    .map((chunk) => chunk[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="grid size-12 place-items-center rounded-2xl bg-gradient-to-br from-[var(--primary)]/85 via-[var(--primary)] to-[var(--accent)] text-base font-semibold text-[var(--text-on-primary)] shadow-lg">
      {initials}
    </div>
  );
}

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 hidden h-screen w-72 shrink-0 flex-col border-r border-[var(--border)] bg-[var(--surface)]/90 px-6 py-8 backdrop-blur-xl lg:flex">
      <div className="flex flex-col gap-6">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="grid size-11 place-items-center rounded-2xl bg-[var(--primary)]/18 text-[var(--primary)]">
            <svg
              aria-hidden
              className="size-6"
              viewBox="0 0 32 32"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
            >
              <path d="M19 5h9v9" />
              <path d="M4 13V4h9" />
              <path d="M13 28H4v-9" />
              <path d="M28 19v9h-9" />
              <path d="M9 9 23 23" />
            </svg>
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-xs font-semibold uppercase tracking-[0.35em] text-[var(--text-muted)]">
              UniMind
            </span>
            <span className="text-lg font-semibold text-[var(--text)]">
              Learning Hub
            </span>
          </div>
        </Link>

        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm">
          <div className="flex items-center gap-4">
            <Avatar />
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-[var(--text)]">
                {userStub.name}
              </span>
              <span className="text-xs text-[var(--text-muted)]">{userStub.role}</span>
            </div>
          </div>
        </div>
      </div>

      <nav className="mt-8 flex flex-col gap-1 text-sm font-medium text-[var(--text-muted)]">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={[
                "group flex items-center gap-3 rounded-xl border border-transparent px-3 py-2 transition",
                isActive
                  ? "border-[var(--primary)]/45 bg-[var(--primary)]/12 text-[var(--text)] shadow-sm"
                  : "hover:border-[var(--border)] hover:bg-[var(--surface-muted)]/70",
              ].join(" ")}
            >
              <span
                className={[
                  "grid size-8 place-items-center rounded-lg text-[var(--text-muted)] transition",
                  isActive
                    ? "bg-[var(--primary)]/20 text-[var(--primary)]"
                    : "bg-[var(--surface-muted)]/80 group-hover:bg-[var(--surface-strong)]",
                ].join(" ")}
              >
                {item.icon}
              </span>
              <span className="text-sm font-medium tracking-tight">
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto flex flex-col gap-2 text-sm">
        <Link
          href="/support"
          className="flex items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--surface-muted)]/80 px-3 py-2 text-[var(--text-muted)] transition hover:border-[var(--primary)]/40 hover:bg-[var(--surface-muted)] hover:text-[var(--text)]"
        >
          Support
          <span aria-hidden className="text-xs">↗</span>
        </Link>
        <button
          type="button"
          className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-left text-[var(--text-muted)] transition hover:border-[var(--destructive)]/50 hover:bg-[var(--destructive)]/12 hover:text-[var(--destructive)]"
        >
          Log out
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
