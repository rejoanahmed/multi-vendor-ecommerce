import { z } from "zod";

export const storeSchema = z.object({
  name: z.string().min(2).max(50),
  description: z.string().min(50).max(200),
});
