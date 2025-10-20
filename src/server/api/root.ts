import { assessmentRouter } from "~/server/api/routers/assessment";
import { courseRouter } from "~/server/api/routers/course";
import { postRouter } from "~/server/api/routers/post";
import { questionRouter } from "~/server/api/routers/question";
import { statsRouter } from "~/server/api/routers/stats";
import { subtopicRouter } from "~/server/api/routers/subtopic";
import { topicRouter } from "~/server/api/routers/topic";
import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  post: postRouter,
  course: courseRouter,
  topic: topicRouter,
  subtopic: subtopicRouter,
  question: questionRouter,
  stats: statsRouter,
  assessment: assessmentRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
