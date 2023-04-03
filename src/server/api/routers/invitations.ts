import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const invitationsRouter = createTRPCRouter({
  // Create a new invitation
  create: protectedProcedure
    .input(
      z.object({
        groupId: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const group = await ctx.prisma.group.findFirst({
        where: {
          id: input.groupId,
          adminId: ctx.session.user.id, // Only the admin can create invitations
        },
      });

      if (!group) throw new Error("Group not found");

      return ctx.prisma.invitation.create({
        data: { groupId: input.groupId },
      });
    }),

  // Get the details of an invitation
  get: protectedProcedure
    .input(
      z.object({
        invitationId: z.string(),
      })
    )
    .query(({ input, ctx }) => {
      return ctx.prisma.invitation.findFirst({
        where: { id: input.invitationId },
        include: { group: true },
      });
    }),

  // Accept an invitation if it is still valid
  accept: protectedProcedure
    .input(
      z.object({
        invitationId: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const invitation = await ctx.prisma.invitation.findFirst({
        where: { id: input.invitationId },
      });

      if (!invitation) throw new Error("Invitation not found");

      if (invitation.expiresAt && invitation.expiresAt < new Date()) {
        throw new Error("Invitation expired");
      }

      return ctx.prisma.group.update({
        where: { id: invitation.groupId },
        data: { users: { connect: { id: ctx.session.user.id } } },
      });
    }),
});
