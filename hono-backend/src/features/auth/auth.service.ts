import { Prisma } from "../../lib/prisma.js";
import { hashPassword, comparePassword } from "../../utils/hash.js";
import { signToken } from "../../utils/jwt.js";
import type { SignupInput, SigninInput } from "./auth.schema.js";

export const AuthService = {
  signup: async (input: SignupInput, prisma: Prisma, jwtSecret: string) => {
    // Check if user already exists
    const existing = await prisma.user.findUnique({
      where: { email: input.email },
    });

    if (existing) {
      throw new Error("EMAIL_TAKEN");
    }

    // Hash password
    const hashedPassword = await hashPassword(input.password);

    // Create user
    const user = await prisma.user.create({
      data: {
        name: input.name,
        email: input.email,
        password: hashedPassword,
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });

    // Sign JWT
    const token = await signToken(
      { sub: user.id, email: user.email },
      jwtSecret,
    );

    return { user, token };
  },
  signin: async (input: SigninInput, prisma: Prisma, jwtSecret: string) => {
    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: input.email },
    });

    if (!user) {
      throw new Error("INVALID_CREDENTIALS");
    }

    // Compare password
    const isValidPassword = await comparePassword(
      input.password,
      user.password,
    );

    if (!isValidPassword) {
      throw new Error("INVALID_CREDENTIALS");
    }

    // Sign JWT
    const token = await signToken(
      { sub: user.id, email: user.email },
      jwtSecret,
    );

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      },
      token,
    };
  },
};
