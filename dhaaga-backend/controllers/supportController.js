import asyncHandler from "express-async-handler";
import Support from "../models/Support.js";
import Craft from "../models/Craft.js";
import Artisan from "../models/Artisan.js";

// @route POST /api/support   (public — buyer doesn't have to be logged in)
export const createSupportRequest = asyncHandler(async (req, res) => {
  const { type, craftId, artisanId, contactName, contactEmail, contactPhone, message, amount } = req.body;

  let artisan = artisanId;
  if (craftId) {
    const craft = await Craft.findById(craftId);
    if (!craft) {
      res.status(404);
      throw new Error("Craft not found");
    }
    artisan = craft.artisan;
  }
  if (!artisan) {
    res.status(400);
    throw new Error("artisanId or craftId is required");
  }
  const artisanExists = await Artisan.exists({ _id: artisan });
  if (!artisanExists) {
    res.status(404);
    throw new Error("Artisan not found");
  }

  const support = await Support.create({
    type: type || "inquiry",
    craft: craftId,
    artisan,
    customer: req.user?._id,
    contactName,
    contactEmail,
    contactPhone,
    message,
    amount,
  });

  res.status(201).json({ success: true, support });
});

// @route GET /api/support/artisan/:artisanId   (artisan dashboard — their incoming requests)
export const getArtisanSupportRequests = asyncHandler(async (req, res) => {
  if (req.user.role !== "admin" && String(req.user.artisanProfile) !== String(req.params.artisanId)) {
    res.status(403);
    throw new Error("Not authorized to view these support requests");
  }

  const requests = await Support.find({ artisan: req.params.artisanId })
    .populate("craft", "title images")
    .sort({ createdAt: -1 });
  res.json({ success: true, count: requests.length, requests });
});

// @route PATCH /api/support/:id/status
export const updateSupportStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  if (!["pending", "accepted", "declined", "completed"].includes(status)) {
    res.status(400);
    throw new Error("status must be pending, accepted, declined, or completed");
  }

  const support = await Support.findById(req.params.id);
  if (!support) {
    res.status(404);
    throw new Error("Support request not found");
  }
  if (req.user.role !== "admin" && String(support.artisan) !== String(req.user.artisanProfile)) {
    res.status(403);
    throw new Error("Not authorized to update this support request");
  }

  support.status = status;
  await support.save();
  res.json({ success: true, support });
});
