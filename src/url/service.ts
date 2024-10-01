import { urlRepository } from "@/url/repository";
import { generateShortCode } from "@/utils/generateShortUrl";

export const urlService = {
  async createShortUrl({
    originalUrl,
    userId,
  }: {
    originalUrl: string;
    userId?: number;
  }) {
    const shortCode = generateShortCode();
    const url = await urlRepository.createShortUrl({
      originalUrl,
      shortCode,
      userId,
    });
    return `${process.env.BASE_URL}/${url.shortCode}`;
  },
  async getOriginalUrl(shortCode: string) {
    return await urlRepository.getOriginalUrl(shortCode);
  },
  async incrementClicks(shortCode: string) {
    return await urlRepository.incrementClicks(shortCode);
  },
  async listUrlsByUser(userId: number) {
    return await urlRepository.listUrlsByUser(userId);
  },
  async updateUrl({
    shortCode,
    originalUrl,
    userId,
  }: {
    shortCode: string;
    originalUrl: string;
    userId: number;
  }) {
    const updatedUrl = await urlRepository.updateUrl({
      shortCode,
      originalUrl,
      userId,
    });

    if (!updatedUrl) {
      throw new Error("URL not found or not owned by user");
    }

    return updatedUrl;
  },
  async deleteUrl({
    shortCode,
    userId,
  }: {
    shortCode: string;
    userId: number;
  }) {
    const deletedUrl = await urlRepository.deleteUrl({ shortCode, userId });

    if (!deletedUrl) {
      throw new Error("URL not found or not owned by user");
    }
  },
};
