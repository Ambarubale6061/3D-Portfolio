import { Router, type IRouter } from "express";
import { z } from "zod";

const router: IRouter = Router();

// Inline schema — no longer depends on the shared @workspace/api-zod lib
const HealthCheckResponse = z.object({ status: z.string() });

router.get("/healthz", (_req, res) => {
  const data = HealthCheckResponse.parse({ status: "ok" });
  res.json(data);
});

export default router;
