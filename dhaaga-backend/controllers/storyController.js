import asyncHandler from "express-async-handler";
import Story from "../models/Story.js";
import Artisan from "../models/Artisan.js";

export const createStory = asyncHandler(async (req, res) => {
  const artisan = await Artisan.findOne({ user: req.user._id });
  if (!artisan) {
    res.status(400);
    throw new Error("Create an artisan profile before adding stories");
  }
  const { craft, title, body, sourceAudio } = req.body;
  const story = await Story.create({
    craft,
    artisan: artisan._id,
    title,
    body: body || {},
    coverImage: req.file ? `/${req.file.path}` : undefined,
    sourceAudio,
  });
  res.status(201).json({ success: true, story });
});

export const getStories = asyncHandler(async (req, res) => {
  const { craft, artisan } = req.query;
  const filter = {};
  if (craft) filter.craft = craft;
  if (artisan) filter.artisan = artisan;
  const stories = await Story.find(filter).populate("artisan", "name craftType");
  res.json({ success: true, count: stories.length, stories });
});

export const getStoryById = asyncHandler(async (req, res) => {
  const story = await Story.findById(req.params.id).populate("artisan").populate("craft");
  if (!story) {
    res.status(404);
    throw new Error("Story not found");
  }
  res.json({ success: true, story });
});

export const updateStory = asyncHandler(async (req, res) => {
  const story = await Story.findById(req.params.id).populate("artisan");
  if (!story) {
    res.status(404);
    throw new Error("Story not found");
  }
  if (String(story.artisan.user) !== String(req.user._id) && req.user.role !== "admin") {
    res.status(403);
    throw new Error("Not authorized to edit this story");
  }

  ["title", "sourceAudio"].forEach((field) => {
    if (req.body[field] !== undefined) story[field] = req.body[field];
  });
  if (req.body.body !== undefined) story.body = typeof req.body.body === "string" ? { en: req.body.body } : req.body.body;
  if (req.file) story.coverImage = `/${req.file.path}`;
  await story.save();
  res.json({ success: true, story });
});

export const deleteStory = asyncHandler(async (req, res) => {
  const story = await Story.findById(req.params.id).populate("artisan");
  if (!story) {
    res.status(404);
    throw new Error("Story not found");
  }
  if (String(story.artisan.user) !== String(req.user._id) && req.user.role !== "admin") {
    res.status(403);
    throw new Error("Not authorized to delete this story");
  }

  await story.deleteOne();
  res.json({ success: true, message: "Story deleted" });
});
