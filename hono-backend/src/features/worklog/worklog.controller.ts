import type { Context } from "hono";
import {
  checkInSchema,
  checkOutSchema,
  takeBreakSchema,
  returnFromBreakSchema,
} from "./worklog.schema.js";
import { WorkLogService } from "./worklog.service.js";
import { successResponse, errorResponse } from "../../utils/response.js";
import type { Bindings, Variables } from "../../types/index.js";

export const checkIn = async (
  c: Context<{ Bindings: Bindings; Variables: Variables }>,
) => {
  try {
    const body = await c.req.json();
    const parsed = checkInSchema.safeParse(body);

    if (!parsed.success) {
      return errorResponse(c, parsed.error.message, 400);
    }

    const prisma = c.get("prisma");
    const jwtPayload = c.get("jwtPayload");

    const workLog = await WorkLogService.checkIn(
      jwtPayload.sub,
      parsed.data.latitude,
      parsed.data.longitude,
      prisma,
    );

    return successResponse(c, { workLog }, 201);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "DUPLICATE_CHECKIN") {
        return errorResponse(c, "Already checked in today", 409);
      }
      if (error.message === "OFFICE_NOT_CONFIGURED") {
        return errorResponse(c, "Office location not configured", 500);
      }
      if (error.message.startsWith("LOCATION_OUT_OF_RANGE:")) {
        const distance = error.message.split(":")[1];
        return errorResponse(
          c,
          `You are ${distance} away from office. Must be within 10 meters`,
          400,
        );
      }
      throw error;
    }
    throw new Error("Internal server error");
  }
};

export const checkOut = async (
  c: Context<{ Bindings: Bindings; Variables: Variables }>,
) => {
  try {
    const body = await c.req.json();
    const parsed = checkOutSchema.safeParse(body);

    if (!parsed.success) {
      return errorResponse(c, parsed.error.message, 400);
    }

    const prisma = c.get("prisma");
    const jwtPayload = c.get("jwtPayload");

    const workLog = await WorkLogService.checkOut(
      jwtPayload.sub,
      parsed.data.latitude,
      parsed.data.longitude,
      prisma,
    );

    return successResponse(c, { workLog }, 200);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "WORKLOG_NOT_FOUND") {
        return errorResponse(c, "No check-in found for today", 404);
      }
      if (error.message === "INVALID_STATUS") {
        return errorResponse(c, "Cannot check out when on break", 400);
      }
      if (error.message === "OFFICE_NOT_CONFIGURED") {
        return errorResponse(c, "Office location not configured", 500);
      }
      if (error.message.startsWith("LOCATION_OUT_OF_RANGE:")) {
        const distance = error.message.split(":")[1];
        return errorResponse(
          c,
          `You are ${distance} away from office. Must be within 10 meters`,
          400,
        );
      }
      throw error;
    }
    throw new Error("Internal server error");
  }
};

export const takeBreak = async (
  c: Context<{ Bindings: Bindings; Variables: Variables }>,
) => {
  try {
    const body = await c.req.json().catch(() => ({}));
    const parsed = takeBreakSchema.safeParse(body);

    if (!parsed.success) {
      return errorResponse(c, parsed.error.message, 400);
    }

    const prisma = c.get("prisma");
    const jwtPayload = c.get("jwtPayload");

    const result = await WorkLogService.takeBreak(jwtPayload.sub, prisma);

    return successResponse(c, result, 200);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "WORKLOG_NOT_FOUND") {
        return errorResponse(c, "No check-in found for today", 404);
      }
      if (error.message === "INVALID_STATUS") {
        return errorResponse(c, "Cannot take a break when not active", 400);
      }
      throw error;
    }
    throw new Error("Internal server error");
  }
};

export const returnFromBreak = async (
  c: Context<{ Bindings: Bindings; Variables: Variables }>,
) => {
  try {
    const body = await c.req.json().catch(() => ({}));
    const parsed = returnFromBreakSchema.safeParse(body);

    if (!parsed.success) {
      return errorResponse(c, parsed.error.message, 400);
    }

    const prisma = c.get("prisma");
    const jwtPayload = c.get("jwtPayload");

    const result = await WorkLogService.returnFromBreak(jwtPayload.sub, prisma);

    return successResponse(c, result, 200);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "WORKLOG_NOT_FOUND") {
        return errorResponse(c, "No check-in found for today", 404);
      }
      if (error.message === "INVALID_STATUS") {
        return errorResponse(c, "Not currently on break", 400);
      }
      if (error.message === "BREAK_SESSION_NOT_FOUND") {
        return errorResponse(c, "No open break session found", 404);
      }
      throw error;
    }
    throw new Error("Internal server error");
  }
};

export const getTodayWorkLog = async (
  c: Context<{ Bindings: Bindings; Variables: Variables }>,
) => {
  try {
    const prisma = c.get("prisma");
    const jwtPayload = c.get("jwtPayload");

    const workLog = await WorkLogService.getToday(jwtPayload.sub, prisma);

    return successResponse(c, { workLog }, 200);
  } catch (error) {
    throw new Error("Internal server error");
  }
};
