import { Prisma } from "../../lib/prisma.js";
import type { CreateOfficeInput, UpdateOfficeInput } from "./office.schema.js";

export const OfficeService = {
  create: async (input: CreateOfficeInput, prisma: Prisma) => {
    const office = await prisma.office.create({
      data: {
        name: input.name,
        latitude: input.latitude,
        longitude: input.longitude,
        radiusMeters: input.radiusMeters || 10,
      },
    });

    return office;
  },

  getAll: async (prisma: Prisma) => {
    const offices = await prisma.office.findMany({
      orderBy: { createdAt: "desc" },
    });

    return offices;
  },

  getById: async (id: string, prisma: Prisma) => {
    const office = await prisma.office.findUnique({
      where: { id },
    });

    if (!office) {
      throw new Error("OFFICE_NOT_FOUND");
    }

    return office;
  },

  update: async (id: string, input: UpdateOfficeInput, prisma: Prisma) => {
    const office = await prisma.office.findUnique({
      where: { id },
    });

    if (!office) {
      throw new Error("OFFICE_NOT_FOUND");
    }

    const updatedOffice = await prisma.office.update({
      where: { id },
      data: {
        name: input.name || office.name,
        latitude: input.latitude || office.latitude,
        longitude: input.longitude || office.longitude,
        radiusMeters: input.radiusMeters || office.radiusMeters,
      },
    });

    return updatedOffice;
  },

  delete: async (id: string, prisma: Prisma) => {
    const office = await prisma.office.findUnique({
      where: { id },
    });

    if (!office) {
      throw new Error("OFFICE_NOT_FOUND");
    }

    await prisma.office.delete({
      where: { id },
    });

    return { success: true };
  },
};
