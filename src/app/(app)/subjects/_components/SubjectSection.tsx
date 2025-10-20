import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { EnrollmentPanel } from "./EnrollmentPanel";
import { SubjectStats } from "./SubjectStats";
import { TopicPriorityList } from "./TopicPriorityList";
import { UpcomingList } from "./UpcomingList";

interface SubjectSectionProps {
  subjectId: string;
  name: string;
  topics?: Array<{
    id: string;
    name: string;
    accuracy: number;
    priority: number;
  }>;
  events?: Array<{
    id: string;
    title: string;
    dueAt: string;
  }>;
  stats?: {
    accuracy: number;
    timeMins: number;
    questions: number;
  };
}

const FALLBACK_TOPIC = {
  id: "topic-placeholder",
  name: "Topics coming soon",
  accuracy: 0,
  priority: 0,
};

const FALLBACK_EVENT = {
  id: "event-placeholder",
  title: "No upcoming events",
  dueAt: "TBD",
};

const FALLBACK_STATS = {
  accuracy: 0,
  timeMins: 0,
  questions: 0,
};

export function SubjectSection({
  subjectId,
  name,
  topics,
  events,
  stats,
}: SubjectSectionProps) {
  const displayName = name?.trim() ? name : "Untitled subject";
  const topicItems =
    topics && topics.length > 0
      ? topics
      : [{ ...FALLBACK_TOPIC, id: `${subjectId}-${FALLBACK_TOPIC.id}` }];
  const eventItems =
    events && events.length > 0
      ? events
      : [{ ...FALLBACK_EVENT, id: `${subjectId}-${FALLBACK_EVENT.id}` }];
  const statsData = stats ?? { ...FALLBACK_STATS };

  return (
    <Card className="bg-muted/10 backdrop-blur">
      <CardHeader className="border-b border-border pb-6">
        <CardTitle className="text-xl font-semibold text-foreground">
          {displayName}
        </CardTitle>
        <CardAction>
          <EnrollmentPanel subjectId={subjectId} />
        </CardAction>
      </CardHeader>
      <CardContent className="grid gap-6 lg:grid-cols-[minmax(0,1.65fr)_minmax(0,1fr)]">
        <div className="grid gap-6">
          <TopicPriorityList topics={topicItems} />
          <UpcomingList events={eventItems} />
        </div>
        <SubjectStats stats={statsData} />
      </CardContent>
    </Card>
  );
}
