import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import { Prisma } from "../config/prisma";
import { sendError, sendSuccess } from "../config/sender.config";
import { generateToken } from "../utils/jwt";

// Register user
export const RegisterUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { name, email, password } = req.body;

  try {
    // Check duplicate
    const existingUser = await Prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return sendError(res, "Email already registered", 409);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = await Prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    // Generate token
    const token = generateToken({
      userId: user.id,
      email: user.email,
    });

    return sendSuccess(
      res,
      {
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      },
      "Registered successfully"
    );
  } catch (err) {
    console.error("Register error:", err);
    return sendError(res, "Failed to Register User", 500);
  }
};

// Login User by email and password
export const LoginUser = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  try {
    // Check user exists
    const user = await Prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return sendError(res, "Invalid credentials", 401);
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return sendError(res, "Invalid credentials", 401);
    }

    // Generate token
    const token = generateToken({
      userId: user.id,
      email: user.email,
    });

    return sendSuccess(
      res,
      {
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      },
      "Login successful"
    );
  } catch (err) {
    console.error("Login error:", err);
    return sendError(res, "Failed to Login User", 500);
  }
};
