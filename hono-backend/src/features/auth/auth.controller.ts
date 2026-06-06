import type { Context } from "hono";
import { setCookie } from "hono/cookie";
import { signupSchema, signinSchema } from "./auth.schema.js";
import { AuthService } from "./auth.service.js";
import { successResponse, errorResponse } from "../../utils/response.js";
import type { Bindings, Variables } from "../../types/index.js";

const setCookieOptions = {
  httpOnly: true,
  secure: false, // Set to true in production with HTTPS
  sameSite: "Lax" as const,
  maxAge: 60 * 60 * 24 * 7, // 7 days
  path: "/",
};

export const signup = async (
  c: Context<{ Bindings: Bindings; Variables: Variables }>,
) => {
  try {
    // Parse & validate body
    const body = await c.req.json();
    const parsed = signupSchema.safeParse(body);

    if (!parsed.success) {
      return errorResponse(c, parsed.error.message, 400);
    }

    const prisma = c.get("prisma");
    const jwtSecret = c.env.JWT_SECRET;

    const result = await AuthService.signup(parsed.data, prisma, jwtSecret);

    // Set HTTP-only cookie with token
    setCookie(c, "auth_token", result.token, setCookieOptions);

    // Return user data without token
    return successResponse(c, { user: result.user }, 201);
  } catch (error) {
    if (error instanceof Error) {
      throw error; // Let global error handler catch it
    }
    throw new Error("Internal server error");
  }
};

export const signin = async (
  c: Context<{ Bindings: Bindings; Variables: Variables }>,
) => {
  try {
    // Parse & validate body
    const body = await c.req.json();
    const parsed = signinSchema.safeParse(body);

    if (!parsed.success) {
      return errorResponse(c, parsed.error.message, 400);
    }

    const prisma = c.get("prisma");
    const jwtSecret = c.env.JWT_SECRET;

    const result = await AuthService.signin(parsed.data, prisma, jwtSecret);

    // Set HTTP-only cookie with token
    setCookie(c, "auth_token", result.token, setCookieOptions);

    // Return user data without token
    return successResponse(c, { user: result.user }, 200);
  } catch (error) {
    if (error instanceof Error) {
      throw error; // Let global error handler catch it
    }
    throw new Error("Internal server error");
  }
};

export const resetPassword = async (c: Context) => {
  // implement reset password logic
};

export const editProfile = async (c: Context) => {
  // implement edit profile logic
};
