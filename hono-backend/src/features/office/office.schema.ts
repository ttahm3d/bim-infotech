import { z } from "zod";

export const createOfficeSchema = z.object({
  name: z.string().min(1, "Office name is required"),
  latitude: z.number().min(-90).max(90, "Invalid latitude"),
  longitude: z.number().min(-180).max(180, "Invalid longitude"),
  radiusMeters: z.number().min(1, "Radius must be at least 1 meter").optional(),
});

export const updateOfficeSchema = z.object({
  name: z.string().min(1, "Office name is required").optional(),
  latitude: z.number().min(-90).max(90, "Invalid latitude").optional(),
  longitude: z.number().min(-180).max(180, "Invalid longitude").optional(),
  radiusMeters: z.number().min(1, "Radius must be at least 1 meter").optional(),
});

export type CreateOfficeInput = z.infer<typeof createOfficeSchema>;
export type UpdateOfficeInput = z.infer<typeof updateOfficeSchema>;
