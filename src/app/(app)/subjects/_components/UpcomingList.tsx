import type { Event } from "@/lib/types";

type UpcomingListProps = {
  events: Event[];
};

export function UpcomingList({ events }: UpcomingListProps) {
  const hasEvents = events.length > 0;

  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--text-muted)]">
          Upcoming deadlines
        </h4>
        {hasEvents ? (
          <span className="text-xs text-[var(--text-muted)]">
            Next {Math.min(events.length, 3)} events
          </span>
        ) : null}
      </div>
      {hasEvents ? (
        <ul className="space-y-2">
          {events.map((event) => (
            <li
              key={event.id}
              className="flex flex-col gap-1 rounded-2xl border border-[var(--border)] bg-[var(--surface)]/90 px-4 py-3 text-sm text-[var(--text)] transition hover:border-[var(--primary)]/45 hover:bg-[var(--surface-muted)]"
            >
              <span className="font-semibold">{event.title}</span>
              <span className="text-xs text-[var(--text-muted)]">
                {formatDateTime(event.dueAt)}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="rounded-2xl border border-dashed border-[var(--border)] bg-[var(--surface-muted)]/50 px-4 py-6 text-center text-sm text-[var(--text-muted)]">
          No upcoming events scheduled.
        </p>
      )}
    </section>
  );
}

function formatDateTime(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Date to be confirmed";
  }

  return date.toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}
