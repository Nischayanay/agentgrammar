// Local / self-hosted entry: run the Hono app on a Node HTTP server.
// Used by `npm run dev` and `npm start`. Vercel uses api/index.ts instead.

import { serve } from "@hono/node-server";
import app from "./app.js";

const port = Number(process.env.PORT ?? 8787);

serve({ fetch: app.fetch, port }, (info) => {
  console.log(`agentgrammar API listening on http://localhost:${info.port}`);
});
