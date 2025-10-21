import Link from "next/link";
import { redirect } from "next/navigation";

import { QuestionCard } from "../dashboard/_components/QuestionCard";
import UpcomingTasksCard from "../dashboard/_components/Upcoming";
import  {TopicCard}  from "../dashboard/_components/TopicCard";
import { LatestPost } from "~/app/components/post";
import { auth } from "~/server/auth";
import { api, HydrateClient } from "~/trpc/server";

const quickStats = [
  {
    id: "modules",
    label: "Modules completed",
    value: "12",
    helper: "+3 this week",
  },
  {
    id: "accuracy",
    label: "Average accuracy",
    value: "74%",
    helper: "Up 6% vs last week",
  },
  {
    id: "streak",
    label: "Daily streak",
    value: "8 days",
    helper: "Keep going!",
  },
] as const;

const priorityTopics: TopicCardProps[] = [
  {
    title: "Derivatives",
    category: "Mathematics",
    icon: "∂",
    mastery: 0.62,
  },
  {
    title: "Cell Biology",
    category: "Science",
    icon: "🧬",
    mastery: 0.58,
  },
  {
    title: "World Wars",
    category: "History",
    icon: "📜",
    mastery: 0.45,
  },
  {
    title: "Probability",
    category: "Mathematics",
    icon: "Σ",
    mastery: 0.71,
  },
];

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-10">
      <section className="overflow-hidden rounded-3xl border border-[var(--border)] bg-gradient-to-r from-[var(--surface)] via-[var(--surface-muted)] to-[var(--surface)] px-8 py-8 shadow-lg">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <Welcome />
          <div className="flex flex-wrap gap-3">
            <Button className="rounded-full bg-[var(--primary)] px-6 text-[var(--text-on-primary)] hover:bg-[var(--primary)]/90">
              Plan my study day
            </Button>
            <Button
              variant="outline"
              className="rounded-full border-[var(--border)] bg-[var(--surface)] px-6 text-[var(--text)] hover:border-[var(--primary)]/40 hover:bg-[var(--primary)]/10"
            >
              View analytics
            </Button>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <UserProgressCard />
        <div className="flex flex-col gap-6">
          <Card className="rounded-3xl border border-[var(--border)] bg-[var(--surface)]/95 text-[var(--text)] shadow-lg">
            <CardHeader className="px-6 pb-0 pt-6">
              <CardTitle className="text-lg font-semibold">This week</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 px-6 pb-6 pt-5 sm:grid-cols-3">
              {quickStats.map((stat) => (
                <div
                  key={stat.id}
                  className="rounded-2xl border border-[var(--border)] bg-[var(--surface-muted)]/80 px-4 py-3 shadow-sm"
                >
                  <p className="text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-[var(--text-muted)]">
                    {stat.label}
                  </p>
                  <p className="mt-2 text-xl font-semibold">{stat.value}</p>
                  <p className="text-xs text-[var(--text-muted)]">{stat.helper}</p>
                </div>
              ))}
            </CardContent>
          </Card>
          <UpcomingTasksCard />
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-xl font-semibold text-[var(--text)]">
            Priority topics
          </h2>
          <p className="text-sm text-[var(--text-muted)]">
            Focus on these to boost your retention score.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {priorityTopics.map((topic) => (
            <TopicCard key={topic.title} {...topic} />
          ))}
        </div>
      </section>

      <Separator className="bg-[var(--border)]" />

      <section className="flex flex-col gap-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-xl font-semibold text-[var(--text)]">
            Daily check-in
          </h2>
          <p className="text-sm text-[var(--text-muted)]">
            Answer the quick question below to reinforce today&apos;s concept.
          </p>
        </div>
        <QuestionCard />
      </section>
    </div>
  );
}
