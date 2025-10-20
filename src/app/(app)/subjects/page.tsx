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

export default function SubjectsPage() {
  return (
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
  );
}
