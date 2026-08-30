import express from "express";
import { processVoiceInterview, classifyCraft, translate } from "../controllers/aiController.js";
import { protect, authorize } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";

const router = express.Router();

router.post(
  "/artisans/:id/interview",
  protect,
  authorize("artisan", "admin"),
  upload.single("audio"),
  processVoiceInterview
);
router.post("/crafts/:id/classify", protect, authorize("artisan", "admin"), classifyCraft);
router.post("/translate", protect, translate);

export default router;
