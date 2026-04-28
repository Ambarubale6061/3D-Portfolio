import { Router } from "express";
import chatRouter from "./chat.js";
import healthRouter from "./health.js";
import contactRouter from "./contact.js"; // ← ADD THIS

const router = Router();

router.use(healthRouter);
router.use(chatRouter);
router.use(contactRouter); // ← ADD THIS

export default router;