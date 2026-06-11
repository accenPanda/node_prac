import { Router } from "express";
import multer from "multer";
import { checkAppInsights, getHealth } from "../controllers/health.controller";
import { getGreeting } from "../controllers/greet.controller";
import { checkEnv } from "../controllers/envTest.controller";
import { errorTest, getLoginPageDetails, slowAPI } from "../controllers/loginPageDetails.controller";
import { insertUser, loginUser, updateUserProfilePicture } from "../controllers/users.controller";
import { getMediaAccessUrl, uploadMedia } from "../controllers/mediaUpload.controller";

const router = Router();
const mediaUpload = multer({
	storage: multer.memoryStorage(),
	limits: {
		fileSize: 25 * 1024 * 1024
	}
});

router.get("/health", getHealth);
router.get("/greet", getGreeting);
router.get("/test-env", checkEnv);
router.get("/loginPageDetails", getLoginPageDetails);
router.get("/error-test", errorTest);
router.get("/slow-api", slowAPI);
router.get("/app-insights", checkAppInsights);
router.post("/users", insertUser);
router.post("/login", loginUser);
router.put("/users/:id/profile-picture", updateUserProfilePicture);
router.post("/media-upload", mediaUpload.single("file"), uploadMedia);
router.get("/media-access-url", getMediaAccessUrl);

export default router;
