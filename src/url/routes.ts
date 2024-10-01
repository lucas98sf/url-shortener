import express from "express";
import { urlController } from "./controller";
import { authMiddleware, getUserMiddleware } from "@/auth/middleware";
import { validateUrl } from "@/validators";

const router = express.Router();

/**
 * @openapi
 * /urls/shorten:
 *   post:
 *     tags:
 *       - URLs
 *     summary: Shorten a URL
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - originalUrl
 *             properties:
 *               originalUrl:
 *                 type: string
 *                 format: uri
 *     responses:
 *       200:
 *         description: URL shortened successfully
 *       400:
 *         description: Invalid URL
 */
router.post(
  "/urls/shorten",
  validateUrl,
  getUserMiddleware,
  urlController.shorten
);

/**
 * @openapi
 * /{shortCode}:
 *   get:
 *     tags:
 *       - URLs
 *     summary: Redirect to original URL
 *     parameters:
 *       - in: path
 *         name: shortCode
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       302:
 *         description: Redirect to original URL
 *       404:
 *         description: URL not found
 */
router.get("/:shortCode", urlController.redirect);

/**
 * @openapi
 * /urls/list:
 *   get:
 *     tags:
 *       - URLs
 *     summary: List all URLs for the authenticated user
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of URLs
 *       401:
 *         description: Unauthorized
 */
router.get("/urls/list", authMiddleware, urlController.listUrls);

/**
 * @openapi
 * /{shortCode}:
 *   put:
 *     tags:
 *       - URLs
 *     summary: Update an existing short URL
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: shortCode
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - originalUrl
 *             properties:
 *               originalUrl:
 *                 type: string
 *                 format: uri
 *     responses:
 *       200:
 *         description: URL updated successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: URL not found or not owned by user
 */
router.put("/:shortCode", validateUrl, authMiddleware, urlController.updateUrl);

/**
 * @openapi
 * /{shortCode}:
 *   delete:
 *     tags:
 *       - URLs
 *     summary: Delete a short URL
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: shortCode
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: URL deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: URL not found or not owned by user
 */
router.delete("/:shortCode", authMiddleware, urlController.deleteUrl);

export { router as urlRoutes };
