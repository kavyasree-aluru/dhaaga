import express from "express";
import {
  addProvenanceEvent,
  getProvenance,
  verifyByPublicId,
} from "../controllers/provenanceController.js";
import { protect, authorize } from "../middleware/auth.js";

const router = express.Router();

router.get("/verify/:publicId", verifyByPublicId); // public QR-scan endpoint
router.get("/:craftId", getProvenance);
router.post("/:craftId/events", protect, authorize("artisan", "admin"), addProvenanceEvent);

export default router;
