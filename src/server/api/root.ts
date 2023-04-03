import { createTRPCRouter } from "~/server/api/trpc";
import { groupsRouter } from "~/server/api/routers/groups";
import { invitationsRouter } from "./routers/invitations";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  groups: groupsRouter,
  invitations: invitationsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
