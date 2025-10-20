import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

type Topic = {
  id: string;
  name: string;
  accuracy: number;
  priority: number;
};

type TopicPriorityListProps = {
  topics: Topic[];
};

export function TopicPriorityList({ topics }: TopicPriorityListProps) {
  const sortedTopics = [...topics].sort((a, b) => b.priority - a.priority);

  return (
    <Card className="w-full rounded-3xl border border-border/50 bg-card shadow-lg">
      <CardHeader className="px-6 pb-4 pt-6">
        <CardTitle className="text-xl font-semibold text-card-foreground">
          Priority Topics
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 px-6 pb-6">
        {sortedTopics.map((topic) => {
          const progressValue = Math.max(
            0,
            Math.min(topic.accuracy, 100),
          );

          return (
            <div
              key={topic.id}
              className="rounded-2xl border border-border/40 bg-muted/20 px-4 py-3 shadow-sm"
            >
              <div className="flex items-center justify-between text-sm font-medium text-card-foreground">
                <span>{topic.name}</span>
                <span className="text-muted-foreground">
                  {Math.round(topic.priority)}%
                </span>
              </div>
              <Progress
                value={progressValue}
                className="mt-3 h-2 bg-[var(--track)] [&_[data-slot='progress-indicator']]:bg-[var(--primary)]"
              />
              <p className="mt-1 text-xs text-muted-foreground">
                Accuracy {Math.round(progressValue)}%
              </p>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
