import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const stubProgress = {
  userName: "Alex Rivers",
  level: 100,
  xpCurrent: 1840,
  xpNext: 2100,
  streakDays: 8,
  rank: 1,
  badgeLabel: "Flamekeeper",
} as const;

const xpPercentage = Math.round(
  (stubProgress.xpCurrent / stubProgress.xpNext) * 100,
);

export function UserProgressCard() {
  const initials = stubProgress.userName
    .split(" ")
    .map((chunk) => chunk[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const xpRemaining = stubProgress.xpNext - stubProgress.xpCurrent;

  return (
    <Card className="rounded-3xl border border-[var(--border)] bg-[var(--surface)]/95 text-[var(--text)] shadow-xl">
      <CardHeader className="flex flex-col gap-6 px-7 pb-0 pt-7">
        <div className="flex items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="grid size-16 place-items-center rounded-2xl bg-[var(--surface-muted)] shadow-inner">
              <span className="text-2xl font-semibold text-[var(--text)]/90">
                {initials}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[var(--text-muted)]">
                Learner profile
              </p>
              <CardTitle className="text-2xl font-semibold text-[var(--text)]">
                {stubProgress.userName}
              </CardTitle>
              <p className="text-sm text-[var(--text-muted)]">
                {stubProgress.streakDays}-day streak · Rank #{stubProgress.rank}
              </p>
            </div>
          </div>
          <div className="grid place-items-center rounded-2xl bg-[var(--primary)] text-[var(--text-on-primary)] shadow-lg shadow-[var(--primary)]/40">
            <div className="flex flex-col items-center gap-1 px-6 py-4">
              <span className="text-[0.7rem] uppercase tracking-[0.3em] opacity-80">
                Level
              </span>
              <span className="text-3xl font-bold leading-none">
                {stubProgress.level}
              </span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6 px-7 pb-7 pt-6">
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-muted)]/80 p-4 shadow-sm">
          <div className="flex items-center justify-between text-sm font-medium">
            <span className="text-[var(--text-muted)]">XP progress</span>
            <span>
              {stubProgress.xpCurrent} / {stubProgress.xpNext}
            </span>
          </div>
          <Progress
            value={xpPercentage}
            className="mt-3 h-3 bg-[var(--track)] [&_[data-slot=progress-indicator]]:bg-[var(--primary)]"
          />
          <p className="mt-2 text-xs text-[var(--text-muted)]">
            {xpRemaining} XP until level {stubProgress.level + 1}.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <Stat label="Rank" value={`#${stubProgress.rank}`} />
          <Stat label="Streak" value={`${stubProgress.streakDays} days`} />
          <Stat label="Badge" value={stubProgress.badgeLabel} accent />
        </div>
      </CardContent>
    </Card>
  );
}

function Stat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div
      className={[
        "rounded-2xl border px-4 py-3 text-center shadow-sm",
        accent
          ? "border-transparent bg-gradient-to-br from-[var(--primary)]/30 via-[var(--primary)]/20 to-[var(--accent)]/25 text-[var(--text)]"
          : "border-[var(--border)] bg-[var(--surface)]/90 text-[var(--text)]",
      ].join(" ")}
    >
      <p className="text-[0.65rem] uppercase tracking-[0.3em] text-[var(--text-muted)]">
        {label}
      </p>
      <p className="mt-2 text-lg font-semibold">{value}</p>
    </div>
  );
}
