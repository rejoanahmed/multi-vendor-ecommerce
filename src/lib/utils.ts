import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { WeaviateClient } from "weaviate-ts-client";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Weaviate batch query
export async function getBatchWithCursor(
  client: WeaviateClient,
  collectionName: string,
  batchSize: number,
  cursor: string | null,
): Promise<unknown[]> {
  const query = client.graphql
    .get()
    .withClassName(collectionName)
    .withFields("productId name category description _additional { id }")
    .withLimit(batchSize);

  let result;
  if (cursor) {
    result = await query.withAfter(cursor).do();
    return result.data.Get[collectionName];
  } else {
    result = await query.do();
    return result.data.Get[collectionName];
  }
}
