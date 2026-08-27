import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import path from "path";

import { connectDB } from "./config/db.js";
import { notFound, errorHandler } from "./middleware/errorHandler.js";

import authRoutes from "./routes/authRoutes.js";
import artisanRoutes from "./routes/artisanRoutes.js";
import craftRoutes from "./routes/craftRoutes.js";
import storyRoutes from "./routes/storyRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import provenanceRoutes from "./routes/provenanceRoutes.js";
import qrRoutes from "./routes/qrRoutes.js";
import supportRoutes from "./routes/supportRoutes.js";
import syncRoutes from "./routes/syncRoutes.js";

dotenv.config();
await connectDB();

const app = express();

// Item 1: Backend/API core setup
app.use(helmet({ crossOriginResourcePolicy: false })); // allow serving uploaded images cross-origin
app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173", credentials: true }));
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 300 });
app.use("/api", limiter);

// Item 6: serve uploaded images/audio/QR codes statically
app.use("/uploads", express.static(path.resolve("uploads")));

app.get("/api/health", (req, res) => res.json({ success: true, message: "DHAAGA API is running" }));

app.use("/api/auth", authRoutes);
app.use("/api/artisans", artisanRoutes);
app.use("/api/crafts", craftRoutes);
app.use("/api/stories", storyRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/provenance", provenanceRoutes);
app.use("/api/qr", qrRoutes);
app.use("/api/support", supportRoutes);
app.use("/api/sync", syncRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`DHAAGA API listening on port ${PORT}`));
