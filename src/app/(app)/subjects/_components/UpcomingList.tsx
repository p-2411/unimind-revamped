interface UpcomingListProps {
  events: Array<{
    id: string;
    title: string;
    dueAt: string;
  }>;
}

export function UpcomingList({ events: _events }: UpcomingListProps) {
  return null;
}
