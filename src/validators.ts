import { body, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";

export const validateRegister = [
  body("email").isEmail().withMessage("Invalid email address"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  handleValidationErrors,
];

export const validateLogin = [
  body("email").isEmail().withMessage("Invalid email address"),
  body("password").notEmpty().withMessage("Password is required"),
  handleValidationErrors,
];

export const validateUrl = [
  body("originalUrl").isURL().withMessage("Invalid URL"),
  handleValidationErrors,
];

function handleValidationErrors(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
}
