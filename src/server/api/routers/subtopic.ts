/*
  subtopic.byTopic GETS all subtopics in a topic with usage counts (logged in)
  subtopic.details GETS one subtopic with questions and recent attempts (logged in)
  subtopic.setScore UPDATES the subtopic score (logged in)
*/

import { TRPCError } from "@trpc/server";
import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";
import { db } from "~/server/db";

const flattenQuestionIds = (
  items: {
    questions: { id: string; difficulty: number }[];
  }[],
) =>
  items.flatMap((subtopic: (typeof items)[number]) =>
    subtopic.questions.map(
      (question: (typeof subtopic.questions)[number]) => question.id,
    ),
  );

export const subtopicRouter = createTRPCRouter({
  byTopic: protectedProcedure
    .input(z.object({ topicId: z.string() }))
    .query(async ({ ctx, input }) => {
      const subtopics = await db.subtopic.findMany({
        where: { topicId: input.topicId },
        include: {
          questions: {
            select: { id: true, difficulty: true },
            orderBy: [{ difficulty: "asc" }, { createdAt: "asc" }],
          },
        },
        orderBy: { score: "desc" },
      });

      const questionIds = flattenQuestionIds(subtopics);

      const attemptCounts: {
        questionId: string;
        _count: { _all: number };
      }[] =
        questionIds.length === 0
          ? []
          : await db.questionAttempt.groupBy({
              by: ["questionId"],
              where: {
                userId: ctx.session.user.id,
                questionId: { in: questionIds },
              },
              _count: { _all: true },
            });

      const countsByQuestion = new Map(
        attemptCounts.map(
          (entry: (typeof attemptCounts)[number]) =>
            [entry.questionId, entry._count._all] as const,
        ),
      );

      return subtopics.map((subtopic: (typeof subtopics)[number]) => {
        const totalQuestions = subtopic.questions.length;
        const totalAttempts = subtopic.questions.reduce(
          (sum: number, question: (typeof subtopic.questions)[number]) =>
            sum + (countsByQuestion.get(question.id) ?? 0),
          0,
        );

        return {
          id: subtopic.id,
          name: subtopic.name,
          description: subtopic.description,
          score: subtopic.score,
          totalQuestions,
          totalAttempts,
          questions: subtopic.questions,
        };
      });
    }),

  details: protectedProcedure
    .input(z.object({ subtopicId: z.string() }))
    .query(async ({ ctx, input }) => {
      const subtopic = await db.subtopic.findUnique({
        where: { id: input.subtopicId },
        include: {
          topic: {
            select: {
              id: true,
              name: true,
              courseId: true,
              course: { select: { name: true } },
            },
          },
          questions: {
            orderBy: [{ difficulty: "asc" }, { createdAt: "asc" }],
            include: {
              attempts: {
                where: { userId: ctx.session.user.id },
                orderBy: { answeredAt: "desc" },
                take: 10,
                select: {
                  id: true,
                  isCorrect: true,
                  answeredAt: true,
                  timeSpent: true,
                },
              },
            },
          },
        },
      });

      if (!subtopic) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Subtopic not found.",
        });
      }

      return {
        id: subtopic.id,
        name: subtopic.name,
        description: subtopic.description,
        score: subtopic.score,
        topic: subtopic.topic,
        questions: subtopic.questions.map(
          (question: (typeof subtopic.questions)[number]) => ({
            id: question.id,
            difficulty: question.difficulty,
            answerIndex: question.answerIndex,
            attempts: question.attempts,
          }),
        ),
      };
    }),

  setScore: protectedProcedure
    .input(
      z.object({
        subtopicId: z.string(),
        score: z.number().int().min(0).max(100),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const subtopic = await db.subtopic.findUnique({
        where: { id: input.subtopicId },
        select: { topicId: true },
      });

      if (!subtopic) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Subtopic not found.",
        });
      }

      return db.subtopic.update({
        where: { id: input.subtopicId },
        data: { score: input.score },
      });
    }),
});
