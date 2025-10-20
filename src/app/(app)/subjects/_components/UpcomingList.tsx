import type { Event } from "@/lib/types";

type UpcomingListProps = {
  events: Event[];
};

export function UpcomingList({ events }: UpcomingListProps) {
  const hasEvents = events.length > 0;

  return (
    <section className="flex flex-col gap-4">
      <h4 className="text-base font-semibold text-[var(--text)]">
        Upcoming Deadlines
      </h4>
      {hasEvents ? (
        <ul className="space-y-2">
          {events.map((event) => (
            <li
              key={event.id}
              className="rounded-lg border border-[var(--border)] bg-[var(--surface)]/60 p-3 transition hover:bg-[var(--surface)]/80"
            >
              <span className="block text-sm font-medium text-[var(--text)]">
                {event.title}
              </span>
              <span className="text-xs text-[var(--text-muted)]">
                {formatDateTime(event.dueAt)}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="rounded-lg border border-dashed border-[var(--border)] bg-[var(--surface)]/40 px-4 py-6 text-center text-sm text-[var(--text-muted)]">
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
