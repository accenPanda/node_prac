import { Router } from "express";
import { getHealth } from "../controllers/health.controller";
import { getGreeting } from "../controllers/greet.controller";
import { checkEnv } from "../controllers/envTest.controller";
import { errorTest, getLoginPageDetails, slowAPI } from "../controllers/loginPageDetails.controller";

const router = Router();

router.get("/health", getHealth);
router.get("/greet", getGreeting);
router.get("/test-env", checkEnv);
router.get("/loginPageDetails", getLoginPageDetails);
router.get("/error-test", errorTest);
router.get("/slow-api", slowAPI);

export default router;
