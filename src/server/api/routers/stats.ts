/*
  stats.overview GETS the stats summary for the user (logged in)
  stats.topicProgress GETS topic scores for the priority list (logged in)
  stats.assessmentSchedule GETS upcoming assessments for the dashboard (logged in)
*/

import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";
import { db } from "~/server/db";

const startOfDay = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate());

const addDays = (date: Date, days: number) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

const dateLabel = (date: Date) => startOfDay(date).toISOString().slice(0, 10);

const buildLastSevenDays = () => {
  const now = new Date();
  const days: { date: Date; label: string }[] = [];
  for (let offset = 6; offset >= 0; offset--) {
    const date = startOfDay(addDays(now, -offset));
    days.push({
      date,
      label: dateLabel(date),
    });
  }
  return days;
};

export const statsRouter = createTRPCRouter({
  overview: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;

    const since = addDays(startOfDay(new Date()), -6);

    const [stats, attempts] = await Promise.all([
      db.userStats.findUnique({ where: { userId } }),
      db.questionAttempt.findMany({
        where: { userId, answeredAt: { gte: since } },
        orderBy: { answeredAt: "asc" },
      }),
    ]);

    const dayBuckets = buildLastSevenDays().map((day) => ({
      label: day.label,
      total: 0,
      correct: 0,
    }));

    const bucketByLabel = new Map(dayBuckets.map((bucket) => [bucket.label, bucket]));

    for (const attempt of attempts) {
      const label = dateLabel(attempt.answeredAt);
      const bucket = bucketByLabel.get(label);
      if (!bucket) continue;
      bucket.total += 1;
      if (attempt.isCorrect) bucket.correct += 1;
    }

    return {
      stats,
      lastSevenDays: dayBuckets,
    };
  }),

  topicProgress: protectedProcedure
    .input(
      z.object({
        courseId: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      return db.userTopic.findMany({
        where: {
          userId,
          ...(input.courseId ? { topic: { courseId: input.courseId } } : {}),
        },
        include: {
          topic: {
            select: {
              id: true,
              name: true,
              courseId: true,
              course: { select: { name: true } },
            },
          },
        },
        orderBy: { updatedAt: "desc" },
      });
    }),

  assessmentSchedule: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;

    const upcomingAssessments = await db.userAssessment.findMany({
      where: {
        userId,
        assessment: { date: { gte: new Date() } },
      },
      orderBy: { assessment: { date: "asc" } },
      include: {
        assessment: {
          select: {
            id: true,
            name: true,
            date: true,
            description: true,
            course: { select: { id: true, name: true } },
          },
        },
      },
    });

    return upcomingAssessments;
  }),
});
