import { env } from "process";
import weaviate, { ApiKey, type WeaviateClient } from "weaviate-ts-client";

let client: WeaviateClient;

export const getWeaviateClient = () => {
  if (!client) {
    client = weaviate.client({
      scheme: "https",
      host: env.WEAVIATE_HOST_URL ?? "", // Replace with your endpoint
      apiKey: new ApiKey(env.WEAVIATE_API_KEY ?? ""), // Replace w/ your Weaviate instance API key
      headers: { "X-Cohere-Api-Key": env.COHERE_EMBED_API_KEY ?? "" }, // Replace with your inference API key
    });
  }

  return client;
};
