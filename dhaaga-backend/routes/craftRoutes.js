import express from "express";
import {
  createCraft,
  getCrafts,
  getCraftById,
  updateCraft,
  deleteCraft,
} from "../controllers/craftController.js";
import { protect, authorize } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";

const router = express.Router();

router.get("/", getCrafts);
router.get("/:id", getCraftById);

router.post("/", protect, authorize("artisan", "admin"), upload.array("images", 6), createCraft);
router.put("/:id", protect, authorize("artisan", "admin"), upload.array("images", 6), updateCraft);
router.delete("/:id", protect, authorize("artisan", "admin"), deleteCraft);

export default router;
