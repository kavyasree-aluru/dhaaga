import asyncHandler from "express-async-handler";
import mongoose from "mongoose";
import Support from "../models/Support.js";
import Craft from "../models/Craft.js";
import Artisan from "../models/Artisan.js";
import User from "../models/User.js";
import { sendSupportRequestEmail } from "../utils/mailer.js";

// @route POST /api/support
export const createSupportRequest = asyncHandler(async (req, res) => {
  const { type, craftId, artisanId, artisanName, craftType, contactName, contactEmail, contactPhone, message, amount, deliveryAddress } = req.body;

  const signedInCustomer = req.user?._id || null;
  const finalContactName = (contactName || req.user?.name || "").trim();
  const finalContactEmail = (contactEmail || req.user?.email || "").trim();
  const finalContactPhone = (contactPhone || req.user?.phone || "").trim();

  if (!signedInCustomer && (!finalContactName || !finalContactEmail || !finalContactPhone)) {
    res.status(400);
    throw new Error("Customer details are required to send a support request");
  }

  let customerId = signedInCustomer;
  if (!customerId && finalContactEmail) {
    const matchedUser = await User.findOne({
      email: { $regex: new RegExp(`^${finalContactEmail.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "i") },
    }).select("_id");

    if (matchedUser) {
      customerId = matchedUser._id;
    }
  }

  let artisan = artisanId;

  if (artisan && !mongoose.isValidObjectId(artisan)) {
    artisan = null;
  }

  if (craftId && !mongoose.isValidObjectId(craftId)) {
    craftId = null;
  }

  if (craftId) {
    const craft = await Craft.findById(craftId);
    if (!craft) {
      res.status(404);
      throw new Error("Craft not found");
    }
    artisan = craft.artisan;
  }

  if (!artisan && artisanName) {
    const normalizedName = String(artisanName).trim();
    const existingArtisan = await Artisan.findOne({
      name: { $regex: new RegExp(normalizedName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i") },
    });

    if (existingArtisan) {
      artisan = existingArtisan._id;
    }
  }

  if (!artisan && artisanName) {
    const normalizedCraftType = String(craftType || "Traditional Craft").trim();
    const fallbackArtisan = await Artisan.create({
      name: String(artisanName).trim(),
      craftType: normalizedCraftType,
      bio: {
        en: `A heritage craft profile created for support requests from ${String(artisanName).trim()}.`,
        te: "సహాయం అభ్యర్థనల కోసం సృష్టించబడిన వారసత్వ నైపుణ్యం ప్రొఫైల్.",
      },
      yearsOfExperience: 0,
      location: {
        type: "Point",
        coordinates: [0, 0],
        village: "Unknown",
        district: "Unknown",
        state: "India",
      },
      verified: false,
      isApproved: true,
      isHidden: false,
    });

    artisan = fallbackArtisan._id;
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
    customer: customerId,
    contactName: finalContactName || "Customer",
    contactEmail: finalContactEmail || req.user?.email || "",
    contactPhone: finalContactPhone,
    message: message || `Support interest for artisan ${artisan}`,
    amount,
    deliveryAddress,
  });

  const artisanDoc = await Artisan.findById(artisan).populate("user", "name email");
  if (artisanDoc?.user?.email) {
    void sendSupportRequestEmail({
      to: artisanDoc.user.email,
      artisanName: artisanDoc.name || artisanDoc.user.name || "Artisan",
      customerName: finalContactName || "A customer",
      supportId: String(support._id),
      message: support.message,
      contactEmail: finalContactEmail,
    });
  }

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

// @route GET /api/support/logistics (admin — all buy requests)
export const getLogisticsRequests = asyncHandler(async (req, res) => {
  const requests = await Support.find({ type: "buy" })
    .populate("artisan", "name craftType")
    .populate("customer", "name email")
    .sort({ createdAt: -1 });
  res.json({ success: true, count: requests.length, requests });
});

// @route GET /api/support/customer (signed-in customer's orders)
export const getCustomerOrders = asyncHandler(async (req, res) => {
  const requests = await Support.find({ customer: req.user._id, type: "buy" })
    .populate("artisan", "name craftType")
    .sort({ createdAt: -1 });
  res.json({ success: true, count: requests.length, requests });
});

// @route PATCH /api/support/:id/logistics (admin)
export const updateLogistics = asyncHandler(async (req, res) => {
  const { shipmentStatus, deliveryPartner, trackingNumber } = req.body;
  const validStatuses = ["pending", "confirmed", "dispatched", "in_transit", "delivered", "cancelled"];
  if (!validStatuses.includes(shipmentStatus)) {
    res.status(400);
    throw new Error("Invalid shipment status");
  }

  const request = await Support.findByIdAndUpdate(
    req.params.id,
    { shipmentStatus, deliveryPartner, trackingNumber },
    { new: true, runValidators: true }
  );
  if (!request) {
    res.status(404);
    throw new Error("Logistics request not found");
  }
  res.json({ success: true, request });
});
