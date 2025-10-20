/*
  assessment.upcoming GETS upcoming assessments for the user (logged in)
  assessment.details GETS details of an assessment including topics and enrollment status (logged in)
  assessment.setStatus UPDATES completion status and score for a user (logged in)
  assessment.create CREATES a new assessment (logged in)
*/

import { TRPCError } from "@trpc/server";
import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";
import { db } from "~/server/db";

export const assessmentRouter = createTRPCRouter({
  upcoming: protectedProcedure
    .input(
      z
        .object({
          courseId: z.string().optional(),
        })
        .optional(),
    )
    .query(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const courseFilter = input?.courseId
        ? { courseId: input.courseId }
        : {};

      return db.userAssessment.findMany({
        where: {
          userId,
          assessment: {
            date: { gte: new Date() },
            ...courseFilter,
          },
        },
        orderBy: { assessment: { date: "asc" } },
        include: {
          assessment: {
            include: {
              course: { select: { id: true, name: true } },
            },
          },
        },
      });
    }),

  details: protectedProcedure
    .input(z.object({ assessmentId: z.string() }))
    .query(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      const assessment = await db.assessment.findUnique({
        where: { id: input.assessmentId },
        include: {
          course: {
            select: { id: true, name: true },
          },
          users: {
            where: { userId },
            select: { isCompleted: true, score: true, completedAt: true },
          },
        },
      });

      if (!assessment) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Assessment not found.",
        });
      }

      return {
        ...assessment,
        enrollment: assessment.users[0] ?? null,
      };
    }),

  setStatus: protectedProcedure
    .input(
      z.object({
        assessmentId: z.string(),
        isCompleted: z.boolean(),
        score: z.number().int().min(0).max(100).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      const enrollment = await db.userAssessment.upsert({
        where: {
          userId_assessmentId: {
            userId,
            assessmentId: input.assessmentId,
          },
        },
        update: {
          isCompleted: input.isCompleted,
          score: input.score ?? null,
          completedAt: input.isCompleted ? new Date() : null,
        },
        create: {
          userId,
          assessmentId: input.assessmentId,
          isCompleted: input.isCompleted,
          score: input.score ?? null,
          completedAt: input.isCompleted ? new Date() : null,
        },
        include: {
          assessment: {
            select: { courseId: true },
          },
        },
      });

      return enrollment;
    }),

  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(3),
        courseId: z.string(),
        date: z.date(),
        description: z.string().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      const assessment = await db.assessment.create({
        data: {
          name: input.name,
          courseId: input.courseId,
          date: input.date,
          description: input.description,
        },
      });

      return assessment;
    }),
});
