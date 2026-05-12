import { Router } from "express";
import { getHealth } from "../controllers/health.controller";
import { getGreeting } from "../controllers/greet.controller";

const router = Router();

router.get("/health", getHealth);
router.get("/greet", getGreeting);

export default router;
