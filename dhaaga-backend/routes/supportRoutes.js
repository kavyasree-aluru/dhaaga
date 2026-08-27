import express from "express";
import {
  createSupportRequest,
  getArtisanSupportRequests,
  updateSupportStatus,
} from "../controllers/supportController.js";
import { protect, authorize } from "../middleware/auth.js";

const router = express.Router();

router.post("/", createSupportRequest); // public, buyers may not have accounts
router.get("/artisan/:artisanId", protect, authorize("artisan", "admin"), getArtisanSupportRequests);
router.patch("/:id/status", protect, authorize("artisan", "admin"), updateSupportStatus);

export default router;
