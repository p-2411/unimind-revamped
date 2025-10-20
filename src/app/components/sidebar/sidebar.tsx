import Link from "next/link";
import type { JSX } from "react";

type NavItem = {
  label: string;
  href: string;
  icon: JSX.Element;
  isActive?: boolean;
  badge?: string;
};

const userStub = {
  name: "Alex Rivers",
};

const navItems: NavItem[] = [
  {
    label: "My Dashboard",
    href: "/dashboard",
    isActive: true,
    icon: (
      <svg
        aria-hidden="true"
        className="size-4 text-[#050505]"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M3 3h8v8H3zM3 13h8v8H3zM13 3h8v12h-8zM13 17h8v4h-8z" />
      </svg>
    ),
  },
  {
    label: "Content Review",
    href: "/content-review",
    badge: "1",
    icon: (
      <svg
        aria-hidden="true"
        className="size-4 text-zinc-300"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M4 5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v15l-4-3H6a2 2 0 0 1-2-2z" />
      </svg>
    ),
  },
  {
    label: "My Subjects",
    href: "/subjects",
    icon: (
      <svg
        aria-hidden="true"
        className="size-4 text-zinc-300"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M5 3h14a2 2 0 0 1 2 2v14l-4-2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z" />
      </svg>
    ),
  },
  {
    label: "Settings",
    href: "/settings",
    icon: (
      <svg
        aria-hidden="true"
        className="size-4 text-zinc-300"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M12 15.5A3.5 3.5 0 1 0 12 8.5a3.5 3.5 0 0 0 0 7Zm8-1.319v-4.38l-2.04-.34a6.53 6.53 0 0 0-.64-1.55l1.17-1.7-3.096-3.095-1.699 1.169a6.53 6.53 0 0 0-1.55-.64L13.819 2h-3.64l-.341 2.04a6.53 6.53 0 0 0-1.55.64l-1.7-1.17L3.5 6.606l1.169 1.699a6.53 6.53 0 0 0-.64 1.55L2 10.181v3.64l2.04.341a6.53 6.53 0 0 0 .64 1.55l-1.17 1.7 3.096 3.095 1.699-1.169c.482.27.998.488 1.55.64L10.181 22h3.64l.341-2.04a6.53 6.53 0 0 0 1.55-.64l1.7 1.17L20.5 17.394l-1.169-1.699c.27-.482.488-.998.64-1.55Z" />
      </svg>
    ),
  },
];

function LogoMark() {
  return (
    <svg
      aria-hidden="true"
      className="size-10 text-amber-300"
      viewBox="0 0 64 64"
      fill="none"
      stroke="currentColor"
      strokeWidth="4"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M32 6c13 0 24 11 24 24s-11 24-24 24S8 43 8 30 19 6 32 6Z" />
      <path d="M34 14 26 36h12l-8 14" />
    </svg>
  );
}

export function Sidebar() {
  return (
    <aside className="flex h-full w-72 flex-col gap-10 rounded-3xl bg-[#0B0F19] p-8 text-white shadow-[0_25px_50px_-12px_rgba(0,0,0,0.55)]">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <LogoMark />
          <span className="text-3xl font-semibold text-amber-300">UniMind</span>
        </div>
        <div className="rounded-3xl bg-white/5 p-4 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.04)]">
          <div className="flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-full border border-white/10 bg-gradient-to-br from-amber-200/60 via-amber-400/70 to-amber-500/80 text-base font-semibold text-black shadow-[inset_0_0_12px_rgba(0,0,0,0.25)]">
              {userStub.name
                .split(" ")
                .map((chunk) => chunk[0])
                .join("")
                .slice(0, 2)
                .toUpperCase()}
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-white/70">Welcome back</span>
              <span className="text-lg font-semibold text-white">
                {userStub.name}
              </span>
            </div>
          </div>
        </div>
      </div>

      <nav className="flex flex-col gap-2 text-sm font-medium">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={[
              "flex items-center justify-between rounded-2xl px-4 py-3 transition",
              item.isActive
                ? "bg-amber-400 text-black shadow-[0_18px_45px_rgba(255,200,0,0.35)]"
                : "text-white/85 hover:bg-white/10",
            ].join(" ")}
          >
            <span className="flex items-center gap-3">
              <span
                className={[
                  "grid size-9 place-items-center rounded-xl",
                  item.isActive ? "bg-black/10" : "bg-white/5",
                ].join(" ")}
              >
                {item.icon}
              </span>
              {item.label}
            </span>
            {item.badge ? (
              <span className="grid size-6 place-items-center rounded-full bg-red-500 text-xs font-semibold text-white">
                {item.badge}
              </span>
            ) : null}
          </Link>
        ))}
      </nav>

      <div className="mt-auto flex flex-col gap-3 text-sm text-white/70">
        <button
          type="button"
          className="rounded-2xl border border-white/5 px-4 py-3 text-left transition hover:bg-white/10 hover:text-white"
        >
          Support
        </button>
        <button
          type="button"
          className="rounded-2xl border border-white/5 px-4 py-3 text-left transition hover:bg-white/10 hover:text-white"
        >
          Log out
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
