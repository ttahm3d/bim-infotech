import type { Context, Next } from "hono";
import { getCookie } from "hono/cookie";
import { verifyToken } from "../utils/jwt.js";
import { errorResponse } from "../utils/response.js";
import type { Bindings, Variables } from "../types/index.js";

export const authMiddleware = async (
  c: Context<{ Bindings: Bindings; Variables: Variables }>,
  next: Next,
) => {
  try {
    const token = getCookie(c, "auth_token");

    if (!token) {
      return errorResponse(c, "Unauthorized", 401);
    }

    const jwtSecret = c.env.JWT_SECRET;
    const payload = await verifyToken(token, jwtSecret);

    c.set("jwtPayload", payload);
    await next();
  } catch (error) {
    return errorResponse(c, "Unauthorized", 401);
  }
};
