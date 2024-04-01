import { storeSchema } from "~/utils/formSchema";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
export const vendorStoreRouter = createTRPCRouter({
  create: protectedProcedure
    .input(storeSchema)
    .mutation(async ({ ctx, input }) => {
      // Check if user exists
      const user = await ctx.db.user.findUnique({
        where: { id: ctx.session.user.id },
      });
      if (!user) {
        throw new Error("User not found");
      }
      // Check if user already has a VendorStore
      if (user.vendorStoreId) {
        throw new Error("User already has a VendorStore");
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
