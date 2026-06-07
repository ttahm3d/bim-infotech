import type { Context } from "hono";
import { createOfficeSchema, updateOfficeSchema } from "./office.schema.js";
import { OfficeService } from "./office.service.js";
import { successResponse, errorResponse } from "../../utils/response.js";
import type { Bindings, Variables } from "../../types/index.js";

export const createOffice = async (
  c: Context<{ Bindings: Bindings; Variables: Variables }>,
) => {
  try {
    const body = await c.req.json();
    const parsed = createOfficeSchema.safeParse(body);

    if (!parsed.success) {
      return errorResponse(c, parsed.error.message, 400);
    }

    const prisma = c.get("prisma");

    const office = await OfficeService.create(parsed.data, prisma);

    return successResponse(c, { office }, 201);
  } catch (error) {
    throw error;
  }
};

export const getOffices = async (
  c: Context<{ Bindings: Bindings; Variables: Variables }>,
) => {
  try {
    const prisma = c.get("prisma");

    const offices = await OfficeService.getAll(prisma);

    return successResponse(c, { offices }, 200);
  } catch (error) {
    throw error;
  }
};

export const getOfficeById = async (
  c: Context<{ Bindings: Bindings; Variables: Variables }>,
) => {
  try {
    const { id } = c.req.param();
    const prisma = c.get("prisma");

    const office = await OfficeService.getById(id, prisma);

    return successResponse(c, { office }, 200);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "OFFICE_NOT_FOUND") {
        return errorResponse(c, "Office not found", 404);
      }
      throw error;
    }
    throw new Error("Internal server error");
  }
};

export const updateOffice = async (
  c: Context<{ Bindings: Bindings; Variables: Variables }>,
) => {
  try {
    const { id } = c.req.param();
    const body = await c.req.json();
    const parsed = updateOfficeSchema.safeParse(body);

    if (!parsed.success) {
      return errorResponse(c, parsed.error.message, 400);
    }

    const prisma = c.get("prisma");

    const office = await OfficeService.update(id, parsed.data, prisma);

    return successResponse(c, { office }, 200);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "OFFICE_NOT_FOUND") {
        return errorResponse(c, "Office not found", 404);
      }
      throw error;
    }
    throw new Error("Internal server error");
  }
};

export const deleteOffice = async (
  c: Context<{ Bindings: Bindings; Variables: Variables }>,
) => {
  try {
    const { id } = c.req.param();
    const prisma = c.get("prisma");

    await OfficeService.delete(id, prisma);

    return successResponse(c, { success: true }, 200);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "OFFICE_NOT_FOUND") {
        return errorResponse(c, "Office not found", 404);
      }
      throw error;
    }
    throw new Error("Internal server error");
  }
};
