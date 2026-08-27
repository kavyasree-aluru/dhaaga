import asyncHandler from "express-async-handler";
import Craft from "../models/Craft.js";
import Provenance from "../models/Provenance.js";
import { generateCraftQR } from "../utils/qrGenerator.js";

// @route POST /api/qr/:craftId
export const generateQR = asyncHandler(async (req, res) => {
  const craft = await Craft.findById(req.params.craftId).populate("provenance");
  if (!craft) {
    res.status(404);
    throw new Error("Craft not found");
  }

  const provenance = craft.provenance || (await Provenance.findOne({ craft: craft._id }));
  if (!provenance) {
    res.status(400);
    throw new Error("This craft has no provenance record yet");
  }

  const { filePath, targetUrl } = await generateCraftQR(craft._id.toString(), provenance.publicId);
  craft.qrCodeUrl = filePath;
  await craft.save();

  res.status(201).json({ success: true, qrCodeUrl: filePath, targetUrl });
});
