import { storeSchema } from "~/utils/formSchema";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { z } from "zod";
export const vendorStoreRouter = createTRPCRouter({
  // get a store
  getStore: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db.vendorStore.findUnique({
        where: { id: input.id },
        include: {
          user: true,
          products: {
            include: {
              images: true,
            },
          },
        },
      });
    }),

  // create a store
  create: protectedProcedure
    .input(storeSchema)
    .mutation(async ({ ctx, input }) => {
      // Check if user exists
      const user = await ctx.db.user.findUnique({
        where: {
          id: ctx.session.user.id,
          isVendor: false,
        },
      });
      if (!user) {
        throw new Error("User not found or is already a vendor.");
      }

      await ctx.db.user.update({
        where: { id: ctx.session.user.id },
        data: { isVendor: true },
      });
      // create a store
      return await ctx.db.vendorStore.create({
        data: {
          name: input.name,
          description: input.description,
          user: { connect: { id: ctx.session.user.id } },
        },
      });
    }),
});
