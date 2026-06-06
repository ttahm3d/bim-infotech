import { Hono } from "hono";
import { signup, signin } from "./auth.controller.js";
import type { Bindings, Variables } from "../../types/index.js";

const auth = new Hono<{ Bindings: Bindings; Variables: Variables }>();

auth.post("/signup", signup);
auth.post("/signin", signin);

export default auth;
