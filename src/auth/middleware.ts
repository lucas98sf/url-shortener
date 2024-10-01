import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

declare global {
	namespace Express {
		interface Request {
			user?: { id: number };
		}
	}
}

export function getUserMiddleware(
	req: Request,
	_res: Response,
	next: NextFunction,
) {
	const authHeader = req.headers["authorization"];

	if (!authHeader || !authHeader.startsWith("Bearer ")) {
		return next();
	}

	const token = authHeader.split(" ")[1];

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
			userId: number;
		};
		req.user = { id: decoded.userId };
		next();
	} catch (error) {
		next();
	}
}

export function authMiddleware(
	req: Request,
	res: Response,
	next: NextFunction,
) {
	const authHeader = req.headers["authorization"];

	if (!authHeader || !authHeader.startsWith("Bearer ")) {
		return res.status(401).json({ error: "Unauthorized" });
	}

	const token = authHeader.split(" ")[1];

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
			userId: number;
		};
		req.user = { id: decoded.userId };
		next();
	} catch (error) {
		res.status(401).json({ error: "Invalid token" });
	}
}
