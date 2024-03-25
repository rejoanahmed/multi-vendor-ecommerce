import { createTRPCRouter, publicProcedure } from "../trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { getWeaviateClient } from "~/lib/weaviate";
import { getBatchWithCursor } from "~/lib/utils";
import { productClass } from "~/lib/weaviate_schema";

const client = getWeaviateClient();

export const vectorSearchRouter = createTRPCRouter({
  deleteAllProducts: publicProcedure.mutation(async () => {
    try {
      await client.schema.classDeleter().withClassName("Product").do();
    } catch (e) {
      throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: e });
    }
  }),
  addProduct: publicProcedure
    .input(
      z.object({
        productId: z.string(),
        category: z.string(),
        name: z.string(),
        description: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const { productId, category, name, description } = input;
      try {
        const schemaExists = await client.schema.exists("Product");
        if (!schemaExists) {
          await client.schema.classCreator().withClass(productClass).do();
        }
        await client.data
          .creator()
          .withClassName("Product")
          .withProperties({
            productId,
            category,
            name,
            description,
          })
          .do();
      } catch (e) {
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: e });
      }
    }),
  getAllProducts: publicProcedure.query(async () => {
    const products = [];
    let cursor = null;
    const schemaExists = await client.schema.exists("Product");
    if (!schemaExists) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Product Schema is not initialized.",
      });
    }
    try {
      while (true) {
        // Request the next batch of objects
        let nextBatch = await getBatchWithCursor(
          client,
          "Product",
          100,
          cursor,
        );

        // Break the loop if empty – we are done
        if (nextBatch.length === 0) break;

        // Here is your next batch of objects
        products.push(...nextBatch);

        cursor = nextBatch.at(-1)["_additional"]["id"];
      }
    } catch (e) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: e,
      });
    }
    return products;
  }),

  search: publicProcedure
    .input(
      z.object({
        query: z.string(),
      }),
    )
    .query(async ({ input }) => {
      const { query } = input;

      const nearText = {
        concepts: [],
      };

      nearText.concepts = [query];
      nearText.certainty = 0.6;

      try {
        const res = await client.graphql
          .get()
          .withClassName("Product")
          .withFields(
            "productId name category description _additional { id distance certainty }",
          )
          .withNearText(nearText)
          .withLimit(5)
          .do();

        return res;
      } catch (e) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: e,
        });
      }
    }),
  getRecommendations: publicProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ input }) => {
      const { id } = input;
      try {
        const recommendations = await client.graphql
          .get()
          .withClassName("Product")
          .withFields(
            "productId name category description _additional {id distance certainty }",
          )
          .withNearObject({
            id,
            certainty: 0.6,
          })
          .withLimit(5)
          .do();
        return recommendations;
      } catch (e) {
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: e });
      }
    }),
});
