import { type Config } from "drizzle-kit";

import { env } from "~/env";

export const uri = [
  "mysql://",
  env.DATABASE_USERNAME,
  ":",
  env.DATABASE_PASSWORD,
  "@",
  env.DATABASE_HOST,
  ":3306/",
  env.DATABASE_NAME,
  '?ssl={"rejectUnauthorized":true}',
].join("");

export default {
  schema: "./src/server/db/schema.ts",
  driver: "mysql2",
  dbCredentials: {
    uri,
  },
  tablesFilter: ["multivendor-ecommerce_*"],
} satisfies Config;
