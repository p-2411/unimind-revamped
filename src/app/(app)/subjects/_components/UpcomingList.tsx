import { Card, CardContent, CardHeader, CardTitle } from "~/app/components/ui/card";

type UpcomingEvent = {
  id: string;
  title: string;
  dueAt: string;
};

type UpcomingListProps = {
  events: UpcomingEvent[];
};

const dateFormatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: "medium",
  timeStyle: "short",
});

export function UpcomingList({ events }: UpcomingListProps) {
  return (
    <Card className="w-full rounded-3xl border border-border/50 bg-card shadow-lg">
      <CardHeader className="px-6 pb-4 pt-6">
        <CardTitle className="text-xl font-semibold text-card-foreground">
          Upcoming Deadlines
        </CardTitle>
      </CardHeader>
      <CardContent className="px-6 pb-6">
        <ul className="space-y-3">
          {events.map((event) => {
            const formattedDue = dateFormatter.format(new Date(event.dueAt));

            return (
              <li
                key={event.id}
                className="rounded-md border border-[color:var(--border)] bg-[color:var(--card)]/60 px-4 py-3 transition hover:bg-[color:var(--muted)]/35"
              >
                <strong className="block text-sm font-semibold text-[color:var(--foreground)]">
                  {event.title}
                </strong>
                <span className="mt-1 block text-xs text-[color:var(--muted-foreground)]">
                  {formattedDue}
                </span>
              </li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
}
