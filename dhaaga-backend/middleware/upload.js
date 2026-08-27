import multer from "multer";
import path from "path";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";

const IMAGE_DIR = "uploads/images";
const AUDIO_DIR = "uploads/audio";
[IMAGE_DIR, AUDIO_DIR].forEach((dir) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

const storage = multer.diskStorage({
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

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 25 * 1024 * 1024 }, // 25MB, generous for audio interviews
});

// NOTE: This stores files on local disk, which is fine for development/demo.
// For production, swap `storage` above for an S3-compatible multer-storage-s3
// driver so files survive redeploys and scale across instances.
