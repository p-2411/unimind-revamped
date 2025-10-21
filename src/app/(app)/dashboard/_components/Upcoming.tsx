import { Card, CardTitle, CardHeader, CardContent } from "~/app/components/ui/card";

export default function UpcomingTasksCard() {
  return (
    <Card className="rounded-3xl border border-[var(--border)] bg-[var(--surface)]/95 text-[var(--text)] shadow-lg">
      <CardHeader className="px-6 pb-0 pt-6">
        <CardTitle className="text-lg font-semibold text-[var(--text)]">
          Upcoming tasks
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 px-6 pb-6 pt-4">
        {upcomingTasks.map((task) => (
          <div
            key={task.id}
            className="rounded-2xl border border-[var(--border)] bg-[var(--surface-muted)]/70 p-4 transition hover:border-[var(--primary)]/40 hover:bg-[var(--surface-muted)]"
          >
            <div className="flex items-center justify-between text-sm font-medium">
              <span>{task.title}</span>
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[var(--text-muted)]">
                {task.dueLabel}
              </span>
            </div>
            <p className="mt-1 text-xs text-[var(--text-muted)]">{task.course}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
