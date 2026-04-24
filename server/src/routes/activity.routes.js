import { Router } from "express";
import { activityLog, dashboard } from "../controllers/activity.controller.js";
import { requireAuth } from "../middlewares/auth.js";

const router = Router();
router.use(requireAuth);
router.get("/dashboard", dashboard);
router.get("/logs", activityLog);
export default router;
