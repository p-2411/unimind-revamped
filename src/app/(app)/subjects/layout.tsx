import type { ReactNode } from "react";

export default function SubjectsLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[var(--app-bg)] text-[var(--text)]">
      <div className="mx-auto max-w-7xl px-6 py-6">
        <div className="sticky top-0 z-10 border-b border-[var(--border)] bg-[var(--app-bg)]/80 backdrop-blur">
          <h1 className="py-4 text-2xl font-semibold">My Subjects</h1>
        </div>
        <div className="pt-6">{children}</div>
      </div>
    </div>
  );
}
