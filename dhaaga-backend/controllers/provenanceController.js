import asyncHandler from "express-async-handler";
import Provenance from "../models/Provenance.js";

// @route POST /api/provenance/:craftId/events   (artisan/admin adds a milestone)
export const addProvenanceEvent = asyncHandler(async (req, res) => {
  const { type, description } = req.body;
  const provenance = await Provenance.findOne({ craft: req.params.craftId });
  if (!provenance) {
    res.status(404);
    throw new Error("No provenance record for this craft");
  }
  if (req.user.role !== "admin" && String(provenance.artisan) !== String(req.user.artisanProfile)) {
    res.status(403);
    throw new Error("Not authorized to update this provenance record");
  }

  provenance.addEvent({ type, description, actor: req.user._id });
  await provenance.save();

  res.status(201).json({ success: true, provenance });
});

// @route GET /api/provenance/:craftId  (public — used by the QR scan page)
export const getProvenance = asyncHandler(async (req, res) => {
  const provenance = await Provenance.findOne({ craft: req.params.craftId })
    .populate("artisan", "name craftType location verified")
    .populate("craft", "title images price");
  if (!provenance) {
    res.status(404);
    throw new Error("No provenance record for this craft");
  }

  const isValid = provenance.verifyChain();
  res.json({ success: true, isValid, provenance });
});

// @route GET /api/provenance/verify/:publicId  (what the QR code actually links to)
export const verifyByPublicId = asyncHandler(async (req, res) => {
  const provenance = await Provenance.findOne({ publicId: req.params.publicId })
    .populate("artisan", "name craftType location verified")
    .populate("craft", "title images price");
  if (!provenance) {
    res.status(404);
    throw new Error("Invalid provenance code");
  }
  const isValid = provenance.verifyChain();
  res.json({ success: true, isValid, provenance });
});
