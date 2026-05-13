import { Router } from "express";
import { getHealth } from "../controllers/health.controller";
import { getGreeting } from "../controllers/greet.controller";
import { checkEnv } from "../controllers/envTest.controller";

const router = Router();

router.get("/health", getHealth);
router.get("/greet", getGreeting);
router.get("/test-env", checkEnv);

export default router;
