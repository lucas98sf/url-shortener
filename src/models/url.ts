import {
  pgTable,
  serial,
  varchar,
  timestamp,
  integer,
} from "drizzle-orm/pg-core";
import { users } from "./user";

export const urls = pgTable("urls", {
  id: serial("id").primaryKey(),
  originalUrl: varchar("original_url", { length: 2048 }).notNull(),
  shortCode: varchar("short_code", { length: 6 }).notNull().unique(),
  userId: integer("user_id").references(() => users.id),
  clicks: integer("clicks").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  deletedAt: timestamp("deleted_at"),
});
