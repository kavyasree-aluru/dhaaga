import express from "express";
import { generateQR } from "../controllers/qrController.js";
import { protect, authorize } from "../middleware/auth.js";

const router = express.Router();

router.post("/:craftId", protect, authorize("artisan", "admin"), generateQR);

export default router;
