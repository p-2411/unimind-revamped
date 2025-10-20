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
    <section className="flex flex-col gap-4">
      <h4 className="text-base font-semibold text-[var(--text)]">
        Topic Priority
      </h4>
      {sortedTopics.length === 0 ? (
        <p className="rounded-lg border border-dashed border-[var(--border)] bg-[var(--surface)]/40 px-4 py-6 text-center text-sm text-[var(--text-muted)]">
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
                className="rounded-lg border border-[var(--border)] bg-[var(--surface)]/60 p-4"
              >
                <div className="flex items-center justify-between text-sm font-medium text-[var(--text)]">
                  <span>{topic.name}</span>
                  <span className="text-[var(--text-muted)]">
                    Priority {priorityPercent}%
                  </span>
                </div>
                <div className="mt-2">
                  <Progress
                    value={priorityPercent}
                    className="bg-[var(--track)] [&_[data-slot=progress-indicator]]:bg-[var(--primary)]"
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
