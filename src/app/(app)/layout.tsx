import type { ReactNode } from "react";

import Sidebar from "../(app)/_components/Sidebar";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[var(--app-bg)] text-[var(--text)]">
      <Sidebar />
      <main className="flex-1 overflow-y-auto bg-transparent px-5 py-8 sm:px-8 lg:px-12">
        <div className="mx-auto flex max-w-6xl flex-col gap-10">{children}</div>
      </main>
    </div>
  );
}
