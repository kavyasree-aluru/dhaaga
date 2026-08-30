import express from "express";
import {
  createSupportRequest,
  getCustomerOrders,
  getLogisticsRequests,
  getArtisanSupportRequests,
  updateLogistics,
  updateSupportStatus,
} from "../controllers/supportController.js";
import { protect, authorize } from "../middleware/auth.js";

const router = express.Router();

router.post("/", protect, createSupportRequest);
router.get("/customer", protect, getCustomerOrders);
router.get("/logistics", protect, authorize("admin"), getLogisticsRequests);
router.get("/artisan/:artisanId", protect, authorize("artisan", "admin"), getArtisanSupportRequests);
router.patch("/:id/status", protect, authorize("artisan", "admin"), updateSupportStatus);
router.patch("/:id/logistics", protect, authorize("admin"), updateLogistics);

export default router;
