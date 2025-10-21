import { Progress } from "@/components/ui/progress";
import type { Topic } from "@/lib/types";

type TopicPriorityListProps = {
  topics: Topic[];
};

export function TopicPriorityList({ topics }: TopicPriorityListProps) {
  const sortedTopics = [...topics].sort(
    (a, b) => (b?.priority ?? 0) - (a?.priority ?? 0),
  );

  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]">
          Topic priority
        </h4>
        <span className="rounded-full bg-[var(--primary)]/12 px-3 py-1 text-xs font-medium text-[var(--primary)]">
          {sortedTopics.length} topics
        </span>
      </div>
      {sortedTopics.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-[var(--border)] bg-[var(--surface-muted)]/50 px-4 py-6 text-center text-sm text-[var(--text-muted)]">
          No topics assigned yet.
        </p>
      ) : (
        <ul className="space-y-3">
          {sortedTopics.map((topic) => {
            const priorityPercent = clampToPercent(topic.priority);
            const accuracyPercent = clampToPercent(topic.accuracy);

            return (
              <li
                key={topic.id}
                className="rounded-2xl border border-[var(--border)] bg-[var(--surface)]/90 p-4 shadow-sm transition hover:border-[var(--primary)]/45 hover:bg-[var(--surface-muted)]"
              >
                <div className="flex items-center justify-between text-sm font-semibold text-[var(--text)]">
                  <span>{topic.name}</span>
                  <span className="text-xs uppercase tracking-[0.3em] text-[var(--text-muted)]">
                    {priorityPercent}%
                  </span>
                </div>
                <div className="mt-3">
                  <Progress
                    value={priorityPercent}
                    className="h-2 bg-[var(--track)] [&_[data-slot=progress-indicator]]:bg-[var(--primary)]"
                  />
                </div>
                <p className="mt-2 text-xs text-[var(--text-muted)]">
                  Accuracy {accuracyPercent}%
                </p>
              </li>
            );
          })}
        </ul>
      )}
    </section>
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
