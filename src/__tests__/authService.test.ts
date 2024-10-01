import { authRepository } from "@/auth/repository";
import { authService } from "../auth/service";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

jest.mock("../auth/repository");
jest.mock("bcryptjs");
jest.mock("jsonwebtoken");

describe("Auth Service", () => {
	afterEach(() => {
		jest.clearAllMocks();
	});

	describe("register", () => {
		it("should register a new user", async () => {
			const mockUser = {
				id: 1,
				email: "test@example.com",
				password: "hashedPassword",
			};
			(authRepository.createUser as jest.Mock).mockResolvedValue(mockUser);
			(bcrypt.hash as jest.Mock).mockResolvedValue("hashedPassword");

			const result = await authService.register("test@example.com", "password");

			expect(result).toEqual(mockUser);
			expect(bcrypt.hash).toHaveBeenCalledWith("password", 10);
		});
	});

	describe("login", () => {
		it("should login a user and return a token", async () => {
			const mockUser = {
				id: 1,
				email: "test@example.com",
				password: "hashedPassword",
			};
			(authRepository.getUserByEmail as jest.Mock).mockResolvedValue(mockUser);
			(bcrypt.compare as jest.Mock).mockResolvedValue(true);
			(jwt.sign as jest.Mock).mockReturnValue("mockToken");

			const result = await authService.login("test@example.com", "password");

			expect(result).toBe("mockToken");
			expect(bcrypt.compare).toHaveBeenCalledWith("password", "hashedPassword");
			expect(jwt.sign).toHaveBeenCalledWith(
				{ userId: 1 },
				process.env.JWT_SECRET!,
				{
					expiresIn: "1h",
				},
			);
		});

		it("should throw an error if user is not found", async () => {
			(authRepository.getUserByEmail as jest.Mock).mockResolvedValue(undefined);

			await expect(
				authService.login("test@example.com", "password"),
			).rejects.toThrow("Invalid credentials");
		});

		it("should throw an error if password is incorrect", async () => {
			const mockUser = {
				id: 1,
				email: "test@example.com",
				password: "hashedPassword",
			};
			(authRepository.getUserByEmail as jest.Mock).mockResolvedValue([
				mockUser,
			]);
			(bcrypt.compare as jest.Mock).mockResolvedValue(false);

			await expect(
				authService.login("test@example.com", "wrongPassword"),
			).rejects.toThrow("Invalid credentials");
		});
	});
});
