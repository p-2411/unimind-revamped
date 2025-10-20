import type { Stats } from "@/lib/types";

type SubjectStatsProps = {
  stats: Stats;
};

export function SubjectStats({ stats }: SubjectStatsProps) {
  const accuracyPercent = clampToPercent(stats.accuracy);
  const totalMinutes = clampToNonNegative(stats.timeMins);
  const totalQuestions = clampToNonNegative(stats.questions);

  return (
    <section className="flex flex-col gap-4">
      <h4 className="text-base font-semibold text-[var(--text)]">
        Performance Overview
      </h4>
      <div className="grid gap-3 sm:grid-cols-3">
        <Stat label="Accuracy" value={`${accuracyPercent}%`} />
        <Stat label="Time" value={`${totalMinutes} m`} />
        <Stat label="Questions" value={`${totalQuestions}`} />
      </div>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)]/60 p-3">
      <span className="text-xs font-semibold uppercase text-[var(--text-muted)]">
        {label}
      </span>
      <p className="mt-1 text-lg font-semibold text-[var(--text)]">{value}</p>
    </div>
  );
}

function clampToPercent(value: number) {
  if (!Number.isFinite(value)) {
    return 0;
  }

  if (value > 1) {
    return Math.round(Math.min(value, 100));
  }

  if (value < 0) {
    return 0;
  }

  return Math.round(value * 100);
}

function clampToNonNegative(value: number) {
  if (!Number.isFinite(value) || value < 0) {
    return 0;
  }

  return Math.round(value);
}
