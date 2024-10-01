import type { Config } from "drizzle-kit";
import dotenv from "dotenv";

dotenv.config();

export default {
  schema: "./src/models/*",
  out: "./drizzle",
  driver: "pg",
  dbCredentials: {
    connectionString: process.env.DATABASE_URL!,
  },
} satisfies Config;
