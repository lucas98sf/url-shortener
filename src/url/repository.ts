import { db } from "@/config/database";
import { urls } from "@/models";
import { eq, and, isNull, sql } from "drizzle-orm";

export const urlRepository = {
  async createShortUrl({
    originalUrl,
    shortCode,
    userId,
  }: {
    originalUrl: string;
    shortCode: string;
    userId?: number;
  }) {
    const [url] = await db
      .insert(urls)
      .values({ originalUrl, shortCode, userId })
      .returning();
    return url;
  },
  async getOriginalUrl(shortCode: string) {
    const [url] = await db
      .select()
      .from(urls)
      .where(and(eq(urls.shortCode, shortCode), isNull(urls.deletedAt)))
      .limit(1);
    return url;
  },
  async incrementClicks(shortCode: string) {
    await db
      .update(urls)
      .set({ clicks: sql`${urls.clicks} + 1` })
      .where(eq(urls.shortCode, shortCode));
  },
  async listUrlsByUser(userId: number) {
    return db
      .select()
      .from(urls)
      .where(and(eq(urls.userId, userId), isNull(urls.deletedAt)));
  },
  async updateUrl({
    originalUrl,
    shortCode,
    userId,
  }: {
    originalUrl: string;
    shortCode: string;
    userId: number;
  }) {
    const [updatedUrl] = await db
      .update(urls)
      .set({ originalUrl, updatedAt: new Date() })
      .where(
        and(
          eq(urls.shortCode, shortCode),
          eq(urls.userId, userId),
          isNull(urls.deletedAt)
        )
      )
      .returning();
    return updatedUrl;
  },
  async deleteUrl({
    shortCode,
    userId,
  }: {
    shortCode: string;
    userId: number;
  }) {
    const [deletedUrl] = await db
      .update(urls)
      .set({ deletedAt: new Date() })
      .where(
        and(
          eq(urls.shortCode, shortCode),
          eq(urls.userId, userId),
          isNull(urls.deletedAt)
        )
      )
      .returning();
    return deletedUrl;
  },
};
