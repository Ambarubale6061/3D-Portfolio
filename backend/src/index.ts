// ✅ dotenv proper way (NO "dotenv/config")
import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import { logger } from "./lib/logger.js";

// ✅ Render sathi PORT (default fallback)
const port = Number(process.env.PORT || 10000);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${process.env.PORT}"`);
}

// ✅ Server start
app.listen(port, () => {
  logger.info(`🚀 Backend server running on port ${port}`);
});