export default function Welcome() {
  return (
    <div className="flex flex-col gap-2 text-[var(--text)]">
      <p className="text-xs font-semibold uppercase tracking-[0.4em] text-[var(--text-muted)]">
        Welcome back
      </p>
      <h1 className="text-3xl font-semibold leading-snug sm:text-4xl">
        Your learning snapshot is ready
      </h1>
      <p className="max-w-2xl text-sm text-[var(--text-muted)] sm:text-base">
        Track your momentum, stay on top of upcoming tasks, and dive back into
        the topics that need the most attention.
      </p>
    </div>
  );
}
