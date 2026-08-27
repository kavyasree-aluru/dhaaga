import asyncHandler from "express-async-handler";
import fs from "fs";
import Artisan from "../models/Artisan.js";
import Craft from "../models/Craft.js";
import { transcribeAudio, structureArtisanProfile, classifyCraftImage, translateText } from "../utils/ai.js";

// @route POST /api/ai/artisans/:id/interview
// Item 7 + 8: upload a voice interview, transcribe it, translate it into
// en/te/hi/ta, and extract a structured artisan profile.
export const processVoiceInterview = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error("An audio file is required (field name: audio)");
  }

  const artisan = await Artisan.findById(req.params.id);
  if (!artisan) {
    res.status(404);
    throw new Error("Artisan not found");
  }

  const rawTranscript = await transcribeAudio(req.file.path);
  const { translations, structuredProfile } = await structureArtisanProfile(rawTranscript);

  artisan.audioInterviews.push({
    url: `/${req.file.path}`,
    language: req.body.language || "auto",
    transcript: translations,
    structuredProfile,
    processedAt: new Date(),
  });

  // Fill in bio/craft fields if the artisan didn't already set them
  if (!artisan.bio?.en) artisan.bio = translations;
  if (structuredProfile?.yearsOfExperience && !artisan.yearsOfExperience) {
    artisan.yearsOfExperience = structuredProfile.yearsOfExperience;
  }

  await artisan.save();

  res.status(201).json({ success: true, transcript: translations, structuredProfile });
});

// @route POST /api/ai/crafts/:id/classify
// Item 9: computer vision classification / authenticity check on a craft photo.
export const classifyCraft = asyncHandler(async (req, res) => {
  const craft = await Craft.findById(req.params.id);
  if (!craft) {
    res.status(404);
    throw new Error("Craft not found");
  }
  if (!craft.images.length) {
    res.status(400);
    throw new Error("This craft has no images to classify");
  }

  const imagePath = craft.images[0].replace(/^\//, "");
  const buffer = fs.readFileSync(imagePath);
  const base64 = buffer.toString("base64");
  const mediaType = imagePath.endsWith(".png") ? "image/png" : "image/jpeg";

  const result = await classifyCraftImage(base64, mediaType, craft.craftType);

  craft.visionTags = result.tags || [];
  craft.visionVerified = !!result.matchesClaim;
  craft.visionConfidence = result.confidence;
  await craft.save();

  res.json({ success: true, result });
});

// @route POST /api/ai/translate
// Item 8: on-demand translation of arbitrary UI/content text.
export const translate = asyncHandler(async (req, res) => {
  const { text, targetLang } = req.body;
  if (!text || !targetLang) {
    res.status(400);
    throw new Error("text and targetLang are required");
  }
  const translated = await translateText(text, targetLang);
  res.json({ success: true, translated });
});
