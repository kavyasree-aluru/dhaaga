import asyncHandler from "express-async-handler";
import Artisan from "../models/Artisan.js";
import User from "../models/User.js";

// @route POST /api/artisans   (item 3: artisan registration)
export const registerArtisan = asyncHandler(async (req, res) => {
  const { name, craftType, phone, bio, yearsOfExperience, longitude, latitude, village, district, state } = req.body;
  const profileBio = typeof bio === "string" ? { en: bio } : bio || {};

  if (!name || !craftType) {
    res.status(400);
    throw new Error("name and craftType are required");
  }

  if (req.user) {
    const existing = await Artisan.findOne({ user: req.user._id });
    if (existing) {
      res.status(409);
      throw new Error("This account already has an artisan profile");
    }
  }

  const artisan = await Artisan.create({
    user: req.user?._id,
    name,
    craftType,
    contactNumber: phone,
    bio: profileBio,
    yearsOfExperience,
    profilePhoto: req.file ? `/${req.file.path}` : undefined,
    location: {
      type: "Point",
      coordinates: [Number(longitude) || 0, Number(latitude) || 0],
      village,
      district,
      state,
    },
  });

  if (req.user) {
    await User.findByIdAndUpdate(req.user._id, { role: "artisan", artisanProfile: artisan._id });
  }

  res.status(201).json({ success: true, artisan });
});

// @route GET /api/artisans
export const getArtisans = asyncHandler(async (req, res) => {
  const { craftType, verified } = req.query;
  const filter = {};
  if (craftType) filter.craftType = new RegExp(craftType, "i");
  if (verified !== undefined) filter.verified = verified === "true";

  const artisans = await Artisan.find(filter).sort({ createdAt: -1 });
  res.json({ success: true, count: artisans.length, artisans });
});

// @route GET /api/artisans/:id
export const getArtisanById = asyncHandler(async (req, res) => {
  const artisan = await Artisan.findById(req.params.id).populate("user", "name email phone");
  if (!artisan) {
    res.status(404);
    throw new Error("Artisan not found");
  }
  res.json({ success: true, artisan });
});

// @route PUT /api/artisans/:id
export const updateArtisan = asyncHandler(async (req, res) => {
  const artisan = await Artisan.findById(req.params.id);
  if (!artisan) {
    res.status(404);
    throw new Error("Artisan not found");
  }
  if (String(artisan.user) !== String(req.user._id) && req.user.role !== "admin") {
    res.status(403);
    throw new Error("Not authorized to edit this artisan profile");
  }

  const updatable = ["name", "craftType", "bio", "yearsOfExperience"];
  updatable.forEach((field) => {
    if (req.body[field] !== undefined) artisan[field] = req.body[field];
  });

  if (req.body.longitude !== undefined && req.body.latitude !== undefined) {
    artisan.location.coordinates = [Number(req.body.longitude), Number(req.body.latitude)];
  }
  if (req.file) artisan.profilePhoto = `/${req.file.path}`;

  await artisan.save();
  res.json({ success: true, artisan });
});

// @route DELETE /api/artisans/:id
export const deleteArtisan = asyncHandler(async (req, res) => {
  const artisan = await Artisan.findById(req.params.id);
  if (!artisan) {
    res.status(404);
    throw new Error("Artisan not found");
  }
  if (String(artisan.user) !== String(req.user._id) && req.user.role !== "admin") {
    res.status(403);
    throw new Error("Not authorized to delete this artisan");
  }

  await artisan.deleteOne();
  if (artisan.user) await User.findByIdAndUpdate(artisan.user, { $unset: { artisanProfile: 1 }, role: "customer" });
  res.json({ success: true, message: "Artisan deleted" });
});

// @route GET /api/artisans/near?lng=..&lat=..&maxKm=25   (item 10: Cultural Map)
export const getArtisansNear = asyncHandler(async (req, res) => {
  const { lng, lat, maxKm = 25 } = req.query;
  const longitude = Number(lng);
  const latitude = Number(lat);
  const radiusKm = Number(maxKm);
  if (!Number.isFinite(longitude) || !Number.isFinite(latitude) || !Number.isFinite(radiusKm) || radiusKm <= 0) {
    res.status(400);
    throw new Error("lng, lat, and a positive maxKm must be valid numbers");
  }

  const artisans = await Artisan.find({
    location: {
      $near: {
        $geometry: { type: "Point", coordinates: [longitude, latitude] },
        $maxDistance: radiusKm * 1000,
      },
    },
  });

  res.json({ success: true, count: artisans.length, artisans });
});

// @route PATCH /api/artisans/:id/verify  (admin)
export const verifyArtisan = asyncHandler(async (req, res) => {
  const artisan = await Artisan.findByIdAndUpdate(req.params.id, { verified: true }, { new: true });
  if (!artisan) {
    res.status(404);
    throw new Error("Artisan not found");
  }
  res.json({ success: true, artisan });
});
