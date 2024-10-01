import { urlService } from "../url/service";
import { db } from "../config/database";
import { generateShortCode } from "../utils/generateShortUrl";
import { urlRepository } from "../url/repository";

jest.mock("../utils/generateShortUrl");
jest.mock("../url/repository");

describe("URL Service", () => {
	afterEach(() => {
		jest.clearAllMocks();
	});

	describe("createShortUrl", () => {
		it("should create a short URL", async () => {
			const mockUrl = {
				id: 1,
				originalUrl: "https://example.com",
				shortCode: "abc123",
			};
			(generateShortCode as jest.Mock).mockReturnValue("abc123");
			(urlRepository.createShortUrl as jest.Mock).mockResolvedValue(mockUrl);

			const result = await urlService.createShortUrl({
				originalUrl: "https://example.com",
				userId: 1,
			});

			expect(result).toBe(`${process.env.BASE_URL}/abc123`);
			expect(urlRepository.createShortUrl).toHaveBeenCalledWith(
				expect.anything(),
			);
		});
	});

	describe("getOriginalUrl", () => {
		it("should return the original URL for a given short code", async () => {
			const mockUrl = { originalUrl: "https://example.com" };
			(urlRepository.getOriginalUrl as jest.Mock).mockResolvedValue(mockUrl);

			const result = await urlService.getOriginalUrl("abc123");

			expect(result).toEqual(mockUrl);
			expect(urlRepository.getOriginalUrl).toHaveBeenCalledWith(
				expect.anything(),
			);
		});

		it("should return undefined if short code is not found", async () => {
			(urlRepository.getOriginalUrl as jest.Mock).mockResolvedValue(undefined);

			const result = await urlService.getOriginalUrl("nonexistent");

			expect(result).toBeUndefined();
		});
	});

	describe("incrementClicks", () => {
		it("should increment the click count for a URL", async () => {
			(urlRepository.incrementClicks as jest.Mock).mockResolvedValue(undefined);

			await urlService.incrementClicks("abc123");

			expect(urlRepository.incrementClicks).toHaveBeenCalledWith(
				expect.anything(),
			);
		});
	});

	describe("listUrlsByUser", () => {
		it("should return a list of URLs for a user", async () => {
			const mockUrls = [
				{ id: 1, originalUrl: "https://example.com", shortCode: "abc123" },
			];
			(urlRepository.listUrlsByUser as jest.Mock).mockResolvedValue(mockUrls);

			const result = await urlService.listUrlsByUser(1);

			expect(result).toEqual(mockUrls);
			expect(urlRepository.listUrlsByUser).toHaveBeenCalledWith(
				expect.anything(),
			);
		});
	});

	describe("updateUrl", () => {
		it("should update the original URL", async () => {
			const mockUrl = {
				id: 1,
				originalUrl: "https://newexample.com",
				shortCode: "abc123",
			};
			(urlRepository.updateUrl as jest.Mock).mockResolvedValue(mockUrl);

			const result = await urlService.updateUrl({
				originalUrl: "https://newexample.com",
				shortCode: "abc123",
				userId: 1,
			});

			expect(result).toEqual(mockUrl);
			expect(urlRepository.updateUrl).toHaveBeenCalledWith(expect.anything());
		});

		it("should throw an error if URL is not found or not owned by user", async () => {
			(urlRepository.updateUrl as jest.Mock).mockResolvedValue(undefined);

			await expect(
				urlService.updateUrl({
					originalUrl: "https://newexample.com",
					shortCode: "nonexistent",
					userId: 1,
				}),
			).rejects.toThrow("URL not found or not owned by user");
		});
	});

	describe("deleteUrl", () => {
		it("should soft delete a URL", async () => {
			(urlRepository.deleteUrl as jest.Mock).mockResolvedValue({ id: 1 });

			await urlService.deleteUrl({
				shortCode: "abc123",
				userId: 1,
			});

			expect(urlRepository.deleteUrl).toHaveBeenCalledWith(expect.anything());
		});

		it("should throw an error if URL is not found or not owned by user", async () => {
			(urlRepository.deleteUrl as jest.Mock).mockResolvedValue(undefined);

			await expect(
				urlService.deleteUrl({
					shortCode: "nonexistent",
					userId: 1,
				}),
			).rejects.toThrow("URL not found or not owned by user");
		});
	});
});
