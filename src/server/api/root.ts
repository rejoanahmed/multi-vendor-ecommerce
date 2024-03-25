import { postRouter } from "~/server/api/routers/post";
import { createTRPCRouter } from "~/server/api/trpc";
import { vectorSearchRouter } from "./routers/vector_search";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  post: postRouter,
  vectorSearch: vectorSearchRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
