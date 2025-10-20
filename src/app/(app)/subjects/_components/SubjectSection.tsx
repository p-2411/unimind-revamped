import { Card, CardContent } from "@/components/ui/card";
import type { Event, Stats, Topic } from "@/lib/types";

import { EnrollmentPanel } from "./EnrollmentPanel";
import { SubjectStats } from "./SubjectStats";
import { TopicPriorityList } from "./TopicPriorityList";
import { UpcomingList } from "./UpcomingList";

type SubjectSectionProps = {
  subjectId: string;
  name: string;
  topics?: Topic[];
  events?: Event[];
  stats?: Stats;
  initiallyEnrolled?: boolean;
};

const EMPTY_TOPICS: Topic[] = [];
const EMPTY_EVENTS: Event[] = [];
const FALLBACK_STATS: Stats = {
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
  initiallyEnrolled,
}: SubjectSectionProps) {
  const displayName = name?.trim() ? name : "Untitled subject";
  const topicItems = topics && topics.length > 0 ? topics : EMPTY_TOPICS;
  const eventItems = events && events.length > 0 ? events : EMPTY_EVENTS;
  const statsData = stats ?? { ...FALLBACK_STATS };

  return (
    <Card className="rounded-xl border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] shadow-sm">
      <div className="flex items-center justify-between gap-4 border-b border-[var(--border)] px-6 py-4">
        <h3 className="text-lg font-semibold">{displayName}</h3>
        <EnrollmentPanel
          subjectId={subjectId}
          initiallyEnrolled={initiallyEnrolled}
        />
      </div>
      <CardContent className="flex flex-col gap-6 px-6 py-6">
        <TopicPriorityList topics={topicItems} />
        <UpcomingList events={eventItems} />
        <SubjectStats stats={statsData} />
      </CardContent>
    </Card>
  );
}
