// Vercel serverless entry (Node runtime).
//
// Vercel's Node runtime invokes the function with Node-style (req, res) arguments.
// hono/vercel's `handle` returns a Web-style (Request) => Response handler, which never
// writes to `res` under this runtime — the request hangs. `getRequestListener` from
// @hono/node-server adapts the Hono fetch handler into a proper Node (req, res) listener.

import { getRequestListener } from "@hono/node-server";
import app from "../src/app.js";

export const config = { runtime: "nodejs" };

export default getRequestListener(app.fetch);
