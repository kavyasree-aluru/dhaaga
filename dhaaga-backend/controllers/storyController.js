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
