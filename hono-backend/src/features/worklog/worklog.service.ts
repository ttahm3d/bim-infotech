import { Prisma } from "../../lib/prisma.js";
import {
  calculateDistance,
  isLocationWithinRadius,
} from "../../utils/location.js";

export const WorkLogService = {
  checkIn: async (
    userId: string,
    latitude: number,
    longitude: number,
    prisma: Prisma,
  ) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Validate location - get office location (default office or employee's assigned office)
    const office = await prisma.office.findFirst({
      orderBy: { createdAt: "asc" }, // Get first office as default
    });

    if (!office) {
      throw new Error("OFFICE_NOT_CONFIGURED");
    }

    // Check if user is within office radius
    const isWithinRadius = isLocationWithinRadius(
      latitude,
      longitude,
      office.latitude,
      office.longitude,
      office.radiusMeters,
    );

    if (!isWithinRadius) {
      const distance = calculateDistance(
        latitude,
        longitude,
        office.latitude,
        office.longitude,
      );
      throw new Error(`LOCATION_OUT_OF_RANGE:${Math.round(distance)}m`);
    }

    // Check if user already has a check-in for today
    const existingWorkLog = await prisma.workLog.findFirst({
      where: {
        userId,
        date: today,
      },
    });

    if (existingWorkLog) {
      throw new Error("DUPLICATE_CHECKIN");
    }

    // Create new work log
    const workLog = await prisma.workLog.create({
      data: {
        userId,
        date: today,
        checkinAt: new Date(),
        checkinLat: latitude,
        checkinLng: longitude,
        status: "ACTIVE",
      },
      include: {
        breakSessions: true,
      },
    });

    return workLog;
  },

  checkOut: async (
    userId: string,
    latitude: number,
    longitude: number,
    prisma: Prisma,
  ) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Validate location - get office location
    const office = await prisma.office.findFirst({
      orderBy: { createdAt: "asc" },
    });

    if (!office) {
      throw new Error("OFFICE_NOT_CONFIGURED");
    }

    // Check if user is within office radius
    const isWithinRadius = isLocationWithinRadius(
      latitude,
      longitude,
      office.latitude,
      office.longitude,
      office.radiusMeters,
    );

    if (!isWithinRadius) {
      const distance = calculateDistance(
        latitude,
        longitude,
        office.latitude,
        office.longitude,
      );
      throw new Error(`LOCATION_OUT_OF_RANGE:${Math.round(distance)}m`);
    }

    // Find today's active work log
    const workLog = await prisma.workLog.findFirst({
      where: {
        userId,
        date: today,
      },
    });

    if (!workLog) {
      throw new Error("WORKLOG_NOT_FOUND");
    }

    if (workLog.status !== "ACTIVE") {
      throw new Error("INVALID_STATUS");
    }

    // Update work log with checkout time and location
    const updatedWorkLog = await prisma.workLog.update({
      where: { id: workLog.id },
      data: {
        checkoutAt: new Date(),
        checkoutLat: latitude,
        checkoutLng: longitude,
        status: "CHECKED_OUT",
      },
      include: {
        breakSessions: true,
      },
    });

    return updatedWorkLog;
  },

  takeBreak: async (userId: string, prisma: Prisma) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Find today's active work log
    const workLog = await prisma.workLog.findFirst({
      where: {
        userId,
        date: today,
      },
    });

    if (!workLog) {
      throw new Error("WORKLOG_NOT_FOUND");
    }

    if (workLog.status !== "ACTIVE") {
      throw new Error("INVALID_STATUS");
    }

    // Create break session
    const breakSession = await prisma.breakSession.create({
      data: {
        worklogId: workLog.id,
        startAt: new Date(),
      },
    });

    // Update work log status to ON_BREAK
    const updatedWorkLog = await prisma.workLog.update({
      where: { id: workLog.id },
      data: {
        status: "ON_BREAK",
      },
      include: {
        breakSessions: true,
      },
    });

    return {
      workLog: updatedWorkLog,
      breakSession,
    };
  },

  returnFromBreak: async (userId: string, prisma: Prisma) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Find today's active work log
    const workLog = await prisma.workLog.findFirst({
      where: {
        userId,
        date: today,
      },
    });

    if (!workLog) {
      throw new Error("WORKLOG_NOT_FOUND");
    }

    if (workLog.status !== "ON_BREAK") {
      throw new Error("INVALID_STATUS");
    }

    // Find open break session
    const openBreakSession = await prisma.breakSession.findFirst({
      where: {
        worklogId: workLog.id,
        endAt: null,
      },
    });

    if (!openBreakSession) {
      throw new Error("BREAK_SESSION_NOT_FOUND");
    }

    // End break session
    const updatedBreakSession = await prisma.breakSession.update({
      where: { id: openBreakSession.id },
      data: {
        endAt: new Date(),
      },
    });

    // Update work log status to ACTIVE
    const updatedWorkLog = await prisma.workLog.update({
      where: { id: workLog.id },
      data: {
        status: "ACTIVE",
      },
      include: {
        breakSessions: true,
      },
    });

    return {
      workLog: updatedWorkLog,
      breakSession: updatedBreakSession,
    };
  },

  getToday: async (userId: string, prisma: Prisma) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const workLog = await prisma.workLog.findFirst({
      where: {
        userId,
        date: today,
      },
      include: {
        breakSessions: true,
      },
    });

    return workLog;
  },
};
