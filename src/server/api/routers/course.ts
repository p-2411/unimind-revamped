/*
  course.list GETS the course catalog with Topic/Subtopic counts (everyone)
  course.details GETS a specific course with nested progress (logged in)
  course.enroll ENROLLS the current user into a course (logged in)
  course.create CREATES a new course entry (logged in)
*/

import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { db } from "~/server/db";

export const courseRouter = createTRPCRouter({
  list: publicProcedure.query(async () => {
    return db.course.findMany({
      include: {
        topics: {
          include: { _count: { select: { subtopics: true } } },
          orderBy: { name: "asc" },
        },
        _count: { select: { assessments: true, users: true } },
      },
      orderBy: { name: "asc" },
    });
  }),

  details: protectedProcedure
    .input(z.object({ courseId: z.string() }))
    .query(async ({ ctx, input }) => {
      return db.course.findUnique({
        where: { id: input.courseId },
        include: {
          topics: {
            include: {
              subtopics: {
                include: {
                  questions: { select: { id: true, difficulty: true } },
                },
                orderBy: { name: "asc" },
              },
              userTopics: {
                where: { userId: ctx.session.user.id },
                select: { score: true, updatedAt: true },
              },
            },
            orderBy: { name: "asc" },
          },
          assessments: { orderBy: { date: "asc" } },
        },
      });
    }),

  enroll: protectedProcedure
    .input(z.object({ courseId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return db.userCourse.upsert({
        where: {
          userId_courseId: {
            userId: ctx.session.user.id,
            courseId: input.courseId,
          },
        },
        update: { enrolledAt: new Date() },
        create: {
          userId: ctx.session.user.id,
          courseId: input.courseId,
        },
      });
    }),

  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(3),
        description: z.string().optional(),
        color: z.string().optional(),
        icon: z.string().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      return db.course.create({
        data: {
          name: input.name,
          description: input.description,
          color: input.color,
          icon: input.icon,
        },
      });
    }),
});
