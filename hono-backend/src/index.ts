import { Hono } from "hono";
import { cors } from "hono/cors";
import { prisma } from "./lib/prisma.js";
import auth from "./features/auth/auth.routes.js";
import worklog from "./features/worklog/worklog.routes.js";
import office from "./features/office/office.routes.js";
import { errorResponse } from "./utils/response.js";
import type { Bindings, Variables } from "./types/index.js";

const app = new Hono<{ Bindings: Bindings; Variables: Variables }>();

app.use(
  "*",
  cors({
    origin: ["http://localhost:3000", "http://127.0.0.1:3000"],
    allowMethods: ["GET", "POST", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);

// Middleware to inject Prisma into context
app.use(async (c, next) => {
  c.set("prisma", prisma);
  await next();
});

// Global error handler
app.onError((err, c) => {
  console.error("Error:", err);

  // Handle specific auth errors
  if (err.message === "EMAIL_TAKEN") {
    return errorResponse(c, "Email already registered", 409);
  }
  if (err.message === "INVALID_CREDENTIALS") {
    return errorResponse(c, "Invalid email or password", 401);
  }

  return errorResponse(c, err.message || "Internal server error", 500);
});

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.get("/users", async (c) => {
  const employees = await prisma.user.findMany({ select: { name: true } });
  const names = employees.map((employee) => employee.name);
  return c.text(JSON.stringify(names));
});

// Mount auth routes
app.route("/auth", auth);

// Mount worklog routes
app.route("/worklog", worklog);

// Mount office routes
app.route("/office", office);

export default app;
