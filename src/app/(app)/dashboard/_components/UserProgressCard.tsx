import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Progress } from "../../../components/ui/progress";

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
  const xpRemaining = stubProgress.xpNext - stubProgress.xpCurrent;

  return (
    <Card className="w-full max-w-md rounded-3xl border border-border/60 bg-card shadow-lg transition hover:shadow-xl">
      <CardHeader className="rounded-t-3xl px-7 pb-4 pt-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="grid h-16 w-16 place-items-center rounded-2xl bg-muted shadow-[inset_0_0_12px_rgb(0_0_0/0.06)]">
              <span className="text-2xl font-semibold text-muted-foreground">
                {stubProgress.userName
                  .split(" ")
                  .map((chunk) => chunk[0])
                  .join("")
                  .slice(0, 2)}
              </span>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground/80">
                Learner profile
              </p>
              <CardTitle className="text-xl font-semibold text-foreground">
                {stubProgress.userName}
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                {stubProgress.streakDays}-day streak · Rank #{stubProgress.rank}
              </p>
            </div>
          </div>
          <div className="flex flex-col items-center gap-1 rounded-2xl bg-gradient-to-br from-primary via-primary/90 to-primary/80 px-5 py-4 text-primary-foreground shadow-lg">
            <span className="text-xs uppercase tracking-wide text-primary-foreground/80">
              Level
            </span>
            <span className="text-3xl font-bold leading-none">
              {stubProgress.level}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-5 px-7 pb-6 pt-2">
        <div className="rounded-2xl border border-border/50 bg-muted/30 p-4">
          <div className="flex items-center justify-between text-sm font-medium">
            <span className="text-muted-foreground">XP Progress</span>
            <span className="text-foreground">
              {stubProgress.xpCurrent} / {stubProgress.xpNext}
            </span>
          </div>
          <Progress
            value={xpPercentage}
            className="mt-3 h-3 bg-muted/50"
          />
          <p className="mt-2 text-xs text-muted-foreground">
            {xpRemaining} XP until level {stubProgress.level + 1}.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-border/40 bg-card/70 px-4 py-3 text-center shadow-sm">
            <p className="text-xs uppercase tracking-wide text-muted-foreground/80">
              Rank
            </p>
            <p className="text-lg font-semibold text-foreground">
              #{stubProgress.rank}
            </p>
          </div>
          <div className="rounded-2xl border border-border/40 bg-card/70 px-4 py-3 text-center shadow-sm">
            <p className="text-xs uppercase tracking-wide text-muted-foreground/80">
              Streak
            </p>
            <p className="text-lg font-semibold text-foreground">
              {stubProgress.streakDays} days
            </p>
          </div>
          <div className="rounded-2xl border border-border/40 bg-gradient-to-br from-amber-300/80 via-amber-200/80 to-amber-100/80 px-4 py-3 text-center shadow-sm">
            <p className="text-xs uppercase tracking-wide text-amber-900/70">
              Badge
            </p>
            <p className="text-lg font-semibold text-amber-900">
              {stubProgress.badgeLabel}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
