import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { addProductSchema } from "~/utils/formSchema";

export const productRouter = createTRPCRouter({
  create: protectedProcedure
    .input(addProductSchema)
    .mutation(async ({ ctx, input }) => {
      const store = await ctx.db.vendorStore.findFirst({
        where: {
          userId: ctx.session.user.id,
        },
      });

      if (!store) {
        throw new Error("Store not found");
      }

      return ctx.db.product.create({
        data: {
          name: input.name,
          description: input.description,
          price: input.price,
          images: {
            create: input.images.map((url) => ({
              url,
            })),
          },
          store: {
            connect: {
              id: store?.id,
            },
          },
        },
      });
    }),
});
