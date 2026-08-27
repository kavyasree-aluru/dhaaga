import asyncHandler from "express-async-handler";
import Craft from "../models/Craft.js";
import Artisan from "../models/Artisan.js";
import Provenance from "../models/Provenance.js";
import { v4 as uuidv4 } from "uuid";

// @route POST /api/crafts
export const createCraft = asyncHandler(async (req, res) => {
  const artisan = await Artisan.findOne({ user: req.user._id });
  if (!artisan) {
    res.status(400);
    throw new Error("Create an artisan profile before adding crafts");
  }

  const { title, craftType, description, price, materials, stock, clientTempId } = req.body;
  const images = (req.files || []).map((f) => `/${f.path}`);

  if (!title || !craftType || images.length === 0) {
    res.status(400);
    throw new Error("title, craftType and at least one image are required");
  }

  const craft = await Craft.create({
    artisan: artisan._id,
    title,
    craftType,
    description,
    price,
    materials: materials ? materials.split(",").map((m) => m.trim()) : [],
    images,
    stock,
    clientTempId,
  });

  // Item 11: start the provenance chain the moment a craft is created
  const provenance = await Provenance.create({
    craft: craft._id,
    artisan: artisan._id,
    publicId: uuidv4(),
  });
  provenance.addEvent({ type: "created", description: `${title} registered on DHAAGA`, actor: req.user._id });
  await provenance.save();

  craft.provenance = provenance._id;
  await craft.save();

  res.status(201).json({ success: true, craft });
});

// @route GET /api/crafts
export const getCrafts = asyncHandler(async (req, res) => {
  const { craftType, artisan, search, status = "published" } = req.query;
  const filter = {};
  if (craftType) filter.craftType = new RegExp(craftType, "i");
  if (artisan) filter.artisan = artisan;
  if (status) filter.status = status;
  if (search) filter.$text = { $search: search };

  const crafts = await Craft.find(filter).populate("artisan", "name craftType location").sort({ createdAt: -1 });
  res.json({ success: true, count: crafts.length, crafts });
});

// @route GET /api/crafts/:id
export const getCraftById = asyncHandler(async (req, res) => {
  const craft = await Craft.findById(req.params.id).populate("artisan").populate("provenance");
  if (!craft) {
    res.status(404);
    throw new Error("Craft not found");
  }
  res.json({ success: true, craft });
});

// @route PUT /api/crafts/:id
export const updateCraft = asyncHandler(async (req, res) => {
  const craft = await Craft.findById(req.params.id).populate("artisan");
  if (!craft) {
    res.status(404);
    throw new Error("Craft not found");
  }
  if (String(craft.artisan.user) !== String(req.user._id) && req.user.role !== "admin") {
    res.status(403);
    throw new Error("Not authorized to edit this craft");
  }

  const updatable = ["title", "craftType", "description", "price", "stock", "status"];
  updatable.forEach((field) => {
    if (req.body[field] !== undefined) craft[field] = req.body[field];
  });
  if (req.body.materials) craft.materials = req.body.materials.split(",").map((m) => m.trim());
  if (req.files?.length) craft.images.push(...req.files.map((f) => `/${f.path}`));

  await craft.save();
  res.json({ success: true, craft });
});

// @route DELETE /api/crafts/:id
export const deleteCraft = asyncHandler(async (req, res) => {
  const craft = await Craft.findById(req.params.id).populate("artisan");
  if (!craft) {
    res.status(404);
    throw new Error("Craft not found");
  }
  if (String(craft.artisan.user) !== String(req.user._id) && req.user.role !== "admin") {
    res.status(403);
    throw new Error("Not authorized to delete this craft");
  }

  await craft.deleteOne();
  res.json({ success: true, message: "Craft deleted" });
});
