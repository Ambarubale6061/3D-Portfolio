import "dotenv/config";   // ← ADD THIS as the very first line

import app from "./app.js";
import { logger } from "./lib/logger.js";

const port = Number(process.env.PORT ?? 3001);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${process.env.PORT}"`);
}

app.listen(port, (err?: Error) => {
  if (err) {
    logger.error({ err }, "Error starting server");
    process.exit(1);
  }
  logger.info({ port }, `🚀 Backend server listening on http://localhost:${port}`);
});