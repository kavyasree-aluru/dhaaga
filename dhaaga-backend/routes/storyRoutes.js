import express from "express";
import { createStory, getStories, getStoryById, updateStory, deleteStory } from "../controllers/storyController.js";
import { protect, authorize } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";

const router = express.Router();

router.get("/", getStories);
router.get("/:id", getStoryById);
router.post("/", protect, authorize("artisan", "admin"), upload.single("coverImage"), createStory);
router.put("/:id", protect, authorize("artisan", "admin"), upload.single("coverImage"), updateStory);
router.delete("/:id", protect, authorize("artisan", "admin"), deleteStory);

export default router;
