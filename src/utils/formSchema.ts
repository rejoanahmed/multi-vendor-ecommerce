import { z } from "zod";

export const storeSchema = z.object({
  name: z.string().min(2).max(50),
  description: z.string().min(50).max(200),
});

export const addProductSchema = z.object({
  name: z.string().min(2).max(50),
  description: z.string().min(50).max(200),
  price: z.coerce.number().min(0),
  images: z.array(z.string()),
});
