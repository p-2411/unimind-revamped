/*
  topic.byCourse GETS all topics within a course (logged in)
  topic.details GETS details for a topic including subtopics and progress (logged in)
  topic.setScore UPDATES the user's score override for a topic (logged in)
*/

import { TRPCError } from "@trpc/server";
import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";
import { db } from "~/server/db";

export const topicRouter = createTRPCRouter({
  byCourse: protectedProcedure
    .input(z.object({ courseId: z.string() }))
    .query(async ({ ctx, input }) => {
      const topics = await db.topic.findMany({
        where: { courseId: input.courseId },
        include: {
          subtopics: {
            include: { _count: { select: { questions: true } } },
            orderBy: { name: "asc" },
          },
          userTopics: {
            where: { userId: ctx.session.user.id },
            select: { score: true, updatedAt: true },
          },
        },
        orderBy: { name: "asc" },
      });

      return topics.map((topic: (typeof topics)[number]) => {
        const progress = topic.userTopics[0];

        return {
          id: topic.id,
          name: topic.name,
          description: topic.description,
          subtopics: topic.subtopics,
          totalSubtopics: topic.subtopics.length,
          userScore: progress?.score ?? 0,
          userScoreUpdatedAt: progress?.updatedAt ?? null,
        };
      });
    }),

  details: protectedProcedure
    .input(z.object({ topicId: z.string() }))
    .query(async ({ ctx, input }) => {
      const topic = await db.topic.findUnique({
        where: { id: input.topicId },
        include: {
          course: { select: { id: true, name: true } },
          subtopics: {
            include: {
              _count: { select: { questions: true } },
              questions: {
                select: { id: true, difficulty: true, createdAt: true },
              },
            },
            orderBy: { name: "asc" },
          },
          userTopics: {
            where: { userId: ctx.session.user.id },
            select: { score: true, updatedAt: true },
          },
        },
      });

      if (!topic) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Topic not found.",
        });
      }

      const progress = topic.userTopics[0];

      return {
        id: topic.id,
        name: topic.name,
        description: topic.description,
        course: topic.course,
        subtopics: topic.subtopics.map(
          (subtopic: (typeof topic.subtopics)[number]) => ({
            id: subtopic.id,
            name: subtopic.name,
            description: subtopic.description,
            questions: subtopic.questions,
            totalQuestions: subtopic._count.questions,
          }),
        ),
        userScore: progress?.score ?? 0,
        userScoreUpdatedAt: progress?.updatedAt ?? null,
      };
    }),

  setScore: protectedProcedure
    .input(
      z.object({
        topicId: z.string(),
        score: z.number().min(0).max(100),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return db.userTopic.upsert({
        where: {
          userId_topicId: {
            userId: ctx.session.user.id,
            topicId: input.topicId,
          },
        },
        update: {
          score: input.score,
        },
        create: {
          userId: ctx.session.user.id,
          topicId: input.topicId,
          score: input.score,
        },
      });
    }),
});
