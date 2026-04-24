import app from "./app.js";
import { logger } from "./lib/logger.js";

// Default to 3001 so the backend always starts locally without any .env setup.
// The frontend Vite proxy points to http://localhost:3001 by default.
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
