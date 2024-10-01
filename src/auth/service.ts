import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { authRepository } from "@/auth/repository";

export const authService = {
	async register(email: string, password: string) {
		const hashedPassword = await bcrypt.hash(password, 10);
		return await authRepository.createUser(email, hashedPassword);
	},

	async login(email: string, password: string) {
		const user = await authRepository.getUserByEmail(email);

		if (!user || !(await bcrypt.compare(password, user.password))) {
			throw new Error("Invalid credentials");
		}

		const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
			expiresIn: "1h",
		});
		return token;
	},
};
