interface TopicPriorityListProps {
  topics: Array<{
    id: string;
    name: string;
    accuracy: number;
    priority: number;
  }>;
}

export function TopicPriorityList({ topics: _topics }: TopicPriorityListProps) {
  return null;
}
