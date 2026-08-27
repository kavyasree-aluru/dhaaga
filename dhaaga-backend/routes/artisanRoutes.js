import express from "express";
import {
  registerArtisan,
  getArtisans,
  getArtisanById,
  updateArtisan,
  getArtisansNear,
  verifyArtisan,
} from "../controllers/artisanController.js";
import { protect, authorize } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";

const router = express.Router();

router.get("/near", getArtisansNear); // must be before /:id
router.get("/", getArtisans);
router.get("/:id", getArtisanById);

router.post("/", upload.single("profilePhoto"), registerArtisan);
router.put("/:id", protect, upload.single("profilePhoto"), updateArtisan);
router.patch("/:id/verify", protect, authorize("admin"), verifyArtisan);

export default router;
