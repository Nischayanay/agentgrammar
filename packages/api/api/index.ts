// Vercel serverless entry. Hono ships a Vercel adapter that maps the
// Web Fetch handler onto Vercel's Node runtime.

import { handle } from "hono/vercel";
import app from "../src/app.js";

export const config = { runtime: "nodejs" };

export default handle(app);
