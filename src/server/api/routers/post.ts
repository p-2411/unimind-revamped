import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const postRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  getLatest: publicProcedure.query((): { id: string; name: string; createdAt: Date } | null => {
    // This is just a placeholder - you can implement this later
    return null;
  }),

  create: publicProcedure
    .input(z.object({ name: z.string().min(1) }))
    .mutation(async ({ input }) => {
      // Placeholder - just return the input for now
      // You can implement actual post creation later
      return {
        id: "placeholder",
        name: input.name,
        createdAt: new Date(),
      };
    }),
});
