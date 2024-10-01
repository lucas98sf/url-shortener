import request from "supertest";
import express from "express";
import { authRoutes } from "../auth/routes";
import { urlRoutes } from "../url/routes";
import { authService } from "../auth/service";
import { urlService } from "../url/service";
import { authMiddleware, getUserMiddleware } from "../auth/middleware";

jest.mock("../auth/service");
jest.mock("../url/service");
jest.mock("../auth/middleware");

const app = express();
app.use(express.json());
app.use("/auth", authRoutes);
app.use(urlRoutes);

describe("API Integration Tests", () => {
  describe("Auth Endpoints", () => {
    it("should register a new user", async () => {
      (authService.register as jest.Mock).mockResolvedValue({ id: 1 });

      const res = await request(app)
        .post("/auth/register")
        .send({ email: "test@example.com", password: "password123" });

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty(
        "message",
        "User registered successfully"
      );
    });

    it("should login a user", async () => {
      (authService.login as jest.Mock).mockResolvedValue("mockToken");

      const res = await request(app)
        .post("/auth/login")
        .send({ email: "test@example.com", password: "password123" });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("token", "mockToken");
    });
  });

  describe("URL Endpoints", () => {
    it("should create a short URL", async () => {
      (getUserMiddleware as jest.Mock).mockImplementation((req, _res, next) => {
        req.user = {
          id: 1,
        };
        next();
      });
      (urlService.createShortUrl as jest.Mock).mockResolvedValue(
        "http://short.url/abc123"
      );

      const res = await request(app)
        .post("/urls/shorten")
        .send({ originalUrl: "https://example.com" });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("shortUrl", "http://short.url/abc123");
    });

    it("should redirect to the original URL", async () => {
      (urlService.getOriginalUrl as jest.Mock).mockResolvedValue({
        originalUrl: "https://example.com",
      });
      (urlService.incrementClicks as jest.Mock).mockResolvedValue(undefined);

      const res = await request(app).get("/abc123");

      expect(res.statusCode).toBe(302);
      expect(res.header.location).toBe("https://example.com");
    });

    it("should list all URLs", async () => {
      (authMiddleware as jest.Mock).mockImplementation((req, _res, next) => {
        req.user = {
          id: 1,
        };
        next();
      });
      (urlService.listUrlsByUser as jest.Mock).mockResolvedValue([
        {
          id: 1,
          originalUrl: "https://example.com",
          shortUrl: "http://short.url/abc123",
          clicks: 0,
        },
      ]);

      const res = await request(app).get("/urls/list");

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual([
        {
          id: 1,
          originalUrl: "https://example.com",
          shortUrl: "http://short.url/abc123",
          clicks: 0,
        },
      ]);
    });
  });
});
