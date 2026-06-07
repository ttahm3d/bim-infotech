import { Hono } from "hono";
import {
  createOffice,
  getOffices,
  getOfficeById,
  updateOffice,
  deleteOffice,
} from "./office.controller.js";
import type { Bindings, Variables } from "../../types/index.js";

const office = new Hono<{ Bindings: Bindings; Variables: Variables }>();

// Create office
office.post("/", createOffice);

// Get all offices
office.get("/", getOffices);

// Get office by ID
office.get("/:id", getOfficeById);

// Update office
office.put("/:id", updateOffice);

// Delete office
office.delete("/:id", deleteOffice);

export default office;
