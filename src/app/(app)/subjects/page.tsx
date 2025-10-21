import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { Subject } from "@/lib/types";

import { SubjectSection } from "./_components/SubjectSection";

const now = Date.now();

const subjects: Subject[] = [
  {
    id: "math",
    name: "Mathematics",
    topics: [
      { id: "deriv", name: "Derivatives", accuracy: 0.62, priority: 0.82 },
      { id: "int", name: "Integrals", accuracy: 0.74, priority: 0.58 },
      { id: "algebra", name: "Linear Algebra", accuracy: 0.81, priority: 0.41 },
    ],
    events: [
      {
        id: "math-quiz",
        title: "Quiz: Differential Calculus",
        dueAt: new Date(now + 2 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ],
    stats: { accuracy: 0.68, timeMins: 210, questions: 124 },
  },
  {
    id: "science",
    name: "Science",
    topics: [
      { id: "cells", name: "Cell Biology", accuracy: 0.56, priority: 0.76 },
      { id: "forces", name: "Forces & Motion", accuracy: 0.63, priority: 0.64 },
    ],
    events: [
      {
        id: "lab-report",
        title: "Lab Report Submission",
        dueAt: new Date(now + 5 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "science-review",
        title: "Study Group: Energy Systems",
        dueAt: new Date(now + 7 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ],
    stats: { accuracy: 0.61, timeMins: 180, questions: 98 },
  },
  {
    id: "history",
    name: "History",
    topics: [],
    events: [],
    stats: { accuracy: 0.52, timeMins: 95, questions: 47 },
  },
];

const totalSubjects = subjects.length;
const totalUpcomingEvents = subjects.reduce(
  (count, subject) => count + subject.events.length,
  0,
);
const averageAccuracy = Math.round(
  (subjects.reduce((sum, subject) => sum + subject.stats.accuracy, 0) /
    Math.max(totalSubjects, 1)) *
    100,
);
const totalQuestionsPracticed = subjects.reduce(
  (sum, subject) => sum + subject.stats.questions,
  0,
);

export default function SubjectsPage() {
  return (
    <div className="flex flex-col gap-10">
      <section className="overflow-hidden rounded-3xl border border-[var(--border)] bg-gradient-to-r from-[var(--surface)] via-[var(--surface-muted)] to-[var(--surface)] px-8 py-8 text-[var(--text)] shadow-lg">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-3">
            <span className="text-xs font-semibold uppercase tracking-[0.35em] text-[var(--text-muted)]">
              My subjects
            </span>
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Curate your personalised learning plan
            </h1>
            <p className="max-w-2xl text-sm text-[var(--text-muted)] sm:text-base">
              Review your enrolled subjects, keep an eye on upcoming milestones, and monitor
              performance trends to stay one step ahead.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button className="rounded-full bg-[var(--primary)] px-6 text-[var(--text-on-primary)] hover:bg-[var(--primary)]/90">
              Start practice
            </Button>
            <Button
              variant="outline"
              className="rounded-full border-[var(--border)] bg-[var(--surface)] px-6 text-[var(--text)] hover:border-[var(--primary)]/40 hover:bg-[var(--primary)]/10"
            >
              Browse catalog
            </Button>
          </div>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <SummaryCard label="Active subjects" value={totalSubjects} />
          <SummaryCard label="Avg. accuracy" value={`${averageAccuracy}%`} />
          <SummaryCard label="Upcoming events" value={totalUpcomingEvents} />
          <SummaryCard label="Questions practised" value={totalQuestionsPracticed} />
        </div>
      </section>

      <Separator className="bg-[var(--border)]" />

      <section className="flex flex-col gap-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-[var(--text)]">
              Subject details
            </h2>
            <p className="text-sm text-[var(--text-muted)]">
              Deep dive into performance, upcoming deadlines, and topic priority for each course.
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="rounded-full border-[var(--border)] bg-[var(--surface)] px-5 text-sm font-medium text-[var(--text)] hover:border-[var(--primary)]/40 hover:bg-[var(--primary)]/10"
            >
              Manage enrollment
            </Button>
            <Button
              variant="ghost"
              className="rounded-full border border-transparent px-5 text-sm font-medium text-[var(--text)] hover:border-[var(--border)] hover:bg-[var(--surface-muted)]"
            >
              Export summary
            </Button>
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {subjects.map((subject) => (
            <SubjectSection
              key={subject.id}
              subjectId={subject.id}
              name={subject.name}
              topics={subject.topics}
              events={subject.events}
              stats={subject.stats}
              initiallyEnrolled
            />
          ))}
        </div>
      </section>
    </div>
  );
}

function SummaryCard({ label, value }: { label: string; value: number | string }) {
  return (
    <Card className="rounded-2xl border border-[var(--border)] bg-[var(--surface)]/90 shadow-md">
      <CardContent className="space-y-3 p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--text-muted)]">
          {label}
        </p>
        <p className="text-3xl font-semibold text-[var(--text)]">{value}</p>
      </CardContent>
    </Card>
  );
}
