import multer from "multer";
import path from "path";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";

const storageDriver = (process.env.STORAGE_DRIVER || "local").toLowerCase();
const IMAGE_DIR = "uploads/images";
const AUDIO_DIR = "uploads/audio";
const QR_DIR = "uploads/qrcodes";

[IMAGE_DIR, AUDIO_DIR, QR_DIR].forEach((dir) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

const localStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isAudio = file.mimetype.startsWith("audio/");
    cb(null, isAudio ? AUDIO_DIR : IMAGE_DIR);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${uuidv4()}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = /image\/(jpeg|jpg|png|webp)|audio\/(mpeg|mp3|wav|m4a|ogg|webm)/;
  if (allowed.test(file.mimetype)) cb(null, true);
  else cb(new Error("Unsupported file type. Only images and audio files are allowed."));
};

const validateRemoteStorageConfig = () => {
  const configuredBaseUrl = process.env.UPLOAD_BASE_URL || process.env.S3_PUBLIC_URL || process.env.CLOUDINARY_URL;
  if (!configuredBaseUrl) {
    throw new Error("STORAGE_DRIVER is configured for a remote provider but no UPLOAD_BASE_URL/S3_PUBLIC_URL/CLOUDINARY_URL has been set.");
  }
};

const storage = storageDriver === "local" ? localStorage : (() => {
  validateRemoteStorageConfig();
  return localStorage;
})();

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 25 * 1024 * 1024 }, // 25MB, generous for audio interviews
});

export const getStorageBaseUrl = () => {
  if (storageDriver === "local") return process.env.PUBLIC_BASE_URL || "";
  const configuredBaseUrl = process.env.UPLOAD_BASE_URL || process.env.S3_PUBLIC_URL || process.env.CLOUDINARY_URL;
  return configuredBaseUrl || "";
};

export const getUploadPath = (relativePath) => {
  const baseUrl = getStorageBaseUrl();
  const normalized = relativePath.startsWith("/") ? relativePath : `/${relativePath}`;
  return baseUrl ? `${baseUrl.replace(/\/$/, "")}${normalized}` : normalized;
};
