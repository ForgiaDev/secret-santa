import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { pusher } from "~/utils/pusher";

export const groupsRouter = createTRPCRouter({
  // Obtain all groups that the user is a member of
  getAll: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.group.findMany({
      where: { users: { some: { id: ctx.session.user.id } } },
      include: { users: true },
    });
  }),

  // Obtain a single group that the user is a member of
  get: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(({ input, ctx }) => {
      return ctx.prisma.group.findFirst({
        where: {
          id: input.id,
          users: { some: { id: ctx.session.user.id } },
        },
        include: {
          users: true,
          invitations: true,
          messages: {
            include: { author: true },
          },
        },
      });
    }),

  // Create a new group
  create: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        description: z.string().optional(),
      })
    )
    .mutation(({ input, ctx }) => {
      return ctx.prisma.group.create({
        data: {
          name: input.name,
          description: input.description,
          users: { connect: { id: ctx.session.user.id } },
          adminId: ctx.session.user.id,
        },
      });
    }),

  postMessage: protectedProcedure
    .input(
      z.object({
        groupId: z.string(),
        content: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const group = await ctx.prisma.group.findFirst({
        where: {
          id: input.groupId,
          users: { some: { id: ctx.session.user.id } },
        },
      });

      if (!group) throw new Error("Group not found");

      const message = await ctx.prisma.message.create({
        data: {
          content: input.content,
          authorId: ctx.session.user.id,
          groupId: input.groupId,
        },
        include: { author: true },
      });

      await pusher.trigger(`group-${input.groupId}`, "new-message", message);

      return true;
    }),
});
