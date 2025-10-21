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
  const topicItems = topics ?? [];
  const eventItems = events ?? [];
  const statsData = stats ?? { ...FALLBACK_STATS };

  return (
    <Card className="flex h-full flex-col rounded-3xl border border-[var(--border)] bg-[var(--surface)]/95 text-[var(--text)] shadow-lg">
      <div className="flex items-center justify-between gap-4 border-b border-[var(--border)] bg-[var(--surface-muted)]/70 px-6 py-5">
        <div className="flex flex-col">
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--text-muted)]">
            Subject
          </span>
          <h3 className="text-lg font-semibold leading-tight text-[var(--text)]">
            {displayName}
          </h3>
        </div>
        <EnrollmentPanel subjectId={subjectId} initiallyEnrolled={initiallyEnrolled} />
      </div>
      <CardContent className="flex flex-col gap-6 px-6 py-6">
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
          <div className="flex flex-col gap-6">
            <TopicPriorityList topics={topicItems} />
            <UpcomingList events={eventItems} />
          </div>
          <SubjectStats stats={statsData} />
        </div>
      </CardContent>
    </Card>
  );
}
