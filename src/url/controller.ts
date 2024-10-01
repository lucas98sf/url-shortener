import type { Request, Response } from "express";
import { urlService } from "./service";
import logger from "@/config/logger";

export const urlController = {
	async shorten(req: Request, res: Response) {
		const { originalUrl } = req.body;
		const userId = req.user?.id as number;
		const shortUrl = await urlService.createShortUrl({ originalUrl, userId });
		logger.info(
			{ originalUrl, shortUrl, user: req.user },
			"URL shortened successfully",
		);
		res.json({ shortUrl });
	},
	async redirect(req: Request, res: Response) {
		const shortCode = req.params.shortCode;
		const url = await urlService.getOriginalUrl(shortCode);

		if (!url) {
			return res.status(404).json({ error: "URL not found" });
		}
		logger.info({ shortCode }, "Redirecting to original URL");
		await urlService.incrementClicks(shortCode);
		res.redirect(url.originalUrl);
	},
	async listUrls(req: Request, res: Response) {
		const userId = req.user!.id;
		const urls = await urlService.listUrlsByUser(userId);
		res.json(urls);
	},
	async updateUrl(req: Request, res: Response) {
		const shortCode = req.params.shortCode;
		const { originalUrl } = req.body;
		const userId = req.user!.id;

		try {
			const updatedUrl = await urlService.updateUrl({
				shortCode,
				originalUrl,
				userId,
			});
			logger.info({ shortCode, originalUrl }, "URL updated successfully");
			res.json(updatedUrl);
		} catch (error) {
			res.status(404).json({ error: "URL not found or not owned by user" });
		}
	},
	async deleteUrl(req: Request, res: Response) {
		const shortCode = req.params.shortCode;
		const userId = req.user!.id;

		try {
			await urlService.deleteUrl({ shortCode, userId });
			logger.info({ shortCode }, "URL deleted successfully");
			res.status(204).json({ message: "URL deleted successfully" });
		} catch (error) {
			res.status(404).json({ error: "URL not found or not owned by user" });
		}
	},
};
