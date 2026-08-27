import express from "express";
import { syncOperations } from "../controllers/syncController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.post("/", protect, syncOperations);

export default router;
