import { Request, Response } from "express";
import { authService } from "./service";
import logger from "@/config/logger";

export const authController = {
  async register(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const user = await authService.register(email, password);
      logger.info({ userId: user.id }, "User registered successfully");
      res
        .status(201)
        .json({ message: "User registered successfully", userId: user.id });
    } catch (error) {
      logger.error(error, "Error registering user");
      res.status(409).json({ error: "Email already exists" });
    }
  },
  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const token = await authService.login(email, password);
      logger.info({ email }, "User logged in successfully");
      res.json({ token });
    } catch (error) {
      logger.error(error, "Error logging in user");
      res.status(401).json({ error: "Invalid credentials" });
    }
  },
};
