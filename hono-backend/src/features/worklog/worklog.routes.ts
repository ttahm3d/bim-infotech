import { Hono } from "hono";
import { authMiddleware } from "../../middleware/auth.middleware.js";
import {
  checkIn,
  checkOut,
  takeBreak,
  returnFromBreak,
  getTodayWorkLog,
} from "./worklog.controller.js";
import type { Bindings, Variables } from "../../types/index.js";

const worklog = new Hono<{ Bindings: Bindings; Variables: Variables }>();

// All worklog routes require authentication
worklog.use(authMiddleware);

// Check-in endpoint
worklog.post("/check-in", checkIn);

// Check-out endpoint
worklog.post("/check-out", checkOut);

// Take break endpoint
worklog.post("/take-break", takeBreak);

// Return from break endpoint
worklog.post("/return-from-break", returnFromBreak);

// Get today's worklog
worklog.get("/today", getTodayWorkLog);

export default worklog;
