import Link from "next/link";

import { QuestionCard } from "../dashboard/_components/QuestionCard";
import UpcomingTasksCard from "../dashboard/_components/Upcoming";
import  {TopicCard}  from "../dashboard/_components/TopicCard";
import { LatestPost } from "~/app/components/post";
import { auth } from "~/server/auth";
import { api, HydrateClient } from "~/trpc/server";

const quickLinks = [
  {
    title: "View Modules",
    description: "Browse topics, lessons, and supporting resources.",
    href: "/modules",
  },
  {
    title: "Assignments",
    description: "Stay on top of submissions and upcoming due dates.",
    href: "/assignments",
  },
  {
    title: "Grades",
    description: "Review performance insights and feedback.",
    href: "/grades",
  },
  {
    title: "Community",
    description: "Connect with classmates and mentors.",
    href: "/community",
  },
] as const;

export default async function Home() {
  const hello = await api.post.hello({ text: "from tRPC" });
  const session = await auth();
  console.log("Session:", session);
  if (!session) {
    redirect("/login");
  }

  if (session?.user) {
    void api.post.getLatest.prefetch();
  }

  const userName = session?.user?.name ?? "there";

  return (
    <HydrateClient>
      <main className="min-h-screen bg-background text-foreground">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 py-10 lg:px-12 lg:py-16">
          <section className="rounded-3xl bg-gradient-to-r from-primary via-primary/90 to-primary/80 p-8 text-primary-foreground shadow-2xl lg:p-12">
            <p className="text-sm uppercase tracking-[0.35em] text-primary-foreground/80">
              Dashboard
            </p>
            <h1 className="mt-4 text-3xl font-semibold leading-tight sm:text-4xl">
              Welcome back, {userName}
            </h1>
            <p className="mt-3 max-w-xl text-base text-primary-foreground/80 sm:text-lg">
              {hello
                ? hello.greeting
                : "Loading your personalised workspace..."}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href={session ? "/api/auth/signout" : "/api/auth/signin"}
                className="rounded-full bg-primary-foreground px-6 py-2 text-sm font-semibold text-primary transition hover:bg-primary-foreground/90"
              >
                {session ? "Sign out" : "Sign in"}
              </Link>
              <Link
                href="/settings"
                className="rounded-full border border-primary-foreground/40 px-6 py-2 text-sm font-semibold text-primary-foreground transition hover:border-primary-foreground hover:text-white/90"
              >
                Account settings
              </Link>
            </div>
          </section>

          <section className="grid gap-6 md:grid-cols-[2fr_1fr]">
            <QuestionCard />
            <aside className="flex flex-col gap-6">
              <TopicCard />
              <UpcomingTasksCard />
            </aside>
          </section>

          <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {quickLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="group rounded-2xl border border-border/60 bg-card p-6 transition hover:-translate-y-1 hover:border-primary hover:shadow-lg"
              >
                <h2 className="text-lg font-semibold text-card-foreground">
                  {link.title}
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  {link.description}
                </p>
                <span className="mt-4 inline-flex items-center text-sm font-semibold text-primary group-hover:gap-2">
                  Explore
                  <svg
                    aria-hidden="true"
                    className="size-4 transition-transform group-hover:translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path d="M5 12h14" />
                    <path d="m12 5 7 7-7 7" />
                  </svg>
                </span>
              </Link>
            ))}
          </section>

          {session?.user && (
            <section className="rounded-3xl border border-border/60 bg-card/80 p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-card-foreground">
                Latest activity
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Keep track of your most recent contributions.
              </p>
              <div className="mt-4">
                <LatestPost />
              </div>
            </section>
          )}
        </div>
      </main>
    </HydrateClient>
  );
}
