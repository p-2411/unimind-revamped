/*
  question.bySubtopic GETS all subtopic questions (logged in)
  question.next GETS the next question to show (logged in)
  question.submit RECORDS an answer and updates progress (logged in)
*/

import { TRPCError } from "@trpc/server";
import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";
import { db } from "~/server/db";

const normalizeDay = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate());

const diffInDays = (a: Date, b: Date) => {
  const msPerDay = 1000 * 60 * 60 * 24;
  return Math.floor(
    (normalizeDay(a).getTime() - normalizeDay(b).getTime()) / msPerDay,
  );
};

export const questionRouter = createTRPCRouter({
  bySubtopic: protectedProcedure
    .input(
      z.object({
        subtopicId: z.string(),
      }),
    )
    .query(async ({ input }) => {
      return db.question.findMany({
        where: { subtopicId: input.subtopicId },
        orderBy: [{ difficulty: "asc" }, { createdAt: "asc" }],
      });
    }),

  next: protectedProcedure
    .input(
      z.object({
        subtopicId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const questions = await db.question.findMany({
        where: { subtopicId: input.subtopicId },
        orderBy: [{ difficulty: "asc" }, { createdAt: "asc" }],
      });

      if (questions.length === 0) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "No questions available for that subtopic.",
        });
      }

      const recentAttempts = await db.questionAttempt.findMany({
        where: {
          userId: ctx.session.user.id,
          questionId: {
            in: questions.map(
              (question: (typeof questions)[number]) => question.id,
            ),
          },
        },
        orderBy: { answeredAt: "desc" },
        take: 20,
        select: { questionId: true },
      });

      const recentlySeenIds = new Set(
        recentAttempts.map(
          (attempt: (typeof recentAttempts)[number]) => attempt.questionId,
        ),
      );
      const unseen = questions.filter(
        (question: (typeof questions)[number]) =>
          !recentlySeenIds.has(question.id),
      );
      const pool = unseen.length > 0 ? unseen : questions;
      const random = pool[Math.floor(Math.random() * pool.length)];

      return random;
    }),

  submit: protectedProcedure
    .input(
      z.object({
        questionId: z.string(),
        isCorrect: z.boolean(),
        timeSpentMs: z.number().int().nonnegative().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const question = await db.question.findUnique({
        where: { id: input.questionId },
        include: { subtopic: { select: { id: true, topicId: true } } },
      });

      if (!question) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Question not found.",
        });
      }

      const attempt = await db.questionAttempt.create({
        data: {
          userId: ctx.session.user.id,
          questionId: input.questionId,
          isCorrect: input.isCorrect,
          timeSpent: input.timeSpentMs ?? null,
        },
      });

      const stats = await db.userStats.findUnique({
        where: { userId: ctx.session.user.id },
      });

      const now = new Date();
      const answered = (stats?.totalQuestionsAnswered ?? 0) + 1;
      const correct =
        (stats?.totalCorrectAnswers ?? 0) + (input.isCorrect ? 1 : 0);
      const timeSpent =
        (stats?.totalTimeSpent ?? 0) + (input.timeSpentMs ?? 0);

      const earnedXp = input.isCorrect
        ? 10 + question.difficulty * 5
        : 3 + question.difficulty * 2;
      const xp = (stats?.xp ?? 0) + earnedXp;
      const level = Math.floor(xp / 100) + 1;

      let currentStreak = stats?.currentStreak ?? 0;

      if (input.isCorrect) {
        if (stats?.lastActiveDate) {
          const gap = diffInDays(now, stats.lastActiveDate);
          if (gap === 0) {
            currentStreak = currentStreak;
          } else if (gap === 1) {
            currentStreak += 1;
          } else {
            currentStreak = 1;
          }
        } else {
          currentStreak = 1;
        }
      } else {
        currentStreak = 0;
      }

      const longestStreak = Math.max(currentStreak, stats?.longestStreak ?? 0);

      const updatedStats = await db.userStats.upsert({
        where: { userId: ctx.session.user.id },
        update: {
          totalQuestionsAnswered: answered,
          totalCorrectAnswers: correct,
          totalTimeSpent: timeSpent,
          xp,
          level,
          currentStreak,
          longestStreak,
          lastActiveDate: now,
        },
        create: {
          userId: ctx.session.user.id,
          totalQuestionsAnswered: answered,
          totalCorrectAnswers: correct,
          totalTimeSpent: timeSpent,
          xp,
          level,
          currentStreak,
          longestStreak,
          lastActiveDate: now,
        },
      });

      const existingTopicProgress = await db.userTopic.findUnique({
        where: {
          userId_topicId: {
            userId: ctx.session.user.id,
            topicId: question.subtopic.topicId,
          },
        },
      });

      const delta = input.isCorrect ? 8 : -5;
      const nextScore = existingTopicProgress
        ? Math.min(100, Math.max(0, existingTopicProgress.score + delta))
        : Math.max(0, delta);

      const topicProgress = await db.userTopic.upsert({
        where: {
          userId_topicId: {
            userId: ctx.session.user.id,
            topicId: question.subtopic.topicId,
          },
        },
        update: {
          score: nextScore,
        },
        create: {
          userId: ctx.session.user.id,
          topicId: question.subtopic.topicId,
          score: nextScore,
        },
      });

      return {
        attempt,
        stats: updatedStats,
        topic: topicProgress,
        earnedXp,
      };
    }),
});
