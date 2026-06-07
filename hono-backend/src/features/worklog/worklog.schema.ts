import { z } from "zod";

export const checkInSchema = z.object({
  latitude: z.number().min(-90).max(90, "Invalid latitude"),
  longitude: z.number().min(-180).max(180, "Invalid longitude"),
});

export const checkOutSchema = z.object({
  latitude: z.number().min(-90).max(90, "Invalid latitude"),
  longitude: z.number().min(-180).max(180, "Invalid longitude"),
});

export const takeBreakSchema = z.object({});

export const returnFromBreakSchema = z.object({});

export type CheckInInput = z.infer<typeof checkInSchema>;
export type CheckOutInput = z.infer<typeof checkOutSchema>;
export type TakeBreakInput = z.infer<typeof takeBreakSchema>;
export type ReturnFromBreakInput = z.infer<typeof returnFromBreakSchema>;
